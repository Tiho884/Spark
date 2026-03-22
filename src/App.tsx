import { useState, useRef, useEffect } from "react";

const PROFILES = [
  { id: 1, name: "Ana", age: 26, city: "Zagreb", bio: "Ljubiteljica kave, planina i dobrih knjiga ☕🏔️", img: "https://randomuser.me/api/portraits/women/44.jpg", tags: ["Planinarenje", "Kava", "Čitanje"] },
  { id: 2, name: "Marko", age: 29, city: "Split", bio: "Surfer dušom, kuhar po potrebi 🌊🍕", img: "https://randomuser.me/api/portraits/men/32.jpg", tags: ["Surfanje", "Kuhanje", "Glazba"] },
  { id: 3, name: "Petra", age: 24, city: "Rijeka", bio: "Dizajnerica koja voli jazz i dugačke šetnje uz more 🎷🌊", img: "https://randomuser.me/api/portraits/women/68.jpg", tags: ["Dizajn", "Jazz", "More"] },
  { id: 4, name: "Ivan", age: 31, city: "Osijek", bio: "Programer, entuzijast kave i vikend kuhar 💻☕", img: "https://randomuser.me/api/portraits/men/75.jpg", tags: ["Tech", "Kuhanje", "Fitness"] },
  { id: 5, name: "Maja", age: 27, city: "Dubrovnik", bio: "Putnica po struci, fotografkinja po pozivu 📸✈️", img: "https://randomuser.me/api/portraits/women/90.jpg", tags: ["Putovanja", "Fotografija", "Yoga"] },
  { id: 6, name: "Luka", age: 28, city: "Zadar", bio: "Gitarist, vegetarijanac i ljubitelj mora 🎸🌿", img: "https://randomuser.me/api/portraits/men/55.jpg", tags: ["Glazba", "Vegetarijanci", "More"] },
];

const MATCHES = [
  { id: 101, name: "Sara", age: 25, img: "https://randomuser.me/api/portraits/women/22.jpg", lastMsg: "Hej! Kako si? 😊", time: "14:32", unread: 2 },
  { id: 102, name: "Tomislav", age: 30, img: "https://randomuser.me/api/portraits/men/11.jpg", lastMsg: "Super, sutra si slobodna?", time: "11:20", unread: 0 },
  { id: 103, name: "Nina", age: 23, img: "https://randomuser.me/api/portraits/women/55.jpg", lastMsg: "Baš sam uživala 🌊", time: "Jučer", unread: 1 },
];

const CHAT_HISTORY = {
  101: [
    { from: "them", text: "Hej! Kako si? 😊", time: "14:30" },
    { from: "them", text: "Vidim da voliš planinarenje!", time: "14:32" },
  ],
  102: [
    { from: "me", text: "Hej Tomislave! Baš lijepi profil 😄", time: "10:00" },
    { from: "them", text: "Hvala! I tvoj je odličan.", time: "10:15" },
    { from: "them", text: "Super, sutra si slobodna?", time: "11:20" },
  ],
  103: [
    { from: "me", text: "Hej Nina, i ti voliš more?", time: "Jučer" },
    { from: "them", text: "Baš sam uživala 🌊", time: "Jučer" },
  ],
};

