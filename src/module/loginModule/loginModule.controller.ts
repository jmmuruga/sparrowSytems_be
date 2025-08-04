import { Router } from "express";
import {  addLogsWhileLogout, forgotPassword, login, sendOtp } from "./loginModule.service";

const loginModuleRouter = Router();
loginModuleRouter.post('/login', (req, res) => login(req, res));
loginModuleRouter.get('/forgotPassword/:email', (req , res) => forgotPassword(req, res));
loginModuleRouter.get('/addLogsWhileLogout/:userId' , (req, res) => addLogsWhileLogout(req, res));
loginModuleRouter.get('/sendotpfrom/:email' , (req, res) => sendOtp(req, res));

export default loginModuleRouter;