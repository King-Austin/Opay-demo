"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePidgin, t } from "@/contexts/PidginContext";

const FREQS = ["Weekly", "Bi-weekly", "Monthly"];

function fmt(n) { return "₦" + n.toLocaleString(); }

const INITIAL_MEMBERS = [
  { id: 1, phone: "0801 234 5678", name: "Ngozi Adaeze (you)", position: 1 },
];

export default function CreateCircle() {
  const router = useRouter();
  const { pidgin } = usePidgin();
  const [step, setStep] = useState(0); // 0=rules, 1=members, 2=rotation
  const [done, setDone] = useState(false);
  // Random code assigned on the client after mount — avoids server/client mismatch.
  const [circleCode, setCircleCode] = useState("AWK-000");
  useEffect(() => {
    setCircleCode("AWK-" + Math.floor(Math.random() * 900 + 100));
  }, []);

  // Step 0 — Rules
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(5000);
  const [freq, setFreq] = useState("Weekly");
  const [maxMembers, setMaxMembers] = useState(10);

  // Step 1 — Members
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [newPhone, setNewPhone] = useState("");

  function addMember(e) {
    e.preventDefault();
    if (!newPhone.trim()) return;
    setMembers(prev => [...prev, { id: Date.now(), phone: newPhone, name: "Pending invite", position: prev.length + 1 }]);
    setNewPhone("");
  }

  function removeMember(id) {
    setMembers(prev => prev.filter(m => m.id !== id).map((m, i) => ({ ...m, position: i + 1 })));
  }

  // Step 2 — Rotation (drag-reorder simplified to up/down)
  function moveUp(id) {
    setMembers(prev => {
      const idx = prev.findIndex(m => m.id === id);
      if (idx === 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next.map((m, i) => ({ ...m, position: i + 1 }));
    });
  }
  function moveDown(id) {
    setMembers(prev => {
      const idx = prev.findIndex(m => m.id === id);
      if (idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next.map((m, i) => ({ ...m, position: i + 1 }));
    });
  }
  function randomize() {
    setMembers(prev => {
      const shuffled = [...prev].sort(() => Math.random() - 0.5).map((m, i) => ({ ...m, position: i + 1 }));
      return shuffled;
    });
  }

  function handleCreate() {
    setDone(true);
    setTimeout(() => router.push("/app/dashboard"), 3000);
  }

  if (done) {
    return (
      <main style={{ minHeight: "100vh", background: "#0E0E0C", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "440px", animation: "fadeUp 0.5s ease forwards" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(31,74,53,0.2)", border: "2px solid #1F4A35", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", fontSize: "22px" }}>◈</div>
          <span className="rp-eyebrow-dark" style={{ display: "block", marginBottom: "1rem" }}>
            {t("Circle Created", "Circle Don Ready", pidgin)}
          </span>
          <h2 className="rp-big-heading" style={{ fontSize: "36px", marginBottom: "1rem" }}>
            <em>{name || "Your Circle"}</em><br />{t("is live.", "don ready.", pidgin)}
          </h2>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-md)", padding: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#8E8E80", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
              {t("Share this code with your members", "Give your members this code", pidgin)}
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "24px", fontWeight: 500, color: "#D4A853", letterSpacing: "0.2em" }}>
              {circleCode}
            </p>
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#6E6E62" }}>
            {t("Invites sent by SMS to all members. Taking you to dashboard...", "SMS don go to all members. E dey take you to dashboard...", pidgin)}
          </p>
        </div>
      </main>
    );
  }

  const totalPot = amount * members.length;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Step header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
          {["Rules", "Members", "Rotation"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: i === step ? "var(--accent-green)" : i < step ? "var(--accent-green-tint)" : "var(--bg-surface)", border: "0.5px solid", borderColor: i <= step ? "var(--accent-green-border)" : "var(--border-default)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: i === step ? "#ECEAE4" : i < step ? "var(--accent-green)" : "var(--text-ghost)" }}>
                  {i < step ? "✓" : String(i + 1)}
                </span>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.06em", color: i === step ? "var(--text-primary)" : "var(--text-ghost)" }}>{s}</span>
              {i < 2 && <span style={{ color: "var(--border-strong)", fontSize: "10px" }}>—</span>}
            </div>
          ))}
        </div>

        {/* STEP 0: Rules */}
        {step === 0 && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
            <span className="rp-eyebrow">{t("Step 1 of 3 — Circle Rules", "Step 1 of 3 — Circle Rules", pidgin)}</span>
            <h2 className="rp-sub-heading" style={{ marginBottom: "0.5rem" }}>
              {t("Set the rules once.", "Set rules once.")}<br />
              <em>{t("The platform enforces them.", "Platform go enforce am.", pidgin)}</em>
            </h2>
            <p className="rp-body" style={{ marginBottom: "2rem" }}>{t("You're taking on responsibility. Let's make it official.", "You dey take responsibility. Make we set am properly.", pidgin)}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
                  {t("Circle name", "Circle name", pidgin)}
                </label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t("e.g. Awka Market Women Circle", "e.g. Our Ajo Circle", pidgin)}
                  style={{ width: "100%", background: "var(--bg-sunken)", border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--text-primary)", outline: "none" }} />
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
                  {t("Contribution amount", "How much per round", pidgin)} — <span style={{ color: "var(--accent-green)" }}>{fmt(amount)}</span>
                </label>
                <input type="range" min={1000} max={100000} step={1000} value={amount} onChange={e => setAmount(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent-green)", cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)" }}>₦1,000</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)" }}>₦100,000</span>
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
                  {t("Frequency", "How often", pidgin)}
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {FREQS.map(f => (
                    <button key={f} onClick={() => setFreq(f)} style={{ flex: 1, padding: "0.6rem", fontFamily: "var(--font-mono)", fontSize: "12px", borderRadius: "var(--radius-md)", border: "0.5px solid", borderColor: freq === f ? "var(--accent-green-border)" : "var(--border-default)", background: freq === f ? "var(--accent-green-tint)" : "transparent", color: freq === f ? "var(--accent-green)" : "var(--text-muted)", cursor: "pointer" }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
                  {t("Max members", "Max members", pidgin)} — <span style={{ color: "var(--accent-green)" }}>{maxMembers}</span>
                </label>
                <input type="range" min={3} max={30} step={1} value={maxMembers} onChange={e => setMaxMembers(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent-green)", cursor: "pointer" }} />
              </div>

              <div className="rp-card-tinted">
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-green)" }}>
                  {t(`Total pot per cycle: ${fmt(amount * maxMembers)}`, `Total per cycle: ${fmt(amount * maxMembers)}`, pidgin)}
                  {" · "}{t(`Each member waits max ${maxMembers} ${freq.toLowerCase()}s for their payout.`, `Each person go wait max ${maxMembers} rounds.`, pidgin)}
                </p>
              </div>

              <button className="rp-btn-cta" style={{ justifyContent: "center" }} onClick={() => setStep(1)}>
                {t("Next — Add members →", "Next — Add members →", pidgin)}
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Members */}
        {step === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
            <span className="rp-eyebrow">{t("Step 2 of 3 — Invite Members", "Step 2 of 3 — Invite Members", pidgin)}</span>
            <h2 className="rp-sub-heading" style={{ marginBottom: "0.5rem" }}>
              {t("Add by phone number.", "Add by phone number.")}<br />
              <em>{t("They'll get an SMS invite.", "Dem go receive SMS invite.", pidgin)}</em>
            </h2>
            <p className="rp-body" style={{ marginBottom: "2rem" }}>
              {t(`Circle name: ${name || "Unnamed"}  ·  ${fmt(amount)} ${freq.toLowerCase()}  ·  Max ${maxMembers} members`, "", pidgin)}
            </p>

            <form onSubmit={addMember} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)}
                placeholder={t("08012345678", "08012345678", pidgin)}
                style={{ flex: 1, background: "var(--bg-sunken)", border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "0.65rem 1rem", fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--text-primary)", outline: "none" }} />
              <button type="submit" className="rp-btn-solid">{t("+ Add", "+ Add", pidgin)}</button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "2rem" }}>
              {members.map(m => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 0.75rem", background: "var(--bg-raised)", borderRadius: "var(--radius-sm)", border: "0.5px solid var(--border-default)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)", width: "16px" }}>{m.position}</span>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "14px", color: "var(--text-primary)" }}>{m.name}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>{m.phone}</span>
                  </div>
                  {m.id !== 1 && (
                    <button onClick={() => removeMember(m.id)} style={{ background: "none", border: "none", color: "var(--text-ghost)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "12px" }}>✕</button>
                  )}
                </div>
              ))}
              {members.length < maxMembers && (
                <div style={{ padding: "0.65rem 0.75rem", border: "0.5px dashed var(--border-default)", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)" }}>
                    {t(`${maxMembers - members.length} spots remaining`, `${maxMembers - members.length} spots remain`, pidgin)}
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="rp-btn-ghost" onClick={() => setStep(0)}>{t("← Back", "← Back", pidgin)}</button>
              <button className="rp-btn-cta" style={{ flex: 1, justifyContent: "center" }} onClick={() => setStep(2)} disabled={members.length < 2}>
                {t("Next — Set rotation →", "Next — Set rotation →", pidgin)}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Rotation */}
        {step === 2 && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
            <span className="rp-eyebrow">{t("Step 3 of 3 — Payout Order", "Step 3 of 3 — Payout Order", pidgin)}</span>
            <h2 className="rp-sub-heading" style={{ marginBottom: "0.5rem" }}>
              {t("Who gets paid first?", "Who go collect first?")}<br />
              <em>{t("You decide. Or randomise.", "You choose. Or randomise.", pidgin)}</em>
            </h2>
            <p className="rp-body" style={{ marginBottom: "1.5rem" }}>
              {t("Use ↑↓ to reorder, or randomise. This order is locked once the circle starts.", "Use ↑↓ to change order, or randomise. Order go lock once circle start.", pidgin)}
            </p>

            <button onClick={randomize} className="rp-btn-ghost" style={{ marginBottom: "1rem" }}>
              ↺ {t("Randomise order", "Randomise order", pidgin)}
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "2rem" }}>
              {members.map((m, i) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0.75rem", background: "var(--bg-raised)", borderRadius: "var(--radius-sm)", border: "0.5px solid var(--border-default)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-green)", width: "20px", fontWeight: 500 }}>{String(m.position).padStart(2, "0")}</span>
                  <span style={{ flex: 1, fontFamily: "var(--font-serif)", fontSize: "14px", color: "var(--text-primary)" }}>{m.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
                    {freq === "Weekly" ? `Week ${m.position}` : `Month ${m.position}`} · {fmt(amount * members.length)}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <button onClick={() => moveUp(m.id)} disabled={i === 0} style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", color: i === 0 ? "var(--text-ghost)" : "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "10px", lineHeight: 1 }}>↑</button>
                    <button onClick={() => moveDown(m.id)} disabled={i === members.length - 1} style={{ background: "none", border: "none", cursor: i === members.length - 1 ? "default" : "pointer", color: i === members.length - 1 ? "var(--text-ghost)" : "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "10px", lineHeight: 1 }}>↓</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="rp-btn-ghost" onClick={() => setStep(1)}>{t("← Back", "← Back", pidgin)}</button>
              <button className="rp-btn-cta" style={{ flex: 1, justifyContent: "center" }} onClick={handleCreate}>
                {t("Create Circle ↗", "Create Circle ↗", pidgin)}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
