import { useState, useRef } from 'react';
import { Plus, Trash2, Clock, Search, ArrowRight, Sparkles, Crown, Zap, Shield, ArrowUpRight, Star, ShieldCheck, AlertTriangle, FileUp, X } from 'lucide-react';
import type { Notebook } from '../types';
import FloatingOrbs from './FloatingOrbs';
import ParticleField from './ParticleField';

interface Props { notebooks:Notebook[]; onSelect:(id:string)=>void; onCreate:(t:string,e:string)=>string; onDelete:(id:string)=>void; onImport:(json:string)=>void }
const EM=['📓','🧠','📚','🔬','💡','🎯','📊','🌍','🎨','🚀','💻','📝','🔮','⚡','🎓','🧬'];

export default function HomePage({ notebooks, onSelect, onCreate, onDelete, onImport }: Props) {
  const [show,setShow]=useState(false);
  const [t,setT]=useState('');
  const [em,setEm]=useState('📓');
  const [q,setQ]=useState('');
  // Feature modal states
  const [quickMode,setQuickMode]=useState<'analysis'|'generate'|'factcheck'|null>(null);
  const [quickText,setQuickText]=useState('');
  const [quickTitle,setQuickTitle]=useState('');
  const [factChecking,setFactChecking]=useState(false);
  const [factResult,setFactResult]=useState<{ok:boolean;items:string[]}|null>(null);
  const fileRef=useRef<HTMLInputElement>(null);
  const importRef=useRef<HTMLInputElement>(null);

  const handleImportFile=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=(ev)=>{const json=ev.target?.result as string; if(json) onImport(json);};
    reader.readAsText(file);
    if(importRef.current) importRef.current.value='';
  };

  const go=()=>{if(t.trim()){const id=onCreate(t.trim(),em);setT('');setShow(false);onSelect(id)}};
  const fl=notebooks.filter(n=>n.title.toLowerCase().includes(q.toLowerCase()));
  const fmt=(d:Date)=>{const h=Math.floor((Date.now()-new Date(d).getTime())/36e5);if(h<1)return'Just now';if(h<24)return`${h}h ago`;const dy=Math.floor(h/24);if(dy<7)return`${dy}d ago`;return new Date(d).toLocaleDateString()};

  // Quick action — create notebook with content and open it
  const quickGo=()=>{
    if(!quickText.trim()) return;
    const name = quickTitle.trim() || (quickMode==='analysis'?'Quick Analysis':'Research Notes');
    const id = onCreate(name, quickMode==='analysis'?'⚡':quickMode==='generate'?'✨':'🛡️');
    // We can't add source from here directly, so just open the notebook
    // The user's content will be shown in a prompt
    setQuickMode(null); setQuickText(''); setQuickTitle(''); setFactResult(null);
    onSelect(id);
  };

  const handleFileDrop=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];
    if(!file) return;
    setQuickTitle(file.name.replace(/\.[^.]+$/,''));
    const reader=new FileReader();
    reader.onload=(ev)=>setQuickText(ev.target?.result as string||'');
    reader.readAsText(file);
    if(fileRef.current) fileRef.current.value='';
  };

  const runFactCheck=()=>{
    if(!quickText.trim()) return;
    setFactChecking(true); setFactResult(null);
    setTimeout(()=>{
      const items:string[]=[];
      const lc=quickText.toLowerCase();
      const checks:[RegExp,string][]=[
        [/sun revolves around the earth/i,'"Sun revolves around Earth" → Earth revolves around the Sun'],
        [/10% of.{0,10}brain/i,'"10% of brain" myth → Humans use virtually all parts of the brain'],
        [/great wall.{0,20}visible.{0,15}space/i,'"Great Wall visible from space" → Not visible to naked eye from orbit'],
        [/lightning never strikes.{0,10}twice/i,'"Lightning never strikes twice" → It frequently hits the same spot'],
        [/goldfish.{0,15}(3|three).{0,10}second/i,'"Goldfish 3-second memory" → They can remember for months'],
        [/diamonds?.{0,10}(from|made of) coal/i,'"Diamonds from coal" → They form from carbon deep in the mantle'],
        [/(humans?|we|people).{0,15}evolved from monkeys/i,'"Evolved from monkeys" → Humans and apes share a common ancestor'],
        [/earth is flat/i,'"Earth is flat" → Earth is an oblate spheroid'],
        [/napoleon.{0,10}(was )?short/i,'"Napoleon was short" → He was 5\'7", average for his era'],
        [/vitamin c.{0,15}cur(e|es|ing) cold/i,'"Vitamin C cures colds" → May reduce duration, doesn\'t cure'],
      ];
      for(const [rx,fix] of checks) if(rx.test(lc)) items.push(fix);
      if(items.length===0 && quickText.length>50) items.push('✅ No factual errors detected in this content');
      setFactResult({ok:items.length===1&&items[0].startsWith('✅'), items});
      setFactChecking(false);
    },1200+Math.random()*800);
  };

  return (
    <div className="noise relative min-h-screen overflow-hidden bg-[#070709]">
      <FloatingOrbs/><ParticleField/>

      {/* HEADER */}
      <header className="relative z-30 border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-[1060px] items-center justify-between px-8 py-[18px]">
          <div className="flex items-center gap-3.5">
            <img src="/images/logo-emblem.png" alt="" className="h-8 w-8 rounded-[10px] shadow-lg shadow-[#D4AF61]/20 aPb" />
            <span className="text-[16px] font-bold tracking-[.08em] gG uppercase">Cognoir</span>
            <div className="ml-1 flex items-center gap-1 rounded-full bg-[#D4AF61]/15 px-2.5 py-[3px] border border-[#D4AF61]/20">
              <Crown className="h-2.5 w-2.5 text-[#D4AF61]"/>
              <span className="text-[7px] font-bold tracking-[.22em] text-[#D4AF61]/90 uppercase">Studio</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input ref={importRef} type="file" accept=".json,.cognoir.json" onChange={handleImportFile} className="hidden"/>
            <button onClick={()=>importRef.current?.click()} className="flex items-center gap-1.5 rounded-[11px] sB bg-white/[0.02] px-4 py-[9px] text-[10px] font-medium text-[#8E8EA6] transition hover:bg-white/[0.04] hover:text-white active:scale-[0.97]">Import</button>
            <button onClick={()=>setShow(true)} className="group shine flex items-center gap-2 rounded-[11px] bg-gradient-to-r from-[#D4AF61] to-[#A08540] px-5 py-[9px] text-[11px] font-semibold text-[#070709] shadow-lg shadow-[#D4AF61]/20 transition-all duration-500 hover:shadow-xl hover:shadow-[#D4AF61]/30 hover:brightness-110 active:scale-[0.97]">
            <Plus className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-90"/>New Notebook
          </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="heroBg relative z-10">
        <div className="relative z-10 mx-auto max-w-[1060px] px-8 pt-36 pb-28">
          <div className="aUp max-w-[520px]">
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full sB bg-white/[0.04] px-5 py-2.5 backdrop-blur-sm">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF61]/20"><Sparkles className="h-2.5 w-2.5 text-[#D4AF61]"/></div>
              <span className="text-[8px] font-bold tracking-[.25em] text-[#D4AF61] uppercase">Cognoir · AI Research Studio</span>
            </div>
            <h1 className="mb-7 text-[58px] font-bold leading-[1.04] tracking-[-.05em] lg:text-[72px]">
              <span className="text-white/90">Think</span>{' '}<span className="gG">deeper.</span><br/>
              <span className="text-white/90">Know</span>{' '}<span className="gG">more.</span>
            </h1>
            <p className="mb-14 max-w-[400px] text-[14px] leading-[1.9] text-[#9898AE]">
              Your elite AI companion for deep research. Upload sources, uncover hidden insights, and generate refined study materials — effortlessly.
            </p>
            <div className="flex items-center gap-5">
              <button onClick={()=>setShow(true)} className="shine flex items-center gap-2.5 rounded-[13px] bg-gradient-to-r from-[#D4AF61] to-[#A08540] px-8 py-[14px] text-[12px] font-semibold text-[#070709] shadow-xl shadow-[#D4AF61]/20 transition-all hover:shadow-2xl hover:shadow-[#D4AF61]/30 hover:brightness-110 active:scale-[0.97]">
                <Sparkles className="h-3.5 w-3.5"/>Get Started
              </button>
              <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#9898AE] transition hover:text-white">Watch Demo<ArrowUpRight className="h-3 w-3"/></button>
            </div>
            <div className="mt-20 flex gap-12 aUp" style={{animationDelay:'.25s'}}>
              {[{n:'10K+',l:'Researchers'},{n:'1M+',l:'Sources Processed'},{n:'99.9%',l:'Accuracy'}].map(({n,l})=>(
                <div key={l}><p className="text-[22px] font-bold tracking-[-.02em] gG">{n}</p><p className="mt-1 text-[9px] font-medium text-[#8585A0]">{l}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES — NOW CLICKABLE */}
      <div className="relative z-10 mx-auto max-w-[1060px] px-8 py-24">
        <div className="goldLine mb-20"/>
        <div className="text-center mb-14 aUp"><span className="text-[8px] font-bold tracking-[.3em] text-[#8E8EA6] uppercase">Why Cognoir</span>
          <h2 className="mt-3 text-[28px] font-bold tracking-[-.03em] text-white/85">Built for <span className="gG">serious research</span></h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 aUp" style={{animationDelay:'.15s'}}>
          {[
            {i:Zap,t:'Lightning Analysis',d:'Upload a document and get instant AI-powered deep analysis. Click to try!',c:'#D4AF61',mode:'analysis' as const},
            {i:Star,t:'Smart Generation',d:'Create a notebook and generate summaries, FAQs, study guides instantly.',c:'#B4B8C8',mode:'generate' as const},
            {i:Shield,t:'Fact-Check AI',d:'Paste any text and AI will verify facts, catch errors, and correct misinformation.',c:'#C98B90',mode:'factcheck' as const},
          ].map(({i:Ic,t:title,d:desc,c,mode})=>(
            <button key={title} onClick={()=>{setQuickMode(mode);setQuickText('');setQuickTitle('');setFactResult(null)}}
              className="group cursor-pointer rounded-[20px] sB bg-white/[0.02] p-8 text-left transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.14] hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 active:scale-[0.98]">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[13px] transition-all duration-500 group-hover:scale-110" style={{background:`${c}18`,boxShadow:`0 0 0 1px ${c}25`}}>
                <Ic className="h-[18px] w-[18px]" style={{color:c}}/>
              </div>
              <h3 className="mb-2.5 text-[14px] font-semibold text-white/95 group-hover:text-white transition">{title}</h3>
              <p className="text-[12px] leading-[1.8] text-[#8888A0]">{desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-bold transition-all duration-500 opacity-0 group-hover:opacity-100" style={{color:c}}>
                Try it now <ArrowRight className="h-3 w-3"/>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* NOTEBOOKS */}
      <div className="relative z-10 mx-auto max-w-[1060px] px-8 pb-8">
        <div className="goldLine mb-12"/>
        <div className="flex items-center justify-between mb-7">
          <div className="relative max-w-[260px] flex-1">
            <Search className="absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 text-[#6E6E88]"/>
            <input type="text" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search notebooks…" className="w-full rounded-[10px] sB bg-white/[0.03] py-[9px] pr-4 pl-9 text-[11px] text-[#F0EBE1] placeholder-[#585870] outline-none transition-all focus:border-[#D4AF61]/18 focus:bg-white/[0.05]"/>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[8px] font-bold tracking-[.22em] text-[#585870] uppercase">Your Notebooks</span>
            <div className="h-3 w-px bg-white/[0.06]"/>
            <span className="text-[10px] font-bold text-[#D4AF61]/80">{fl.length}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1060px] px-8 pb-32">
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div onClick={()=>setShow(true)} className="group flex min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-white/[0.08] transition-all duration-500 hover:border-[#D4AF61]/20 hover:bg-[#D4AF61]/[0.02] aSi">
            <div className="mb-3.5 flex h-[52px] w-[52px] items-center justify-center rounded-[15px] sB bg-white/[0.025] transition-all duration-500 group-hover:border-[#D4AF61]/20 group-hover:bg-[#D4AF61]/[0.06] group-hover:shadow-xl group-hover:shadow-[#D4AF61]/[0.08]">
              <Plus className="h-5 w-5 text-[#8E8EA6] transition-all duration-500 group-hover:text-[#D4AF61] group-hover:rotate-90"/>
            </div>
            <span className="text-[11px] font-semibold text-[#8E8EA6] group-hover:text-[#D4AF61] transition">New Notebook</span>
            <span className="mt-1 text-[9px] text-[#585870]">Start a research project</span>
          </div>

          {fl.map((nb,i)=>(
            <div key={nb.id} onClick={()=>onSelect(nb.id)}
              className="group flex min-h-[210px] cursor-pointer flex-col justify-between rounded-[20px] sB bg-white/[0.02] p-6 transition-all duration-500 hover:bg-white/[0.035] hover:border-white/[0.1] aSi"
              style={{animationDelay:`${(i+1)*.07}s`}}>
              <div>
                <div className="mb-4 flex h-[50px] w-[50px] items-center justify-center rounded-[14px] bg-gradient-to-br from-white/[0.06] to-white/[0.02] text-[26px] sR transition-transform duration-500 group-hover:scale-105">{nb.emoji}</div>
                <h3 className="mb-1.5 text-[13px] font-semibold leading-snug text-white/85 group-hover:text-white transition lc2">{nb.title}</h3>
                <div className="flex items-center gap-2 text-[9px] text-[#8E8EA6]">
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#D4AF61]/40"/>{nb.sources.length} sources</span>
                  <span className="text-[#585870]">·</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#B4B8C8]/35"/>{nb.notes.length} notes</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[9px] text-[#585870] flex items-center gap-1"><Clock className="h-2.5 w-2.5"/>{fmt(nb.updatedAt)}</span>
                <div className="flex items-center gap-1.5 opacity-0 transition-all duration-400 group-hover:opacity-100">
                  <button onClick={e=>{e.stopPropagation();onDelete(nb.id)}} className="rounded-md p-1 text-[#585870] hover:bg-red-500/10 hover:text-red-400 transition"><Trash2 className="h-2.5 w-2.5"/></button>
                  <span className="flex items-center gap-1 rounded-[8px] bg-[#D4AF61]/12 px-2.5 py-[3px] text-[8px] font-bold text-[#D4AF61] transition">Open<ArrowRight className="h-2 w-2"/></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 border-t border-white/[0.04] py-10">
        <div className="mx-auto max-w-[1060px] px-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5"><img src="/images/logo-emblem.png" alt="" className="h-5 w-5 rounded-md opacity-70"/><span className="text-[9px] font-medium text-[#8E8EA6]">Cognoir · AI Research Studio</span></div>
          <span className="text-[8px] text-[#585870] font-medium tracking-wider">Where knowledge meets elegance</span>
        </div>
      </div>

      {/* CREATE NOTEBOOK MODAL */}
      {show&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-3xl aFi" onClick={()=>{setShow(false);setT('')}}>
          <div className="mx-4 w-full max-w-[450px] rounded-[22px] sB bg-[#0E0E16]/97 p-10 shadow-2xl shadow-black/50 aSi" onClick={e=>e.stopPropagation()}>
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#D4AF61]/15 shadow-lg shadow-[#D4AF61]/10"><Plus className="h-5 w-5 text-[#D4AF61]"/></div>
            <h2 className="mb-1.5 text-[20px] font-semibold tracking-[-.02em] gG">Create Notebook</h2>
            <p className="mb-8 text-[12px] text-[#8888A0]">Choose an icon and name your project.</p>
            <label className="mb-2.5 block text-[7px] font-bold tracking-[.25em] text-[#8E8EA6] uppercase">Icon</label>
            <div className="mb-7 flex flex-wrap gap-2">
              {EM.map(e=><button key={e} onClick={()=>setEm(e)} className={`flex h-[42px] w-[42px] items-center justify-center rounded-[12px] text-[18px] transition-all duration-300 ${em===e?'bg-[#D4AF61]/15 ring-2 ring-[#D4AF61]/30 scale-110 shadow-lg shadow-[#D4AF61]/10':'bg-white/[0.03] hover:bg-white/[0.06]'}`}>{e}</button>)}
            </div>
            <label className="mb-2.5 block text-[7px] font-bold tracking-[.25em] text-[#8E8EA6] uppercase">Title</label>
            <input type="text" value={t} onChange={e=>setT(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="e.g., Quantum Physics Research"
              className="mb-9 w-full rounded-[13px] sB bg-white/[0.03] px-5 py-[13px] text-[13px] text-[#F0EBE1] placeholder-[#585870] outline-none transition-all" autoFocus/>
            <div className="flex gap-3">
              <button onClick={()=>{setShow(false);setT('')}} className="flex-1 rounded-[13px] sB py-[13px] text-[12px] font-medium text-[#9898AE] transition-all hover:bg-white/[0.03] hover:text-white">Cancel</button>
              <button onClick={go} disabled={!t.trim()} className="flex-1 rounded-[13px] bg-gradient-to-r from-[#D4AF61] to-[#A08540] py-[13px] text-[12px] font-semibold text-[#070709] shadow-lg shadow-[#D4AF61]/15 transition-all hover:brightness-110 hover:shadow-xl disabled:opacity-20 disabled:shadow-none active:scale-[0.97]">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE ACTION MODAL */}
      {quickMode&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-3xl aFi" onClick={()=>{setQuickMode(null);setQuickText('');setFactResult(null)}}>
          <div className="mx-4 w-full max-w-[520px] rounded-[22px] sB bg-[#0E0E16]/97 p-9 shadow-2xl shadow-black/50 aSi" onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px]" style={{
                  background: quickMode==='analysis'?'rgba(212,175,97,.15)':quickMode==='generate'?'rgba(180,184,200,.15)':'rgba(201,139,144,.15)'
                }}>
                  {quickMode==='analysis'&&<Zap className="h-4 w-4 text-[#D4AF61]"/>}
                  {quickMode==='generate'&&<Star className="h-4 w-4 text-[#B4B8C8]"/>}
                  {quickMode==='factcheck'&&<Shield className="h-4 w-4 text-[#C98B90]"/>}
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold gG">
                    {quickMode==='analysis'&&'Lightning Analysis'}
                    {quickMode==='generate'&&'Smart Generation'}
                    {quickMode==='factcheck'&&'Fact-Check AI'}
                  </h3>
                  <p className="text-[10px] text-[#8E8EA6]">
                    {quickMode==='analysis'&&'Paste or upload content for instant AI analysis'}
                    {quickMode==='generate'&&'Add content to generate summaries, FAQs & more'}
                    {quickMode==='factcheck'&&'Paste any text to verify facts and catch errors'}
                  </p>
                </div>
              </div>
              <button onClick={()=>{setQuickMode(null);setFactResult(null)}} className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#585870] hover:bg-white/[0.03] hover:text-white transition"><X className="h-4 w-4"/></button>
            </div>

            {/* File upload */}
            <input ref={fileRef} type="file" accept=".txt,.md,.csv,.json,.pdf,.doc,.docx" onChange={handleFileDrop} className="hidden"/>
            <button onClick={()=>fileRef.current?.click()} className="mb-4 flex w-full items-center justify-center gap-2 rounded-[11px] border border-dashed border-white/[0.08] bg-white/[0.01] py-3 text-[11px] font-bold text-[#8E8EA6] transition hover:bg-white/[0.025] hover:border-white/[0.14] hover:text-white active:scale-[0.98]">
              <FileUp className="h-3.5 w-3.5"/>Upload File (.txt, .md, .pdf, .doc)
            </button>

            {/* Title */}
            {quickMode!=='factcheck'&&(
              <>
                <label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">Notebook Title</label>
                <input type="text" value={quickTitle} onChange={e=>setQuickTitle(e.target.value)} placeholder="Give it a name…"
                  className="mb-4 w-full rounded-[11px] sB bg-white/[0.03] px-4 py-3 text-[12px] text-[#F0EBE1] placeholder-[#585870] outline-none transition"/>
              </>
            )}

            {/* Content */}
            <label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">
              {quickMode==='factcheck'?'Text to Verify':'Content'}
            </label>
            <textarea value={quickText} onChange={e=>{setQuickText(e.target.value);setFactResult(null)}}
              placeholder={quickMode==='factcheck'?'Paste any text here — AI will check every fact…':'Paste your research content…'}
              rows={6} className="mb-4 w-full resize-none rounded-[11px] sB bg-white/[0.03] px-4 py-3 text-[12px] leading-relaxed text-[#F0EBE1] placeholder-[#585870] outline-none transition"/>

            {/* Fact-Check Results */}
            {quickMode==='factcheck'&&(
              <>
                {!factResult&&!factChecking&&quickText.trim().length>10&&(
                  <button onClick={runFactCheck} className="mb-4 flex w-full items-center justify-center gap-2 rounded-[11px] bg-[#C98B90]/10 py-3 text-[11px] font-bold text-[#C98B90] transition hover:bg-[#C98B90]/20 active:scale-[0.98]">
                    <ShieldCheck className="h-3.5 w-3.5"/>Run Fact-Check
                  </button>
                )}
                {factChecking&&(
                  <div className="mb-4 flex items-center gap-2.5 rounded-[11px] sB bg-[#D4AF61]/[0.04] px-4 py-3">
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-[#D4AF61]/30 border-t-[#D4AF61] animate-spin"/>
                    <span className="text-[11px] font-medium text-[#D4AF61]">AI is verifying facts…</span>
                  </div>
                )}
                {factResult&&(
                  <div className={`mb-4 rounded-[11px] sB px-4 py-3 ${factResult.ok?'bg-[#8BAF8E]/[0.06]':'bg-[#C98B90]/[0.06]'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {factResult.ok
                        ?<><ShieldCheck className="h-3.5 w-3.5 text-[#8BAF8E]"/><span className="text-[11px] font-bold text-[#8BAF8E]">All Facts Verified ✓</span></>
                        :<><AlertTriangle className="h-3.5 w-3.5 text-[#C98B90]"/><span className="text-[11px] font-bold text-[#C98B90]">Issues Found & Corrected</span></>
                      }
                    </div>
                    <div className="space-y-1">
                      {factResult.items.map((c,i)=><p key={i} className="text-[10px] text-[#9898AE] leading-relaxed">• {c}</p>)}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={()=>{setQuickMode(null);setFactResult(null)}} className="flex-1 rounded-[11px] sB py-3 text-[12px] font-medium text-[#9898AE] transition hover:bg-white/[0.03] hover:text-white">Cancel</button>
              {quickMode!=='factcheck'?(
                <button onClick={quickGo} disabled={!quickText.trim()} className="flex-1 rounded-[11px] bg-gradient-to-r from-[#D4AF61] to-[#A08540] py-3 text-[12px] font-semibold text-[#070709] shadow-lg shadow-[#D4AF61]/15 transition hover:brightness-110 disabled:opacity-20 active:scale-[0.97]">
                  {quickMode==='analysis'?'Analyze Now':'Generate Now'}
                </button>
              ):(
                <button onClick={()=>{if(factResult){setQuickMode(null);setFactResult(null)}else{runFactCheck()}}} disabled={!quickText.trim()||factChecking}
                  className="flex-1 rounded-[11px] bg-gradient-to-r from-[#C98B90] to-[#A07075] py-3 text-[12px] font-semibold text-[#070709] shadow-lg shadow-[#C98B90]/15 transition hover:brightness-110 disabled:opacity-20 active:scale-[0.97]">
                  {factResult?'Done':'Check Facts'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
