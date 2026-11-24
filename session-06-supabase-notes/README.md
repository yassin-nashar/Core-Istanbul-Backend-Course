# Session 06 — Supabase Notes

Notes app using Vite, TypeScript, Supabase JS, and hosted PostgreSQL. **Frontend → Supabase SDK → Postgres.**

## Setup (English)
1. In [Supabase Dashboard](https://supabase.com/dashboard) choose **New project**, select an organization, name, region, and database password.
2. Open **SQL Editor**, paste `supabase.sql`, and click **Run**. It creates `notes` and demo RLS policies. These anonymous policies are for class use only; production apps need authenticated ownership policies.
3. Open **Project Settings → API**. Copy **Project URL** and the public **anon key** into `.env` copied from `.env.example`.
4. Run `npm install`, then `npm run dev`.

## الإعداد بالعربي
1. افتح [Supabase Dashboard](https://supabase.com/dashboard)، اختر **New project** وحدد المؤسسة والاسم والمنطقة وكلمة مرور قاعدة البيانات.
2. افتح **SQL Editor** والصق محتوى `supabase.sql` واضغط **Run**. ينشئ جدول `notes` وقواعد RLS تجريبية. هذه القواعد للتدريب فقط؛ في الإنتاج استخدم سياسات ملكية للمستخدمين المسجلين.
3. من **Project Settings → API** انسخ **Project URL** و **anon key** العام إلى ملف `.env` بعد نسخ `.env.example`.
4. نفّذ `npm install` ثم `npm run dev`.

لا ترفع مفاتيح service-role إلى GitHub. مفتاح anon مخصص للواجهة، لكن RLS هو الذي يحمي البيانات.
