import { Router } from "express";
import {  addLogsWhileLogout, forgotPassword, login } from "./loginModule.service";

const loginModuleRouter = Router();
loginModuleRouter.get('/login/:email/:password', (req, res) => login(req, res));
loginModuleRouter.get('/forgotPassword/:email', (req , res) => forgotPassword(req, res));
loginModuleRouter.get('/addLogsWhileLogout/:userId' , (req, res) => addLogsWhileLogout(req, res));
export default loginModuleRouter;