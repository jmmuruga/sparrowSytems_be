import { Router } from "express";
import { addsubCategory, changeSubCategoryStatus, deleteSubCategory } from "./categoryNested.services";


const categoryNestedRouter= Router();

categoryNestedRouter.post('/addsubCategory',(req, res) => { addsubCategory (req, res);
})
categoryNestedRouter.delete('/deletesubCategory/:subcategoryid',(req, res) => {  deleteSubCategory (req, res);
})

categoryNestedRouter.post('/changesubstatus',(req, res) => { changeSubCategoryStatus (req, res);
})





export default categoryNestedRouter;