
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const SECRET = process.env.JWT_SECRET || "dev-secret";
const ACCOUNTS_FILE = path.join(process.cwd(),"data","accounts.json");

function readAccounts(){
 if(!fs.existsSync(ACCOUNTS_FILE)) return [];
 return JSON.parse(fs.readFileSync(ACCOUNTS_FILE));
}

function signToken(account){
 return jwt.sign({email:account.email,id:account.id},SECRET,{expiresIn:"7d"});
}

function verify(req){
 const header=req.headers.authorization||"";
 if(!header.startsWith("Bearer ")) return null;

 const token=header.slice(7);

 try{
   const decoded=jwt.verify(token,SECRET);
   const accounts=readAccounts();
   return accounts.find(a=>a.email===decoded.email)||null;
 }catch{
   return null;
 }
}

module.exports={signToken,verify};
