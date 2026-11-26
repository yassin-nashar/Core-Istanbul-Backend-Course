import type {RequestHandler} from "express"; import {createBookingSchema,eventIdSchema} from "../schemas/event.schema.js"; import {bookingService} from "../services/booking.service.js";
export const listBookings:RequestHandler=async(q,r)=>r.status(200).json(await bookingService.list(q.user!));
export const getBooking:RequestHandler=async(q,r)=>r.status(200).json(await bookingService.get(eventIdSchema.parse(q.params).id,q.user!));
export const createBooking:RequestHandler=async(q,r)=>{const input=createBookingSchema.parse(q.body);r.status(201).json(await bookingService.create(input.eventId,q.user!,input.userId))};
export const deleteBooking:RequestHandler=async(q,r)=>{await bookingService.remove(eventIdSchema.parse(q.params).id,q.user!);r.status(204).send()};
