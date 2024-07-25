const router = require('express').Router();
const bcrypt = require('bcrypt');


const User = require("../models/user");

//Middlewares
const verifyToken = require("../helpers/chek-token");

//helpers
const getUserByToken = require("../helpers/get-user-by-token");

//get usuario
router.get("/:id", verifyToken,async (req, res) => {
    
    const id = req.params.id;

    try {

        const user = await User.findOne({ _id: id}, {password: 0});
        res.json({error: null, user});

    } catch(err){
        return res.status(400).json({error:"Usuario não existe!"});
    }
    
    
    //res.json({ msg:"Funcinou!" });
});

//update do usuario
router.put("/",verifyToken, async(req, res)=>{
    const token = req.header("auth-token");
    const user = await getUserByToken(token); 
    const userReqId = req.body.id;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    const userId = user._id.toString();
    if(userId != userReqId){
        res.status(401).json({error:"Acesso negado!"});
    }
    const updateData ={
        name: req.body.name,
        email: req.boby.email
    };
});

module.exports = router;