import express , {Request,Router } from "express";
import isLoggedIn from "../../../middleware/middleware";
import asyncErrorHandler from "../../../services/asyncErrorHandler";
import {createCourseTable, deleteCourse, getAllCourse, getSingleCourse } from "../../../controller/institute/course/courseController";
import upload from "../../../middleware/multerUpload";

// import{multer,storage} from "../../../middleware/multerMiddlerware"




const router : Router = express.Router()

//fieldname -- frontend/postman bata chai k name aairaxa.file vanne kura
router.route("/")
.post(isLoggedIn,upload.single("courseThumbnail"),
 asyncErrorHandler(createCourseTable))
.get(isLoggedIn,asyncErrorHandler(getAllCourse))

router.route("/:id")
.get(asyncErrorHandler(getSingleCourse))
.delete(isLoggedIn,asyncErrorHandler(deleteCourse))


export default router