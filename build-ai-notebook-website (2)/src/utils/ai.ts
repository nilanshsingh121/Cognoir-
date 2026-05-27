import type { Source } from '../types';

function factCheckSources(sources: Source[]): string[] {
  const warnings: string[] = [];
  const allContent = sources.map(s => s.content).join(' ').toLowerCase();
  const checks: [string, string][] = [
    ['sun revolves around the earth', '"Sun revolves around Earth" is incorrect — Earth revolves around the Sun'],
    ['10% of brain', '"Humans use 10% of brain" is a myth — we use virtually all parts of the brain'],
    ['great wall.*visible from space', '"Great Wall visible from space" is false — not visible to the naked eye from orbit'],
    ['lightning never strikes.*twice', '"Lightning never strikes twice" is wrong — it frequently hits the same spot'],
    ['goldfish.*3 second memory', '"Goldfish 3-second memory" is a myth — goldfish can remember for months'],
    ['diamonds.*from coal', '"Diamonds form from coal" is incorrect — they form from carbon deep in the mantle'],
    ['evolved from monkeys', '"Humans evolved from monkeys" is inaccurate — humans and apes share a common ancestor'],
    ['earth is flat', '"Earth is flat" is false — Earth is an oblate spheroid'],
    ['napoleon.*short', '"Napoleon was short" is a myth — he was 5\'7", average for his time'],
    ['tongue map', '"Tongue taste map" is debunked — all taste buds can sense all basic tastes'],
    ['vitamin c.*cures cold', '"Vitamin C cures colds" is not supported — it may slightly reduce duration but doesn\'t cure'],
    ['cracking knuckles.*arthritis', '"Cracking knuckles causes arthritis" is a myth — studies show no link'],
  ];
  for (const [pattern, correction] of checks) {
    if (new RegExp(pattern, 'i').test(allContent)) warnings.push(correction);
  }
  return warnings;
}

function findRelevantContent(sources: Source[], query: string): string[] {
  const queryWords = query.toLowerCase().split(/\s+/);
  const relevant: string[] = [];
  sources.filter((s) => s.selected).forEach((source) => {
    const paragraphs = source.content.split('\n\n');
    paragraphs.forEach((p) => {
      const pLower = p.toLowerCase();
      const matches = queryWords.filter((w) => w.length > 3 && pLower.includes(w));
      if (matches.length >= 1) relevant.push(p.trim());
    });
  });
  return relevant.slice(0, 5);
}

