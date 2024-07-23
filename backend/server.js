//modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

//routes
const authRouter = require('./routes/authRoutes.js');
const userRouter = require('./routes/userRoutes.js');


//middlewars

//config
const dbName = "partytime";
const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));


//atrela as rotas no express
app.use('/api/auth',authRouter);
app.use('/api/auth',userRouter);

//Conexão mongodb
mongoose.connect(`mongodb://localhost:27017/${dbName}`);
const db = mongoose.connection;
db.on('error', console.error.bind(console,"Erro de conexão com o MongoDb"));
db.once('open', () =>{
    console.log('Conexão bem-vindo com o MongoDb');
});

//atrelar as rotas express
app.get('/',(req, res)=>{
    res.json({message: "Rota teste!"});
});

app.listen(port, ()=>{
    console.log(`O backend está rodando na porta ${port}`);
})