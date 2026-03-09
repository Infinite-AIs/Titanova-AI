
const {verify}=require("../../../lib/auth");
const {loadChats,appendChat}=require("../../../lib/storage");
const {v4:uuidv4}=require("uuid");

export default function handler(req,res){

 const account=verify(req);
 if(!account) return res.status(401).json({error:"Unauthorized"});

 const {sessionId}=req.query;
 if(!sessionId) return res.status(400).json({error:"sessionId required"});

 if(req.method==="GET"){
   const chats=loadChats(sessionId);
   return res.json({chats});
 }

 if(req.method==="POST"){

   const {role,message}=req.body;

   const entry={
     id:uuidv4(),
     role,
     message,
     createdAt:new Date().toISOString()
   };

   appendChat(sessionId,entry);

   return res.json({entry});
 }

 res.status(405).end();
}