// General knowledge responses when no sources are selected
const KNOWLEDGE_DB: Record<string, string> = {
  'what is ai': `**Artificial Intelligence (AI)** is a broad field of computer science focused on building smart machines capable of performing tasks that typically require human intelligence.\n\n**Key branches of AI include:**\n1. **Machine Learning** — Systems that learn from data and improve over time\n2. **Natural Language Processing** — Understanding and generating human language\n3. **Computer Vision** — Interpreting visual information from the world\n4. **Robotics** — Physical machines that can interact with the environment\n5. **Expert Systems** — Programs that mimic human decision-making\n\nAI is transforming industries from healthcare to finance, transportation, and entertainment.`,
  'machine learning': `**Machine Learning (ML)** is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.\n\n**Three main types:**\n1. **Supervised Learning** — Learning from labeled training data (classification, regression)\n2. **Unsupervised Learning** — Finding hidden patterns in unlabeled data (clustering, dimensionality reduction)\n3. **Reinforcement Learning** — Learning through trial-and-error with rewards\n\n**Popular algorithms include:**\n- Linear/Logistic Regression\n- Decision Trees & Random Forests\n- Support Vector Machines\n- Neural Networks & Deep Learning\n- K-Means Clustering\n\nML powers recommendation engines, fraud detection, speech recognition, and much more.`,
  'deep learning': `**Deep Learning** is a specialized subset of machine learning using neural networks with many layers (hence "deep").\n\n**Key architectures:**\n1. **CNNs (Convolutional Neural Networks)** — Excel at image recognition and computer vision\n2. **RNNs (Recurrent Neural Networks)** — Process sequential data like text and time series\n3. **Transformers** — Power modern LLMs like GPT, BERT, and T5\n4. **GANs (Generative Adversarial Networks)** — Generate realistic synthetic data\n5. **Autoencoders** — Learn efficient data representations\n\n**Why it works:** Deep networks can learn hierarchical features — from edges and textures to complex objects and concepts.`,
  'python': `**Python** is one of the most popular programming languages in the world, known for its clean syntax and versatility.\n\n**Why developers love Python:**\n1. **Easy to learn** — Clean, readable syntax similar to English\n2. **Vast ecosystem** — Over 400,000 packages on PyPI\n3. **AI/ML powerhouse** — TensorFlow, PyTorch, scikit-learn, pandas\n4. **Web development** — Django, Flask, FastAPI\n5. **Automation** — Scripts, data processing, DevOps\n\n**Key features:**\n- Dynamic typing\n- Interpreted language\n- Object-oriented and functional paradigms\n- Cross-platform compatibility\n- Strong community support`,
  'blockchain': `**Blockchain** is a distributed, decentralized ledger technology that records transactions across many computers.\n\n**Core concepts:**\n1. **Blocks** — Data containers linked in a chain\n2. **Decentralization** — No single point of control\n3. **Consensus mechanisms** — Proof of Work, Proof of Stake\n4. **Smart Contracts** — Self-executing code on the blockchain\n5. **Immutability** — Once recorded, data cannot be altered\n\n**Major applications:**\n- Cryptocurrencies (Bitcoin, Ethereum)\n- DeFi (Decentralized Finance)\n- NFTs (Non-Fungible Tokens)\n- Supply chain tracking\n- Digital identity verification`,
  'quantum computing': `**Quantum Computing** harnesses quantum-mechanical phenomena like superposition and entanglement to process information.\n\n**Key concepts:**\n1. **Qubits** — Unlike classical bits (0 or 1), qubits can be in superposition of both states\n2. **Superposition** — A qubit can represent multiple states simultaneously\n3. **Entanglement** — Qubits can be correlated regardless of distance\n4. **Quantum gates** — Operations that manipulate qubits\n5. **Quantum supremacy** — Solving problems impossible for classical computers\n\n**Applications:**\n- Cryptography and security\n- Drug discovery and molecular simulation\n- Financial modeling\n- Optimization problems\n- Climate modeling`,
  'climate change': `**Climate Change** refers to long-term shifts in global temperatures and weather patterns, primarily driven by human activities since the Industrial Revolution.\n\n**Key facts:**\n1. **Global temperature** has risen ~1.1°C since pre-industrial times\n2. **CO₂ levels** are at their highest in 800,000 years\n3. **Sea levels** are rising at 3.3mm per year\n4. **Arctic ice** is declining at 13% per decade\n\n**Major causes:**\n- Burning fossil fuels (coal, oil, gas)\n- Deforestation\n- Industrial agriculture\n- Cement production\n\n**Solutions being pursued:**\n- Renewable energy (solar, wind)\n- Electric vehicles\n- Carbon capture technology\n- Reforestation\n- International agreements (Paris Accord)`,
  'space': `**Space exploration** has been one of humanity's greatest achievements, pushing the boundaries of science and technology.\n\n**Key milestones:**\n1. **1957** — Sputnik, first artificial satellite\n2. **1961** — Yuri Gagarin, first human in space\n3. **1969** — Apollo 11, first Moon landing\n4. **1998** — International Space Station construction begins\n5. **2020s** — Artemis program, Mars missions, private spaceflight\n\n**Current frontiers:**\n- Mars colonization (SpaceX Starship)\n- James Webb Space Telescope discoveries\n- Commercial space tourism\n- Asteroid mining concepts\n- Search for extraterrestrial life`,
};

