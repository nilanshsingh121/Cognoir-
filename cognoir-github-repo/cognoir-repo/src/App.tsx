import { useState } from 'react';
import { useAuth } from './AuthContext';
import HomePage from './components/HomePage';
import NotebookView from './components/NotebookView';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { useStore } from './store';

type AuthPage = 'login' | 'signup';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const store = useStore();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen meshBg noise flex items-center justify-center">
        <div className="text-center aUp">
          <h1 className="text-4xl font-bold mb-4 gG">Cognoir</h1>
          <p className="text-[#9299A8]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Authentication pages
  if (!isAuthenticated) {
    return authPage === 'login' ? (
      <LoginPage onSwitchToSignup={() => setAuthPage('signup')} />
    ) : (
      <SignupPage onSwitchToLogin={() => setAuthPage('login')} />
    );
  }

  // Authenticated view - Notebook
  if (store.activeNotebook) {
    return (
      <NotebookView
        notebook={store.activeNotebook}
        onBack={() => store.setActiveNotebookId(null)}
        onRename={(title) => store.renameNotebook(store.activeNotebook!.id, title)}
        onAddSource={(title, content, type) => store.addSource(store.activeNotebook!.id, title, content, type)}
        onRemoveSource={(sourceId) => store.removeSource(store.activeNotebook!.id, sourceId)}
        onToggleSource={(sourceId) => store.toggleSource(store.activeNotebook!.id, sourceId)}
        onSendMessage={(message) => store.addMessage(store.activeNotebook!.id, message)}
        onAddNote={(note) => store.addNote(store.activeNotebook!.id, note)}
        onToggleNotePin={(noteId) => store.toggleNotePin(store.activeNotebook!.id, noteId)}
        onDeleteNote={(noteId) => store.deleteNote(store.activeNotebook!.id, noteId)}
        onExport={() => store.exportNotebook(store.activeNotebook!.id)}
      />
    );
  }

  // Authenticated view - Home
  return (
    <HomePage
      notebooks={store.notebooks}
      onSelect={(id) => store.setActiveNotebookId(id)}
      onCreate={store.createNotebook}
      onDelete={store.deleteNotebook}
      onImport={(json) => {
        const id = store.importNotebook(json);
        if (id) store.setActiveNotebookId(id);
      }}
    />
  );
}
