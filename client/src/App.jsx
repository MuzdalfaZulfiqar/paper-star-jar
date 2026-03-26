
// // src/App.jsx
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Mailbox, Lock, X, Trash2, LogOut } from "lucide-react";
// import AuthPage from "./AuthPage";
// import { useAuth } from "./AuthContext";

// const API_URL = "http://localhost:5000/api/letters";

// const isDelivered = (l) => new Date(l.deliverAt) <= new Date();

// export default function App() {
//   const { token, logout, loading } = useAuth();

//   if (loading) return (
//     <div className="min-h-screen bg-[#dfd3c3] flex items-center justify-center font-display text-2xl opacity-50">
//       Consulting Vault...
//     </div>
//   );

//   return !token ? <AuthPage /> : <RetroArchive token={token} onLogout={logout} />;
// }

// function RetroArchive({ token, onLogout }) {
//   const [letters, setLetters] = useState([]);
//   const [writeOpen, setWriteOpen] = useState(false);
//   const [readingLetter, setReadingLetter] = useState(null);

//   const refresh = async () => {
//     try {
//       const res = await fetch(API_URL, {
//         headers: { "x-auth-token": token }
//       });
//       const data = await res.json();
//       // Sort: Future dates at the very top, descending to oldest
//       const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.deliverAt) - new Date(a.deliverAt)) : [];
//       setLetters(sorted);
//     } catch (err) {
//       console.error("Archive sync failed", err);
//     }
//   };

//   useEffect(() => {
//     refresh();
//   }, [token]);

//   const handleSave = async (e) => {
//     e.preventDefault();
//     const payload = { 
//       body: e.target.body.value, 
//       deliverAt: e.target.date.value 
//     };

//     await fetch(API_URL, {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json", 
//         "x-auth-token": token 
//       },
//       body: JSON.stringify(payload)
//     });
//     setWriteOpen(false);
//     refresh();
//   };

//   const handleDelete = async (id) => {
//     await fetch(`${API_URL}/${id}`, {
//       method: "DELETE",
//       headers: { "x-auth-token": token }
//     });
//     setReadingLetter(null);
//     refresh();
//   };

//   // ARRIVAL LOGIC
//   const isNewlyArrived = (date) => {
//     const now = new Date();
//     const arrival = new Date(date);
//     const diffInHours = Math.abs(now - arrival) / 36e5;
//     return diffInHours < 24 && arrival <= now;
//   };

//   // SEPARATE DATA
//   const incoming = letters.filter(l => !isDelivered(l) || isNewlyArrived(l.deliverAt));
//   const historical = letters.filter(l => isDelivered(l) && !isNewlyArrived(l.deliverAt));

//   const renderShelf = (title, letterSet) => {
//     if (letterSet.length === 0) return null;
    
//     const rows = [];
//     for (let i = 0; i < letterSet.length; i += 4) {
//       rows.push(letterSet.slice(i, i + 4));
//     }

//     return (
//       <section className="mb-32">
//         <h2 className="font-display text-2xl uppercase tracking-[0.3em] text-[#5e4b3c] mb-12 border-l-4 border-[#8c4a2a] pl-4">
//           {title}
//         </h2>
//         <div className="flex flex-col gap-36">
//           {rows.map((row, rIdx) => (
//             <div key={rIdx} className="relative">
//               <div className="flex justify-around items-end px-10 pb-3 relative z-20 gap-8">
//                 {row.map((l, idx) => {
//                   const envelopeTilt = idx % 2 === 0 ? "rotate-2" : "-rotate-1";
//                   const ticketRotation = idx % 2 === 0 ? "-rotate-3" : "rotate-6";
//                   const justDelivered = isNewlyArrived(l.deliverAt);
//                   const inFuture = !isDelivered(l);

