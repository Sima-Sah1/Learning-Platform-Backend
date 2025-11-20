import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import User from "../database/models/user.model"
import { IExtendedRequest } from "./type"




const isLoggedIn = async (req:IExtendedRequest ,res:Response,next:NextFunction)=>{

        //check if login or not
        //token accept
        const token = req.headers.authorization //jwt
    
        //verify garne
        if(!token){
            res.status(401).json({
                message : "Please provide token"
            })
            return
        }
        jwt.verify(token,'thisissecret',async (erroraayo,resultaayo : any )=>{
            if(erroraayo){
                res.status(403).json({
                    message : "Token  is invalid"
                })
            }else{
                //verified vayo
                //console.log(resultaayo,"Result aayo")
                const userData = await User.findByPk(resultaayo.id,{
                    attributes : ['id', 'currentInstituteNumber']
                })

                /*
                 aaba userData ma 
                id ra currentInstituteNumber matra basna vayo
            
                */
                
                
                
                if(!userData){
                    res.status(403).json({
                        message : "No user with that id, invalid token"
                    })
                }else{
                    req.user = userData
                    next()
                }
            }
        })
       
    }
    // static restrictTo(req:Request,res:Response){

    // }


export default isLoggedIn