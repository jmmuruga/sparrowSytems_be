import { Router } from "express";
import { newUser } from "./userDetails.service";
import { getUser } from "./userDetails.service";
// import { auth } from "../../shared/helper";
const userDetailRouter = Router();

userDetailRouter.post('/newUser',(req, res) => { newUser(req, res);
});
userDetailRouter.get('/getUser',(req, res) => { getUser(req, res);
});



export default userDetailRouter;
