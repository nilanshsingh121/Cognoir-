// PDF text extraction using pdf.js
export async function extractPdfText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Dynamic import pdf.js
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      if (text.trim()) pages.push(text.trim());
    }
    
    return pages.join('\n\n') || 'Could not extract text from this PDF.';
  } catch (e) {
    console.error('PDF parse error:', e);
    return 'Error reading PDF. The file may be encrypted or corrupted.';
  }
}

// Website content fetching (using public CORS proxies)
export async function fetchWebsiteContent(url: string): Promise<{ title: string; content: string }> {
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ];
  
  for (const proxyUrl of proxies) {
    try {
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const html = await res.text();
      return parseHtmlContent(html, url);
    } catch { continue; }
  }
  
  return { title: url, content: `Could not fetch content from ${url}. The website may be blocking automated access.` };
}

function parseHtmlContent(html: string, url: string): { title: string; content: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Extract title
  const title = doc.querySelector('title')?.textContent?.trim() || 
                doc.querySelector('h1')?.textContent?.trim() || 
                new URL(url).hostname;
  
  // Remove unwanted elements
  doc.querySelectorAll('script,style,nav,footer,header,aside,iframe,noscript,svg,.ad,.ads,.sidebar,.menu,.nav,.footer,.header').forEach(el => el.remove());
  
  // Try article/main content first
  const article = doc.querySelector('article') || doc.querySelector('main') || doc.querySelector('.content') || doc.querySelector('.post') || doc.body;
  
  // Extract text with structure
  const lines: string[] = [];
  article?.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,blockquote,pre,td,th').forEach(el => {
    const tag = el.tagName.toLowerCase();
    const text = el.textContent?.trim();
    if (!text || text.length < 3) return;
    
    if (tag.startsWith('h')) {
      const level = parseInt(tag[1]);
      lines.push(`${'#'.repeat(level)} ${text}`);
    } else if (tag === 'li') {
      lines.push(`- ${text}`);
    } else if (tag === 'blockquote') {
      lines.push(`> ${text}`);
    } else {
      lines.push(text);
    }
  });
  
  const content = lines.join('\n\n').substring(0, 50000) || 'Could not extract meaningful content from this page.';
  return { title, content };
}

// YouTube transcript extraction (using public API)
export async function fetchYouTubeTranscript(url: string): Promise<{ title: string; content: string }> {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return { title: 'YouTube Video', content: 'Invalid YouTube URL. Please provide a valid YouTube link.' };
  }
  
  // Try to fetch via noembed for title
  let title = 'YouTube Video';
  try {
    const oembed = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    const data = await oembed.json();
    if (data.title) title = data.title;
  } catch {}
  
  // Simulated transcript (real implementation would need YouTube Data API)
  const content = `# ${title}

**Video ID:** ${videoId}
**URL:** https://www.youtube.com/watch?v=${videoId}

---

*Note: Full transcript extraction requires YouTube Data API integration. For now, you can:*

1. **Go to YouTube** → Open the video
2. **Click "..." (More)** → Select "Show transcript"
3. **Copy the transcript** text
4. **Paste it here** as a source

*Alternatively, many browser extensions can extract YouTube transcripts automatically.*

---

**Video Title:** ${title}
**Platform:** YouTube
**Added to Cognoir:** ${new Date().toLocaleDateString()}`;

  return { title, content };
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

// Text-to-Speech audio generation
export function generateAudioOverview(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Split into chunks (browser limit ~200 chars per utterance)
    const chunks = text.match(/.{1,180}[.!?\n]|.{1,200}/g) || [text];
    let i = 0;
    
    const speakNext = () => {
      if (i >= chunks.length) { resolve(); return; }
      const utterance = new SpeechSynthesisUtterance(chunks[i]);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;
      // Try to use a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'));
      if (preferred) utterance.voice = preferred;
      utterance.onend = () => { i++; speakNext(); };
      utterance.onerror = () => { i++; speakNext(); };
      window.speechSynthesis.speak(utterance);
    };
    
    // Wait for voices to load
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => speakNext();
    } else {
      speakNext();
    }
  });
}

export function stopAudio() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
