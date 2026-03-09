
const fs=require("fs");
const path=require("path");
const {v4:uuidv4}=require("uuid");

const DATA_DIR=path.join(process.cwd(),"data");
const ACCOUNTS_FILE=path.join(DATA_DIR,"accounts.json");
const SESSIONS_FILE=path.join(DATA_DIR,"sessions.json");
const CHATS_DIR=path.join(DATA_DIR,"chats");

if(!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if(!fs.existsSync(CHATS_DIR)) fs.mkdirSync(CHATS_DIR);
if(!fs.existsSync(ACCOUNTS_FILE)) fs.writeFileSync(ACCOUNTS_FILE,JSON.stringify([]));
if(!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE,JSON.stringify([]));

function readJSON(file){
 return JSON.parse(fs.readFileSync(file));
}

function writeJSON(file,data){
 fs.writeFileSync(file,JSON.stringify(data,null,2));
}

function findAccountByEmail(email){
 const accounts=readJSON(ACCOUNTS_FILE);
 return accounts.find(a=>a.email===email)||null;
}

function createAccount(email){
 const accounts=readJSON(ACCOUNTS_FILE);
 const account={id:uuidv4(),email,createdAt:new Date().toISOString()};
 accounts.push(account);
 writeJSON(ACCOUNTS_FILE,accounts);
 return account;
}

function listSessions(email){
 const sessions=readJSON(SESSIONS_FILE);
 return sessions.filter(s=>s.email===email);
}

function createSession(email,name="New Chat"){
 const sessions=readJSON(SESSIONS_FILE);
 const session={id:uuidv4(),email,name,createdAt:new Date().toISOString()};
 sessions.push(session);
 writeJSON(SESSIONS_FILE,sessions);
 return session;
}

function chatFile(sessionId){
 return path.join(CHATS_DIR,sessionId+".json");
}

function loadChats(sessionId){
 const f=chatFile(sessionId);
 if(!fs.existsSync(f)) writeJSON(f,[]);
 return readJSON(f);
}

function appendChat(sessionId,entry){
 const f=chatFile(sessionId);
 if(!fs.existsSync(f)) writeJSON(f,[]);
 const arr=readJSON(f);
 arr.push(entry);
 writeJSON(f,arr);
}

module.exports={
 findAccountByEmail,
 createAccount,
 listSessions,
 createSession,
 loadChats,
 appendChat
};
