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

router.get("/all", async(req, res) =>{
    try{
        const parties = await Party.find({ privacy:false }).sort([['_id',1]]);
        res.json({ error: null, parties: parties});
    }catch (err){
        return res.status(400).json({error});
    }

});

router.get("/userparties", verifyToken, async(req, res) =>{
    try{
        const token = req.header("auth-token");

        const user = await getUserByToken(token);

        const userId = user._id.toString();

        const parties = await Party.find({ userId: userId });
        res.json({ error: null, parties: parties });

    }catch (error){
        return res.status(400).json({error});
    }

});


router.get("/userparty/:id",verifyToken, async(req,res)=>{
    try{
        const token = req.header("auth-token");

        const user = await getUserByToken(token);

        const userId = user._id.toString();
        const partyId = req.params.id;

        const party = await Party.findOne({_id: partyId, userId: userId});

        res.json({error: null, party: party});

    }catch (error){
        return res.status(400).json({error});
    }
});

router.get("/:id", async(req, res) =>{
    
    try{
        const id = req.params.id;
        const party = await Party.findOne({_id: id});

        if(party.privacy === false){
            res.json({error: null, party: party});
        }else{
            const tokne = req.header("auth-token");
            const user = await getUserByToken(token);
            const userId = user._id.toString();
            const partyUserId = party.userId.toString();

            if(userId == partyUserId){
                res.json({error: null, party: party});
            }
        }

    }catch (err){
        return res.status(400).json({error:"Este evento não existe!"})
    }


});


module.exports = router;