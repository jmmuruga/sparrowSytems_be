import { Router } from "express";
import { addOpenings, changeStatus, deleteOpenings, getOpenings } from "./currentOpenings.services";

const currentOpeningsRouter = Router();

currentOpeningsRouter.post('/addOpenings',(req, res) => { addOpenings(req, res);
});
currentOpeningsRouter.get('/getOpenings',(req, res) => { getOpenings(req, res);
});
currentOpeningsRouter.post('/changestatus',(req, res) => { changeStatus(req, res);
});
currentOpeningsRouter.delete("/deleteOpenings/:id/:userId", (req, res) => {
  deleteOpenings(req, res);
});


 export default currentOpeningsRouter;