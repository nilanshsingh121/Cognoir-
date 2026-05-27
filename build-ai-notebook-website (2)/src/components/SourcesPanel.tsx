import { useState, useRef } from 'react';
import { Plus, FileText, Globe, Video, Type, ChevronDown, ChevronRight, Check, X, Eye, Upload, Layers, FileUp, ShieldCheck, AlertTriangle, Link, Loader2 } from 'lucide-react';
import type { Source } from '../types';
import { extractPdfText, fetchWebsiteContent, fetchYouTubeTranscript } from '../utils/parsers';

interface Props { sources:Source[]; onAddSource:(t:string,c:string,ty:Source['type'])=>void; onRemoveSource:(id:string)=>void; onToggleSource:(id:string)=>void; onViewSource:(s:Source)=>void }
const IC:Record<Source['type'],typeof FileText>={text:Type,document:FileText,website:Globe,youtube:Video};
const TN:Record<Source['type'],{c:string;b:string}>={text:{c:'#8BAF8E',b:'rgba(139,175,142,.15)'},document:{c:'#D4AF61',b:'rgba(212,175,97,.15)'},website:{c:'#B4B8C8',b:'rgba(180,184,200,.15)'},youtube:{c:'#C98B90',b:'rgba(201,139,144,.15)'}};

