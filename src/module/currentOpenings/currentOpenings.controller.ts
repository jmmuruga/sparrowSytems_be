import { Router } from "express";
import { addOpenings, getOpenings } from "./currentOpenings.services";

const currentOpeningsRouter = Router();

currentOpeningsRouter.post('/addOpenings',(req, res) => { addOpenings(req, res);
});
currentOpeningsRouter.get('/getOpenings',(req, res) => { getOpenings(req, res);
});


 export default currentOpeningsRouter;