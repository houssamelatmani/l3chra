import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

const dataSchema = new Schema(
  {
    titre: String,
    description: String,
    username:String,
    montant:{type:Number,default:0},
    equipe:{type:[String],default:undefined},
    time:{type:Date,default:Date.now()},
    
  },
  {
    timestamps: true,
  }
);

const Data = mongoose.models.Data || mongoose.model("Data", dataSchema);

export default Data;
