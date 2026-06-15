# AjoStack — Shareable Deliverables

## 📄 PDF walkthrough
**[AjoStack-Walkthrough.pdf](./AjoStack-Walkthrough.pdf)** — a 10-page captioned walkthrough
(cover + all 9 screens) of the working prototype. Open/share this directly.

## ▶️ Run the live prototype
```bash
npm install      # first time only
npm run dev      # then open http://localhost:3000
```
Suggested click-through for a demo:
`/onboarding` → `/app/dashboard` → `/app/group/awka` (the transparent ledger) →
`/app/score` → `/app/loan` → `/ussd` (the *347# fallback).

## What this is — and isn't
This is a **functional front-end prototype** running on mock data
([data/mock.js](./data/mock.js)). Every contribution, payout, OTP, AjoScore, and
loan is simulated client-side. There is **no live OPay integration, backend, or
database** yet — the OPay rails, webhooks, and Gemini calls are represented in the
UI but not wired to real services.

## Links
- Live demo (if deployed): _add your Vercel URL here_
- Repo: _add your git remote here_
