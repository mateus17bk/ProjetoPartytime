const jwt = require("jsonwebtoken");


const checkToken = (req, res, next) =>{

    const token = req.header("auth-token");
    if(!token){
        return res.status(401).json({error: "Acesso negado!"});
    }

    try{
       const verified = jwt.verify(token,"scret");
       req.user = verified;
       next();

    } catch(err){
        res.status(400).json({error: "O token é inválido!"})
    }
}

module.exports = checkToken;