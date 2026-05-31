import { useMemo } from 'react';
export default function ParticleField() {
  const d=useMemo(()=>Array.from({length:20}).map((_,i)=>({i,x:Math.random()*100,y:Math.random()*100,s:.7+Math.random()*1.2,o:.08+Math.random()*.14})),[]);
  return <div className="pointer-events-none fixed inset-0 overflow-hidden">{d.map(p=><div key={p.i} className="absolute rounded-full bg-[#D4AF61]" style={{left:`${p.x}%`,top:`${p.y}%`,width:p.s,height:p.s,opacity:p.o,animation:`fl ${10+Math.random()*8}s ease-in-out ${Math.random()*12}s infinite`}}/>)}</div>;
}
