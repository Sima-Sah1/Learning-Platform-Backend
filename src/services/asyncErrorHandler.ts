import { NextFunction, Request, Response } from "express"



 const asyncErrorHandler = (fn:Function)=>{
    return (req :Request, res:Response, next:NextFunction)=>{
        fn(req,res,next).catch((err: Error)=>{
            console.log(err, "ERROR")
            return res.status(500).json({
                message : err.message,
                fullError : err
            })
        })
    }
}

export default asyncErrorHandler



/*


Higher order function --> testo function jasle parameter ma arko function accept garxa 
call back function --> tyo function jun as a parameter/argument arko function ma gayiraxa
e.g, 
filter , map, reduce, foreach
arrays. forEach(function){
}

*/