import { useState } from 'react';
import { ArrowLeft, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Edit3, Check, Sparkles, Share2, Copy, CheckCheck, Download } from 'lucide-react';
import type { Notebook, Source, ChatMessage, Note } from '../types';
import SourcesPanel from './SourcesPanel';
import ChatPanel from './ChatPanel';
import StudioPanel from './StudioPanel';
import SourceViewer from './SourceViewer';

interface Props { notebook:Notebook; onBack:()=>void; onRename:(t:string)=>void; onAddSource:(t:string,c:string,ty:Source['type'])=>void; onRemoveSource:(id:string)=>void; onToggleSource:(id:string)=>void; onSendMessage:(m:Omit<ChatMessage,'id'|'timestamp'>)=>void; onAddNote:(n:Omit<Note,'id'|'createdAt'|'pinned'>)=>void; onToggleNotePin:(id:string)=>void; onDeleteNote:(id:string)=>void }

export default function NotebookView({ notebook, onBack, onRename, onAddSource, onRemoveSource, onToggleSource, onSendMessage, onAddNote, onToggleNotePin, onDeleteNote }: Props) {
  const [lp,setLp]=useState(true),[rp,setRp]=useState(true),[vs,setVs]=useState<Source|null>(null),[ed,setEd]=useState(false),[ev,setEv]=useState(notebook.title);
  const [shareModal,setShareModal]=useState(false);
  const [copied,setCopied]=useState(false);
  const save=()=>{if(ev.trim())onRename(ev.trim());setEd(false)};
  const a=notebook.sources.filter(s=>s.selected).length;

  const shareLink = `https://cognoir.app/nb/${notebook.id}`;

  const copyLink=()=>{
    navigator.clipboard.writeText(shareLink).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  };

  const exportNotebook=()=>{
    const data = {
      title: notebook.title,
      sources: notebook.sources.map(s=>({title:s.title,type:s.type,content:s.content})),
      notes: notebook.notes.map(n=>({title:n.title,type:n.type,content:n.content})),
      messages: notebook.messages.map(m=>({role:m.role,content:m.content})),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href=url;link.download=`${notebook.title.replace(/\s+/g,'-')}.json`;
    link.click();URL.revokeObjectURL(url);
  };

  return (
    <div className="noise meshBg flex h-screen flex-col text-[#F0EBE1]">
      <header className="relative z-30 flex items-center justify-between border-b border-white/[0.06] px-6 py-3 glass">
        <div className="flex items-center gap-3.5">
          <button onClick={onBack} className="group flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-[11px] text-[#8888A0] transition-all hover:bg-[#D4AF61]/[0.06] hover:text-[#D4AF61]">
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5"/><span className="hidden sm:inline font-medium">Home</span>
          </button>
          <div className="h-4 w-px bg-white/[0.08]"/>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-white/[0.05] text-[14px] sR">{notebook.emoji}</div>
            {ed?(<div className="flex items-center gap-1.5"><input value={ev} onChange={e=>setEv(e.target.value)} onKeyDown={e=>e.key==='Enter'&&save()} onBlur={save} className="rounded-[9px] border border-[#D4AF61]/20 bg-white/[0.04] px-3 py-1 text-[12px] outline-none w-56" autoFocus/><button onClick={save} className="rounded-md p-1 text-[#8BAF8E] hover:bg-[#8BAF8E]/10 transition"><Check className="h-3 w-3"/></button></div>
            ):(<div className="flex items-center gap-2"><h1 className="text-[13px] font-semibold">{notebook.title}</h1><button onClick={()=>{setEd(true);setEv(notebook.title)}} className="rounded-md p-0.5 text-[#585870] hover:text-[#9898AE] transition"><Edit3 className="h-2.5 w-2.5"/></button></div>)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Share button */}
          <button onClick={()=>setShareModal(true)} className="mr-1 flex items-center gap-1.5 rounded-[9px] sB bg-white/[0.02] px-3 py-1.5 text-[9px] font-bold text-[#9898AE] transition hover:bg-white/[0.04] hover:text-white">
            <Share2 className="h-3 w-3"/>Share
          </button>
          <div className="mr-2 hidden sm:flex items-center gap-2 rounded-[9px] bg-white/[0.03] sB px-3.5 py-1.5">
            <div className="flex h-4 w-4 items-center justify-center rounded-[5px] bg-[#D4AF61]/12"><Sparkles className="h-2 w-2 text-[#D4AF61]"/></div>
            <span className="text-[9px] font-medium text-[#8888A0]">{a} source{a!==1?'s':''} active</span>
          </div>
          <button onClick={()=>setLp(!lp)} className={`rounded-[9px] p-2 transition-all ${lp?'text-[#8888A0] hover:text-[#D4AF61] hover:bg-[#D4AF61]/[0.06]':'bg-white/[0.04] text-[#585870] hover:text-[#D4AF61]'}`}>{lp?<PanelLeftClose className="h-3.5 w-3.5"/>:<PanelLeftOpen className="h-3.5 w-3.5"/>}</button>
          <button onClick={()=>setRp(!rp)} className={`rounded-[9px] p-2 transition-all ${rp?'text-[#8888A0] hover:text-[#B4B8C8] hover:bg-[#B4B8C8]/[0.06]':'bg-white/[0.04] text-[#585870] hover:text-[#B4B8C8]'}`}>{rp?<PanelRightClose className="h-3.5 w-3.5"/>:<PanelRightOpen className="h-3.5 w-3.5"/>}</button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        {lp&&<div className="w-[275px] flex-shrink-0 border-r border-white/[0.04] bg-[#0A0A10]/90 aFi"><SourcesPanel sources={notebook.sources} onAddSource={onAddSource} onRemoveSource={onRemoveSource} onToggleSource={onToggleSource} onViewSource={setVs}/></div>}
        <div className="min-w-0 flex-1"><ChatPanel messages={notebook.messages} sources={notebook.sources} onSendMessage={onSendMessage}/></div>
        {rp&&<div className="w-[275px] flex-shrink-0 border-l border-white/[0.04] bg-[#0A0A10]/90 aFi"><StudioPanel sources={notebook.sources} notes={notebook.notes} onAddNote={onAddNote} onTogglePin={onToggleNotePin} onDeleteNote={onDeleteNote}/></div>}
      </div>
      {vs&&<SourceViewer source={vs} onClose={()=>setVs(null)}/>}

      {/* SHARE MODAL */}
      {shareModal&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-3xl aFi" onClick={()=>setShareModal(false)}>
          <div className="mx-4 w-full max-w-[420px] rounded-[22px] sB bg-[#0E0E16]/97 p-8 shadow-2xl aSi" onClick={e=>e.stopPropagation()}>
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#B4B8C8]/12"><Share2 className="h-4 w-4 text-[#B4B8C8]"/></div>
            <h3 className="mb-1 text-[17px] font-semibold gG">Share Notebook</h3>
            <p className="mb-6 text-[11px] text-[#8888A0]">Share "{notebook.title}" with others.</p>

            {/* Link */}
            <label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">Shareable Link</label>
            <div className="mb-5 flex gap-2">
              <input type="text" readOnly value={shareLink} className="flex-1 rounded-[11px] sB bg-white/[0.02] px-4 py-2.5 text-[11px] text-[#9898AE] outline-none"/>
              <button onClick={copyLink} className={`flex items-center gap-1.5 rounded-[11px] px-4 py-2.5 text-[11px] font-bold transition active:scale-95 ${copied?'bg-[#8BAF8E]/15 text-[#8BAF8E]':'bg-[#D4AF61]/12 text-[#D4AF61] hover:bg-[#D4AF61]/20'}`}>
                {copied?<><CheckCheck className="h-3 w-3"/>Copied</>:<><Copy className="h-3 w-3"/>Copy</>}
              </button>
            </div>

            {/* Export */}
            <label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">Export</label>
            <button onClick={exportNotebook} className="mb-5 flex w-full items-center gap-2 rounded-[11px] sB bg-white/[0.02] px-4 py-3 text-[11px] font-semibold text-[#9898AE] transition hover:bg-white/[0.04] hover:text-white active:scale-[0.98]">
              <Download className="h-3.5 w-3.5"/>Download as JSON
            </button>

            {/* Info */}
            <div className="mb-5 rounded-[11px] sB bg-white/[0.015] px-4 py-3">
              <p className="text-[10px] text-[#8E8EA6] leading-relaxed">
                📄 {notebook.sources.length} source{notebook.sources.length!==1?'s':''} · 
                💬 {notebook.messages.length} message{notebook.messages.length!==1?'s':''} · 
                📝 {notebook.notes.length} note{notebook.notes.length!==1?'s':''}
              </p>
            </div>

            <button onClick={()=>setShareModal(false)} className="w-full rounded-[11px] sB py-2.5 text-[12px] font-medium text-[#9898AE] transition hover:bg-white/[0.03] hover:text-white">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
