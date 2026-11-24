# Session 06 — Firebase Notes

Beginner Vite + TypeScript Notes app using the Firebase modular SDK and Cloud Firestore. Architecture: **Frontend → Firebase SDK → Cloud Firestore**.

## Run
1. Install Node 20+, Firebase CLI, then run `npm install`.
2. Copy `.env.example` to `.env` and add the web app values from Firebase Console.
3. For local development run `firebase emulators:start --only firestore`, then `npm run dev`.

The web configuration is not a secret; Security Rules protect data. Never put service-account keys in frontend code. The included rules require authenticated access for cloud use. The exercise can use the emulator with development-only test authentication.

See `EXERCISE.md` and `SOLUTION_GUIDE.md` for the 25-minute lesson and CRUD explanations.

## Firebase Console setup (English)

1. Open [Firebase Console](https://console.firebase.google.com), choose **Add project**, enter a project name, and finish the wizard. Google Analytics is optional for this exercise.
2. In **Build → Firestore Database**, choose **Create database**, select a region, and start in production mode. The rules in `firestore.rules` protect cloud data; never use unrestricted public read/write rules.
3. In **Build → Authentication → Sign-in method**, enable **Anonymous**. The sample is intentionally kept simple for beginners; production apps should use an appropriate sign-in provider.
4. In **Project settings → Your apps**, click the Web icon (`</>`), register an app, and copy its Firebase configuration values.
5. Copy `.env.example` to `.env` and paste the Web App values into the matching `VITE_FIREBASE_*` variables. Keep `.env` private and do not commit it.
6. Install dependencies with `npm install`, then run `npm run dev`. For local-only work, keep `VITE_USE_FIRESTORE_EMULATOR=true` and start `firebase emulators:start --only firestore` in another terminal.
7. For cloud testing, set `VITE_USE_FIRESTORE_EMULATOR=false`, deploy rules with `firebase deploy --only firestore:rules`, and reload the app. Confirm that empty inputs are rejected and notes remain after refresh.

## إعداد Firebase من لوحة التحكم (العربي)

1. افتح [Firebase Console](https://console.firebase.google.com)، اختر **Add project**، اكتب اسم المشروع وأكمل الخطوات. تفعيل Google Analytics اختياري.
2. من **Build → Firestore Database** اضغط **Create database**، اختر المنطقة، وابدأ بوضع **Production mode**. ملف `firestore.rules` يحمي بيانات السحابة؛ لا تستخدم قواعد قراءة وكتابة عامة ومفتوحة.
3. من **Build → Authentication → Sign-in method** فعّل طريقة **Anonymous**. استخدمناها لتبسيط التمرين، أما في المشاريع الحقيقية فاختر طريقة تسجيل مناسبة.
4. من **Project settings → Your apps** اضغط أيقونة الويب (`</>`)، سجّل تطبيقاً جديداً، وانسخ قيم إعداد Firebase الظاهرة.
5. انسخ `.env.example` إلى ملف اسمه `.env` وضع القيم في المتغيرات المطابقة `VITE_FIREBASE_*`. لا ترفع ملف `.env` إلى GitHub.
6. ثبّت الحزم بواسطة `npm install` ثم شغّل `npm run dev`. للتطوير المحلي اترك `VITE_USE_FIRESTORE_EMULATOR=true` وشغّل `firebase emulators:start --only firestore` في نافذة طرفية ثانية.
7. للتجربة على Firestore الحقيقي غيّر القيمة إلى `VITE_USE_FIRESTORE_EMULATOR=false`، ثم نفّذ `firebase deploy --only firestore:rules` وأعد تحميل التطبيق. جرّب رفض المدخلات الفارغة وبقاء الملاحظات بعد تحديث الصفحة.

### Firebase CLI / إعداد الـ Emulator

Install the CLI once with `npm install -g firebase-tools`, then run `firebase login` and `firebase use --add` to select your project. The included `firebase.json` starts Firestore on port `8080` and the Emulator UI on port `4000`. The emulator is for development only; it does not replace production Security Rules.

ثبّت Firebase CLI مرة واحدة بالأمر `npm install -g firebase-tools`، ثم نفّذ `firebase login` و`firebase use --add` لاختيار المشروع. الملف `firebase.json` يشغّل Firestore على المنفذ `8080` وواجهة المحاكي على `4000`. المحاكي للتطوير فقط ولا يغني عن Security Rules في الإنتاج.
