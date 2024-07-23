const mongoose = require('mongoose');

const PartySchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String
    },
    partyData:{
        type: Data
    },
    photos:{
        type: Array
    },
    privacy:{
        type: Boolean
    },
    userId:{
        type: mongoose.ObjectId
    }

});

const Party = mongoose.model("Party", PartySchema);
module.exports(Party);