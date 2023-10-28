import Data from "../../models/data"
import connectToMongoDb from "../../lib/mongodb"

import type { NextApiRequest, NextApiResponse } from 'next'
type ResponseData = {
    message: string,
    data:object
  }
export default async function DeleteData(req:NextApiRequest,res:NextApiResponse<ResponseData>){
    try{
        const {_id} =  req.body
        await connectToMongoDb();
        const data = await Data.findByIdAndDelete(_id);
        if(!data){
         return res.status(400).json({message:"not deleted !!!" , data})
        }
         return res.status(200).json({message:"deleted succesfully" , data})
    }catch(err){
        console.error(err)
    }
}