//                   return (
//                     <motion.div 
//                       key={l._id} 
//                       whileHover={{ y: -25, rotate: 0, scale: 1.03 }} 
//                       onClick={() => setReadingLetter(l)} 
//                       // If in future, we make it look "ghostly" or faded compared to unlocked ones
//                       className={`manila-envelope cursor-pointer ${envelopeTilt} w-[280px] h-[180px] relative flex items-center justify-center transition-opacity duration-500 ${inFuture ? 'opacity-60 grayscale-[0.3]' : 'opacity-100'}`}
//                     >
//                       {/* 1. TICKET TAG */}
//                       <div className="ticket-label" style={{ transform: `translate(-50%, -50%) ${ticketRotation}` }}>
//                         {isDelivered(l) ? "AUTHENTICATED" : `IN TRANSIT: ${new Date(l.deliverAt).toLocaleDateString()}`}
//                       </div>

//                       {/* 2. ENVELOPE FLAP */}
//                       <div className="envelope-flap"></div>
                      
//                       {/* 3. WAX SEAL */}
//                       <div className="wax-seal"></div>

//                       {/* 4. LOCK ICON FOR FUTURE LETTERS */}
//                       {inFuture && (
//                         <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none opacity-20">
//                            <Lock size={60} className="text-[#3e2723]" />
//                         </div>
//                       )}

//                       {/* 5. NEW BADGE */}
//                       {justDelivered && (
//                         <div className="absolute top-2 left-2 bg-[#8c4a2a] text-[#f5ead3] text-[7px] font-display px-2 py-0.5 rounded-sm z-[30] animate-pulse">
//                           NEW ARRIVAL
//                         </div>
//                       )}
//                     </motion.div>
//                   );
//                 })}
//               </div>
//               <div className="h-12 w-full bg-[#3e2723] border-t-4 border-[#5d4037] shadow-2xl relative z-10 rounded-sm">
//                 <div className="shelf-shadow"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[#f9e8d2] text-[#2c1810] font-body selection:bg-orange-200 overflow-x-hidden">
//       <style dangerouslySetInnerHTML={{ __html: `
//         @import url('https://fonts.googleapis.com/css2?family=Courier+Prime&family=Special+Elite&display=swap');
//         .font-display { font-family: 'Special Elite', cursive; }
//         .font-body { font-family: 'Courier Prime', monospace; }

//         .manila-envelope {
//           background: #f0d4b0;
//           background-image: url("https://www.transparenttextures.com/patterns/crumpled-paper.png");
//           border: 1px solid #d4b895;
//           border-radius: 4px;
//           box-shadow: 0 15px 35px rgba(0,0,0,0.3), inset 0 15px 40px rgba(200, 170, 130, 0.4);
//           position: relative;
//           overflow: hidden;
//         }

//         .envelope-flap {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 60%;
//           background: #d5ad78;
//           background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
//           clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
//           border-bottom: 1px solid rgba(0,0,0,0.1);
//           z-index: 5;
//         }

//         .wax-seal {
//           width: 32px;
//           height: 32px;
//           background: radial-gradient(circle at 30% 30%, #a02020 0%, #700808 100%);
//           border-radius: 50%;
//           position: absolute;
//           top: 60%; 
//           left: 50%;
//           transform: translate(-50%, -50%);
//           z-index: 10; 
//           border: 1px solid #500505;
//           box-shadow: 0 3px 6px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2);
//         }

//         .wax-seal::before {
//           content: '';
//           position: absolute;
//           inset: -8px -12px -6px -10px;
//           background: rgba(112, 8, 8, 0.85);
//           border-radius: 40% 60% 50% 70% / 60% 40% 70% 50%;
//           z-index: -1;
//           filter: blur(1px);
//           box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
//         }

//         .ticket-label {
//           display: inline-block;
//           padding: 6px 14px;
//           background: #2c1810;
//           color: #f5ead3;
//           font-family: 'Special Elite', cursive;
//           font-size: 10px;
//           text-transform: uppercase;
//           letter-spacing: 1px;
//           border-radius: 2px;
//           position: absolute;
//           top: 75%; 
//           left: 17%;
//           border: 1px dashed rgba(245, 234, 211, 0.2);
//           box-shadow: 3px 3px 10px rgba(0,0,0,0.4);
//           z-index: 20;
//           white-space: nowrap;
//         }

//         .ticket-label::before, .ticket-label::after {
//           content: '';
//           position: absolute;
//           top: 50%;
//           width: 8px;
//           height: 8px;
//           background: #e6c9a2;
//           border-radius: 50%;
//           transform: translateY(-50%);
//         }
//         .ticket-label::before { left: -5px; }
//         .ticket-label::after { right: -5px; }

