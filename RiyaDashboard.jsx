import { useState, useEffect, useRef } from "react";

const LIGHT = {
  bg: "#F8F9FC", sidebar: "#FFFFFF", card: "#FFFFFF",
  border: "rgba(0,0,0,0.07)", text: "#111827", sub: "#6B7280",
  active: "#EEF2FF", activeTxt: "#4F46E5", accent: "#4F46E5",
  ticker: "#1a1a2e", input: "#F3F4F6", muted: "#9CA3AF",
};
const DARK = {
  bg: "#0B0F1A", sidebar: "#131929", card: "#161E2E",
  border: "rgba(255,255,255,0.07)", text: "#F0F4FF", sub: "#8892A4",
  active: "#2D2250", activeTxt: "#818CF8", accent: "#6366F1",
  ticker: "#070B14", input: "#1A2235", muted: "#4B5563",
};

const NAV = [
  { icon: "🏠", label: "Home", active: true },
  { icon: "💬", label: "Ask Riya" },
  { icon: "🌍", label: "World Updates" },
  { icon: "📈", label: "Markets" },
  { icon: "🚀", label: "Space & Science" },
  { icon: "🇮🇳", label: "India Updates" },
  { icon: "🤖", label: "Tech & AI" },
  { icon: "💼", label: "Business Hub", badge: "Premium" },
  { icon: "🧠", label: "AI Agents", badge: "Premium" },
  { icon: "✅", label: "Tasks & Reminders" },
  { icon: "🔖", label: "Bookmarks" },
  { icon: "🕐", label: "History" },
];

const MARKETS = [
  { icon: "🪙", name: "Gold (24K)", price: "₹7,162", unit: "/gm", change: "+0.38%", up: true, points: "0,18 5,14 10,16 15,10 20,12 25,6 30,8 35,4 40,6 45,2 50,4" },
  { icon: "₿", name: "Bitcoin", price: "$67,892", unit: "", change: "+1.26%", up: true, points: "0,20 8,16 16,18 24,10 32,14 40,6 48,10 56,4 64,8 72,2 80,6" },
  { icon: "🇺🇸", name: "USD / INR", price: "₹83.42", unit: "", change: "-0.12%", up: false, points: "0,4 8,6 16,4 24,8 32,6 40,10 48,8 56,12 64,10 72,14 80,12" },
  { icon: "🇮🇳", name: "Sensex", price: "72,402.15", unit: "", change: "+0.71%", up: true, points: "0,18 8,14 16,16 24,10 32,12 40,8 48,10 56,6 64,8 72,4 80,6" },
];

