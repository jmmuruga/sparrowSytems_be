import { Router } from "express";
import { addNewEvent, changeStatusEvent, deleteEvent, getEventDetails } from "./event.service";
import { auth } from "../../shared/helper";


const eventRouter = Router();

eventRouter.post('/addNewEvent', auth, (req, res) => { addNewEvent(req, res)});
eventRouter.get('/getEventDetails', (req, res) => { getEventDetails(req, res)});
eventRouter.delete('/deleteEvent/:eventid/:userId',auth, (req, res) => { deleteEvent(req, res)});
eventRouter.post('/changeStatusEvent',auth, (req, res) => { changeStatusEvent(req, res)});

export default eventRouter;
