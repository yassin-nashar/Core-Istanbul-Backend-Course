DROP TABLE "Ticket";
CREATE TABLE "Event" ("id" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT NOT NULL, "location" TEXT NOT NULL, "eventDate" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Event_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Booking" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "eventId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Booking_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Booking_userId_eventId_key" ON "Booking"("userId","eventId"); CREATE INDEX "Booking_userId_idx" ON "Booking"("userId"); CREATE INDEX "Booking_eventId_idx" ON "Booking"("eventId");
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
