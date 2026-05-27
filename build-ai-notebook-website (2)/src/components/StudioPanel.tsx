import { useState } from 'react';
import { FileText, HelpCircle, BookOpen, Clock, Briefcase, Sparkles, Pin, PinOff, Trash2, ChevronDown, ChevronRight, Headphones, Loader2, Wand2, Eye, VolumeX } from 'lucide-react';
import type { Source, Note } from '../types';
import { generateSummary, generateFAQ, generateStudyGuide, generateTimeline, generateBriefing } from '../utils/ai';
import { generateAudioOverview, stopAudio } from '../utils/parsers';
interface Props { sources:Source[]; notes:Note[]; onAddNote:(n:Omit<Note,'id'|'createdAt'|'pinned'>)=>void; onTogglePin:(id:string)=>void; onDeleteNote:(id:string)=>void }
const ACT=[{id:'summary',l:'Summary',d:'Key points',i:FileText,c:'#D4AF61'},{id:'faq',l:'FAQ',d:'Q&A pairs',i:HelpCircle,c:'#8BAF8E'},{id:'study-guide',l:'Study Guide',d:'Review',i:BookOpen,c:'#B4B8C8'},{id:'timeline',l:'Timeline',d:'Flow',i:Clock,c:'#C98B90'},{id:'briefing',l:'Briefing',d:'Executive',i:Briefcase,c:'#8DA3C4'}];

