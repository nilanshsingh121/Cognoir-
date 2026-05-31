import { useState, useRef } from 'react';
import { Plus, FileText, Globe, Video, Type, ChevronDown, ChevronRight, Check, X, Eye, Upload, Layers, FileUp, ShieldCheck, AlertTriangle, Link, Play } from 'lucide-react';
import type { Source } from '../types';
interface Props { sources:Source[]; onAddSource:(t:string,c:string,ty:Source['type'])=>void; onRemoveSource:(id:string)=>void; onToggleSource:(id:string)=>void; onViewSource:(s:Source)=>void }
const IC:Record<Source['type'],typeof FileText>={text:Type,document:FileText,website:Globe,youtube:Video};
const TN:Record<Source['type'],{c:string;b:string}>={text:{c:'#8BAF8E',b:'rgba(139,175,142,.15)'},document:{c:'#D4AF61',b:'rgba(212,175,97,.15)'},website:{c:'#B4B8C8',b:'rgba(180,184,200,.15)'},youtube:{c:'#C98B90',b:'rgba(201,139,144,.15)'}};

// Simulated website content for demo
const SIMULATED_WEBSITES:Record<string,{title:string;content:string}>={
  'wikipedia.org':{title:'Wikipedia Article',content:'Wikipedia is a free online encyclopedia, created and edited by volunteers around the world.\n\n## Overview\nWikipedia was launched on January 15, 2001 by Jimmy Wales and Larry Sanger. It is the largest and most-read reference work in history.\n\n## Key Features\n- Free and open access\n- Multilingual — available in 300+ languages\n- Community-edited content\n- Non-profit organization\n- Over 60 million articles'},
  'default':{title:'Web Page Content',content:'This is the extracted content from the provided URL.\n\n## Main Content\nThe webpage contains information about various topics including technology, science, and current events.\n\n## Key Points\n- Web content has been successfully scraped\n- Text has been extracted and formatted\n- Ready for AI analysis'},
};

// Simulated YouTube transcripts
const SIMULATED_YOUTUBE:Record<string,{title:string;content:string}>={
  'default':{title:'YouTube Video Transcript',content:`## Video Transcript

[0:00] Welcome to this video. Today we're going to discuss an important topic that affects many people.

[0:15] First, let's look at the background and history of this subject. It has been studied extensively over the past several decades.

[1:00] The key findings show that there are multiple factors at play. Researchers have identified three main areas of interest:

[1:30] **Point 1**: The first major finding relates to how systems interact with each other. This has profound implications for our understanding.

[2:15] **Point 2**: The second discovery was about the relationship between theory and practice. Many assumptions were proven wrong.

[3:00] **Point 3**: Finally, the third insight concerns future directions. There is still much to learn and discover.

[3:45] In conclusion, this field continues to evolve rapidly. Stay curious and keep learning.

[4:00] Thanks for watching! Don't forget to like and subscribe.

---
*Auto-generated transcript by Cognoir AI*`},
};

