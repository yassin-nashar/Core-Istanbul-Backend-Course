# Solution Guide — RBAC and Resource Ownership

## Authentication versus authorization

Authentication validates the JWT and identifies a current user. Authorization runs afterward and decides whether that user may perform the requested action. A valid token therefore does not automatically grant access to every operation.

## RBAC

Prisma defines `UserRole` with `USER` and `ADMIN`; `USER` is the database default. Public registration never maps a client role. `authenticate` verifies the JWT, then loads the user's current role from PostgreSQL. `authorizeRoles(...roles)` fails closed: missing identity returns 401 and a disallowed role returns 403.

The delete route composes `authenticate`, then `authorizeRoles("ADMIN")`. Other ticket routes allow both known roles and leave record-level policy to the service.

## Ownership

Every Ticket has a required indexed `ownerId` foreign key. Creation always writes `ownerId: request.user.id`. Zod strips client-supplied ownership fields, so normal create/update operations cannot transfer a ticket.

Ownership belongs in the service layer because it is business policy shared independently of HTTP details. More importantly, USER mutations include ownership in the Prisma query itself:

```ts
prisma.ticket.updateMany({
  where: { id, ownerId: user.id },
  data: input,
});
```

This avoids first checking ownership and then executing an unrestricted update. Reading another user's ticket and updating it both return 404, preventing resource enumeration. ADMIN queries intentionally operate across owners.

## Changes from the authentication project

- Added `UserRole` and `User.role`.
- Added the Ticket-to-User ownership relation and index.
- Authentication now retrieves the current database role.
- Added reusable role middleware.
- Controllers pass the authenticated identity to TicketService.
- TicketService applies list/read/update ownership predicates.
- DELETE is ADMIN-only.
- Seed data provides one ADMIN, two USER accounts, and owned tickets.
- Tests and Postman demonstrate the complete permission matrix.

Authentication token behavior—Argon2id passwords, short JWTs, rotating hashed refresh tokens, reuse detection, secure cookies, and logout—remains unchanged.
