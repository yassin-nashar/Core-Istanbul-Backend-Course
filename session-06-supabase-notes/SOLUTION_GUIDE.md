# Solution guide

Supabase exposes PostgreSQL through its JS client: `select` reads rows, `insert` creates, `update().eq` changes one, and `delete().eq` removes one. SQL constraints validate input and RLS controls access. Unlike Firebase documents, Supabase uses relational tables, SQL, and PostgreSQL timestamps.
