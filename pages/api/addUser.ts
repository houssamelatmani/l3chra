import User from "../../models/user"
import connectToMongoDb from "../../lib/mongodb"

import type { NextApiRequest, NextApiResponse } from 'next'
type ResponseData = {
    message: string,
    data:object
  }
export default async function AddUser(req:NextApiRequest,res:NextApiResponse<ResponseData>){
    try{
        const {username,password,newPassword} =  req.body
        await connectToMongoDb();
        const user = await User.findOne({username})
        if(user){
            return res.status(400).json({message:"user already exist !!!" , data:{}})
        }
        const newUser = await User.create({username,password,newPassword})
        return res.status(200).json({message:"created succesfully" , data:newUser})

    }catch(err){
        console.error(err)
    }
    }