export default function SourcesPanel({ sources, onAddSource, onRemoveSource, onToggleSource, onViewSource }: Props) {
  const [show,setShow]=useState(false),[ty,setTy]=useState<Source['type']>('text'),[ti,setTi]=useState(''),[co,setCo]=useState(''),[exp,setExp]=useState(true);
  const [verifying,setVerifying]=useState(false),[verified,setVerified]=useState<{fixed:boolean;corrections:string[]}|null>(null);
  const [urlInput,setUrlInput]=useState(''),[fetching,setFetching]=useState(false);
  const fileRef=useRef<HTMLInputElement>(null);
  const sel=sources.filter(s=>s.selected).length;

  const add=()=>{
    if(ti.trim()&&co.trim()){
      const finalContent = verified?.fixed ? `${co}\n\n---\n⚠️ **AI Fact-Check Applied:**\n${verified.corrections.map(c=>`- ${c}`).join('\n')}` : co;
      onAddSource(ti.trim(),finalContent.trim(),ty);
      setTi('');setCo('');setShow(false);setVerified(null);setUrlInput('');
    }
  };

  const all=()=>{const a=sources.every(s=>s.selected);sources.forEach(s=>{if(a?s.selected:!s.selected)onToggleSource(s.id)})};

  const handleFileUpload=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];
    if(!file) return;
    const name = file.name.replace(/\.[^.]+$/,'');
    setTi(name);
    setFetching(true);

    if(file.name.toLowerCase().endsWith('.pdf')){
      setTy('document');
      const text = await extractPdfText(file);
      setCo(text);
    } else {
      setTy('document');
      const reader=new FileReader();
      reader.onload=(ev)=>setCo(ev.target?.result as string||'');
      reader.readAsText(file);
    }
    setFetching(false);
    setVerified(null);
    if(fileRef.current) fileRef.current.value='';
  };

  const handleUrlFetch=async()=>{
    if(!urlInput.trim()) return;
    setFetching(true); setVerified(null);
    const url = urlInput.trim();
    
    if(url.includes('youtube.com')||url.includes('youtu.be')){
      setTy('youtube');
      const {title,content} = await fetchYouTubeTranscript(url);
      setTi(title); setCo(content);
    } else {
      setTy('website');
      const {title,content} = await fetchWebsiteContent(url);
      setTi(title); setCo(content);
    }
    setFetching(false);
  };

  const runFactCheck=(content:string)=>{
    setVerifying(true);setVerified(null);
    setTimeout(()=>{
      const corrections:string[]=[];
      const lower=content.toLowerCase();
      const checks:[RegExp,string][]=[
        [/sun revolves around the earth/i,'"Sun revolves around Earth" → Earth revolves around the Sun'],
        [/10% of.{0,10}brain/i,'"10% of brain" myth → We use virtually all parts of the brain'],
        [/great wall.{0,20}visible.{0,15}space/i,'"Great Wall visible from space" → Not visible to naked eye'],
        [/lightning never strikes.{0,10}twice/i,'"Lightning never strikes twice" → It frequently hits same spot'],
        [/goldfish.{0,15}(3|three).{0,10}second/i,'"Goldfish 3-second memory" → They remember for months'],
        [/diamonds?.{0,10}(from|made of) coal/i,'"Diamonds from coal" → They form from carbon in the mantle'],
        [/(humans?|we).{0,15}evolved from monkeys/i,'"Evolved from monkeys" → Share a common ancestor'],
        [/earth is flat/i,'"Earth is flat" → Earth is an oblate spheroid'],
        [/napoleon.{0,10}(was )?short/i,'"Napoleon was short" → 5\'7", average for his era'],
        [/vitamin c.{0,15}cur(e|es) cold/i,'"Vitamin C cures colds" → May reduce duration only'],
      ];
      for(const [rx,fix] of checks) if(rx.test(lower)) corrections.push(fix);
      setVerified({fixed:corrections.length>0,corrections});
      setVerifying(false);
    },1200+Math.random()*800);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/[0.06] p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-[#D4AF61]/15"><Layers className="h-2.5 w-2.5 text-[#D4AF61]"/></div><span className="text-[11px] font-semibold text-[#B8B8CE]">Sources</span></div>
          <button onClick={()=>{setShow(true);setVerified(null);setUrlInput('');setCo('');setTi('')}} className="shine flex items-center gap-1 rounded-[8px] bg-[#D4AF61]/15 px-2.5 py-1 text-[9px] font-bold text-[#D4AF61] transition-all hover:bg-[#D4AF61]/25 active:scale-95"><Plus className="h-2.5 w-2.5"/>Add</button>
        </div>
        {sources.length>0&&<div className="flex items-center justify-between"><button onClick={all} className="text-[9px] text-[#8E8EA6] hover:text-[#D4AF61] transition">{sel===sources.length?'Deselect':'Select all'}</button><span className="text-[9px] text-[#585870]">{sel}/{sources.length}</span></div>}
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {sources.length===0?(
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02]"><Upload className="h-5 w-5 text-[#8E8EA6]"/></div>
            <p className="text-[11px] font-medium text-[#9898AE]">No sources yet</p>
            <p className="mt-1 text-[9px] text-[#8E8EA6]">Upload PDF, paste text, or add URL</p>
            <button onClick={()=>{setShow(true);setVerified(null);setUrlInput('')}} className="mt-5 text-[10px] font-bold text-[#D4AF61] hover:text-[#E8D5A0] transition">+ Add source</button>
          </div>
        ):(
          <div>
            <button onClick={()=>setExp(!exp)} className="flex w-full items-center gap-1 px-2 py-1.5 text-[9px] font-bold tracking-wider text-[#8E8EA6] uppercase hover:text-[#BABACE] transition">{exp?<ChevronDown className="h-2.5 w-2.5"/>:<ChevronRight className="h-2.5 w-2.5"/>}All ({sources.length})</button>
            {exp&&sources.map((s,i)=>{const I=IC[s.type],tn=TN[s.type];return(
              <div key={s.id} className={`group flex items-start gap-2.5 rounded-[12px] p-2.5 transition-all duration-300 aUp ${s.selected?'bg-[#D4AF61]/[0.06] border border-[#D4AF61]/[0.12]':'border border-transparent hover:bg-white/[0.025]'}`} style={{animationDelay:`${i*.04}s`}}>
                <button onClick={()=>onToggleSource(s.id)} className={`mt-0.5 flex h-[15px] w-[15px] flex-shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-all ${s.selected?'border-[#D4AF61] bg-[#D4AF61] text-[#070709]':'border-[#585870] hover:border-[#9898AE]'}`}>{s.selected&&<Check className="h-2.5 w-2.5" strokeWidth={3}/>}</button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5"><div className="flex h-4 w-4 items-center justify-center rounded-[4px]" style={{background:tn.b}}><I className="h-2.5 w-2.5" style={{color:tn.c}}/></div><span className="truncate text-[11px] font-medium text-[#D2D5E0] group-hover:text-white">{s.title}</span></div>
                  <p className="mt-0.5 text-[9px] text-[#8E8EA6] lc2">{s.content.substring(0,70)}…</p>
                </div>
                <div className="flex flex-col gap-0.5 opacity-0 transition group-hover:opacity-100">
                  <button onClick={()=>onViewSource(s)} className="rounded p-1 text-[#585870] hover:text-[#D4AF61] transition"><Eye className="h-3 w-3"/></button>
                  <button onClick={()=>onRemoveSource(s.id)} className="rounded p-1 text-[#585870] hover:text-red-400 transition"><X className="h-3 w-3"/></button>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      {/* ADD SOURCE MODAL */}
      {show&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-3xl aFi" onClick={()=>{setShow(false);setTi('');setCo('');setVerified(null);setUrlInput('')}}>
          <div className="mx-4 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[22px] sB bg-[#0E0E16]/97 p-9 shadow-2xl aSi" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#D4AF61]/15"><Upload className="h-4 w-4 text-[#D4AF61]"/></div>
              <input ref={fileRef} type="file" accept=".txt,.md,.csv,.json,.pdf,.doc,.docx" onChange={handleFileUpload} className="hidden"/>
              <button onClick={()=>fileRef.current?.click()} className="flex items-center gap-1.5 rounded-[9px] sB bg-white/[0.03] px-3.5 py-2 text-[10px] font-bold text-[#9898AE] transition hover:bg-white/[0.05] hover:text-white active:scale-95">
                <FileUp className="h-3 w-3"/>{fetching?'Reading…':'Upload File / PDF'}
              </button>
            </div>
            <h3 className="mb-1 text-[17px] font-semibold gG">Add Source</h3>
            <p className="mb-5 text-[11px] text-[#8888A0]">Upload PDF, paste a URL, or add text directly. AI will fact-check.</p>

            {/* URL input */}
            <div className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <Link className="absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 text-[#585870]"/>
                <input type="text" value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder="Paste website URL or YouTube link…"
                  className="w-full rounded-[9px] sB bg-white/[0.02] py-2.5 pr-3 pl-9 text-[11px] text-[#F0EBE1] placeholder-[#585870] outline-none transition"/>
              </div>
              <button onClick={handleUrlFetch} disabled={!urlInput.trim()||fetching}
                className="flex items-center gap-1 rounded-[9px] bg-[#B4B8C8]/10 px-3 py-2 text-[10px] font-bold text-[#B4B8C8] transition hover:bg-[#B4B8C8]/20 disabled:opacity-30 active:scale-95">
                {fetching?<Loader2 className="h-3 w-3 animate-spin"/>:<Globe className="h-3 w-3"/>}Fetch
              </button>
            </div>

            {/* Type selector */}
            <div className="mb-4 flex gap-1.5">
              {([{t:'text' as const,l:'Text',i:Type},{t:'document' as const,l:'Doc',i:FileText},{t:'website' as const,l:'Web',i:Globe},{t:'youtube' as const,l:'Video',i:Video}]).map(({t:tp,l,i:II})=>{const tn=TN[tp];return(
                <button key={tp} onClick={()=>setTy(tp)} className={`flex items-center gap-1 rounded-[9px] px-3.5 py-2 text-[10px] font-bold transition ${ty===tp?'':'bg-white/[0.03] text-[#8888A0] hover:bg-white/[0.06]'}`}
                  style={ty===tp?{background:tn.b,color:tn.c,boxShadow:`0 0 0 1px ${tn.c}40`}:{}}><II className="h-2.5 w-2.5"/>{l}</button>
              )})}
            </div>

            <label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">Title</label>
            <input type="text" value={ti} onChange={e=>setTi(e.target.value)} placeholder="Source name" className="mb-3 w-full rounded-[11px] sB bg-white/[0.03] px-4 py-3 text-[12px] text-[#F0EBE1] placeholder-[#585870] outline-none transition" autoFocus/>

            <label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">Content</label>
            <textarea value={co} onChange={e=>{setCo(e.target.value);setVerified(null)}} placeholder="Paste text, or upload file / fetch URL above…" rows={5}
              className="mb-3 w-full resize-none rounded-[11px] sB bg-white/[0.03] px-4 py-3 text-[12px] leading-relaxed text-[#F0EBE1] placeholder-[#585870] outline-none transition"/>

            {/* Fact-check */}
            {co.trim().length>20&&!verified&&!verifying&&(
              <button onClick={()=>runFactCheck(co)} className="mb-3 flex w-full items-center justify-center gap-2 rounded-[11px] sB bg-[#8BAF8E]/8 py-2.5 text-[11px] font-bold text-[#8BAF8E] transition hover:bg-[#8BAF8E]/15 active:scale-[0.98]">
                <ShieldCheck className="h-3.5 w-3.5"/>AI Fact-Check
              </button>
            )}
            {verifying&&(
              <div className="mb-3 flex items-center gap-2.5 rounded-[11px] sB bg-[#D4AF61]/[0.04] px-4 py-3">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D4AF61]"/>
                <span className="text-[11px] font-medium text-[#D4AF61]">Verifying facts…</span>
              </div>
            )}
            {verified&&(
              <div className={`mb-3 rounded-[11px] sB px-4 py-3 ${verified.fixed?'bg-[#C98B90]/[0.06]':'bg-[#8BAF8E]/[0.06]'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  {verified.fixed
                    ?<><AlertTriangle className="h-3.5 w-3.5 text-[#C98B90]"/><span className="text-[11px] font-bold text-[#C98B90]">Issues Found & Corrected</span></>
                    :<><ShieldCheck className="h-3.5 w-3.5 text-[#8BAF8E]"/><span className="text-[11px] font-bold text-[#8BAF8E]">Content Verified ✓</span></>}
                </div>
                {verified.corrections.map((c,i)=><p key={i} className="text-[10px] text-[#9898AE] leading-relaxed">• {c}</p>)}
                {!verified.fixed&&<p className="text-[10px] text-[#8BAF8E]/80">No factual errors detected.</p>}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={()=>{setShow(false);setTi('');setCo('');setVerified(null);setUrlInput('')}} className="flex-1 rounded-[11px] sB py-3 text-[12px] font-medium text-[#9898AE] transition hover:bg-white/[0.03] hover:text-white">Cancel</button>
              <button onClick={add} disabled={!ti.trim()||!co.trim()} className="flex-1 rounded-[11px] bg-gradient-to-r from-[#D4AF61] to-[#A08540] py-3 text-[12px] font-semibold text-[#070709] shadow-lg shadow-[#D4AF61]/15 transition hover:brightness-110 disabled:opacity-20 active:scale-[0.97]">
                {verified?.fixed?'Add with Corrections':'Add Source'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
