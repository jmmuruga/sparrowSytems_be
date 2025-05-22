import { Router } from "express";
import { addNewEvent, changeStatusEvent, deleteEvent, getEventDetails } from "./event.service";

const eventRouter = Router();

eventRouter.post('/addNewEvent', (req, res) => { addNewEvent(req, res)});
eventRouter.get('/getEventDetails', (req, res) => { getEventDetails(req, res)});
eventRouter.delete('/deleteEvent/:eventid', (req, res) => { deleteEvent(req, res)});
eventRouter.post('/changeStatusEvent', (req, res) => { changeStatusEvent(req, res)});

export default eventRouter;