function findGeneralAnswer(query: string): string | null {
  const q = query.toLowerCase();
  for (const [key, answer] of Object.entries(KNOWLEDGE_DB)) {
    const keywords = key.split(/\s+/);
    if (keywords.every(k => q.includes(k)) || q.includes(key)) return answer;
  }
  // Partial match — if any keyword closely matches
  for (const [key, answer] of Object.entries(KNOWLEDGE_DB)) {
    const keywords = key.split(/\s+/);
    if (keywords.some(k => k.length > 3 && q.includes(k))) return answer;
  }
  return null;
}

function generateGeneralResponse(query: string): string {
  const knowledgeAnswer = findGeneralAnswer(query);
  if (knowledgeAnswer) return knowledgeAnswer;

  const q = query.toLowerCase();

  if (q.includes('what is') || q.includes('kya hai') || q.includes('explain') || q.includes('define')) {
    const topic = query.replace(/what is|kya hai|explain|define|the|a|an|\?/gi, '').trim();
    return `**${topic}** is an important topic with several key aspects to understand.\n\nHere's a general overview:\n\n1. **Definition** — ${topic} refers to a concept, technology, or field that encompasses specific principles and applications\n2. **Significance** — It plays a crucial role in modern understanding and has wide-ranging implications\n3. **Applications** — ${topic} is applied across various domains including research, industry, and everyday life\n\n> 💡 For more detailed, citation-backed answers, try adding specific sources about "${topic}" to your notebook.\n\nWould you like to know something more specific about ${topic}?`;
  }

  if (q.includes('how') || q.includes('kaise')) {
    return `Great question! Here's a general approach:\n\n1. **Understand the fundamentals** — Start with the core concepts and principles\n2. **Break it down** — Divide the problem into smaller, manageable steps\n3. **Research best practices** — Look at established methodologies\n4. **Practice and iterate** — Apply what you've learned and refine\n5. **Seek expert resources** — Use authoritative sources for deeper understanding\n\n> 💡 Add relevant documents or articles to your sources for more specific, cited guidance.\n\nCan I help you explore any particular aspect in more detail?`;
  }

  if (q.includes('why') || q.includes('kyon') || q.includes('reason')) {
    return `That's a thoughtful question. Here are some key perspectives:\n\n1. **Historical context** — Understanding the origins helps explain the current state\n2. **Multiple factors** — Most phenomena have several contributing causes\n3. **Evidence-based view** — Scientific research provides the most reliable explanations\n4. **Ongoing debate** — Many complex topics have multiple valid viewpoints\n\n> 💡 Upload relevant research papers or articles to get detailed, source-backed analysis.\n\nWould you like me to explore a specific angle?`;
  }

  if (q.includes('list') || q.includes('top') || q.includes('best') || q.includes('examples')) {
    return `Here are some key points to consider:\n\n1. **Research widely** — Look at multiple authoritative sources\n2. **Consider criteria** — Define what "best" or "top" means for your context\n3. **Stay updated** — Rankings and recommendations change over time\n4. **Verify claims** — Cross-reference information from multiple sources\n5. **Context matters** — The best choice depends on your specific needs\n\n> 💡 Add articles or reports to your notebook for AI-powered ranked analysis with citations.\n\nWhat specific area would you like me to focus on?`;
  }

  return `Thank you for your question! Here's what I can share:\n\n**General Insight:**\nThis is an interesting topic that spans several areas of knowledge. While I can provide general information, the most powerful experience comes from adding your own research sources.\n\n**What you can do:**\n1. **Ask general questions** — I'll provide broad knowledge on many topics\n2. **Add sources** — Upload documents, articles, or notes for citation-backed answers\n3. **Generate content** — Use Studio tools for summaries, FAQs, study guides\n4. **Deep dive** — Ask follow-up questions to explore any topic further\n\n> 💡 Try asking about specific topics like AI, machine learning, Python, blockchain, climate change, quantum computing, or space exploration!\n\nWhat would you like to explore?`;
}

