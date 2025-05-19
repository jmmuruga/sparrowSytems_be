import { Router } from "express";
import { addOpenings } from "./currentOpenings.services";

const currentOpeningsRouter = Router();

currentOpeningsRouter.post('/addOpenings',(req, res) => { addOpenings(req, res);
});


 export default currentOpeningsRouter;