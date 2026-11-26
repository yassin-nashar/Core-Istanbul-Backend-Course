import { prisma } from "../lib/prisma.js"; import { AppError } from "../middleware/error.middleware.js";
type Actor={id:string;role:"USER"|"ADMIN"}; const scope=(_a:Actor)=>({});
export const bookingService={
 list:(a:Actor)=>prisma.booking.findMany({where:scope(a),include:{event:true,user:{select:{id:true,name:true,email:true,role:true}}}}),
 async get(id:string,a:Actor){const row=await prisma.booking.findFirst({where:{id,...scope(a)},include:{event:true,user:{select:{id:true,name:true,email:true,role:true}}}});if(!row)throw new AppError(404,"Booking not found");return row},
 async create(eventId:string,a:Actor,requestedUserId?:string){try{return await prisma.booking.create({data:{eventId,userId:requestedUserId??a.id},include:{event:true}})}catch(e){throw new AppError(409,"Booking already exists or event is unavailable")}},
 async remove(id:string,a:Actor){const result=await prisma.booking.deleteMany({where:{id,...scope(a)}});if(result.count!==1)throw new AppError(404,"Booking not found")}
};
