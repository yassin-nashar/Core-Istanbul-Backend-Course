BEGIN;

CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';
ALTER TABLE "Ticket" ADD COLUMN "ownerId" TEXT;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Ticket" WHERE "ownerId" IS NULL) THEN
    RAISE EXCEPTION 'Ticket ownership backfill required before applying the RBAC migration';
  END IF;
END $$;

ALTER TABLE "Ticket" ALTER COLUMN "ownerId" SET NOT NULL;
CREATE INDEX "Ticket_ownerId_idx" ON "Ticket"("ownerId");
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
