import { User } from "../models/user.js";
import bcrypt from "bcrypt"
import { sendcookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";


 export const register = async(req,res,next)=>{

    try {
        const {name,email,password} = req.body;

    let user = await User.findOne({email});

    if(user) return next(new ErrorHandler("User already exists",400));
       
    const hashPassword = await bcrypt.hash(password,10);
    user = await User.create({
        name,
        email,
        password:hashPassword,
    })

    sendcookie(user,res,"Registered Successfully",201);
        
    } catch (error) {
        next(error);
    }
}

export const login = async(req,res,next)=>{

    try {
        
    const {email, password} = req.body;

   const user = await User.findOne({email}).select("+password");

   if(!user) return next(new ErrorHandler("Invalid email or password",400));
        

   const isMatch = await bcrypt.compare(password,user.password);

   if(!isMatch) return next(new ErrorHandler("Invalid email or password",404));
       
   sendcookie(user,res,`welcome back, ${user.name}`,200);
    } catch (error) {
        next(error);
    }

}

export const logout = (req,res)=>{
    res.status(200).cookie("token","",{
        expires:new Date(Date.now()),
        sameSite:"none",
        secure:true,
    }).json({
        success:true,
        message:"Logout successfully"
    })
}

export const getMyProfile = (req,res)=>{

    res.status(200).json({
        success:true,
        user:req.user,
    })
    
}