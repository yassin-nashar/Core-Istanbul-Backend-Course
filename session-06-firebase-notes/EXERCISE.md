# 25-minute exercise

| Task | Time |
|---|---:|
| Firebase setup and connection | 7 min |
| Create and read notes | 8 min |
| Update notes | 5 min |
| Testing and verification | 5 min |

Configure `.env`, connect Firestore, then verify create/read/update. Stretch: implement delete confirmation and anonymous authentication. Hints: use `collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, and `serverTimestamp`.

Acceptance: notes persist after refresh, empty input is rejected, the correct document updates, and errors are visible. Debug workflow: **Read Error → Explain with AI → Propose Fix → Apply → Verify**.
