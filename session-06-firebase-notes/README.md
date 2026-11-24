# Session 06 — Firebase Notes

Beginner Vite + TypeScript Notes app using the Firebase modular SDK and Cloud Firestore. Architecture: **Frontend → Firebase SDK → Cloud Firestore**.

## Run
1. Install Node 20+, Firebase CLI, then run `npm install`.
2. Copy `.env.example` to `.env` and add the web app values from Firebase Console.
3. For local development run `firebase emulators:start --only firestore`, then `npm run dev`.

The web configuration is not a secret; Security Rules protect data. Never put service-account keys in frontend code. The included rules require authenticated access for cloud use. The exercise can use the emulator with development-only test authentication.

See `EXERCISE.md` and `SOLUTION_GUIDE.md` for the 25-minute lesson and CRUD explanations.
