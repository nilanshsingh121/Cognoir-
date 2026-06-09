import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Notebook, Source, ChatMessage, Note } from './types';

const STORAGE_KEY = 'cognoir_notebooks';

function loadFromStorage(): Notebook[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data.map((n: Notebook) => ({
      ...n,
      createdAt: new Date(n.createdAt),
      updatedAt: new Date(n.updatedAt),
      sources: n.sources.map((s: Source) => ({ ...s, createdAt: new Date(s.createdAt) })),
      messages: n.messages.map((m: ChatMessage) => ({ ...m, timestamp: new Date(m.timestamp) })),
      notes: n.notes.map((nt: Note) => ({ ...nt, createdAt: new Date(nt.createdAt) })),
    }));
  } catch { return null; }
}

function saveToStorage(notebooks: Notebook[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks)); } catch {}
}

const SAMPLE_SOURCES: Source[] = [
  {
    id: uuidv4(),
    title: 'Introduction to Machine Learning',
    content: `Machine Learning (ML) is a subset of artificial intelligence (AI) that focuses on building systems that learn from data. Unlike traditional programming where rules are explicitly coded, ML algorithms identify patterns in data and make decisions with minimal human intervention.

## Types of Machine Learning

### Supervised Learning
In supervised learning, the algorithm is trained on labeled data. The model learns to map inputs to outputs based on example input-output pairs. Common algorithms include:
- Linear Regression
- Decision Trees
- Support Vector Machines
- Neural Networks

### Unsupervised Learning
Unsupervised learning works with unlabeled data. The algorithm tries to find hidden patterns or structures in the data. Common techniques include:
- K-Means Clustering
- Principal Component Analysis (PCA)
- Autoencoders

### Reinforcement Learning
In reinforcement learning, an agent learns to make decisions by interacting with an environment. The agent receives rewards or penalties for its actions and learns to maximize cumulative reward.

## Key Concepts

**Training Data**: The dataset used to train the model.
**Features**: Individual measurable properties of the data.
**Labels**: The output variable the model is trying to predict.
**Overfitting**: When a model performs well on training data but poorly on new data.
**Underfitting**: When a model is too simple to capture the underlying patterns.

## Applications
Machine learning is used in various fields including:
- Natural Language Processing
- Computer Vision
- Recommendation Systems
- Autonomous Vehicles
- Medical Diagnosis
- Financial Trading`,
    type: 'document',
    createdAt: new Date(Date.now() - 86400000),
    selected: true,
  },
  {
    id: uuidv4(),
    title: 'Deep Learning Fundamentals',
    content: `Deep Learning is a specialized subset of machine learning that uses neural networks with multiple layers (deep neural networks) to model complex patterns in data.

## Neural Network Architecture

### Neurons and Layers
A neural network consists of layers of interconnected nodes (neurons):
- **Input Layer**: Receives the raw data
- **Hidden Layers**: Process information through weighted connections
- **Output Layer**: Produces the final prediction

### Activation Functions
Activation functions introduce non-linearity into the network:
- **ReLU (Rectified Linear Unit)**: f(x) = max(0, x)
- **Sigmoid**: f(x) = 1 / (1 + e^(-x))
- **Tanh**: f(x) = (e^x - e^(-x)) / (e^x + e^(-x))
- **Softmax**: Used for multi-class classification

## Popular Architectures

### Convolutional Neural Networks (CNNs)
Designed for processing structured grid data like images. Key components:
- Convolutional layers for feature extraction
- Pooling layers for dimensionality reduction
- Fully connected layers for classification

### Recurrent Neural Networks (RNNs)
Designed for sequential data like text and time series:
- LSTM (Long Short-Term Memory)
- GRU (Gated Recurrent Unit)

### Transformers
The dominant architecture for NLP tasks:
- Self-attention mechanism
- Parallel processing capability
- Foundation for models like GPT, BERT, and T5

## Training Deep Networks

### Backpropagation
The algorithm for computing gradients in neural networks, enabling gradient-based optimization.

### Optimization
- **SGD (Stochastic Gradient Descent)**
- **Adam**: Adaptive learning rate optimizer
- **Learning Rate Scheduling**: Adjusting learning rate during training

### Regularization
Techniques to prevent overfitting:
- Dropout
- Batch Normalization
- Weight Decay
- Data Augmentation`,
    type: 'document',
    createdAt: new Date(Date.now() - 43200000),
    selected: true,
  },
];

