/*
REGISTER/SIGNUP
incomming data --> username , email , password
processing /checking --> email valid, compulsory data aaunu paryo 
db query --> table ma insert/read/delete/update

Backend ma 
json data ma -->req.body aauxa // username,email,password
files ma --> req.file //files like audio , video  
*/



import { Request, Response } from "express"
import User from "../../../database/models/user.model.ts"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//json data -- > req.body // username,email,password
//file --> req.file // files


/* function based 
const registerUser = async (req: Request, res: Response) => {

    //incoming data -->accept
    const { username, password, email } = req.body
    if (!username || !password || !email) {
        res.status(400).json({ // 400 in client side error
            message: "Please provide username, password , email"
        })
    } else {
        //insert into users table
        await User.create({
            username: username,
            password: password,
            email: email
        })
        res.status(200).json({
            message : "User registered successfully"
        })
    }

}

export {registerUser}
*/

class AuthController {
    static async registerUser(req: Request, res: Response) {

        if (req.body == undefined) {
            console.log("triggereed")
            res.status(400).json({
                message: "No data was sent!!"
            })
            return
        }
        const { username, password, email } = req.body
        if (!username || !password || !email) {
            res.status(400).json({
                message: "Please provide username, password, email"
            })
            return
        }
        //insert into User table
        await User.create({
            userName: username,
            password: bcrypt.hashSync(password, 12), //blowfish
            email: email,
        })
        res.status(201).json({
            message: "User registered successfully"
        })
    }


    //LOGIN/SIGNIN
    /*
    login flow : 
    email/username, password (basic)
    email , password -- data accept --> validation --> 
    // first check email exist or not (verify) --> yes --> check password now --> mil0--> 
    token generation (jsonwebtoken)
    
    --> now --> not registered 
    
    
    
    google login, fb, github (oauth)
    email login (SSO)
    
    */


    static async loginUser(req: Request, res: Response) {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).json({
                message: "Please provide email,password "
            })
            return
        }
        // check if email exist or not in our users table
        const data = await User.findAll({
            where: {
                email
            }
        })
        /*
    numbers = [1]
    numbers[0]
    data = [
    {
    email : "manish@gmail.com", 
    username : "manish", 
    password : "jldsjfslkfj3423423"
    }, 
     {
    email : "manish@gmail.com", 
    username : "manish", 
    haha : "hehe"
    }
    ]
    data[0].password 
    data[1].haha


    */
        // select * from User where email = "sima@gmail.com" AND age =  21
        if ( data.length == 0) {
            res.status(404).json({
                message: "Not registerd !!"
            })
        } else {

            // check password , nepal123 --> hash conversion --> asdfghh
            // compare(plain password user bata aako password , hashed password register huda
            //table ma baseko)

   


            const isPasswordMatch = bcrypt.compareSync(password,data[0]!.password)
            if (isPasswordMatch) {
                //login vayo , tooken generation
                const token = jwt.sign({id : data[0]!.id},"thisissecret",{
                    expiresIn : "30d"
                })
                res.status(200).json({
                    token : token,
                    message : "Logged in success"
                })
            } else {
                res.status(403).json({
                    message: "Invalid email or password"
                })
            }
        }
    }
}

export default AuthController

//LOGOUT
//FORGOT PASSWORD
//RESET PASSWORD/ OTP
