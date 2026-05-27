import { useState } from 'react';
import { Plus, Import, LogOut, User as UserIcon, Trash2, ChevronRight, Clock } from 'lucide-react';
import { useAuth } from '../AuthContext';
import type { Notebook } from '../types';

interface HomePageProps {
  notebooks: Notebook[];
  onSelect: (id: string) => void;
  onCreate: (title: string, emoji: string) => string;
  onDelete: (id: string) => void;
  onImport: (json: string) => void;
}

const EMOJI_OPTIONS = ['📓', '🧠', '⚛️', '🌐', '📚', '🔬', '🎨', '💡', '🚀', '📊'];

export default function HomePage({
  notebooks,
  onSelect,
  onCreate,
  onDelete,
  onImport,
}: HomePageProps) {
  const { user, logout } = useAuth();
  const [newTitle, setNewTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📓');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreate = () => {
    if (newTitle.trim()) {
      onCreate(newTitle, selectedEmoji);
      setNewTitle('');
      setSelectedEmoji('📓');
      setShowCreateForm(false);
    }
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.cognoir.json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev: any) => {
          try {
            onImport(ev.target.result);
          } catch {
            alert('Invalid notebook file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const sortedNotebooks = [...notebooks].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="min-h-screen meshBg noise">
      {/* Header */}
      <header className="border-b border-[rgba(255,255,255,.08)] sticky top-0 z-50 backdrop-blur-md bg-[rgba(7,7,9,.3)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold gG">Cognoir</h1>
            <span className="text-xs text-[#9299A8] bg-[rgba(212,175,97,.1)] px-2 py-1 rounded-6">
              Studio
            </span>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-2 glass rounded-12 sB">
              <UserIcon className="w-4 h-4 text-[#D4AF61]" />
              <div className="text-sm">
                <p className="font-medium text-[#F0EBE1]">{user?.name}</p>
                <p className="text-xs text-[#9299A8]">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-[rgba(212,175,97,.1)] rounded-12 text-[#D4AF61] transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12 aUp">
          <h2 className="text-4xl font-bold mb-3 text-[#F0EBE1]">Welcome back, {user?.name?.split(' ')[0]}</h2>
          <p className="text-[#9299A8] max-w-2xl">
            Organize your research with powerful notebooks. Add sources, chat with AI, and generate insights all in one place.
          </p>
        </div>

        {/* Create Notebook Section */}
        {!showCreateForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <button
              onClick={() => setShowCreateForm(true)}
              className="group gb glass sR p-8 rounded-[20px] border border-[rgba(212,175,97,.15)] hover:border-[rgba(212,175,97,.35)] transition-all h-40 flex flex-col items-center justify-center aSi"
            >
              <Plus className="w-8 h-8 text-[#D4AF61] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-[#F0EBE1] mb-1">Create New Notebook</h3>
              <p className="text-sm text-[#9299A8]">Start a new research project</p>
            </button>

            <button
              onClick={handleImport}
              className="group gb glass sR p-8 rounded-[20px] border border-[rgba(212,175,97,.15)] hover:border-[rgba(212,175,97,.35)] transition-all h-40 flex flex-col items-center justify-center aSi"
              style={{ animationDelay: '0.1s' }}
            >
              <Import className="w-8 h-8 text-[#D4AF61] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-[#F0EBE1] mb-1">Import Notebook</h3>
              <p className="text-sm text-[#9299A8]">Load a .cognoir.json file</p>
            </button>
          </div>
        ) : (
          <div className="mb-12 gb glass sR p-8 rounded-[20px] aSi">
            <h3 className="text-lg font-semibold text-[#F0EBE1] mb-6">Create New Notebook</h3>

            <div className="space-y-4">
              {/* Emoji Picker */}
              <div>
                <label className="block text-sm font-medium text-[#D4AF61] mb-3">
                  Choose an emoji
                </label>
                {!showEmojiPicker ? (
                  <button
                    onClick={() => setShowEmojiPicker(true)}
                    className="w-full p-3 bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.1)] rounded-12 text-2xl hover:border-[rgba(212,175,97,.3)] transition-all text-center"
                  >
                    {selectedEmoji}
                  </button>
                ) : (
                  <div className="grid grid-cols-10 gap-2 p-3 bg-[rgba(255,255,255,.02)] rounded-12 border border-[rgba(255,255,255,.1)]">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setSelectedEmoji(emoji);
                          setShowEmojiPicker(false);
                        }}
                        className={`text-2xl p-2 rounded-8 transition-all ${
                          selectedEmoji === emoji
                            ? 'bg-[rgba(212,175,97,.2)] scale-110'
                            : 'hover:bg-[rgba(212,175,97,.1)]'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-[#D4AF61] mb-2">
                  Notebook Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Machine Learning Research..."
                  className="w-full px-4 py-2.5 bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.1)] rounded-12 text-[#F0EBE1] placeholder-[#9299A8] focus:outline-none focus:ring-0 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreate}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#D4AF61] to-[#F0DFB0] text-[#070709] font-semibold rounded-12 hover:shadow-lg hover:shadow-[rgba(212,175,97,.2)] transition-all"
                >
                  Create Notebook
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewTitle('');
                  }}
                  className="flex-1 py-2.5 border border-[rgba(212,175,97,.3)] rounded-12 text-[#D4AF61] hover:bg-[rgba(212,175,97,.1)] transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notebooks Grid */}
        <div>
          <h3 className="text-lg font-semibold text-[#F0EBE1] mb-6">Your Notebooks</h3>

          {sortedNotebooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedNotebooks.map((notebook, idx) => (
                <button
                  key={notebook.id}
                  onClick={() => onSelect(notebook.id)}
                  className="group gb glass sR p-6 rounded-[20px] text-left hover:border-[rgba(212,175,97,.35)] transition-all aSi"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{notebook.emoji}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${notebook.title}"?`)) {
                          onDelete(notebook.id);
                        }
                      }}
                      className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-8 text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="font-semibold text-[#F0EBE1] mb-2 group-hover:text-[#D4AF61] transition-colors lc1">
                    {notebook.title}
                  </h4>

                  <div className="space-y-2 text-xs text-[#9299A8]">
                    <p>📚 {notebook.sources.length} source{notebook.sources.length !== 1 ? 's' : ''}</p>
                    <p>💬 {notebook.messages.length} message{notebook.messages.length !== 1 ? 's' : ''}</p>
                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-[rgba(255,255,255,.05)]">
                      <Clock className="w-3 h-3" />
                      <span>Updated {formatDate(notebook.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[#D4AF61] opacity-0 group-hover:opacity-100 transition-opacity">
                    Open <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 gb glass sR rounded-[20px] p-8">
              <p className="text-[#9299A8] mb-4">No notebooks yet</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(212,175,97,.1)] text-[#D4AF61] rounded-12 hover:bg-[rgba(212,175,97,.2)] transition-all"
              >
                <Plus className="w-4 h-4" />
                Create your first notebook
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