const DEFAULT_NOTEBOOKS: Notebook[] = [
  {
    id: 'demo-notebook',
    title: 'Machine Learning Research',
    description: 'Notes and sources about ML fundamentals',
    sources: SAMPLE_SOURCES,
    messages: [],
    notes: [],
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(),
    emoji: '🧠',
  },
  {
    id: 'demo-notebook-2',
    title: 'Quantum Computing Notes',
    description: 'Exploring quantum computing concepts',
    sources: [],
    messages: [],
    notes: [],
    createdAt: new Date(Date.now() - 604800000),
    updatedAt: new Date(Date.now() - 259200000),
    emoji: '⚛️',
  },
  {
    id: 'demo-notebook-3',
    title: 'History of the Internet',
    description: 'From ARPANET to Web3',
    sources: [],
    messages: [],
    notes: [],
    createdAt: new Date(Date.now() - 1209600000),
    updatedAt: new Date(Date.now() - 432000000),
    emoji: '🌐',
  },
];

export function useStore() {
  const [notebooks, setNotebooks] = useState<Notebook[]>(() => loadFromStorage() || DEFAULT_NOTEBOOKS);
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);

  // Auto-save to localStorage on every change
  useEffect(() => { saveToStorage(notebooks); }, [notebooks]);

  const activeNotebook = notebooks.find((n) => n.id === activeNotebookId) || null;

  const createNotebook = useCallback((title: string, emoji: string = '📓') => {
    const notebook: Notebook = {
      id: uuidv4(), title, description: '', sources: [], messages: [], notes: [],
      createdAt: new Date(), updatedAt: new Date(), emoji,
    };
    setNotebooks((prev) => [notebook, ...prev]);
    return notebook.id;
  }, []);

  const deleteNotebook = useCallback((id: string) => {
    setNotebooks((prev) => prev.filter((n) => n.id !== id));
    setActiveNotebookId((prev) => (prev === id ? null : prev));
  }, []);

  const addSource = useCallback(
    (notebookId: string, title: string, content: string, type: Source['type'] = 'text') => {
      const source: Source = { id: uuidv4(), title, content, type, createdAt: new Date(), selected: true };
      setNotebooks((prev) => prev.map((n) => n.id === notebookId ? { ...n, sources: [...n.sources, source], updatedAt: new Date() } : n));
    }, []);

  const removeSource = useCallback((notebookId: string, sourceId: string) => {
    setNotebooks((prev) => prev.map((n) => n.id === notebookId ? { ...n, sources: n.sources.filter((s) => s.id !== sourceId), updatedAt: new Date() } : n));
  }, []);

  const toggleSource = useCallback((notebookId: string, sourceId: string) => {
    setNotebooks((prev) => prev.map((n) => n.id === notebookId ? { ...n, sources: n.sources.map((s) => s.id === sourceId ? { ...s, selected: !s.selected } : s), updatedAt: new Date() } : n));
  }, []);

  const addMessage = useCallback((notebookId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const msg: ChatMessage = { ...message, id: uuidv4(), timestamp: new Date() };
    setNotebooks((prev) => prev.map((n) => n.id === notebookId ? { ...n, messages: [...n.messages, msg], updatedAt: new Date() } : n));
    return msg;
  }, []);

  const addNote = useCallback((notebookId: string, note: Omit<Note, 'id' | 'createdAt' | 'pinned'>) => {
    const newNote: Note = { ...note, id: uuidv4(), createdAt: new Date(), pinned: false };
    setNotebooks((prev) => prev.map((n) => n.id === notebookId ? { ...n, notes: [newNote, ...n.notes], updatedAt: new Date() } : n));
  }, []);

  const toggleNotePin = useCallback((notebookId: string, noteId: string) => {
    setNotebooks((prev) => prev.map((n) => n.id === notebookId ? { ...n, notes: n.notes.map((note) => note.id === noteId ? { ...note, pinned: !note.pinned } : note) } : n));
  }, []);

  const deleteNote = useCallback((notebookId: string, noteId: string) => {
    setNotebooks((prev) => prev.map((n) => n.id === notebookId ? { ...n, notes: n.notes.filter((note) => note.id !== noteId) } : n));
  }, []);

  const renameNotebook = useCallback((notebookId: string, newTitle: string) => {
    setNotebooks((prev) => prev.map((n) => n.id === notebookId ? { ...n, title: newTitle, updatedAt: new Date() } : n));
  }, []);

  return {
    notebooks, activeNotebook, activeNotebookId, setActiveNotebookId,
    createNotebook, deleteNotebook, renameNotebook,
    addSource, removeSource, toggleSource,
    addMessage, addNote, toggleNotePin, deleteNote,
  };
}
