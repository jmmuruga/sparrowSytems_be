import { Router } from "express";
import { addOpenings, changeStatus, deleteOpenings, getOpenings } from "./currentOpenings.services";
import { auth } from "../../shared/helper";


const currentOpeningsRouter = Router();

currentOpeningsRouter.post('/addOpenings', auth,(req, res) => { addOpenings(req, res);
});
currentOpeningsRouter.get('/getOpenings',(req, res) => { getOpenings(req, res);
});
currentOpeningsRouter.post('/changestatus',auth,(req, res) => { changeStatus(req, res);
});
currentOpeningsRouter.delete("/deleteOpenings/:id/:userId",auth, (req, res) => {
  deleteOpenings(req, res);
});


 export default currentOpeningsRouter;