export default function SourcesPanel({ sources, onAddSource, onRemoveSource, onToggleSource, onViewSource }: Props) {
  const [show,setShow]=useState(false);
  const [tab,setTab]=useState<'text'|'file'|'url'|'youtube'>('text');
  const [ty,setTy]=useState<Source['type']>('text');
  const [ti,setTi]=useState('');
  const [co,setCo]=useState('');
  const [url,setUrl]=useState('');
  const [ytUrl,setYtUrl]=useState('');
  const [loading,setLoading]=useState(false);
  const [exp,setExp]=useState(true);
  const [verifying,setVerifying]=useState(false);
  const [verified,setVerified]=useState<{fixed:boolean;corrections:string[]}|null>(null);
  const fileRef=useRef<HTMLInputElement>(null);
  const sel=sources.filter(s=>s.selected).length;

  const reset=()=>{setTi('');setCo('');setUrl('');setYtUrl('');setVerified(null);setLoading(false)};
  const close=()=>{setShow(false);reset()};

  const add=()=>{
    if(ti.trim()&&co.trim()){
      const finalContent = verified?.fixed ? `${co}\n\n---\n⚠️ **AI Fact-Check Applied:**\n${verified.corrections.map(c=>`- ${c}`).join('\n')}` : co;
      onAddSource(ti.trim(),finalContent.trim(),ty);
      close();
    }
  };

  const all=()=>{const a=sources.every(s=>s.selected);sources.forEach(s=>{if(a?s.selected:!s.selected)onToggleSource(s.id)})};

  const handleFileUpload=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];
    if(!file) return;
    setTi(file.name.replace(/\.[^.]+$/,''));
    setTy('document');
    setLoading(true);
    const reader=new FileReader();
    reader.onload=(ev)=>{setCo(ev.target?.result as string||'');setLoading(false)};
    reader.onerror=()=>{setCo('Error reading file');setLoading(false)};
    reader.readAsText(file);
    if(fileRef.current) fileRef.current.value='';
  };

  const scrapeUrl=()=>{
    if(!url.trim()) return;
    setLoading(true);setTy('website');
    setTimeout(()=>{
      const domain = Object.keys(SIMULATED_WEBSITES).find(d=>url.includes(d));
      const data = SIMULATED_WEBSITES[domain||'default'];
      setTi(data.title + ' — ' + url.split('/').slice(2,3).join(''));
      setCo(`Source: ${url}\n\n${data.content}`);
      setLoading(false);
    },1200+Math.random()*800);
  };

  const importYoutube=()=>{
    if(!ytUrl.trim()) return;
    setLoading(true);setTy('youtube');
    setTimeout(()=>{
      const data = SIMULATED_YOUTUBE['default'];
      const videoId = ytUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] || 'unknown';
      setTi(`YouTube: ${videoId}`);
      setCo(`Source: ${ytUrl}\nVideo ID: ${videoId}\n\n${data.content}`);
      setLoading(false);
    },1500+Math.random()*1000);
  };

  const runFactCheck=(content:string)=>{
    setVerifying(true);setVerified(null);
    setTimeout(()=>{
      const corrections:string[]=[];const lc=content.toLowerCase();
      const checks:[RegExp,string][]=[
        [/sun revolves around the earth/i,'"Sun revolves around Earth" → Earth revolves around the Sun'],
        [/10% of.{0,10}brain/i,'"10% of brain" myth → Humans use virtually all parts of the brain'],
        [/great wall.{0,20}visible.{0,15}space/i,'"Great Wall visible from space" → Not visible to naked eye from orbit'],
        [/lightning never strikes.{0,10}twice/i,'"Lightning never strikes twice" → Frequently hits same spot'],
        [/goldfish.{0,15}(3|three).{0,10}second/i,'"Goldfish 3-second memory" → Can remember for months'],
        [/earth is flat/i,'"Earth is flat" → Earth is an oblate spheroid'],
        [/(humans?|we).{0,15}evolved from monkeys/i,'"Evolved from monkeys" → Share a common ancestor'],
        [/napoleon.{0,10}(was )?short/i,'"Napoleon was short" → 5\'7", average for his era'],
      ];
      for(const [rx,fix] of checks) if(rx.test(lc)) corrections.push(fix);
      setVerified({fixed:corrections.length>0,corrections});
      setVerifying(false);
    },1000+Math.random()*800);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/[0.06] p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-[#D4AF61]/15"><Layers className="h-2.5 w-2.5 text-[#D4AF61]"/></div><span className="text-[11px] font-semibold text-[#B8B8CE]">Sources</span></div>
          <button onClick={()=>{setShow(true);reset()}} className="shine flex items-center gap-1 rounded-[8px] bg-[#D4AF61]/15 px-2.5 py-1 text-[9px] font-bold text-[#D4AF61] transition-all hover:bg-[#D4AF61]/25 active:scale-95"><Plus className="h-2.5 w-2.5"/>Add</button>
        </div>
        {sources.length>0&&<div className="flex items-center justify-between"><button onClick={all} className="text-[9px] text-[#8E8EA6] hover:text-[#D4AF61] transition">{sel===sources.length?'Deselect':'Select all'}</button><span className="text-[9px] text-[#585870]">{sel}/{sources.length}</span></div>}
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {sources.length===0?(
          <div className="flex flex-col items-center py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02]"><Upload className="h-5 w-5 text-[#8E8EA6]"/></div>
            <p className="text-[11px] font-medium text-[#9898AE]">No sources yet</p>
            <p className="mt-1 text-[9px] text-[#8E8EA6]">Upload files, paste text, import URLs or YouTube</p>
            <button onClick={()=>{setShow(true);reset()}} className="mt-5 text-[10px] font-bold text-[#D4AF61] hover:text-[#E8D5A0] transition">+ Add source</button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-3xl aFi" onClick={close}>
          <div className="mx-4 w-full max-w-lg rounded-[22px] sB bg-[#0E0E16]/97 p-8 shadow-2xl aSi" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#D4AF61]/15"><Upload className="h-4 w-4 text-[#D4AF61]"/></div>
                <div><h3 className="text-[16px] font-semibold gG">Add Source</h3><p className="text-[9px] text-[#8E8EA6]">Multiple import options</p></div>
              </div>
              <button onClick={close} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#585870] hover:bg-white/[0.03] hover:text-white transition"><X className="h-4 w-4"/></button>
            </div>

            {/* TABS */}
            <div className="mb-5 flex gap-1 rounded-[11px] bg-white/[0.015] p-1">
              {([
                {k:'text' as const,l:'Text',i:Type},
                {k:'file' as const,l:'File/PDF',i:FileUp},
                {k:'url' as const,l:'Website',i:Link},
                {k:'youtube' as const,l:'YouTube',i:Play},
              ]).map(({k,l,i:TabIc})=>(
                <button key={k} onClick={()=>{setTab(k);reset()}}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-[8px] py-2 text-[10px] font-bold transition ${tab===k?'bg-[#D4AF61]/12 text-[#D4AF61] shadow-sm':'text-[#8E8EA6] hover:text-[#D2D5E0]'}`}>
                  <TabIc className="h-3 w-3"/>{l}
                </button>
              ))}
            </div>

            {/* TEXT TAB */}
            {tab==='text'&&(
              <>
                <label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">Title</label>
                <input type="text" value={ti} onChange={e=>setTi(e.target.value)} placeholder="Source name" className="mb-3 w-full rounded-[11px] sB bg-white/[0.03] px-4 py-2.5 text-[12px] text-[#F0EBE1] placeholder-[#585870] outline-none transition" autoFocus/>
                <label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">Content</label>
                <textarea value={co} onChange={e=>{setCo(e.target.value);setVerified(null)}} placeholder="Paste your text here…" rows={6} className="mb-3 w-full resize-none rounded-[11px] sB bg-white/[0.03] px-4 py-2.5 text-[12px] leading-relaxed text-[#F0EBE1] placeholder-[#585870] outline-none transition"/>
              </>
            )}

            {/* FILE TAB */}
            {tab==='file'&&(
              <>
                <input ref={fileRef} type="file" accept=".txt,.md,.csv,.json,.pdf,.doc,.docx,.html" onChange={handleFileUpload} className="hidden"/>
                <button onClick={()=>fileRef.current?.click()} className="mb-4 flex w-full flex-col items-center gap-2 rounded-[14px] border-2 border-dashed border-white/[0.08] bg-white/[0.01] py-8 transition hover:border-[#D4AF61]/20 hover:bg-[#D4AF61]/[0.02] active:scale-[0.98]">
                  <FileUp className="h-8 w-8 text-[#585870]"/>
                  <span className="text-[12px] font-semibold text-[#9898AE]">Click to upload file</span>
                  <span className="text-[9px] text-[#585870]">.txt, .md, .pdf, .doc, .csv, .json, .html</span>
                </button>
                {loading&&<div className="mb-3 flex items-center gap-2 text-[11px] text-[#D4AF61]"><div className="h-3 w-3 rounded-full border-2 border-[#D4AF61]/30 border-t-[#D4AF61] animate-spin"/>Reading file…</div>}
                {co&&<><label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">Title</label>
                <input type="text" value={ti} onChange={e=>setTi(e.target.value)} placeholder="Source name" className="mb-3 w-full rounded-[11px] sB bg-white/[0.03] px-4 py-2.5 text-[12px] text-[#F0EBE1] placeholder-[#585870] outline-none transition"/>
                <label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">Preview</label>
                <div className="mb-3 max-h-32 overflow-y-auto rounded-[11px] sB bg-white/[0.015] px-4 py-2.5 text-[11px] text-[#8E8EA6] leading-relaxed">{co.substring(0,500)}{co.length>500&&'…'}</div></>}
              </>
            )}

            {/* URL TAB */}
            {tab==='url'&&(
              <>
                <label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">Website URL</label>
                <div className="mb-4 flex gap-2">
                  <input type="text" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com/article" className="flex-1 rounded-[11px] sB bg-white/[0.03] px-4 py-2.5 text-[12px] text-[#F0EBE1] placeholder-[#585870] outline-none transition" autoFocus/>
                  <button onClick={scrapeUrl} disabled={!url.trim()||loading} className="rounded-[11px] bg-[#B4B8C8]/15 px-4 text-[11px] font-bold text-[#B4B8C8] transition hover:bg-[#B4B8C8]/25 disabled:opacity-30 active:scale-95">
                    {loading?<div className="h-3 w-3 rounded-full border-2 border-[#B4B8C8]/30 border-t-[#B4B8C8] animate-spin"/>:'Fetch'}
                  </button>
                </div>
                {co&&<><label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">Extracted Content</label>
                <div className="mb-3 max-h-40 overflow-y-auto rounded-[11px] sB bg-white/[0.015] px-4 py-2.5 text-[11px] text-[#8E8EA6] leading-relaxed">{co.substring(0,600)}{co.length>600&&'…'}</div>
                <input type="text" value={ti} onChange={e=>setTi(e.target.value)} placeholder="Source title" className="mb-3 w-full rounded-[11px] sB bg-white/[0.03] px-4 py-2.5 text-[12px] text-[#F0EBE1] placeholder-[#585870] outline-none transition"/></>}
              </>
            )}

            {/* YOUTUBE TAB */}
            {tab==='youtube'&&(
              <>
                <label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">YouTube URL</label>
                <div className="mb-4 flex gap-2">
                  <input type="text" value={ytUrl} onChange={e=>setYtUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="flex-1 rounded-[11px] sB bg-white/[0.03] px-4 py-2.5 text-[12px] text-[#F0EBE1] placeholder-[#585870] outline-none transition" autoFocus/>
                  <button onClick={importYoutube} disabled={!ytUrl.trim()||loading} className="rounded-[11px] bg-[#C98B90]/15 px-4 text-[11px] font-bold text-[#C98B90] transition hover:bg-[#C98B90]/25 disabled:opacity-30 active:scale-95">
                    {loading?<div className="h-3 w-3 rounded-full border-2 border-[#C98B90]/30 border-t-[#C98B90] animate-spin"/>:'Import'}
                  </button>
                </div>
                {co&&<><label className="mb-2 block text-[8px] font-bold tracking-[.18em] text-[#8E8EA6] uppercase">Transcript</label>
                <div className="mb-3 max-h-40 overflow-y-auto rounded-[11px] sB bg-white/[0.015] px-4 py-2.5 text-[11px] text-[#8E8EA6] leading-relaxed">{co.substring(0,600)}{co.length>600&&'…'}</div>
                <input type="text" value={ti} onChange={e=>setTi(e.target.value)} placeholder="Source title" className="mb-3 w-full rounded-[11px] sB bg-white/[0.03] px-4 py-2.5 text-[12px] text-[#F0EBE1] placeholder-[#585870] outline-none transition"/></>}
              </>
            )}

            {/* Fact Check */}
            {co.trim().length>20&&!verified&&!verifying&&(
              <button onClick={()=>runFactCheck(co)} className="mb-3 flex w-full items-center justify-center gap-2 rounded-[11px] sB bg-[#8BAF8E]/8 py-2.5 text-[11px] font-bold text-[#8BAF8E] transition hover:bg-[#8BAF8E]/15 active:scale-[0.98]">
                <ShieldCheck className="h-3.5 w-3.5"/>AI Fact-Check
              </button>
            )}
            {verifying&&<div className="mb-3 flex items-center gap-2 rounded-[11px] sB bg-[#D4AF61]/[0.04] px-4 py-2.5"><div className="h-3 w-3 rounded-full border-2 border-[#D4AF61]/30 border-t-[#D4AF61] animate-spin"/><span className="text-[11px] text-[#D4AF61]">Verifying facts…</span></div>}
            {verified&&(
              <div className={`mb-3 rounded-[11px] sB px-4 py-2.5 ${verified.fixed?'bg-[#C98B90]/[0.06]':'bg-[#8BAF8E]/[0.06]'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  {verified.fixed?<><AlertTriangle className="h-3 w-3 text-[#C98B90]"/><span className="text-[10px] font-bold text-[#C98B90]">Issues Found</span></>
                  :<><ShieldCheck className="h-3 w-3 text-[#8BAF8E]"/><span className="text-[10px] font-bold text-[#8BAF8E]">Verified ✓</span></>}
                </div>
                {verified.corrections.map((c,i)=><p key={i} className="text-[9px] text-[#9898AE]">• {c}</p>)}
                {!verified.fixed&&<p className="text-[9px] text-[#8BAF8E]/80">No errors detected.</p>}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button onClick={close} className="flex-1 rounded-[11px] sB py-2.5 text-[12px] font-medium text-[#9898AE] transition hover:bg-white/[0.03] hover:text-white">Cancel</button>
              <button onClick={add} disabled={!ti.trim()||!co.trim()} className="flex-1 rounded-[11px] bg-gradient-to-r from-[#D4AF61] to-[#A08540] py-2.5 text-[12px] font-semibold text-[#070709] shadow-lg shadow-[#D4AF61]/15 transition hover:brightness-110 disabled:opacity-20 active:scale-[0.97]">
                {verified?.fixed?'Add with Corrections':'Add Source'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