export default function App() {
  const [tab, setTab] = useState("discover");
  const [cardIndex, setCardIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);
  const [matches, setMatches] = useState(MATCHES);
  const [showMatch, setShowMatch] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState(CHAT_HISTORY);
  const [inputMsg, setInputMsg] = useState("");
  const [filters, setFilters] = useState({ minAge: 18, maxAge: 40, city: "Sve" });
  const [showFilters, setShowFilters] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const cardRef = useRef(null);
  const chatEndRef = useRef(null);

  const cities = ["Sve", "Zagreb", "Split", "Rijeka", "Osijek", "Dubrovnik", "Zadar"];

  const filteredProfiles = PROFILES.filter(p => {
    const ageOk = p.age >= filters.minAge && p.age <= filters.maxAge;
    const cityOk = filters.city === "Sve" || p.city === filters.city;
    return ageOk && cityOk;
  });

  const current = filteredProfiles[cardIndex];

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [activeChat, chatMessages]);

  const handleSwipe = (dir) => {
    setSwipeDir(dir);
    setTimeout(() => {
      if (dir === "right" && current) {
        const newMatch = {
          id: Date.now(),
          name: current.name,
          age: current.age,
          img: current.img,
          lastMsg: "Upravo ste se spojili! 💕",
          time: "Upravo",
          unread: 1,
        };
        setMatches(prev => [newMatch, ...prev]);
        setChatMessages(prev => ({ ...prev, [newMatch.id]: [] }));
        setShowMatch(current);
      }
      setCardIndex(i => i + 1);
      setSwipeDir(null);
      setDragX(0);
      setDragY(0);
    }, 350);
  };

  const onMouseDown = (e) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
    setDragging(true);
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    setDragX(e.clientX - startX.current);
    setDragY((e.clientY - startY.current) * 0.3);
  };

  const onMouseUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragX > 80) handleSwipe("right");
    else if (dragX < -80) handleSwipe("left");
    else { setDragX(0); setDragY(0); }
  };

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setDragging(true);
  };

  const onTouchMove = (e) => {
    if (!dragging) return;
    setDragX(e.touches[0].clientX - startX.current);
    setDragY((e.touches[0].clientY - startY.current) * 0.3);
  };

  const onTouchEnd = () => {
    setDragging(false);
    if (dragX > 70) handleSwipe("right");
    else if (dragX < -70) handleSwipe("left");
    else { setDragX(0); setDragY(0); }
  };

  const sendMessage = () => {
    if (!inputMsg.trim() || !activeChat) return;
    const msg = { from: "me", text: inputMsg, time: new Date().toLocaleTimeString("hr", { hour: "2-digit", minute: "2-digit" }) };
    setChatMessages(prev => ({ ...prev, [activeChat.id]: [...(prev[activeChat.id] || []), msg] }));
    setInputMsg("");
    setTimeout(() => {
      const replies = ["Haha, baš si smiješan/a 😄", "Zvuči odlično!", "Super ideja 💕", "I ja mislim tako!", "Može, predlaži! 🎉"];
      const reply = { from: "them", text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString("hr", { hour: "2-digit", minute: "2-digit" }) };
      setChatMessages(prev => ({ ...prev, [activeChat.id]: [...(prev[activeChat.id] || []), reply] }));
    }, 1200);
  };

  const rotation = swipeDir ? (swipeDir === "right" ? 20 : -20) : dragX * 0.08;
  const translateX = swipeDir ? (swipeDir === "right" ? 600 : -600) : dragX;
  const translateY = swipeDir ? -100 : dragY;
  const opacity = swipeDir ? 0 : 1;

  const likeOpacity = Math.max(0, Math.min(1, dragX / 80));
  const nopeOpacity = Math.max(0, Math.min(1, -dragX / 80));

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      userSelect: "none",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
        .tab-btn { transition: all 0.2s; }
        .tab-btn:hover { opacity: 0.8; }
        .action-btn { transition: all 0.15s; cursor: pointer; }
        .action-btn:hover { transform: scale(1.1); }
        .action-btn:active { transform: scale(0.95); }
        .match-card { transition: background 0.2s; cursor: pointer; }
        .match-card:hover { background: rgba(255,255,255,0.08) !important; }
        input:focus { outline: none; }
        @keyframes fadeIn { from { opacity:0; transform: scale(0.85); } to { opacity:1; transform: scale(1); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes slideUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
        .match-popup { animation: fadeIn 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        .card-anim { animation: slideUp 0.3s ease; }
      `}</style>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 430, padding: "20px 20px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", letterSpacing: -1 }}>
          spark<span style={{ color: "#f472b6" }}>.</span>
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          {tab === "discover" && (
            <button onClick={() => setShowFilters(true)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 14px", color: "#fff", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              ⚙️ Filteri
            </button>
          )}
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #f472b6, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, width: "100%", maxWidth: 430, padding: "0 20px", display: "flex", flexDirection: "column" }}>

        {/* DISCOVER TAB */}
        {tab === "discover" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 10 }}>
            {current ? (
              <>
                {/* Card */}
                <div
                  ref={cardRef}
                  className="card-anim"
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  style={{
                    width: "100%",
                    height: 480,
                    borderRadius: 28,
                    overflow: "hidden",
                    position: "relative",
                    cursor: dragging ? "grabbing" : "grab",
                    transform: `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`,
                    transition: dragging ? "none" : "transform 0.35s cubic-bezier(0.34,1.2,0.64,1), opacity 0.35s",
                    opacity,
                    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                    touchAction: "none",
                  }}
                >
                  <img src={current.img} alt={current.name} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }} />

                  {/* LIKE / NOPE overlays */}
                  <div style={{ position: "absolute", top: 30, left: 24, opacity: likeOpacity, transform: `rotate(-15deg)`, border: "4px solid #4ade80", borderRadius: 12, padding: "6px 18px", color: "#4ade80", fontSize: 28, fontWeight: 800, letterSpacing: 2, transition: "opacity 0.1s" }}>LIKE</div>
                  <div style={{ position: "absolute", top: 30, right: 24, opacity: nopeOpacity, transform: `rotate(15deg)`, border: "4px solid #f87171", borderRadius: 12, padding: "6px 18px", color: "#f87171", fontSize: 28, fontWeight: 800, letterSpacing: 2, transition: "opacity 0.1s" }}>NOPE</div>

                  {/* Info */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px 24px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>{current.name}</span>
                      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 20 }}>{current.age}</span>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 10 }}>📍 {current.city}</div>
                    <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginBottom: 12 }}>{current.bio}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {current.tags.map(t => (
                        <span key={t} style={{ background: "rgba(244,114,182,0.25)", border: "1px solid rgba(244,114,182,0.4)", color: "#f9a8d4", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 24, marginTop: 28, alignItems: "center" }}>
                  <button className="action-btn" onClick={() => handleSwipe("left")} style={{ width: 60, height: 60, borderRadius: "50%", border: "none", background: "rgba(248,113,113,0.15)", fontSize: 26, cursor: "pointer", boxShadow: "0 0 0 2px rgba(248,113,113,0.3)" }}>✕</button>
                  <button className="action-btn" onClick={() => handleSwipe("left")} style={{ width: 48, height: 48, borderRadius: "50%", border: "none", background: "rgba(251,191,36,0.15)", fontSize: 20, cursor: "pointer" }}>⭐</button>
                  <button className="action-btn" onClick={() => handleSwipe("right")} style={{ width: 68, height: 68, borderRadius: "50%", border: "none", background: "linear-gradient(135deg, #f472b6, #818cf8)", fontSize: 28, cursor: "pointer", boxShadow: "0 8px 24px rgba(244,114,182,0.4)" }}>♥</button>
                  <button className="action-btn" onClick={() => handleSwipe("right")} style={{ width: 48, height: 48, borderRadius: "50%", border: "none", background: "rgba(129,140,248,0.15)", fontSize: 20, cursor: "pointer" }}>🔥</button>
                  <button className="action-btn" onClick={() => {}} style={{ width: 60, height: 60, borderRadius: "50%", border: "none", background: "rgba(74,222,128,0.15)", fontSize: 26, cursor: "pointer", boxShadow: "0 0 0 2px rgba(74,222,128,0.3)" }}>↺</button>
                </div>

                {/* Next card preview */}
                {filteredProfiles[cardIndex + 1] && (
                  <div style={{ marginTop: 16, opacity: 0.5, display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                    <img src={filteredProfiles[cardIndex + 1].img} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} alt="" />
                    Sljedeći: {filteredProfiles[cardIndex + 1].name}
                  </div>
                )}
              </>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", gap: 16 }}>
                <div style={{ fontSize: 64 }}>🌟</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>Nema više profila</div>
                <div style={{ fontSize: 14 }}>Promijeni filtere ili se vrati sutra!</div>
                <button onClick={() => setCardIndex(0)} style={{ marginTop: 10, background: "linear-gradient(135deg, #f472b6, #818cf8)", border: "none", borderRadius: 20, padding: "12px 28px", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Osvježi</button>
              </div>
            )}
          </div>
        )}

        {/* MATCHES TAB */}
        {tab === "matches" && !activeChat && (
          <div style={{ flex: 1, paddingTop: 8 }}>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Spojevi 💕</div>
            {matches.length === 0 ? (
              <div style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: 60, fontSize: 15 }}>Još nema spojeva. Swipaj! 🚀</div>
            ) : matches.map(m => (
              <div key={m.id} className="match-card" onClick={() => setActiveChat(m)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 12px", borderRadius: 18, marginBottom: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ position: "relative" }}>
                  <img src={m.img} alt={m.name} style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover", border: "2px solid #f472b6" }} />
                  {m.unread > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: "#f472b6", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{m.unread}</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{m.name}, {m.age}</span>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{m.time}</span>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>{m.lastMsg}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CHAT VIEW */}
        {tab === "matches" && activeChat && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 160px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 10 }}>
              <button onClick={() => setActiveChat(null)} style={{ background: "none", border: "none", color: "#f472b6", fontSize: 22, cursor: "pointer" }}>←</button>
              <img src={activeChat.img} alt={activeChat.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <div style={{ color: "#fff", fontWeight: 600 }}>{activeChat.name}</div>
                <div style={{ color: "#4ade80", fontSize: 12 }}>Online</div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 10 }}>
              {(chatMessages[activeChat.id] || []).length === 0 && (
                <div style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 40, fontSize: 14 }}>Pošalji prvu poruku! 💌</div>
              )}
              {(chatMessages[activeChat.id] || []).map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "72%",
                    padding: "10px 16px",
                    borderRadius: msg.from === "me" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                    background: msg.from === "me" ? "linear-gradient(135deg, #f472b6, #818cf8)" : "rgba(255,255,255,0.1)",
                    color: "#fff",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}>
                    {msg.text}
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 4, textAlign: "right" }}>{msg.time}</div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <input
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Napiši poruku..."
                style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 24, padding: "12px 18px", color: "#fff", fontSize: 14 }}
              />
              <button onClick={sendMessage} style={{ width: 46, height: 46, borderRadius: "50%", border: "none", background: "linear-gradient(135deg, #f472b6, #818cf8)", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ width: "100%", maxWidth: 430, padding: "12px 20px 24px", display: "flex", justifyContent: "space-around", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {[
          { id: "discover", icon: "🔥", label: "Otkrij" },
          { id: "matches", icon: "💬", label: "Poruke" },
        ].map(t => (
          <button key={t.id} className="tab-btn" onClick={() => { setTab(t.id); setActiveChat(null); }} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", opacity: tab === t.id ? 1 : 0.4 }}>
            <div style={{ fontSize: 24, filter: tab === t.id ? "none" : "grayscale(1)" }}>{t.icon}</div>
            <div style={{ color: tab === t.id ? "#f472b6" : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: tab === t.id ? 600 : 400 }}>{t.label}</div>
            {tab === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#f472b6" }} />}
          </button>
        ))}
      </div>

      {/* Match Popup */}
      {showMatch && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div className="match-popup" style={{ background: "linear-gradient(135deg, #1e1b4b, #4c1d95)", borderRadius: 32, padding: "40px 30px", textAlign: "center", maxWidth: 340, width: "100%", border: "1px solid rgba(244,114,182,0.3)" }}>
            <div style={{ fontSize: 50, marginBottom: 10, animation: "pulse 1s ease infinite" }}>💕</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#fff", marginBottom: 6 }}>Spoj!</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginBottom: 24 }}>Sviđaš se i ti njoj/njemu!</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 28 }}>
              <img src={showMatch.img} alt="" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #f472b6" }} />
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #f472b6, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>👤</div>
            </div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 18, marginBottom: 24 }}>{showMatch.name} iz {showMatch.city}</div>
            <button onClick={() => { setShowMatch(null); setTab("matches"); }} style={{ width: "100%", padding: "14px", borderRadius: 20, border: "none", background: "linear-gradient(135deg, #f472b6, #818cf8)", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", marginBottom: 12 }}>
              Pošalji poruku 💬
            </button>
            <button onClick={() => setShowMatch(null)} style={{ width: "100%", padding: "14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.6)", fontSize: 16, cursor: "pointer" }}>
              Nastavi swipati
            </button>
          </div>
        </div>
      )}

      {/* Filters Modal */}
      {showFilters && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div className="match-popup" style={{ background: "#1e1b4b", borderRadius: "28px 28px 0 0", padding: "28px 24px 40px", width: "100%", maxWidth: 430, border: "1px solid rgba(244,114,182,0.2)" }}>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 24 }}>⚙️ Filteri</div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 8 }}>Dob: {filters.minAge} – {filters.maxAge} god.</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input type="range" min={18} max={filters.maxAge} value={filters.minAge} onChange={e => setFilters(f => ({ ...f, minAge: +e.target.value }))} style={{ flex: 1, accentColor: "#f472b6" }} />
                <input type="range" min={filters.minAge} max={60} value={filters.maxAge} onChange={e => setFilters(f => ({ ...f, maxAge: +e.target.value }))} style={{ flex: 1, accentColor: "#818cf8" }} />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 10 }}>Grad</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {cities.map(c => (
                  <button key={c} onClick={() => setFilters(f => ({ ...f, city: c }))} style={{ padding: "7px 16px", borderRadius: 20, border: "1px solid", borderColor: filters.city === c ? "#f472b6" : "rgba(255,255,255,0.2)", background: filters.city === c ? "rgba(244,114,182,0.2)" : "transparent", color: filters.city === c ? "#f472b6" : "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => { setCardIndex(0); setShowFilters(false); }} style={{ width: "100%", padding: "14px", borderRadius: 20, border: "none", background: "linear-gradient(135deg, #f472b6, #818cf8)", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
              Primijeni filtere
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
