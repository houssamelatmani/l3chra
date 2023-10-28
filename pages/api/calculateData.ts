import Data from "../../models/data";
import connectToMongoDb from "../../lib/mongodb";

import type { NextApiRequest, NextApiResponse } from "next";
type ResponseData = {
  message: string;
  data: object;
};
export default async function CalculateData(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { username } = req.body.data;
    await connectToMongoDb();
    const data = await Data.find({});

    //get usernames
    let usernames: string | any[] = [];
    for (let elm of data) {
      if (!usernames.includes(elm.username)) {
        usernames.push(elm.username);
      }
    }

    //get equipes
    let equipes: string | any[] = [];
    for (let elm of data) {
      if (!equipes.includes(JSON.stringify(elm.equipe.sort()))) {
        equipes.push(JSON.stringify(elm.equipe.sort()));
      }
    }

    //get total of every username in every equipe
    let totOfUserInEveryEquipe = [];

    for (let username of usernames) {
      for (let equipe of equipes) {
        let somme = 0;

        data
          .filter((val) => {
            return (
              val.username === username &&
              JSON.stringify(val.equipe.sort()) === equipe
            );
          })
          .map((val) => {
            somme += val.montant;
          });

        totOfUserInEveryEquipe.push({ username, equipe: equipe, somme });
      }
    }

    totOfUserInEveryEquipe = totOfUserInEveryEquipe.filter((elm) =>
      JSON.parse(elm.equipe).includes(elm.username)
    );

    //total of every equipe
    let totOfEveryEquipe: string | any[] = [];
    for (let i of equipes) {
      let somme = 0;
      for (let j of totOfUserInEveryEquipe) {
        if (i === j.equipe) {
          somme += j.somme;
        }
      }
      totOfEveryEquipe.push({ equipe: i, total: somme });
    }
    
    
    let finalResult: string | any[] = [];
    for (let e of equipes) {
      for (let i of usernames) {
        let somme=0
        for (let j of totOfUserInEveryEquipe) {
          if (i === j.username && e===j.equipe) {
                somme+=j.somme
          }
        }
        let tot = totOfEveryEquipe.filter(a=>a.equipe===e)
        finalResult.push({username:i,equipe:e,somme,total:tot[0].total})

      }
    }

    // for(let elm of equipes){
    //   let var1: string | any = {};
    //   for(let els of finalResult){
    //     if(els.equipe===elm){
    //       console.log(els.somme)

    //       if(isNaN(var1[els.username])){
    //         var1[els.username]=0
    //       }else{
    //         var1[els.username] += els.somme
    //       }
          
    //     }
    //   }
    // }
    //result ={equipe:...,moyenne:.....,total:...,data:{user:...}}

    //finalResult = finalResult.filter(elm=>JSON.parse(elm.equipe).includes(elm.username)&&elm.username===username)

 
    
interface TeamData {
  [key: string]: number;
}

interface FinalData {
  equipe: string;
  moyenne: number;
  total: number;
  data: TeamData;
}

let equipeData: FinalData[] = equipes.map((equipe) => {
  let total = 0;
  for (let item of finalResult) {
    if (item.equipe === equipe) {
      total = item.total;
      break;
    }
  }

  let equipeMembers: string[] = JSON.parse(equipe);
  let moyenne: number = total / equipeMembers.length;
  let data: TeamData = {};

  // for (let member of equipeMembers) {
  //   for (let item of finalResult) {
  //     if (item.username === member) {
  //       if(!isNaN(data[member])){
  //         data[member] += item.somme;
  //       }
  //       else{
  //         data[member]=0
  //       }
        
  //     }
  //   }
  // }
  
  for(let elm of finalResult){
    if(elm.equipe===JSON.stringify(equipeMembers)){
      data[elm.username]=elm.somme
    }
  }
  console.log(equipeMembers,total,moyenne)
  console.log(finalResult)
  
  return { equipe, moyenne, total, data };
});

    

return res.status(200).json({ message: "created succesfully", data:equipeData });
  } catch (err) {
    console.error(err);
  }
}