//         .shelf-shadow {
//           background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%);
//           height: 20px;
//           position: absolute;
//           bottom: -20px;
//           width: 100%;
//           z-index: 5;
//         }
//       `}} />

//       <header className="w-full bg-[#fbe8cd] border-b-4 border-[#8d7e6c] px-12 py-8 flex justify-between items-center sticky top-0 z-[60] shadow-lg">
//         <div className="flex items-center gap-5">
//           <div className="p-4 bg-[#3e2723] rounded-sm shadow-xl -rotate-3">
//             <Mailbox className="w-10 h-10 text-[#e6b38a]" />
//           </div>
//           <div>
//             <h1 className="text-4xl font-display uppercase tracking-tighter text-[#2c1810]">Letter Vault</h1>
//             <p className="text-[11px] uppercase tracking-[0.5em] text-[#5e4b3c] font-bold">Write letters to your future self</p>
//           </div>
//         </div>
//         <div className="flex gap-4">
//           <button onClick={() => setWriteOpen(true)} className="font-display px-10 py-4 bg-[#8c4a2a] text-[#f5ead3] shadow-[6px_6px_0px_#3e2723] uppercase text-sm hover:bg-[#5e2e15] active:translate-y-1 active:shadow-none transition-all">
//             Write a Letter
//           </button>
//           <button onClick={onLogout} className="p-4 bg-black/10 hover:bg-black/20 rounded-full text-[#3e2723]">
//             <LogOut size={20} />
//           </button>
//         </div>
//       </header>

//       <main className="w-full max-w-7xl mx-auto px-12 pt-24 pb-48 relative z-10">
//         {letters.length === 0 ? (
//           <div className="text-center py-48 opacity-20 italic font-display text-3xl">The shelf is empty.</div>
//         ) : (
//           <>
//             {renderShelf("Arrivals & Upcoming", incoming)}
//             {renderShelf("Historical Records", historical)}
//           </>
//         )}
//       </main>

//       <AnimatePresence>
//         {writeOpen && (
//           <ModalWrapper onClose={() => setWriteOpen(false)}>
//             <form onSubmit={handleSave} className="bg-[#f8f0d8] p-16 min-h-[500px] flex flex-col shadow-inner rounded-sm" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'}}>
//               <h2 className="font-display text-4xl mb-12 border-b-2 border-[#8d7e6c] pb-3 text-[#2c1810]">New Correspondence</h2>
//               <textarea name="body" required placeholder="Write your memory..." className="flex-grow bg-transparent outline-none text-2xl font-body italic text-stone-900 resize-none" />
//               <div className="flex justify-between items-end mt-12 pt-8 border-t-2 border-[#8d7e6c]">
//                 <div className="flex flex-col gap-2">
//                   <span className="font-display text-[11px] uppercase text-[#5e4b3c]">Unseal Date:</span>
//                   <input type="date" name="date" required className="bg-[#dfd3c3] p-3 text-sm font-body border border-[#e0c29c] outline-none" />
//                 </div>
//                 <button type="submit" className="font-display bg-[#5e2e15] text-[#f5ead3] px-14 py-5 shadow-2xl hover:bg-black uppercase">Seal Archive</button>
//               </div>
//             </form>
//           </ModalWrapper>
//         )}

