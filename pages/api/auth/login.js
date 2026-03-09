const {findAccountByEmail,createAccount}=require("../../../lib/storage");
const {signToken}=require("../../../lib/auth");

export default function handler(req,res){

 if(req.method!=="POST") return res.status(405).end();

 const {email}=req.body;

 if(!email) return res.status(400).json({error:"Email required"});

 let account=findAccountByEmail(email);

 if(!account) account=createAccount(email);

 const token=signToken(account);

 res.status(200).json({token,account});
}
