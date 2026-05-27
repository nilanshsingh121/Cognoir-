export interface Source {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'document' | 'website' | 'youtube';
  createdAt: Date;
  selected: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'summary' | 'faq' | 'study-guide' | 'timeline' | 'briefing' | 'custom';
  createdAt: Date;
  pinned: boolean;
}

export interface Notebook {
  id: string;
  title: string;
  description: string;
  sources: Source[];
  messages: ChatMessage[];
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
  emoji: string;
}
