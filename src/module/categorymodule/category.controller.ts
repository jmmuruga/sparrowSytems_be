import { Router } from "express";
import { addCategory, getCategory } from "./category.service";
 

const categoryRouter= Router();

categoryRouter.post('/addCategory',(req, res) => { addCategory (req, res);
})
categoryRouter.get('/addCategory',(req, res) => { getCategory (req, res);
})



export default categoryRouter;