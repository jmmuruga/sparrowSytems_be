import { Router } from "express";
import { deleteUser, newUser, sendOtpInEmail, updatePassword } from "./userDetails.service";
import { getUser } from "./userDetails.service";
// import { auth } from "../../shared/helper";
const userDetailRouter = Router();

userDetailRouter.post('/newUser',(req, res) => { newUser(req, res);
});
userDetailRouter.get('/getUser',(req, res) => { getUser(req, res);
});
userDetailRouter.delete('/deleteuser/:userid',(req, res) => { deleteUser(req, res);
});

userDetailRouter.delete('/deleteuser/:userid',(req, res) => { deleteUser(req, res);
});

userDetailRouter.put('/updatePassword',(req, res) => {updatePassword(req, res); });
userDetailRouter.get('/otpgeneration/:email',(req, res) => {sendOtpInEmail(req, res); });




export default userDetailRouter;