export function generateAnswer(sources: Source[], query: string): { answer: string; citations: string[] } {
  const selectedSources = sources.filter((s) => s.selected);

  // No sources selected — use general knowledge mode
  if (selectedSources.length === 0) {
    return {
      answer: generateGeneralResponse(query),
      citations: [],
    };
  }

  const relevant = findRelevantContent(sources, query);
  const citations = selectedSources.map((s) => s.title);
  const queryLower = query.toLowerCase();

  // Fact-check: scan source content for known misinformation and add corrections
  const factWarnings = factCheckSources(selectedSources);
  const factNote = factWarnings.length > 0
    ? `\n\n> ⚠️ **AI Fact-Check Notice:** Some claims in your sources may be inaccurate:\n${factWarnings.map(w => `> - ${w}`).join('\n')}\n> *Cognoir has provided corrected information above.*`
    : '';

  if (queryLower.includes('summary') || queryLower.includes('summarize') || queryLower.includes('overview')) {
    const titles = selectedSources.map((s) => s.title).join(', ');
    return {
      answer: `Based on the selected sources (${titles}), here's a comprehensive overview:\n\n${selectedSources
        .map((s) => {
          const firstParagraph = s.content.split('\n\n')[0];
          return `**${s.title}**: ${firstParagraph}`;
        })
        .join('\n\n')}\n\nThese sources provide a thorough foundation for understanding the topics covered. Would you like me to dive deeper into any specific area?${factNote}`,
      citations,
    };
  }

  if (queryLower.includes('difference') || queryLower.includes('compare') || queryLower.includes('vs')) {
    return {
      answer: `Great question! Let me compare the key concepts from your sources:\n\n${relevant.length > 0 ? relevant.slice(0, 3).map((r) => `> ${r}`).join('\n\n') : 'Based on the available sources, the main differences relate to their approaches, applications, and underlying methodologies.'}\n\n**Key Differences:**\n1. **Scope**: Each concept operates at a different level of abstraction\n2. **Application**: They are suited for different types of problems\n3. **Complexity**: They vary in computational requirements\n\nWould you like me to elaborate on any specific comparison?${factNote}`,
      citations,
    };
  }

  if (relevant.length > 0) {
    return {
      answer: `Based on your sources, here's what I found:\n\n${relevant.slice(0, 3).map((r) => `${r}`).join('\n\n')}\n\nThis information is drawn from your selected sources. Would you like me to explore this topic further or look at a different aspect?${factNote}`,
      citations,
    };
  }

  return {
    answer: `Based on the sources you've provided, I can share the following insights:\n\n${selectedSources
      .map((s) => {
        const lines = s.content.split('\n').filter((l) => l.trim());
        return `From **${s.title}**:\n${lines.slice(0, 3).join('\n')}`;
      })
      .join('\n\n')}\n\nThe sources provide extensive information about these topics. Feel free to ask more specific questions for detailed answers!${factNote}`,
    citations,
  };
}

export function generateSummary(sources: Source[]): { title: string; content: string } {
  const selected = sources.filter((s) => s.selected);
  if (selected.length === 0) return { title: 'Summary', content: 'No sources selected.' };
  const content = selected.map((s) => {
    const paragraphs = s.content.split('\n\n').filter((p) => p.trim());
    return `## ${s.title}\n\n${paragraphs.slice(0, 3).join('\n\n')}`;
  }).join('\n\n---\n\n');
  return { title: `Summary: ${selected.map((s) => s.title).join(' & ')}`, content: `# Summary\n\n${content}\n\n---\n\n*This summary was generated from ${selected.length} source(s).*` };
}

