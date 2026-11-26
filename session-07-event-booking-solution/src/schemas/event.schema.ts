import { z } from "zod";
const text=z.string().trim().min(1);
export const eventIdSchema=z.object({id:z.uuid()});
export const createEventSchema=z.object({title:text,description:text,location:text,eventDate:z.iso.datetime().transform(v=>new Date(v))});
export const updateEventSchema=createEventSchema.partial().refine(v=>Object.keys(v).length>0,"Provide at least one field to update");
export const createBookingSchema=z.object({eventId:z.uuid()});
