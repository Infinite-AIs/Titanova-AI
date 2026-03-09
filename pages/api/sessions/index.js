
const {verify}=require("../../../lib/auth");
const {listSessions,createSession}=require("../../../lib/storage");

export default function handler(req,res){

 const account=verify(req);
 if(!account) return res.status(401).json({error:"Unauthorized"});

 if(req.method==="GET"){
   const sessions=listSessions(account.email);
   return res.json({sessions});
 }

 if(req.method==="POST"){
   const {name}=req.body;
   const session=createSession(account.email,name||"New Chat");
   return res.json({session});
 }
 res.status(405).end();
}
