import { useState, useRef, useEffect } from 'react';
import { User, Bot, ArrowUp, Globe2 } from 'lucide-react';
import type { ChatMessage, Source } from '../types';
import { generateAnswer } from '../utils/ai';
interface Props { messages:ChatMessage[]; sources:Source[]; onSendMessage:(m:Omit<ChatMessage,'id'|'timestamp'>)=>void }
const Q=[
  {t:'What is artificial intelligence?',s:'🧠',d:'General knowledge'},
  {t:'Explain quantum computing',s:'⚛️',d:'No sources needed'},
  {t:'What is machine learning?',s:'🤖',d:'Deep dive topic'},
  {t:'Tell me about blockchain',s:'🔗',d:'Broad overview'},
];
const QS=[
  {t:'Summarize the key topics',s:'✦',d:'From your sources'},
  {t:'Compare the main concepts',s:'◇',d:'Side-by-side analysis'},
  {t:'Explain the fundamentals',s:'○',d:'Core principles'},
  {t:'List practical applications',s:'▸',d:'Real-world usage'},
];

export default function ChatPanel({ messages, sources, onSendMessage }: Props) {
  const [inp,setInp]=useState('');const [typing,setTyping]=useState(false);const end=useRef<HTMLDivElement>(null);
  useEffect(()=>{end.current?.scrollIntoView({behavior:'smooth'})},[messages]);
  const send=(x?:string)=>{const v=x||inp.trim();if(!v)return;onSendMessage({role:'user',content:v});setInp('');setTyping(true);setTimeout(()=>{const{answer,citations}=generateAnswer(sources,v);onSendMessage({role:'assistant',content:answer,citations});setTyping(false)},700+Math.random()*900)};
  const key=(e:React.KeyboardEvent)=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}};
  const sc=sources.filter(s=>s.selected).length;
  const suggestions = sc > 0 ? QS : Q;
  return (
    <div className="flex h-full flex-col bg-[#070709]">
      <div className="flex-1 overflow-y-auto">
        {messages.length===0?(
          <div className="flex h-full flex-col items-center justify-center px-6 py-24">
            <div className="relative mb-14">
              <img src="/images/chat-empty.png" alt="" className="h-[90px] w-[90px] rounded-full object-cover aFl" style={{filter:'brightness(0.9) contrast(1.1)'}}/>
              <div className="absolute -inset-10 rounded-full bg-[#D4AF61]/[0.05] blur-3xl aGl"/>
            </div>
            <h2 className="mb-3 text-[28px] font-bold tracking-[-.03em] gG">Ask anything</h2>
            <p className="mb-6 max-w-[400px] text-center text-[13px] leading-[1.85] text-[#8888A0]">
              {sc > 0
                ? "I'll analyze your sources and answer with inline citations."
                : "Ask me about any topic — no sources needed. Add sources for citation-backed answers."
              }
            </p>

            {/* Mode indicator */}
            <div className="mb-10 flex items-center gap-2 rounded-full sB bg-white/[0.02] px-4 py-2">
              {sc > 0 ? (
                <>
                  <span className="flex h-2 w-2 rounded-full bg-[#8BAF8E] shadow-sm shadow-[#8BAF8E]/50"/>
                  <span className="text-[10px] font-semibold text-[#8BAF8E]">Source Mode</span>
                  <span className="text-[9px] text-[#585870]">— {sc} source{sc!==1?'s':''} active</span>
                </>
              ) : (
                <>
                  <Globe2 className="h-3 w-3 text-[#B4B8C8]"/>
                  <span className="text-[10px] font-semibold text-[#B4B8C8]">General Knowledge Mode</span>
                  <span className="text-[9px] text-[#585870]">— ask anything</span>
                </>
              )}
            </div>

            <div className="w-full max-w-[560px]">
              <p className="mb-5 text-center text-[8px] font-bold tracking-[.3em] text-[#585870] uppercase">
                {sc > 0 ? 'Ask about your sources' : 'Try asking'}
              </p>
              <div className="grid grid-cols-2 gap-3.5">
                {suggestions.map(({t,s,d},i)=>(
                  <button key={t} onClick={()=>send(t)} className="group flex flex-col items-start rounded-[16px] sB bg-white/[0.02] p-5 text-left transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.12] aSi" style={{animationDelay:`${i*.08}s`}}>
                    <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-[11px] text-[15px] transition-all duration-500 group-hover:scale-110 ${
                      sc > 0
                        ? 'bg-[#D4AF61]/[0.1] text-[#D4AF61]/80 group-hover:bg-[#D4AF61]/[0.18] group-hover:text-[#D4AF61]'
                        : 'bg-[#B4B8C8]/[0.1] group-hover:bg-[#B4B8C8]/[0.18]'
                    }`}>{s}</div>
                    <span className="text-[11px] font-semibold text-[#B8B8CE] group-hover:text-white transition">{t}</span>
                    <span className="mt-1 text-[9px] leading-relaxed text-[#8E8EA6]">{d}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ):(
          <div className="mx-auto max-w-[700px] space-y-2 px-6 py-8">
            {messages.map((m,i)=>(
              <div key={m.id} className={`flex gap-4 rounded-[18px] p-5 aUp ${m.role==='user'?'ml-14':''}`} style={{animationDelay:`${i*.03}s`}}>
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] ${m.role==='user'?'bg-[#B4B8C8]/12 text-[#B4B8C8]':'bg-[#D4AF61]/12 text-[#D4AF61]'}`}>
                  {m.role==='user'?<User className="h-3.5 w-3.5"/>:<Bot className="h-3.5 w-3.5"/>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`mb-2 text-[8px] font-bold tracking-[.2em] uppercase ${m.role==='user'?'text-[#B4B8C8]/50':'text-[#D4AF61]/50'}`}>{m.role==='user'?'You':'Cognoir'}</p>
                  <div className="text-[13px] leading-[1.95] text-[#D2D5E0]">
                    {m.content.split('\n').map((l,li)=>{
                      if(l.startsWith('**')&&l.endsWith('**')) return <p key={li} className="mt-3 mb-1.5 font-semibold text-white">{l.replace(/\*\*/g,'')}</p>;
                      if(l.startsWith('> ')) return <blockquote key={li} className="my-3 gbs bg-[#D4AF61]/[0.04] py-3 pl-4 pr-3 text-[#9898AE] italic text-[12px] leading-[1.7]">{l.substring(2)}</blockquote>;
                      if(l.startsWith('- ')||l.startsWith('• ')) return <div key={li} className="flex gap-2.5 py-[3px]"><span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4AF61]/40"/><span>{rb(l.substring(2))}</span></div>;
                      if(l.match(/^\d+\.\s/)) return <div key={li} className="flex gap-3 py-[3px]"><span className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[6px] bg-[#D4AF61]/[0.1] text-[9px] font-bold text-[#D4AF61]/80 mt-[3px]">{l.match(/^\d+/)?.[0]}</span><span>{rb(l.replace(/^\d+\.\s*/,''))}</span></div>;
                      if(!l.trim()) return <div key={li} className="h-3"/>;
                      return <p key={li} className="py-[2px]">{rb(l)}</p>;
                    })}
                  </div>
                  {m.citations&&m.citations.length>0&&(
                    <div className="mt-4 flex flex-wrap gap-2">{m.citations.map((c,ci)=>(
                      <span key={ci} className="inline-flex items-center gap-1.5 gbs bg-[#D4AF61]/[0.06] px-3 py-[5px] text-[9px] text-[#D4AF61]/80 font-medium"><span className="h-1 w-1 rounded-full bg-[#D4AF61]/50"/>{c}</span>
                    ))}</div>
                  )}
                </div>
              </div>
            ))}
            {typing&&(
              <div className="flex gap-4 rounded-[18px] p-5 aFi">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#D4AF61]/12"><Bot className="h-3.5 w-3.5 text-[#D4AF61]"/></div>
                <div className="flex items-center gap-2.5 pt-3"><span className="td1 h-[6px] w-[6px] rounded-full bg-[#D4AF61]"/><span className="td2 h-[6px] w-[6px] rounded-full bg-[#D4AF61]/70"/><span className="td3 h-[6px] w-[6px] rounded-full bg-[#D4AF61]/40"/></div>
              </div>
            )}
            <div ref={end}/>
          </div>
        )}
      </div>
      <div className="border-t border-white/[0.04] bg-[#070709]/80 backdrop-blur-3xl p-6">
        <div className="mx-auto max-w-[700px]">
          <div className="shine relative rounded-[16px] sB bg-white/[0.02] transition-all duration-500 focus-within:shadow-lg focus-within:shadow-[#D4AF61]/[0.05] focus-within:border-[#D4AF61]/15">
            <textarea value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={key}
              placeholder={sc > 0 ? 'Ask about your sources…' : 'Ask anything — AI, science, tech, history…'}
              rows={1}
              className="max-h-32 min-h-[54px] w-full resize-none bg-transparent px-6 pt-4 pb-14 text-[13px] text-[#F0EBE1] placeholder-[#585870] outline-none"/>
            <div className="absolute right-4 bottom-4 flex items-center gap-3">
              {sc > 0 ? (
                <span className="flex items-center gap-1.5 rounded-[8px] bg-[#8BAF8E]/8 px-3 py-1.5 text-[9px] text-[#8BAF8E] font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8BAF8E] shadow-sm shadow-[#8BAF8E]/50"/>
                  {sc} source{sc!==1?'s':''}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-[8px] bg-[#B4B8C8]/8 px-3 py-1.5 text-[9px] text-[#B4B8C8] font-medium">
                  <Globe2 className="h-2.5 w-2.5"/>
                  General mode
                </span>
              )}
              <button onClick={()=>send()} disabled={!inp.trim()||typing}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#D4AF61] to-[#8E7440] text-[#070709] shadow-lg shadow-[#D4AF61]/15 transition-all hover:brightness-110 hover:shadow-xl disabled:opacity-15 active:scale-90">
                <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5}/>
              </button>
            </div>
          </div>
          <p className="mt-3 text-center text-[9px] text-[#585870] font-medium tracking-wider">
            {sc > 0 ? 'Responses grounded in your selected sources' : 'General knowledge mode — add sources for citation-backed answers'}
          </p>
        </div>
      </div>
    </div>
  );
}
function rb(t:string){return t.split(/(\*\*[^*]+\*\*)/g).map((p,i)=>p.startsWith('**')&&p.endsWith('**')?<strong key={i} className="font-semibold text-[#E8D5A0]">{p.slice(2,-2)}</strong>:p)}
