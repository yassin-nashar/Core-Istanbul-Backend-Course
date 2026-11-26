import type {RequestHandler} from "express"; import {createEventSchema,eventIdSchema,updateEventSchema} from "../schemas/event.schema.js"; import {eventService} from "../services/event.service.js";
export const listEvents:RequestHandler=async(_q,r)=>r.status(200).json(await eventService.list());
export const getEvent:RequestHandler=async(q,r)=>r.status(200).json(await eventService.get(eventIdSchema.parse(q.params).id));
export const createEvent:RequestHandler=async(q,r)=>r.status(201).json(await eventService.create(createEventSchema.parse(q.body)));
export const updateEvent:RequestHandler=async(q,r)=>r.status(200).json(await eventService.update(eventIdSchema.parse(q.params).id,updateEventSchema.parse(q.body)));
export const deleteEvent:RequestHandler=async(q,r)=>{await eventService.remove(eventIdSchema.parse(q.params).id);r.status(204).send()};
