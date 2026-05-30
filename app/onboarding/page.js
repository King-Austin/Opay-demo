"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePidgin, t } from "@/contexts/PidginContext";

const DEMO_OTP = "123456";
const DEMO_PHONE = "08012345678";

export default function Onboarding() {
  const router = useRouter();
  const { pidgin, toggle } = usePidgin();
  const [screen, setScreen] = useState(0); // 0–3
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [verified, setVerified] = useState(false);
  const [opayLinked, setOpayLinked] = useState(false);

  function handlePhoneSubmit(e) {
    e.preventDefault();
    if (phone.replace(/\s/g, "").length < 10) return;
    setOtpSent(true);
  }

  function handleOtpSubmit(e) {
    e.preventDefault();
    if (otp === DEMO_OTP) {
      setOtpError("");
      setVerified(true);
      setTimeout(() => setOpayLinked(true), 1200);
      setTimeout(() => setScreen(3), 2500);
    } else {
      setOtpError(t("Wrong code. Try 123456 for this demo.", "Code wrong. Use 123456 for demo.", pidgin));
    }
  }

  const screens = [
    // 0 — Recognition (dark)
    <ScreenRecognition key={0} pidgin={pidgin} toggle={toggle} onNext={() => setScreen(1)} />,
    // 1 — Ledger proof (dark)
    <ScreenLedger key={1} pidgin={pidgin} onNext={() => setScreen(2)} />,
    // 2 — Phone + OPay (light)
    <ScreenPhone key={2} pidgin={pidgin}
      phone={phone} setPhone={setPhone}
      otp={otp} setOtp={setOtp}
      otpSent={otpSent} otpError={otpError}
      verified={verified} opayLinked={opayLinked}
      onPhoneSubmit={handlePhoneSubmit}
      onOtpSubmit={handleOtpSubmit}
    />,
    // 3 — First action (light)
    <ScreenAction key={3} pidgin={pidgin} router={router} />,
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Progress dots */}
      {screen < 3 && (
        <div style={{ position: "fixed", top: "1.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px", zIndex: 50 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: i === screen ? "20px" : "6px", height: "6px", borderRadius: "3px", background: i <= screen ? (screen < 2 ? "rgba(255,255,255,0.6)" : "var(--accent-green)") : (screen < 2 ? "rgba(255,255,255,0.2)" : "var(--border-default)"), transition: "all 0.3s ease" }} />
          ))}
        </div>
      )}
      {screens[screen]}
    </div>
  );
}

function ScreenRecognition({ pidgin, toggle, onNext }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0E0E0C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
      {/* Lang toggle */}
      <button onClick={toggle} style={{ position: "absolute", top: "1.5rem", right: "2rem", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", padding: "0.3rem 0.6rem", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-sm)", background: "transparent", color: "#5A5A52", cursor: "pointer" }}>
        {pidgin ? "EN" : "PID"}
      </button>

      <div style={{ maxWidth: "560px", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3A3A34", marginBottom: "2rem" }}>
          ◈ AjoStack
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 600, lineHeight: 0.95, letterSpacing: "-0.02em", color: "#ECEAE4", marginBottom: "1.5rem" }}>
          {t(
            <>You already<br />run an ajo.<br /><em style={{ color: "#D4A853" }}>We just made it safer.</em></>,
            <>You sabi<br />do ajo already.<br /><em style={{ color: "#D4A853" }}>We just make am better.</em></>,
            pidgin
          )}
        </h1>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "17px", lineHeight: 1.7, color: "#9A9A8E", marginBottom: "3rem", maxWidth: "36ch", margin: "0 auto 3rem" }}>
          {t(
            "AjoStack doesn't teach you something new. It runs the circle you already trust on OPay — with a Gemini AI credit score on top.",
            "AjoStack no dey teach you new thing. E just run the ajo wey you know on OPay — plus AI credit score for top.",
            pidgin
          )}
        </p>
        <button className="rp-btn-cta" onClick={onNext} style={{ fontSize: "14px", padding: "1rem 2.5rem" }}>
          {t("Show me how →", "Show me →", pidgin)}
        </button>
      </div>
    </div>
  );
}

const LEDGER_PREVIEW = [
  { member: "Chioma Obi",    amount: 5000, status: "ontime", ref: "OPY-0401-A1" },
  { member: "Adaeze Nwosu",  amount: 5000, status: "ontime", ref: "OPY-0401-A2" },
  { member: "Ify Eze",       amount: 5000, status: "ontime", ref: "OPY-0401-A3" },
  { member: "Amaka Dike",    amount: 5000, status: "late",   ref: "OPY-0405-A4" },
  { member: "Uche Onuoha",   amount: 5000, status: "ontime", ref: "OPY-0401-A5" },
];

