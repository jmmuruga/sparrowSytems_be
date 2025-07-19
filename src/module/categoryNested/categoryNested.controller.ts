import { Router } from "express";
import { addsubCategory, changeSubCategoryStatus, deleteSubCategory } from "./categoryNested.services";
import { auth } from "../../shared/helper";



const categoryNestedRouter = Router();

categoryNestedRouter.post('/addsubCategory', auth, (req, res) => {
    addsubCategory(req, res);
})
categoryNestedRouter.delete('/deletesubCategory/:subcategoryid/:userId',auth, (req, res) => {
    deleteSubCategory(req, res);
})
categoryNestedRouter.post('/changesubstatus', auth, (req, res) => {
    changeSubCategoryStatus(req, res);
})





export default categoryNestedRouter;