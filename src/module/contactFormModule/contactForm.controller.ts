import { Router } from "express";
import { addContactFormDetails, sendMail } from "./contactForm.service";

const contactRouter = Router()

contactRouter.post('/addContactFormDetails', (req, res) => { addContactFormDetails(req, res)});
contactRouter.post('/sendMail', (req, res) => { sendMail(req, res)});

export default contactRouter;