//         {readingLetter && (
//           <ModalWrapper onClose={() => setReadingLetter(null)}>
//             <div className="bg-[#f8f0d8] p-16 min-h-[400px] relative rounded-sm" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'}}>
//               <div className="text-[11px] opacity-40 mb-6 tracking-[0.4em] uppercase border-b border-black/10 pb-2">REF: {readingLetter._id?.slice(-8)}</div>
//               {isDelivered(readingLetter) ? (
//                 <div className="text-2xl font-body leading-relaxed whitespace-pre-wrap text-stone-900">{readingLetter.body}</div>
//               ) : (
//                 <div className="text-center py-24 bg-black/5 rounded-lg border-2 border-dashed border-black/10">
//                   <Lock size={64} className="mx-auto mb-6 text-stone-400 opacity-60" />
//                   <p className="font-body text-stone-500 italic">Sealed until {new Date(readingLetter.deliverAt).toLocaleDateString()}.</p>
//                 </div>
//               )}
//               <div className="mt-16 flex justify-between border-t border-black/10 pt-8 relative z-10">
//                 <button onClick={() => setReadingLetter(null)} className="uppercase text-xs font-display opacity-50 hover:opacity-100 transition-opacity">Return to Shelf</button>
//                 <button onClick={() => handleDelete(readingLetter._id)} className="text-red-900 opacity-20 hover:opacity-100 transition-all hover:scale-110">
//                   <Trash2 size={24}/>
//                 </button>
//               </div>
//             </div>
//           </ModalWrapper>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// function ModalWrapper({ children, onClose }) {
//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1a140e]/90 backdrop-blur-md">
//       <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-2xl bg-[#f5ead3] relative shadow-2xl rounded-sm border-2 border-[#8d7e6c]">
//         <button onClick={onClose} className="absolute top-6 right-6 z-10 opacity-30 hover:opacity-100 transition-all hover:rotate-90">
//           <X size={28} />
//         </button>
//         {children}
//       </motion.div>
//     </motion.div>
//   );
// }


// src/App.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mailbox, Lock, X, Trash2, LogOut } from "lucide-react";
import AuthPage from "./AuthPage";
import { useAuth } from "./AuthContext";

const API_URL = "http://localhost:5000/api/letters";

const isDelivered = (l) => new Date(l.deliverAt) <= new Date();

export default function App() {
  const { token, logout, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#dfd3c3] flex items-center justify-center font-display text-2xl opacity-50">
      Consulting Vault...
    </div>
  );

  return !token ? <AuthPage /> : <RetroArchive token={token} onLogout={logout} />;
}

