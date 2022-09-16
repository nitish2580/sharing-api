require('dotenv').config();
const express=require("express");
const mongoose = require("./Config/db");
const path=require('path');
const app=express();
const PORT =process.env.PORT||3000;
//Template Engine
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.use(express.static('public'))
app.use(express.json());
//Routes
app.use('/api/files',require('./Route/files'));
app.use('/files',require('./Route/show'));
app.use('/files/download',require('./Route/download'))


app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})