function ScreenLedger({ pidgin, onNext }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0E0E0C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "600px", width: "100%", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
        <span className="rp-eyebrow-dark" style={{ display: "block", textAlign: "center", marginBottom: "1rem" }}>
          {t("This is what your members will see.", "This na wetin your members go see.", pidgin)}
        </span>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "#ECEAE4", lineHeight: 1, textAlign: "center", marginBottom: "2rem" }}>
          {t(
            <>Every naira. Every member.<br /><em style={{ color: "#D4A853" }}>Visible to all.</em></>,
            <>Every kobo. Every person.<br /><em style={{ color: "#D4A853" }}>Everybody fit see am.</em></>,
            pidgin
          )}
        </h2>

        {/* Mini ledger */}
        <div style={{ background: "#1A1A17", borderRadius: "var(--radius-lg)", border: "0.5px solid rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: "1.5rem" }}>
          <div style={{ padding: "0.75rem 1.25rem", borderBottom: "0.5px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#5A5A52", letterSpacing: "0.1em" }}>AWKA MARKET WOMEN · WEEK 1</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#3A3A34" }}>Apr 4, 2026</span>
          </div>
          {LEDGER_PREVIEW.map((e, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "1rem", padding: "0.75rem 1.25rem", borderBottom: i < LEDGER_PREVIEW.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "14px", color: "#ECEAE4" }}>{e.member}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#9A9A8E" }}>₦{e.amount.toLocaleString()}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: e.status === "ontime" ? "#1F4A35" : "#D4A853", background: e.status === "ontime" ? "rgba(31,74,53,0.15)" : "rgba(212,168,83,0.12)", padding: "0.15rem 0.4rem", borderRadius: "3px" }}>
                {e.status === "ontime" ? "✓ On Time" : "⚠ Late"}
              </span>
            </div>
          ))}
          <div style={{ padding: "0.6rem 1.25rem", background: "rgba(31,74,53,0.06)", borderTop: "0.5px solid rgba(31,74,53,0.2)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#1F4A35", letterSpacing: "0.05em" }}>
              {t("OPay refs stored. Auditable by every member.", "OPay refs dey stored. Everybody fit audit am.", pidgin)}
            </span>
          </div>
        </div>

        <p style={{ fontFamily: "var(--font-serif)", fontSize: "15px", color: "#7A7A68", textAlign: "center", lineHeight: 1.7, marginBottom: "2rem" }}>
          {t(
            "No more confronting the organiser. No more 'I don't know where the money went.' The ledger is the authority.",
            "No more e don go with the money. No more 'I no know watin happen'. The ledger na the boss.",
            pidgin
          )}
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="rp-btn-cta" onClick={onNext} style={{ fontSize: "14px", padding: "1rem 2.5rem" }}>
            {t("That's the whole system. →", "Simple as that. →", pidgin)}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenPhone({ pidgin, phone, setPhone, otp, setOtp, otpSent, otpError, verified, opayLinked, onPhoneSubmit, onOtpSubmit }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "440px", width: "100%" }}>
        <span className="rp-eyebrow">{t("One step. Then you're in.", "One step. E done.", pidgin)}</span>
        <h2 className="rp-sub-heading" style={{ marginBottom: "2rem" }}>
          {t("Your phone number.", "Your phone number.")} <em>{t("That's your identity.", "Na your identity.", pidgin)}</em>
        </h2>

        {!otpSent ? (
          <form onSubmit={onPhoneSubmit}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
              {t("Phone number (OPay registered)", "Phone number (OPay number)", pidgin)}
            </p>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "var(--bg-sunken)", border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--text-muted)", flexShrink: 0 }}>+234</div>
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="0801 234 5678" autoFocus
                style={{ flex: 1, background: "var(--bg-sunken)", border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", fontSize: "16px", letterSpacing: "0.06em", color: "var(--text-primary)", outline: "none" }}
              />
            </div>
            <button className="rp-btn-cta" type="submit" style={{ width: "100%", justifyContent: "center", fontSize: "14px" }}>
              {t("Send OTP →", "Send code →", pidgin)}
            </button>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)", textAlign: "center", marginTop: "1rem", letterSpacing: "0.03em" }}>
              {t("We'll send a 6-digit code via SMS. No email needed.", "We go send 6-digit code by SMS. No email needed.", pidgin)}
            </p>
          </form>
        ) : !verified ? (
          <form onSubmit={onOtpSubmit}>
            <div className="rp-card-tinted" style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-green)" }}>
                {t(`Code sent to ${phone || "0801 234 5678"} — demo code: 123456`, `Code don go to ${phone || "0801 234 5678"} — demo code: 123456`, pidgin)}
              </p>
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
              {t("Enter 6-digit OTP", "Enter 6-digit code", pidgin)}
            </p>
            <input
              type="text" value={otp} onChange={e => setOtp(e.target.value)}
              placeholder="123456" maxLength={6} autoFocus
              style={{ width: "100%", background: "var(--bg-sunken)", border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "0.9rem 1rem", fontFamily: "var(--font-mono)", fontSize: "22px", letterSpacing: "0.25em", textAlign: "center", color: "var(--text-primary)", marginBottom: "0.75rem", outline: "none" }}
            />
            {otpError && <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-red)", marginBottom: "0.75rem" }}>{otpError}</p>}
            <button className="rp-btn-cta" type="submit" style={{ width: "100%", justifyContent: "center" }}>
              {t("Verify →", "Verify →", pidgin)}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
              {[
                { label: t("Phone verified", "Phone verified", pidgin), done: true },
                { label: t("Linking OPay wallet ****5678", "Linking OPay wallet ****5678", pidgin), done: opayLinked },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", border: "0.5px solid", borderColor: s.done ? "var(--accent-green)" : "var(--border-default)", background: s.done ? "var(--accent-green-tint)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.4s ease" }}>
                    {s.done ? <span style={{ color: "var(--accent-green)", fontSize: "12px" }}>✓</span> : <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--border-default)", display: "block" }} />}
                  </div>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "15px", color: s.done ? "var(--text-primary)" : "var(--text-ghost)" }}>{s.label}</span>
                </div>
              ))}
            </div>
            {opayLinked && (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", animation: "fadeUp 0.4s ease forwards" }}>
                {t("Taking you to your first circle...", "E dey take you to your first circle...", pidgin)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ScreenAction({ pidgin, router }) {
  const [code, setCode] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "540px", width: "100%", textAlign: "center", animation: "fadeUp 0.5s ease forwards" }}>
        <span className="rp-eyebrow" style={{ display: "block", justifyContent: "center" }}>
          {t("You're ready.", "You don ready.", pidgin)}
        </span>
        <h2 className="rp-sub-heading" style={{ marginBottom: "0.5rem" }}>
          {t("Join a circle or ", "Join a circle or ")}<em>{t("start one.", "start your own.", pidgin)}</em>
        </h2>
        <p className="rp-body" style={{ margin: "0 auto 2.5rem", textAlign: "center" }}>
          {t("Got an invite code from your organiser? Enter it below. Or create your own circle.", "Your organiser give you code? Enter am. Or start your own circle.", pidgin)}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          {/* Join */}
          <div className="rp-card-raised" style={{ textAlign: "left" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: "0.75rem" }}>
              {t("Have a code?", "You get code?", pidgin)}
            </p>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "1rem", lineHeight: 1.2 }}>
              {t("Join an existing circle.", "Join circle wey dey exist.", pidgin)}
            </h3>
            <input
              type="text" value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="AWK-001"
              style={{ width: "100%", background: "var(--bg-sunken)", border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "0.6rem 0.75rem", fontFamily: "var(--font-mono)", fontSize: "14px", letterSpacing: "0.1em", color: "var(--text-primary)", marginBottom: "0.75rem", outline: "none" }}
            />
            <button
              className="rp-btn-cta"
              style={{ width: "100%", justifyContent: "center", fontSize: "12px", padding: "0.75rem 1rem" }}
              onClick={() => router.push(`/join/${code || "AWK-001"}`)}
            >
              {t("Find circle →", "Find circle →", pidgin)}
            </button>
          </div>

          {/* Create */}
          <div className="rp-card-raised" style={{ textAlign: "left" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: "0.75rem" }}>
              {t("No code yet?", "No code yet?", pidgin)}
            </p>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "1rem", lineHeight: 1.2 }}>
              {t("Create your own circle.", "Create your own circle.", pidgin)}
            </h3>
            <p className="rp-body" style={{ fontSize: "13px", marginBottom: "1rem" }}>
              {t("Set the rules once. The platform enforces them.", "Set rules once. Platform go enforce am.", pidgin)}
            </p>
            <button
              className="rp-btn-ghost"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => router.push("/create")}
            >
              {t("Create circle →", "Create circle →", pidgin)}
            </button>
          </div>
        </div>

        <button
          style={{ background: "none", border: "none", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-ghost)", cursor: "pointer", letterSpacing: "0.05em" }}
          onClick={() => router.push("/app/dashboard")}
        >
          {t("Skip — take me to dashboard", "Skip — take me to dashboard", pidgin)}
        </button>
      </div>
    </div>
  );
}
