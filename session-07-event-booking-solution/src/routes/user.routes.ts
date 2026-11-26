import{Router}from"express";import{authenticate}from"../middleware/auth.middleware.js";import{prisma}from"../lib/prisma.js";
export const userRouter=Router();userRouter.get("/me",authenticate,async(q,r)=>r.status(200).json(await prisma.user.findUniqueOrThrow({where:{id:q.user!.id},select:{id:true,name:true,email:true,role:true,createdAt:true,updatedAt:true}})));
