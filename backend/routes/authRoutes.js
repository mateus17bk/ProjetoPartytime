const routes = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require("../models/user");

//Registrar usuario do sistema 
routes.post("/register", async(req, res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    //confirmação dos campos require
    if(name == null || email == null || password == null || confirmpassword == null){
        return res.status(400).json({error:"Por forvor, preencha todos os campos!"})
    }
    
    //confirmação da senha
    if(password != confirmpassword){
        return res.status(400).json({ error: "As senhas não conferem" })
    }

    const emailExists = await User.findOne({email: email});
    if(emailExists){
        return res.status(400).json({ error: "O e-mail informado está em uso!" })

    }

    //criar senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name:name,
        email:email,
        password:passwordHash

    });

    try{
        const newUser= await user.save();
        
        //criar token
        const token = jwt.sign(
            //playload
            {
                nome:newUser.nome,
                id: newUser._id
            },
                "scret"
        );
        //return token
        res.json({error: null, mgs:"Você realizou o cadastro com sucesso!", token: token, userId: newUser._id});


    }catch(error){
        res.status(400).json({error});
    }
    
});

// Login do usuario
routes.post("/login", async(req, res)=> {
    const email = req.body.email;
    const password = req.body.password

    //verificar usuario
    const user = await User.findOne({email: email})
    
    if(!user){
        return res.status(400).json({ error: "Não há usuario cadastro com esse email!" });
    }
    
    const checkPassword =await bcrypt.compare(password, user.password)
    if(!checkPassword){
        return res.status(400).json({ error: "Senha invalida!" });
    }

    //criar token
    const token = jwt.sign(
        //playload
        {
            nome:user.nome,
            id:user._id
        },
            "scret"
    );
    //return token
    res.json({error: null, mgs:"Você está authenticado!", token: token, userId: user._id});

});

module.exports = routes;