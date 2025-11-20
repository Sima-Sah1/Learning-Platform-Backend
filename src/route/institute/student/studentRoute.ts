import express, { Router } from "express";
import asyncErrorHandler from "../../../services/asyncErrorHandler";
import { getStudent } from "../../../controller/institute/student/studentController";




const router : Router = express.Router()
router.route("/")
.get(asyncErrorHandler(getStudent))

export default router