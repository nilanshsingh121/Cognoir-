import { useState, useEffect } from 'react';
import { useStore } from './store';
import { useAuthStore } from './authStore';
import HomePage from './components/HomePage';
import NotebookView from './components/NotebookView';
import Login from './components/Login';
import Register from './components/Register';

type AuthScreen = 'login' | 'register';

export default function App() {
  const store = useStore();
  const auth = useAuthStore();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  // Show login/register if not authenticated
  if (!auth.isAuthenticated) {
    return (
      <>
        {authScreen === 'login' ? (
          <Login
            onLogin={auth.login}
            onSwitchToRegister={() => setAuthScreen('register')}
            error={auth.error}
            clearError={auth.clearError}
          />
        ) : (
          <Register
            onRegister={auth.register}
            onSwitchToLogin={() => setAuthScreen('login')}
            error={auth.error}
            clearError={auth.clearError}
          />
        )}
      </>
    );
  }

  // Main app after authentication
  if (store.activeNotebook) {
    return (
      <NotebookView
        notebook={store.activeNotebook}
        user={auth.user}
        onLogout={() => {
          auth.logout();
          store.setActiveNotebookId(null);
        }}
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

  return (
    <HomePage
      user={auth.user}
      notebooks={store.notebooks}
      onSelect={(id) => store.setActiveNotebookId(id)}
      onCreate={store.createNotebook}
      onDelete={store.deleteNotebook}
      onImport={(json) => {
        const id = store.importNotebook(json);
        if (id) store.setActiveNotebookId(id);
      }}
      onLogout={() => auth.logout()}
    />
  );
}
