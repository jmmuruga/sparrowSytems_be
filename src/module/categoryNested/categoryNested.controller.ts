import { Router } from "express";
import { addsubCategory } from "./categoryNested.services";


const categoryNestedRouter= Router();

categoryNestedRouter.post('/addsubCategory',(req, res) => { addsubCategory (req, res);
})



export default categoryNestedRouter;