const NEWS = [
  { cat: "BREAKING", title: "Gold hits record high as global uncertainty rises", src: "Bloomberg", time: "10m ago", color: "#EF4444", img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=300&q=70" },
  { cat: "", title: "India Elections 2025: Phase 4 voting over 65%", src: "Times of India", time: "25m ago", color: null, img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&q=70" },
  { cat: "", title: "NASA confirms water on exoplanet K2-18b", src: "NASA", time: "1h ago", color: null, img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&q=70" },
  { cat: "", title: "OpenAI releases GPT-4.5 with major upgrades", src: "TechCrunch", time: "2h ago", color: null, img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=300&q=70" },
];

const SUGS = [
  { icon: "🌍", text: "What's happening in the world?" },
  { icon: "💰", text: "Should I invest in gold now?" },
  { icon: "🚀", text: "Tell me about latest space news" },
  { icon: "📊", text: "Analyze Sensex today" },
  { icon: "🧬", text: "Explain Quantum Computing" },
  { icon: "🇮🇳", text: "India political updates" },
];

const TICKER_TEXT = "Elon Musk hints at Tesla India entry in 2026  •  Crude Oil prices fall below $80  •  ISRO to launch 3 new satellites in June  •  RBI keeps repo rate unchanged  •  More updates →";

function Sparkline({ points, up }) {
  return (
    <svg width="80" height="24" viewBox="0 0 80 24">
      <polyline points={points} fill="none" stroke={up ? "#10B981" : "#EF4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function RiyaDashboard() {
  const [dark, setDark] = useState(true);
  const [time, setTime] = useState(new Date());
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [deepResearch, setDeepResearch] = useState(false);
  const [sugHidden, setSugHidden] = useState(false);
  const msgRef = useRef(null);
  const T = dark ? DARK : LIGHT;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [messages, thinking]);

  const pad = n => String(n).padStart(2, "0");
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dateStr = `${days[time.getDay()]}, ${time.getDate()} ${months[time.getMonth()]} ${time.getFullYear()}`;

  async function send(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setSugHidden(true);
    setMessages(m => [...m, { role: "user", text: msg }]);
    setThinking(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are Riya, an intelligent AI companion for Indian users. You help with finance, news, markets, space, India updates, and more. Be concise, insightful, and friendly. Format answers clearly.`,
          messages: [{ role: "user", content: msg }]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I couldn't process that right now.";
      setMessages(m => [...m, { role: "ai", text: reply }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Something went wrong. Please try again." }]);
    }
    setThinking(false);
  }

  const s = (obj) => ({ ...obj });

  return (
    <div style={{ fontFamily: "'DM Sans', 'Plus Jakarta Sans', sans-serif", background: T.bg, color: T.text, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", transition: "background 0.2s, color 0.2s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 2px; }
        .nav-item:hover { background: rgba(128,128,128,0.08) !important; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
        .sug-chip:hover { border-color: #6366F1 !important; color: #6366F1 !important; }
        .send-btn:hover { transform: scale(1.05); }
        .news-card:hover { transform: translateY(-2px); }
        @keyframes ticker { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.85)} }
        @keyframes fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .msg-anim { animation: fadein 0.25s ease; }
        .ticker-text { display: inline-block; animation: ticker 40s linear infinite; white-space: nowrap; }
        .riya-orb { animation: pulse 3s ease-in-out infinite; }
      `}</style>

      {/* MAIN LAYOUT */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* SIDEBAR */}
        <div style={{ width: 220, background: T.sidebar, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden", transition: "background 0.2s" }}>
          {/* Logo */}
          <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="riya-orb" style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366F1,#8B5CF6,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✦</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px" }}>Riya AI</div>
                <div style={{ fontSize: 10, color: T.muted, letterSpacing: "0.3px" }}>Your AI. Your Universe.</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
            {NAV.map((n, i) => (
              <div key={i} className="nav-item" style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, marginBottom: 2, cursor: "pointer", background: n.active ? T.active : "transparent", color: n.active ? T.activeTxt : T.sub, fontSize: 13, fontWeight: n.active ? 600 : 400, transition: "all 0.15s" }}>
                <span style={{ fontSize: 15 }}>{n.icon}</span>
                <span style={{ flex: 1 }}>{n.label}</span>
                {n.badge && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: dark ? "rgba(99,102,241,0.2)" : "#EEF2FF", color: T.accent, fontWeight: 600, letterSpacing: "0.3px" }}>{n.badge}</span>}
              </div>
            ))}
          </div>

          {/* Premium card */}
          <div style={{ padding: 12 }}>
            <div style={{ background: dark ? "linear-gradient(135deg,#1e1b4b,#312e81)" : "linear-gradient(135deg,#EEF2FF,#E0E7FF)", borderRadius: 12, padding: "14px 12px", border: `1px solid ${dark ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.15)"}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>💎 Riya Premium</div>
              <div style={{ fontSize: 11, color: T.sub, marginBottom: 10, lineHeight: 1.5 }}>Unlock unlimited power of Riya.</div>
              <button style={{ width: "100%", padding: "8px 0", background: "linear-gradient(90deg,#4F46E5,#7C3AED)", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: "0.3px" }}>Upgrade Now</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 4px 0", fontSize: 11, color: T.muted }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block", animation: "pulse 2s infinite" }}></span>
              <div>
                <div style={{ fontWeight: 500, color: T.sub, fontSize: 11 }}>Riya is online</div>
                <div style={{ fontSize: 10, color: T.muted }}>All systems operational</div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* TOPBAR */}
          <div style={{ height: 56, background: T.sidebar, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", flexShrink: 0, transition: "background 0.2s" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: T.input, borderRadius: 22, padding: "8px 14px", maxWidth: 480, border: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 13, color: T.muted }}>🔍</span>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask Riya anything..." style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: T.text, fontFamily: "inherit" }}/>
              <span style={{ fontSize: 10, color: T.muted, background: T.border, padding: "2px 6px", borderRadius: 4, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.5px" }}>Ctrl /</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
              <button onClick={() => setDark(!dark)} style={{ width: 34, height: 34, borderRadius: 8, background: T.input, border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 16 }}>{dark ? "☀️" : "🌙"}</button>
              <div style={{ position: "relative", cursor: "pointer" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: T.input, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔔</div>
                <div style={{ position: "absolute", top: -3, right: -3, width: 16, height: 16, borderRadius: "50%", background: "#EF4444", fontSize: 9, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>2</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px 4px 4px", borderRadius: 24, background: T.input, border: `1px solid ${T.border}`, cursor: "pointer" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700 }}>A</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>Aarav Singh</div>
                  <div style={{ fontSize: 10, color: T.muted }}>Premium Plan</div>
                </div>
                <span style={{ fontSize: 10, color: T.muted }}>▾</span>
              </div>
            </div>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* MARKET ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {MARKETS.map((m, i) => (
                <div key={i} className="card-hover" style={{ background: T.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${T.border}`, cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 16 }}>{m.icon}</span>
                    <span style={{ fontSize: 11, color: T.sub, fontWeight: 500 }}>{m.name}</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "-0.5px", marginBottom: 4 }}>{m.price}<span style={{ fontSize: 11, color: T.muted, fontWeight: 400 }}>{m.unit}</span></div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: m.up ? "#10B981" : "#EF4444", fontWeight: 600 }}>{m.change}</span>
                    <Sparkline points={m.points} up={m.up}/>
                  </div>
                </div>
              ))}
            </div>

            {/* NEWS */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Top World Updates</div>
                <div style={{ fontSize: 12, color: T.accent, cursor: "pointer", fontWeight: 500 }}>View All</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {NEWS.map((n, i) => (
                  <div key={i} className="card-hover news-card" style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ position: "relative" }}>
                      <img src={n.img} alt="" style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} onError={e => { e.target.style.background = dark ? "#1A2235" : "#E5E7EB"; e.target.style.height = "100px"; }}/>
                      {n.cat && <span style={{ position: "absolute", top: 8, left: 8, background: n.color, color: "#fff", fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: 700, letterSpacing: "0.5px" }}>{n.cat}</span>}
                      <span style={{ position: "absolute", top: 8, right: 8, fontSize: 14, cursor: "pointer", background: "rgba(0,0,0,0.4)", borderRadius: 6, padding: "2px 5px" }}>🔖</span>
                    </div>
                    <div style={{ padding: "10px 12px 12px" }}>
                      <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.5, marginBottom: 8, color: T.text }}>{n.title}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: T.muted }}>
                        <span>{n.src}</span>
                        <span>•</span>
                        <span>{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHAT */}
            <div style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, display: "flex", flexDirection: "column", minHeight: 300, flex: 1 }}>

              {/* Welcome or messages */}
              <div ref={msgRef} style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
                {messages.length === 0 ? (
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div className="riya-orb" style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>✦</div>
                    <div>
                      <div style={{ fontSize: 15, color: T.sub, marginBottom: 4 }}>Hello Aarav! 👋</div>
                      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.5px" }}>How can I help you today?</div>
                      <div style={{ fontSize: 13, color: T.sub, lineHeight: 1.6 }}>I'm Riya. Your AI companion. Ask me anything or explore the world with me.</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {messages.map((m, i) => (
                      <div key={i} className="msg-anim" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-start" }}>
                        {m.role === "ai" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>✦</div>}
                        <div style={{ maxWidth: "72%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.role === "user" ? "linear-gradient(135deg,#4F46E5,#7C3AED)" : T.input, color: m.role === "user" ? "#fff" : T.text, fontSize: 13, lineHeight: 1.7, border: m.role === "ai" ? `1px solid ${T.border}` : "none", whiteSpace: "pre-wrap" }}>{m.text}</div>
                      </div>
                    ))}
                    {thinking && (
                      <div className="msg-anim" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✦</div>
                        <div style={{ display: "flex", gap: 5, padding: "12px 16px", background: T.input, borderRadius: "14px 14px 14px 4px", border: `1px solid ${T.border}` }}>
                          {[0,1,2].map(j => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, animation: `pulse 0.8s ${j*0.15}s ease-in-out infinite` }}/>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Suggestions */}
              {!sugHidden && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 24px 12px" }}>
                  {SUGS.map((s, i) => (
                    <button key={i} className="sug-chip" onClick={() => { setSugHidden(true); send(s.text); }} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 20, background: "none", border: `1px solid ${T.border}`, color: T.sub, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>{s.icon} {s.text}</button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.input, borderRadius: 12, padding: "10px 14px", border: `1px solid ${T.border}` }}>
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask anything..." style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: T.text, fontFamily: "inherit" }}/>
                  <button onClick={() => send()} className="send-btn" style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "transform 0.15s", flexShrink: 0 }}>➤</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8, paddingLeft: 4 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.muted, cursor: "pointer" }}>
                    <div onClick={() => setDeepResearch(!deepResearch)} style={{ width: 28, height: 16, borderRadius: 8, background: deepResearch ? T.accent : T.border, position: "relative", transition: "background 0.2s", cursor: "pointer" }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: deepResearch ? 14 : 2, transition: "left 0.2s" }}/>
                    </div>
                    Deep Research
                  </label>
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: T.muted }}>📎 Attach</button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: T.muted }}>🎤 Voice</button>
                </div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 6, textAlign: "center" }}>Riya can make mistakes. Please verify important info.</div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: 300, background: T.sidebar, borderLeft: `1px solid ${T.border}`, display: "flex", flexDirection: "column", overflow: "hidden", transition: "background 0.2s" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>

            {/* Clock */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 30, fontWeight: 600, letterSpacing: "-1px", marginBottom: 2 }}>{timeStr}</div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.muted }}>{dateStr}</div>
              <div style={{ fontSize: 12, color: T.sub, marginTop: 6 }}>📍 New Delhi, India</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: 12, background: T.card, borderRadius: 10, border: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 28 }}>☀️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>38°C</span>
                    <span style={{ fontSize: 12, color: T.sub }}>Sunny</span>
                  </div>
                  <div style={{ fontSize: 10, color: T.muted }}>H: 39° L: 26° · <span style={{ color: "#10B981" }}>Air Quality: 62 (Good)</span></div>
                </div>
              </div>
            </div>

            {/* Agents */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}>
                  My AI Agents
                  <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: dark ? "rgba(99,102,241,0.2)" : "#EEF2FF", color: T.accent, fontWeight: 700 }}>Premium</span>
                </div>
                <div style={{ fontSize: 11, color: T.accent, cursor: "pointer" }}>View All</div>
              </div>
              {[
                { icon: "📊", name: "Market Watcher", sub: "Tracking 12 assets", bg: "rgba(59,130,246,0.12)" },
                { icon: "📰", name: "News Summarizer", sub: "Daily at 8:00 AM", bg: "rgba(16,185,129,0.12)" },
                { icon: "🔔", name: "Price Alert Agent", sub: "Gold > ₹7,200", bg: "rgba(245,158,11,0.12)" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: T.card, border: `1px solid ${T.border}`, marginBottom: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{a.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{a.name}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{a.sub}</div>
                  </div>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981" }}/>
                </div>
              ))}
              <div style={{ padding: "8px", border: `1px solid ${T.border}`, borderRadius: 10, textAlign: "center", fontSize: 12, color: T.accent, cursor: "pointer", background: T.card }}>+ Create New Agent</div>
            </div>

            {/* Reminders */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Upcoming Reminders</div>
                <div style={{ fontSize: 11, color: T.accent, cursor: "pointer" }}>View All</div>
              </div>
              {[
                { icon: "📋", name: "Daily World Update", time: "Tomorrow, 8:00 AM" },
                { icon: "🪙", name: "Gold Price Alert", time: "When gold > ₹7,200" },
                { icon: "📈", name: "Market Closing Report", time: "Today, 7:30 PM" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: T.card, border: `1px solid ${T.border}`, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{r.name}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{r.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Quick Actions</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["🔍","Research"],["⚖️","Compare"],["🌐","Translate"],["🧮","Calculator"]].map(([ic,lb],i) => (
                  <button key={i} style={{ padding: "12px 8px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 11, color: T.sub, fontFamily: "inherit", transition: "all 0.15s" }} className="card-hover">
                    <span style={{ fontSize: 20 }}>{ic}</span>{lb}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* TICKER BAR */}
      <div style={{ height: 34, background: T.ticker, borderTop: `1px solid rgba(255,255,255,0.05)`, display: "flex", alignItems: "center", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#EF4444", display: "inline-block", animation: "pulse 1.5s infinite" }}/>
          <span style={{ fontSize: 10, color: "#fff", fontWeight: 700, letterSpacing: "1px" }}>LIVE</span>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div className="ticker-text" style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", paddingLeft: "100%" }}>{TICKER_TEXT} &nbsp;&nbsp;&nbsp; {TICKER_TEXT}</div>
        </div>
      </div>
    </div>
  );
}
