

import express, {Router} from 'express'
import isLoggedIn from '../../../middleware/middleware'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import { createCategory, delateCategory, getCategories } from '../../../controller/category/categoryController'



const router:Router = express.Router()

router.route("/").post(isLoggedIn,asyncErrorHandler(createCategory))
.get(isLoggedIn,asyncErrorHandler(getCategories))

router.route("/:id").delete(isLoggedIn,asyncErrorHandler(delateCategory))
export default router ;
