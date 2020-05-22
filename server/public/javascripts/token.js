const jwt = require("jsonwebtoken");
const secret = "rhddesigned";

function createToken(payload) {
  payload.rtiem = new Date();
  payload.exp = 1000*60*60*24;
  return jwt.sign(payload, secret);
}

function checkToken(token) {
  return new Promise((resolve, reject)=>{
    jwt.verify(token, secret,(err, res)=>{
      if(!err) {
        resolve(res)
      }else{
        reject(1);
      }
    })
  })
}

module.exports.createToken = createToken
module.exports.checkToken = checkToken
