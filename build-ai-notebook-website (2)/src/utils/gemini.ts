import type { Source } from '../types';

const STORAGE_KEY = 'cognoir_gemini_key';

export function getApiKey(): string {
  return localStorage.getItem(STORAGE_KEY) || '';
}

export function setApiKey(key: string) {
  localStorage.setItem(STORAGE_KEY, key);
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

export async function callGemini(prompt: string, sources: Source[] = []): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_KEY');

  // Build context from selected sources
  const selectedSources = sources.filter(s => s.selected);
  let systemContext = 'You are Cognoir AI, a premium research assistant. Provide accurate, well-structured answers. Use markdown formatting with **bold**, bullet points, and numbered lists. Be concise but thorough.';
  
  if (selectedSources.length > 0) {
    systemContext += '\n\nThe user has provided the following research sources. Base your answers on these sources and cite them when relevant:\n\n';
    systemContext += selectedSources.map((s, i) => 
      `--- SOURCE ${i + 1}: "${s.title}" ---\n${s.content.substring(0, 3000)}\n--- END SOURCE ${i + 1} ---`
    ).join('\n\n');
    systemContext += '\n\nWhen answering, reference the source titles in your response. If the sources contain incorrect information, point it out and provide the correct information.';
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: prompt }] }
          ],
          systemInstruction: {
            parts: [{ text: systemContext }]
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
          ]
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (res.status === 400 && JSON.stringify(err).includes('API_KEY_INVALID')) throw new Error('INVALID_KEY');
      if (res.status === 429) throw new Error('RATE_LIMIT');
      throw new Error(`API_ERROR: ${res.status}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('EMPTY_RESPONSE');
    return text;
  } catch (e: unknown) {
    if (e instanceof Error) {
      if (e.message === 'NO_KEY' || e.message === 'INVALID_KEY' || e.message === 'RATE_LIMIT' || e.message === 'EMPTY_RESPONSE') throw e;
    }
    throw new Error('NETWORK_ERROR');
  }
}

export async function geminiSummarize(sources: Source[]): Promise<string> {
  const selected = sources.filter(s => s.selected);
  if (selected.length === 0) return 'No sources selected.';
  const prompt = `Summarize the following sources in a comprehensive yet concise way. Use markdown headings and bullet points:\n\n${selected.map(s => `"${s.title}": ${s.content.substring(0, 2000)}`).join('\n\n')}`;
  return callGemini(prompt, sources);
}

export async function geminiFAQ(sources: Source[]): Promise<string> {
  const selected = sources.filter(s => s.selected);
  if (selected.length === 0) return 'No sources selected.';
  const prompt = `Generate a comprehensive FAQ (6-8 questions) based on these sources. Format each as **Q: ...** followed by the answer:\n\n${selected.map(s => `"${s.title}": ${s.content.substring(0, 2000)}`).join('\n\n')}`;
  return callGemini(prompt, sources);
}

export async function geminiStudyGuide(sources: Source[]): Promise<string> {
  const selected = sources.filter(s => s.selected);
  if (selected.length === 0) return 'No sources selected.';
  const prompt = `Create a detailed study guide with key concepts, definitions, and review questions based on:\n\n${selected.map(s => `"${s.title}": ${s.content.substring(0, 2000)}`).join('\n\n')}`;
  return callGemini(prompt, sources);
}
