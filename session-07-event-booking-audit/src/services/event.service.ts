import { Prisma } from "../generated/prisma/client.js"; import { prisma } from "../lib/prisma.js"; import { AppError } from "../middleware/error.middleware.js";
export const eventService={
 list:()=>prisma.event.findMany({orderBy:{eventDate:"asc"}}),
 async get(id:string){const row=await prisma.event.findUnique({where:{id}});if(!row)throw new AppError(404,"Event not found");return row},
 create:(data:Prisma.EventCreateInput)=>prisma.event.create({data}),
 async update(id:string,data:Prisma.EventUpdateInput){try{return await prisma.event.update({where:{id},data})}catch(e){throw new AppError(404,"Event not found")}},
 async remove(id:string){if(await prisma.booking.count({where:{eventId:id}}))throw new AppError(409,"Event has existing bookings");try{await prisma.event.delete({where:{id}})}catch(e){throw new AppError(404,"Event not found")}}
};
