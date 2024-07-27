const router = require('express').Router();
const jwr = require('jsonwebtoken');
const multer = require('multer');

const Party = require('../models/party');
const User = require('../models/user');

const diskStorage = require('../helpers/file-storage');
const upload = multer({storage:diskStorage});

const verifyToken = require('../helpers/chek-token');
const getUserByToken = require('../helpers/get-user-by-token');

router.post('/' ,verifyToken, upload.fields([{name:"photos"}]),  async(req, res)=>{
    const title = req.body.title;
    const description = req.body.description;
    const partyDate = req.body.party_date;
    
    let files = [];
    if(req.files){
        files = req.files.photos;
    }

    if(title == "null" || description == "null" || partyDate == "null"){
        return res.status(400).json({error: "Preencha pelo menos nome, descrição e data."});
    }
    
    const token = req.header("auth-token");
    const userByToken = await getUserByToken(token);
    const userId = userByToken._id.toString();
   
    try{
        const user = await User.findOne({ _id: userId });
        
        let photos = [];
        if(files && files.length > 0){
            files.forEach((photos, i)=>{
                photos[i] = photos.path;
            });
        }

        const party = new Party({
            title: title,
            description: description,
            partyDate: partyDate,
            photos: photos,
            privacy: req.body.privacy,
            userId: user._id.toString()
        });

        try{
            const newParty = await party.save();
            res.json({ error: null, msg:"Envento criado com sucesso!", data: newParty});
        }catch(err){
            res.status(400).json({ error });
        }

    }catch(err){
        return res.status(400).json({error: "Acesso negado!"});
    }

    //res.json({msg: "Funcionando!"});
});

module.exports = router;