function RetroArchive({ token, onLogout }) {
  const [letters, setLetters] = useState([]);
  const [writeOpen, setWriteOpen] = useState(false);
  const [readingLetter, setReadingLetter] = useState(null);

  const refresh = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { "x-auth-token": token }
      });
      const data = await res.json();
      const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.deliverAt) - new Date(a.deliverAt)) : [];
      setLetters(sorted);
    } catch (err) {
      console.error("Archive sync failed", err);
    }
  };

  useEffect(() => {
    refresh();
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { 
      body: e.target.body.value, 
      deliverAt: e.target.date.value 
    };

    await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "x-auth-token": token 
      },
      body: JSON.stringify(payload)
    });
    setWriteOpen(false);
    refresh();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "x-auth-token": token }
    });
    setReadingLetter(null);
    refresh();
  };

  const isNewlyArrived = (date) => {
    const now = new Date();
    const arrival = new Date(date);
    const diffInHours = Math.abs(now - arrival) / 36e5;
    return diffInHours < 24 && arrival <= now;
  };

  const incoming = letters.filter(l => !isDelivered(l) || isNewlyArrived(l.deliverAt));
  const historical = letters.filter(l => isDelivered(l) && !isNewlyArrived(l.deliverAt));

  const renderShelf = (title, letterSet) => {
    if (letterSet.length === 0) return null;
    
    const rows = [];
    for (let i = 0; i < letterSet.length; i += 4) {
      rows.push(letterSet.slice(i, i + 4));
    }

    return (
      <section className="mb-32">
        <h2 className="font-display text-2xl uppercase tracking-[0.3em] text-[#5e4b3c] mb-12 border-l-4 border-[#8c4a2a] pl-4">
          {title}
        </h2>
        <div className="flex flex-col gap-36">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="relative">
              <div className="flex justify-around items-end px-10 pb-3 relative z-20 gap-8">
                {row.map((l, idx) => {
                  const envelopeTilt = idx % 2 === 0 ? "rotate-2" : "-rotate-1";
                  const ticketRotation = idx % 2 === 0 ? "-rotate-3" : "rotate-6";
                  const justDelivered = isNewlyArrived(l.deliverAt);
                  const inFuture = !isDelivered(l);

                  return (
                    <motion.div 
                      key={l._id} 
                      whileHover={{ y: -25, rotate: 0, scale: 1.03 }} 
                      onClick={() => setReadingLetter(l)} 
                      className={`manila-envelope cursor-pointer ${envelopeTilt} w-[280px] h-[180px] relative flex items-center justify-center transition-opacity duration-500 ${inFuture ? 'opacity-60 grayscale-[0.3]' : 'opacity-100'}`}
                    >
                      <div className="ticket-label" style={{ transform: `translate(-50%, -50%) ${ticketRotation}` }}>
                        {isDelivered(l) ? "AUTHENTICATED" : `IN TRANSIT: ${new Date(l.deliverAt).toLocaleDateString()}`}
                      </div>
                      <div className="envelope-flap"></div>
                      <div className="wax-seal"></div>
                      {inFuture && (
                        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none opacity-20">
                           <Lock size={60} className="text-[#3e2723]" />
                        </div>
                      )}
                      {justDelivered && (
                        <div className="absolute top-2 left-2 bg-[#8c4a2a] text-[#f5ead3] text-[7px] font-display px-2 py-0.5 rounded-sm z-[30] animate-pulse">
                          NEW ARRIVAL
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              <div className="h-12 w-full bg-[#3e2723] border-t-4 border-[#5d4037] shadow-2xl relative z-10 rounded-sm">
                <div className="shelf-shadow"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#f9e8d2] text-[#2c1810] font-body selection:bg-orange-200 overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime&family=Special+Elite&display=swap');
        .font-display { font-family: 'Special Elite', cursive; }
        .font-body { font-family: 'Courier Prime', monospace; }

        /* Custom Scrollbar for Letter Content */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
        .custom-scroll::-webkit-scrollbar-thumb { background: #8c4a2a; border-radius: 10px; }

        .manila-envelope {
          background: #f0d4b0;
          background-image: url("https://www.transparenttextures.com/patterns/crumpled-paper.png");
          border: 1px solid #d4b895;
          border-radius: 4px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.3), inset 0 15px 40px rgba(200, 170, 130, 0.4);
          position: relative;
          overflow: hidden;
        }

        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 60%;
          background: #e1bc8a;
          background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
          clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
          border-bottom: 1px solid rgba(0,0,0,0.1);
          z-index: 5;
        }

        .wax-seal {
          width: 32px;
          height: 32px;
          background: radial-gradient(circle at 30% 30%, #a02020 0%, #700808 100%);
          border-radius: 50%;
          position: absolute;
          top: 60%; 
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10; 
          border: 1px solid #500505;
          box-shadow: 0 3px 6px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2);
        }

        .wax-seal::before {
          content: '';
          position: absolute;
          inset: -8px -12px -6px -10px;
          background: rgba(112, 8, 8, 0.85);
          border-radius: 40% 60% 50% 70% / 60% 40% 70% 50%;
          z-index: -1;
          filter: blur(1px);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }

        .ticket-label {
          display: inline-block;
          padding: 6px 14px;
          background: #2c1810;
          color: #f5ead3;
          font-family: 'Special Elite', cursive;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-radius: 2px;
          position: absolute;
          top: 75%; 
          left: 20%;
          border: 1px dashed rgba(245, 234, 211, 0.2);
          box-shadow: 3px 3px 10px rgba(0,0,0,0.4);
          z-index: 20;
          white-space: nowrap;
        }

        .ticket-label::before, .ticket-label::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 8px;
          height: 8px;
          background: #e6c9a2;
          border-radius: 50%;
          transform: translateY(-50%);
        }
        .ticket-label::before { left: -5px; }
        .ticket-label::after { right: -5px; }

        .shelf-shadow {
          background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%);
          height: 20px;
          position: absolute;
          bottom: -20px;
          width: 100%;
          z-index: 5;
        }
      `}} />

      <header className="w-full bg-[#fbe8cd] border-b-4 border-[#8d7e6c] px-12 py-8 flex justify-between items-center sticky top-0 z-[60] shadow-lg">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-[#3e2723] rounded-sm shadow-xl -rotate-3">
            <Mailbox className="w-10 h-10 text-[#e6b38a]" />
          </div>
          <div>
            <h1 className="text-4xl font-display uppercase tracking-tighter text-[#2c1810]">Letter Vault</h1>
            <p className="text-[11px] uppercase tracking-[0.5em] text-[#5e4b3c] font-bold">Write letters to your future self</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setWriteOpen(true)} className="font-display px-10 py-4 bg-[#8c4a2a] text-[#f5ead3] shadow-[6px_6px_0px_#3e2723] uppercase text-sm hover:bg-[#5e2e15] active:translate-y-1 active:shadow-none transition-all">
            Write a Letter
          </button>
          <button onClick={onLogout} className="p-4 bg-black/10 hover:bg-black/20 rounded-full text-[#3e2723]">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-12 pt-24 pb-48 relative z-10">
        {letters.length === 0 ? (
          <div className="text-center py-48 opacity-20 italic font-display text-3xl">The shelf is empty.</div>
        ) : (
          <>
            {renderShelf("Arrivals & Upcoming", incoming)}
            {renderShelf("Historical Records", historical)}
          </>
        )}
      </main>

      <AnimatePresence>
        {writeOpen && (
          <ModalWrapper onClose={() => setWriteOpen(false)}>
            <form onSubmit={handleSave} className="bg-[#f8f0d8] p-10 md:p-16 min-h-[500px] flex flex-col shadow-inner rounded-sm" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'}}>
              <h2 className="font-display text-3xl md:text-4xl mb-12 border-b-2 border-[#8d7e6c] pb-3 text-[#2c1810]">New Correspondence</h2>
              <textarea name="body" required placeholder="Write your memory..." className="flex-grow bg-transparent outline-none text-xl md:text-2xl font-body italic text-stone-900 resize-none custom-scroll" />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-12 pt-8 border-t-2 border-[#8d7e6c] gap-6">
                <div className="flex flex-col gap-2">
                  <span className="font-display text-[11px] uppercase text-[#5e4b3c]">Unseal Date:</span>
                  <input type="date" name="date" required className="bg-[#dfd3c3] p-3 text-sm font-body border border-[#e0c29c] outline-none" />
                </div>
                <button type="submit" className="w-full md:w-auto font-display bg-[#5e2e15] text-[#f5ead3] px-14 py-5 shadow-2xl hover:bg-black uppercase">Seal Archive</button>
              </div>
            </form>
          </ModalWrapper>
        )}

        {readingLetter && (
          <ModalWrapper onClose={() => setReadingLetter(null)}>
            <div className="bg-[#f8f0d8] p-10 md:p-16 max-h-[85vh] flex flex-col relative rounded-sm" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'}}>
              <div className="text-[11px] opacity-40 mb-6 tracking-[0.4em] uppercase border-b border-black/10 pb-2">REF: {readingLetter._id?.slice(-8)}</div>
              
              <div className="flex-grow overflow-y-auto pr-4 custom-scroll">
                {isDelivered(readingLetter) ? (
                  <div className="text-xl md:text-2xl font-body leading-relaxed whitespace-pre-wrap break-words text-stone-900 italic">
                    {readingLetter.body}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-black/5 rounded-lg border-2 border-dashed border-black/10">
                    <Lock size={64} className="mx-auto mb-6 text-stone-400 opacity-60" />
                    <p className="font-body text-stone-500 italic">Sealed until {new Date(readingLetter.deliverAt).toLocaleDateString()}.</p>
                  </div>
                )}
              </div>

              <div className="mt-12 flex justify-between border-t border-black/10 pt-8 relative z-10 shrink-0">
                <button onClick={() => setReadingLetter(null)} className="uppercase text-xs font-display opacity-50 hover:opacity-100 transition-opacity">Return to Shelf</button>
                <button onClick={() => handleDelete(readingLetter._id)} className="text-red-900 opacity-20 hover:opacity-100 transition-all hover:scale-110">
                  <Trash2 size={24}/>
                </button>
              </div>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalWrapper({ children, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#1a140e]/95 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-2xl bg-[#f5ead3] relative shadow-2xl rounded-sm border-2 border-[#8d7e6c] overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 z-[110] opacity-30 hover:opacity-100 transition-all hover:rotate-90 p-2">
          <X size={24} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}