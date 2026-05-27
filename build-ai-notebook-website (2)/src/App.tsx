import { useStore } from './store';
import HomePage from './components/HomePage';
import NotebookView from './components/NotebookView';

export default function App() {
  const store = useStore();

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
