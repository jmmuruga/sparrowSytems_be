import { Router } from "express";
import { newUser } from "./userDetails.service";
// import { auth } from "../../shared/helper";
const userDetailRouter = Router();

userDetailRouter.post('/newUser',(req, res) => { newUser(req, res);
});


export default userDetailRouter;
