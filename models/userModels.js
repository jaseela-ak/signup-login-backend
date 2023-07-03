const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema =   mongoose.Schema({
    username:{
        type:String,
        require
    },
    email:{
        type:String,
        require
    },
    
    password:{
        type:String,
        require
    },
   

},{
    timestamps:true
}
);

//Export the model
module.exports = mongoose.model('User', userSchema);