export function generateFAQ(sources: Source[]): { title: string; content: string } {
  const selected = sources.filter((s) => s.selected);
  if (selected.length === 0) return { title: 'FAQ', content: 'No sources selected.' };
  const headings: string[] = [];
  selected.forEach((s) => { s.content.split('\n').forEach((line) => { if (line.startsWith('#')) headings.push(line.replace(/^#+\s*/, '').replace(/\*+/g, '')); }); });
  const faqs = headings.slice(0, 8).map((h, i) => `**Q${i + 1}: What is ${h}?**\n\nBased on the sources, ${h} is a key concept that plays an important role in the overall topic. It encompasses various aspects that are detailed in the source materials.`);
  if (faqs.length === 0) faqs.push('**Q1: What are the main topics covered?**\n\nThe sources cover: ' + selected.map((s) => s.title).join(', '));
  return { title: 'Frequently Asked Questions', content: `# Frequently Asked Questions\n\n${faqs.join('\n\n---\n\n')}\n\n---\n\n*Generated from ${selected.length} source(s).*` };
}

export function generateStudyGuide(sources: Source[]): { title: string; content: string } {
  const selected = sources.filter((s) => s.selected);
  if (selected.length === 0) return { title: 'Study Guide', content: 'No sources selected.' };
  const sections = selected.map((s) => {
    const lines = s.content.split('\n').filter((l) => l.trim());
    const keyTerms = lines.filter((l) => l.includes('**') || l.startsWith('- ')).slice(0, 6).map((l) => l.replace(/^\s*-\s*/, '• '));
    return `## 📖 ${s.title}\n\n### Key Concepts\n${keyTerms.join('\n') || '• Review the main content for key terms'}\n\n### Review Questions\n1. What are the main ideas presented in "${s.title}"?\n2. How do these concepts relate to the broader topic?\n3. Can you explain the key terms in your own words?`;
  });
  return { title: 'Study Guide', content: `# 📚 Study Guide\n\n${sections.join('\n\n---\n\n')}\n\n---\n\n## 🎯 Study Tips\n- Review each section thoroughly\n- Try to explain concepts without looking at the source\n- Create connections between different topics\n- Practice with the review questions\n\n*Generated from ${selected.length} source(s).*` };
}

export function generateTimeline(sources: Source[]): { title: string; content: string } {
  const selected = sources.filter((s) => s.selected);
  if (selected.length === 0) return { title: 'Timeline', content: 'No sources selected.' };
  const headings: string[] = [];
  selected.forEach((s) => { s.content.split('\n').forEach((line) => { if (line.startsWith('#')) headings.push(line.replace(/^#+\s*/, '').replace(/\*+/g, '')); }); });
  const timeline = headings.slice(0, 10).map((h, i) => `**Step ${i + 1}**: ${h}\n> Understanding this concept is foundational for the next stage.`);
  return { title: 'Topic Timeline', content: `# 📅 Topic Timeline & Progression\n\n${timeline.join('\n\n')}\n\n---\n\n*This timeline shows the logical progression of topics from your ${selected.length} source(s).*` };
}

export function generateBriefing(sources: Source[]): { title: string; content: string } {
  const selected = sources.filter((s) => s.selected);
  if (selected.length === 0) return { title: 'Briefing Doc', content: 'No sources selected.' };
  const briefing = selected.map((s) => {
    const firstParagraph = s.content.split('\n\n')[0];
    const bulletPoints = s.content.split('\n').filter((l) => l.startsWith('- ') || l.startsWith('• ')).slice(0, 5);
    return `## ${s.title}\n\n**Overview:** ${firstParagraph}\n\n${bulletPoints.length > 0 ? '**Key Points:**\n' + bulletPoints.join('\n') : ''}`;
  });
  return { title: 'Briefing Document', content: `# 📋 Briefing Document\n\n**Prepared from:** ${selected.map((s) => s.title).join(', ')}\n**Date:** ${new Date().toLocaleDateString()}\n\n---\n\n${briefing.join('\n\n---\n\n')}\n\n---\n\n## Executive Summary\nThis briefing covers the essential information from ${selected.length} source(s), highlighting key concepts and actionable insights.\n\n*Auto-generated briefing document.*` };
}
