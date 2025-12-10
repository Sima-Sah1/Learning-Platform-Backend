
// const upload = multer({storage : storage})

import { Request } from 'express';
import {cloudinary,storage} from './../services/cloudinaryConfig'
import multer from "multer";
const upload = multer({storage:storage,

fileFilter : (req:Request,file:Express.Multer.File,cb)=>{
    const allowedFileTypes = ['image/png','image/jpeg','image/jpg']
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error("Only image support garxa haii !"))
    }
},
limits : {
    fileSize : 4 * 1024 * 1024 //2mb
}

})

export default upload