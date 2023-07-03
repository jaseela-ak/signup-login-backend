const mongoose=require('mongoose')
require('dotenv').config();
mongoose
    .connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(() => console.log("connect to mongo"))
    .catch((err) => {
      console.log(err);
    })
