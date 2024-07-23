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
    
    /*if(password != confirmpassword){
        return res.status(400).json({ error: "As senhas não conferem" })
    }*/

});

module.exports = routes;