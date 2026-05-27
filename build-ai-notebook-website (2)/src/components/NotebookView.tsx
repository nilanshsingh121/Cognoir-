import { useState } from 'react';
import { ArrowLeft, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Edit3, Check, Sparkles, Download } from 'lucide-react';
import type { Notebook, Source, ChatMessage, Note } from '../types';
import SourcesPanel from './SourcesPanel';
import ChatPanel from './ChatPanel';
import StudioPanel from './StudioPanel';
import SourceViewer from './SourceViewer';

interface Props { notebook:Notebook; onBack:()=>void; onRename:(t:string)=>void; onAddSource:(t:string,c:string,ty:Source['type'])=>void; onRemoveSource:(id:string)=>void; onToggleSource:(id:string)=>void; onSendMessage:(m:Omit<ChatMessage,'id'|'timestamp'>)=>void; onAddNote:(n:Omit<Note,'id'|'createdAt'|'pinned'>)=>void; onToggleNotePin:(id:string)=>void; onDeleteNote:(id:string)=>void; onExport:()=>void }

export default function NotebookView({ notebook, onBack, onRename, onAddSource, onRemoveSource, onToggleSource, onSendMessage, onAddNote, onToggleNotePin, onDeleteNote, onExport }: Props) {
  const [lp,setLp]=useState(true),[rp,setRp]=useState(true),[vs,setVs]=useState<Source|null>(null),[ed,setEd]=useState(false),[ev,setEv]=useState(notebook.title);
  const save=()=>{if(ev.trim())onRename(ev.trim());setEd(false)};
  const a=notebook.sources.filter(s=>s.selected).length;
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
          {/* Export button */}
          <button onClick={onExport} className="hidden sm:flex items-center gap-1.5 rounded-[9px] sB bg-white/[0.02] px-3 py-1.5 text-[9px] font-medium text-[#8888A0] transition hover:bg-white/[0.04] hover:text-[#D4AF61]" title="Export notebook">
            <Download className="h-2.5 w-2.5"/>Export
          </button>
          <div className="hidden sm:flex items-center gap-2 rounded-[9px] bg-white/[0.03] sB px-3.5 py-1.5">
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
    </div>
  );
}
