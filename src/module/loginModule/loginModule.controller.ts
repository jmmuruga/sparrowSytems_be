import { Router } from "express";
import { forgotPassword, login, resetNewPassword } from "./loginModule.service";

const loginModuleRouter = Router();
loginModuleRouter.get('/login/:email/:password', (req, res) => login(req, res));
loginModuleRouter.post('/forgotPassword/:e_mail', (req, res) => forgotPassword(req, res));
loginModuleRouter.post('/resetNewPassword', (req, res) => resetNewPassword(req, res));
export default loginModuleRouter;