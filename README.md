# Nicolas Delgado — Portfolio

Personal portfolio site for Nicolas Delgado, full-stack software engineer.

Live site: [Nicky10.github.io/ReactPortfolio](https://Nicky10.github.io/ReactPortfolio)

## Stack

- React 16 (Create React App)
- Sass
- Bootstrap / React Bootstrap (modals, badges)
- Content driven by JSON (`public/res_primaryLanguage.json`, `public/res_secondaryLanguage.json`, `public/portfolio_shared_data.json`)
- English / French UI toggle

## Featured work

- [Immiland Sign](https://immiland-sign-384917653933.us-central1.run.app/) — multi-tenant e-signature platform
- [PIE Placement Test](https://app.planetaimmilandeducation.com/) — language placement exams & scoring
- [Affiliate Agency Hub](https://affiliates-pie-615391055837.us-central1.run.app/) — partner portal for agencies
- [Immiland Foundation](https://immilandfoundation.com/) — humanitarian missions, donations & transparency
- [Consultation Booking](https://en.immilandcanada.com/law/revision-previa-a-envio) — Calendly-style scheduling with Stripe & Google Calendar

## Contact form (Apps Script)

1. Open [Google Apps Script](https://script.google.com) → New project
2. Paste `apps-script/ContactForm.gs`
3. Deploy → New deployment → Web app  
   - Execute as: **Me**  
   - Who has access: **Anyone**
4. Copy the Web App URL into `public/portfolio_shared_data.json` → `basic_info.contact_form_endpoint`
5. Redeploy / refresh the portfolio

The form sends name + email to the script, which emails the visitor a professional intro (EN/FR) with your phone, email, LinkedIn, and GitHub. Replies go to you (`replyTo` + BCC).

## Develop

```bash
npm install
npm start
```

App runs at `http://localhost:3000/ReactPortfolio` (see `homepage` in `package.json`).

## Build & deploy (GitHub Pages)

```bash
npm run build
npm run deploy
```

## Project structure

- `src/components/` — UI sections (Header, About, Projects, Skills, Experience, …)
- `public/images/portfolio/` — project screenshots
- `public/*.json` — copy, projects, experience, skills (EN + FR)
