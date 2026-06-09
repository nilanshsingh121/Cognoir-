import { FileText, Globe, Video, Type, X, BookOpen, Calendar, Hash } from 'lucide-react';
import type { Source } from '../types';
const IC:Record<Source['type'],typeof FileText>={text:Type,document:FileText,website:Globe,youtube:Video};
const TN:Record<Source['type'],string>={text:'#8BAF8E',document:'#D4AF61',website:'#B4B8C8',youtube:'#C98B90'};

export default function SourceViewer({source,onClose}:{source:Source;onClose:()=>void}){
  const I=IC[source.type],c=TN[source.type],wc=source.content.split(/\s+/).length;
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-3xl aFi" onClick={onClose}>
      <div className="mx-4 flex max-h-[85vh] w-full max-w-3xl flex-col rounded-[22px] sB bg-[#0E0E16]/97 shadow-2xl aSi" onClick={e=>e.stopPropagation()}>
        <div className="border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{background:`${c}18`}}><I className="h-3.5 w-3.5" style={{color:c}}/></div>
            <div><h3 className="text-[13px] font-semibold">{source.title}</h3><div className="mt-0.5 flex items-center gap-2.5 text-[9px] text-[#8888A0]"><span className="flex items-center gap-1 capitalize"><BookOpen className="h-2.5 w-2.5"/>{source.type}</span><span className="flex items-center gap-1"><Hash className="h-2.5 w-2.5"/>{wc} words</span><span className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5"/>{new Date(source.createdAt).toLocaleDateString()}</span></div></div></div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8888A0] hover:bg-white/[0.04] hover:text-white transition"><X className="h-3.5 w-3.5"/></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5"><div className="text-[13px] leading-[1.9] text-[#D2D5E0]">
          {source.content.split('\n').map((l,i)=>{
            if(l.startsWith('# ')) return <h1 key={i} className="mb-2.5 text-[16px] font-semibold gG">{l.substring(2)}</h1>;
            if(l.startsWith('## ')) return <h2 key={i} className="mt-4 mb-1.5 text-[14px] font-semibold text-white/90">{l.substring(3)}</h2>;
            if(l.startsWith('### ')) return <h3 key={i} className="mt-3 mb-1 text-[13px] font-medium text-[#D2D5E0]">{l.substring(4)}</h3>;
            if(l.startsWith('---')) return <hr key={i} className="my-3 border-white/[0.06]"/>;
            if(l.startsWith('- ')||l.startsWith('• ')) return <div key={i} className="flex gap-2.5 py-[2px] ml-1"><span className="mt-[8px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4AF61]/40"/><span>{rb(l.substring(2))}</span></div>;
            if(l.startsWith('*')&&l.endsWith('*')&&!l.startsWith('**')) return <p key={i} className="text-[#8888A0] italic">{l.replace(/^\*|\*$/g,'')}</p>;
            if(!l.trim()) return <div key={i} className="h-2"/>;
            return <p key={i}>{rb(l)}</p>;
          })}
        </div></div>
      </div>
    </div>
  );
}
function rb(t:string){return t.split(/(\*\*[^*]+\*\*)/g).map((p,i)=>p.startsWith('**')&&p.endsWith('**')?<strong key={i} className="font-semibold text-[#E8D5A0]">{p.slice(2,-2)}</strong>:p)}