export default function StudioPanel({ sources, notes, onAddNote, onTogglePin, onDeleteNote }: Props) {
  const [gen,setGen]=useState<string|null>(null),[showN,setShowN]=useState(true),[view,setView]=useState<Note|null>(null),[aGen,setAGen]=useState(false);
  const sc=sources.filter(s=>s.selected).length,pin=notes.filter(n=>n.pinned),unpin=notes.filter(n=>!n.pinned);
  const doGen=(id:string)=>{if(!sc)return;setGen(id);setTimeout(()=>{let r:{title:string;content:string};switch(id){case'summary':r=generateSummary(sources);break;case'faq':r=generateFAQ(sources);break;case'study-guide':r=generateStudyGuide(sources);break;case'timeline':r=generateTimeline(sources);break;case'briefing':r=generateBriefing(sources);break;default:r={title:'Note',content:''}};onAddNote({title:r.title,content:r.content,type:id as Note['type']});setGen(null)},1000+Math.random()*1200)};
  const [playing,setPlaying]=useState(false);
  const doAudio=async()=>{
    setAGen(true);
    const selected=sources.filter(s=>s.selected);
    const transcript=selected.map(s=>`From ${s.title}: ${s.content.split('\n\n').slice(0,2).join('. ').replace(/[#*\-_>]/g,'').substring(0,300)}`).join('. Next, ');
    const noteContent=`# 🎧 Audio Overview\n\n*Podcast-style overview generated from ${selected.length} source(s).*\n\n## Transcript\n\n${selected.map(s=>`**${s.title}**: ${s.content.split('\n\n')[0]}`).join('\n\n')}\n\n---\n\n*Audio was played using Web Speech API. Click the play button to listen again.*`;
    onAddNote({title:'🎧 Audio Overview',content:noteContent,type:'summary'});
    // Play via TTS
    setPlaying(true);
    await generateAudioOverview(`Welcome to your Cognoir audio overview. ${transcript}. That concludes the overview.`);
    setPlaying(false);
    setAGen(false);
  };
  const handleStopAudio=()=>{stopAudio();setPlaying(false);setAGen(false)};
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/[0.06] p-4"><div className="flex items-center gap-2"><div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#B4B8C8]/15"><Wand2 className="h-2.5 w-2.5 text-[#B4B8C8]"/></div><span className="text-[11px] font-semibold text-[#B8B8CE]">Studio</span></div></div>
      <div className="flex-1 overflow-y-auto p-2.5">
        <div className="mb-4"><button onClick={doAudio} disabled={!sc||aGen} className="shine group relative w-full overflow-hidden rounded-2xl sB bg-gradient-to-r from-[#D4AF61]/[0.06] to-[#B4B8C8]/[0.04] p-4 transition-all duration-500 hover:from-[#D4AF61]/[0.1] disabled:opacity-35 active:scale-[0.98]">
          <div className="relative flex items-center gap-3">{aGen?<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF61]/15"><Loader2 className="h-4 w-4 animate-spin text-[#D4AF61]"/></div>:<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF61]/15 transition group-hover:scale-105"><Headphones className="h-4 w-4 text-[#D4AF61]"/></div>}
          <div className="text-left"><p className="text-[11px] font-semibold text-white/90">{playing?'Playing Audio…':'Audio Overview'}</p><p className="text-[9px] text-[#8888A0]">{aGen?(playing?'🔊 Speaking…':'Creating…'):'Real AI voice narration'}</p></div>
            {playing&&<button onClick={(e)=>{e.stopPropagation();handleStopAudio()}} className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg bg-[#C98B90]/15 text-[#C98B90] hover:bg-[#C98B90]/25 transition"><VolumeX className="h-3 w-3"/></button>}</div>
          {aGen&&<div className="mt-2.5 flex items-end gap-[2px] h-4">{Array.from({length:28}).map((_,i)=><div key={i} className="w-[1.5px] rounded-full bg-[#D4AF61]/40" style={{animation:`wb .7s ease-in-out ${i*.03}s infinite alternate`}}/>)}</div>}
        </button></div>

        <p className="mb-2 px-1 text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">Generate</p>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {ACT.map((a,idx)=>{const I=a.i,ig=gen===a.id;return(
            <button key={a.id} onClick={()=>doGen(a.id)} disabled={!sc||ig} className="group flex flex-col items-start rounded-[14px] sB bg-white/[0.02] p-3 text-left transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.12] disabled:opacity-20 aSi active:scale-[0.97]" style={{animationDelay:`${idx*.05}s`}}>
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg transition group-hover:scale-110" style={{background:`${a.c}18`}}>{ig?<Loader2 className="h-3 w-3 animate-spin" style={{color:a.c}}/>:<I className="h-3 w-3" style={{color:a.c}}/>}</div>
              <span className="text-[10px] font-semibold text-[#D2D5E0]">{a.l}</span><span className="text-[8px] text-[#8E8EA6]">{a.d}</span>
            </button>
          )})}
        </div>

        <button onClick={()=>setShowN(!showN)} className="mb-2 flex w-full items-center gap-1 px-1 py-1 text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase hover:text-[#BABACE] transition">
          {showN?<ChevronDown className="h-2.5 w-2.5"/>:<ChevronRight className="h-2.5 w-2.5"/>}Notes
          <span className="ml-auto rounded-full bg-[#D4AF61]/10 px-2 py-[1px] text-[9px] text-[#D4AF61]/80 normal-case tracking-normal">{notes.length}</span>
        </button>
        {showN&&(<div className="space-y-1">
          {notes.length===0?<div className="flex flex-col items-center py-10"><div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-white/[0.08]"><Sparkles className="h-4 w-4 text-[#8E8EA6]"/></div><p className="text-[9px] text-[#8888A0]">Generate content above</p></div>
          :<>{pin.length>0&&<div className="space-y-1"><p className="flex items-center gap-1 px-1 text-[7px] font-bold tracking-wider text-[#D4AF61]/60 uppercase"><Pin className="h-2 w-2"/>Pinned</p>{pin.map(n=><NC key={n.id} n={n} v={()=>setView(n)} p={()=>onTogglePin(n.id)} d={()=>onDeleteNote(n.id)}/>)}</div>}
          {unpin.length>0&&<div className="space-y-1">{pin.length>0&&<p className="px-1 text-[7px] font-bold tracking-wider text-[#585870] uppercase">Recent</p>}{unpin.map(n=><NC key={n.id} n={n} v={()=>setView(n)} p={()=>onTogglePin(n.id)} d={()=>onDeleteNote(n.id)}/>)}</div>}</>}
        </div>)}
      </div>
      {view&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-3xl aFi" onClick={()=>setView(null)}>
          <div className="mx-4 flex max-h-[85vh] w-full max-w-2xl flex-col rounded-[22px] sB bg-[#0E0E16]/97 shadow-2xl aSi" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4"><div className="flex items-center gap-2.5"><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D4AF61]/15"><FileText className="h-3 w-3 text-[#D4AF61]"/></div><h3 className="text-[13px] font-semibold">{view.title}</h3></div><button onClick={()=>setView(null)} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8888A0] hover:bg-white/[0.04] hover:text-white transition">✕</button></div>
            <div className="flex-1 overflow-y-auto px-6 py-5"><div className="text-[13px] leading-[1.9] text-[#D2D5E0]">{view.content.split('\n').map((l,i)=>rl(l,i))}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}
const TN:Record<string,{s:string;c:string}>={summary:{s:'✦',c:'#D4AF61'},faq:{s:'◆',c:'#8BAF8E'},'study-guide':{s:'○',c:'#B4B8C8'},timeline:{s:'◇',c:'#C98B90'},briefing:{s:'▪',c:'#8DA3C4'},custom:{s:'·',c:'#8888A0'}};
function NC({n,v,p,d}:{n:Note;v:()=>void;p:()=>void;d:()=>void}){const t=TN[n.type]||TN.custom;return(
  <div onClick={v} className="group cursor-pointer rounded-xl sB bg-white/[0.02] p-2.5 transition-all duration-300 hover:bg-white/[0.04]">
    <div className="mb-1 flex items-start justify-between gap-2">
      <div className="flex items-center gap-1.5 min-w-0"><span className="text-[11px] flex-shrink-0 font-bold" style={{color:t.c}}>{t.s}</span><span className="text-[10px] font-medium text-[#D2D5E0] lc1 group-hover:text-white">{n.title}</span></div>
      <div className="flex gap-0.5 opacity-0 transition group-hover:opacity-100">
        <button onClick={e=>{e.stopPropagation();p()}} className="rounded p-0.5 text-[#585870] hover:text-[#D4AF61]">{n.pinned?<PinOff className="h-2.5 w-2.5"/>:<Pin className="h-2.5 w-2.5"/>}</button>
        <button onClick={e=>{e.stopPropagation();v()}} className="rounded p-0.5 text-[#585870] hover:text-white"><Eye className="h-2.5 w-2.5"/></button>
        <button onClick={e=>{e.stopPropagation();d()}} className="rounded p-0.5 text-[#585870] hover:text-red-400"><Trash2 className="h-2.5 w-2.5"/></button>
      </div>
    </div>
    <span className="inline-block rounded-[4px] px-1.5 py-[2px] text-[8px] font-bold" style={{background:`${t.c}15`,color:t.c}}>{n.type.replace('-',' ')}</span>
  </div>
)}
function rl(l:string,i:number){
  if(l.startsWith('# '))return<h1 key={i} className="mb-2.5 text-[16px] font-semibold gG">{l.substring(2)}</h1>;
  if(l.startsWith('## '))return<h2 key={i} className="mt-4 mb-1.5 text-[14px] font-semibold text-white/90">{l.substring(3)}</h2>;
  if(l.startsWith('### '))return<h3 key={i} className="mt-3 mb-1 text-[13px] font-medium text-[#D2D5E0]">{l.substring(4)}</h3>;
  if(l.startsWith('---'))return<hr key={i} className="my-3 border-white/[0.06]"/>;
  if(l.startsWith('- ')||l.startsWith('• '))return<div key={i} className="flex gap-2.5 py-[2px] ml-1"><span className="mt-[8px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4AF61]/40"/><span>{rb(l.substring(2))}</span></div>;
  if(l.startsWith('*')&&l.endsWith('*'))return<p key={i} className="text-[#8888A0] italic">{l.replace(/^\*|\*$/g,'')}</p>;
  if(l.match(/^\d+\.\s/))return<div key={i} className="flex gap-2.5 py-[2px] ml-1"><span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#D4AF61]/[0.1] text-[9px] font-bold text-[#D4AF61]/80 mt-[2px]">{l.match(/^\d+/)?.[0]}</span><span>{rb(l.replace(/^\d+\.\s*/,''))}</span></div>;
  if(!l.trim())return<div key={i} className="h-2"/>;
  return<p key={i}>{rb(l)}</p>;
}
function rb(t:string){return t.split(/(\*\*[^*]+\*\*)/g).map((p,i)=>p.startsWith('**')&&p.endsWith('**')?<strong key={i} className="font-semibold text-[#E8D5A0]">{p.slice(2,-2)}</strong>:p)}
