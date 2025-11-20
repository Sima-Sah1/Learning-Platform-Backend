
// multer configuration

import { Request } from "express";
import multer from "multer";


//  locally file store garna 
const storage = multer.diskStorage({
    // location incomming file kata rakne vanne ho 
    // cb - callback function
    // cb(error,success)

    destination : function(req:Request,file:Express.Multer.File,
        cb:any){
            cb(null,'./src/storage')

    },
    // mathi ko location deko ma rakey paxi, k name ma rakne vanne
    filename : function(req:Request,file:Express.Multer.File, cb:any){
        cb(null,Date.now() + "-" + file.originalname) 

    }
})


/*
1234 -- data.now() --> 1234-filename.pdf
filename.pdf --> multer --> location(src/storage/) --> something_filename.pdf
filename.pdf --> multer --> location(storage)--> filename-1234.pdf
*/
export {multer,storage}