import Data from "../../models/data"
import connectToMongoDb from "../../lib/mongodb"

import type { NextApiRequest, NextApiResponse } from 'next'
type ResponseData = {
    message: string,
    data:object
  }
export default async function AllData(req:NextApiRequest,res:NextApiResponse<ResponseData>){
    try{
        const {username,password,newPassword} =  req.body
        await connectToMongoDb();
        const data = await Data.find({})
        if(!data){
            return res.status(400).json({message:"data not found !!!" , data})
        }
            return res.status(200).json({message:"find succesfully" , data})
    }catch(err){
        console.error(err)
    }
}