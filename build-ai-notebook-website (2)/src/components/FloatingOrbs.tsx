export default function FloatingOrbs() {
  return <div className="pointer-events-none fixed inset-0 overflow-hidden">
    <div className="absolute aMp aGl" style={{top:'-12%',right:'-10%',width:600,height:600,background:'radial-gradient(circle,rgba(212,175,97,.12) 0%,transparent 55%)',filter:'blur(80px)'}}/>
    <div className="absolute aMp aGl" style={{bottom:'-18%',left:'-12%',width:550,height:550,background:'radial-gradient(circle,rgba(180,184,200,.08) 0%,transparent 55%)',filter:'blur(70px)',animationDelay:'3s'}}/>
    <div className="absolute aGl" style={{top:'35%',left:'55%',width:280,height:280,background:'radial-gradient(circle,rgba(201,139,144,.06) 0%,transparent 55%)',filter:'blur(60px)',animationDelay:'6s'}}/>
  </div>;
}
