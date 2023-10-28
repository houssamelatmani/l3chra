import Data from "../../models/data"
import connectToMongoDb from "../../lib/mongodb"

import type { NextApiRequest, NextApiResponse } from 'next'
type ResponseData = {
    message: string,
    data:object
  }
export default async function AddData(req:NextApiRequest,res:NextApiResponse<ResponseData>){
    try{
        const newData =  req.body
        await connectToMongoDb();
        const data = await Data.create(newData);
        if(!data){
            return res.status(400).json({message:"not created !!!" , data})
        }
            return res.status(200).json({message:"created succesfully" , data})
    }catch(err){
        console.error(err)
    }
}