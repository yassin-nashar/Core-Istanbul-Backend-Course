import{Router}from"express";import{authenticate}from"../middleware/auth.middleware.js";import{prisma}from"../lib/prisma.js";
export const userRouter=Router();userRouter.get("/me",async(q,r)=>r.status(200).json(await prisma.user.findFirstOrThrow()));
