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

//json data -- > req.body // username,email,password
//file --> req.file // files
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
    }

}

export {registerUser}




//LOGIN/SIGNIN
//LOGOUT
//FORGOT PASSWORD
//RESET PASSWORD/ OTP
