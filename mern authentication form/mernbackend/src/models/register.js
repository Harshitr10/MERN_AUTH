require('dotenv').config();
const mongoose  = require("mongoose");
const bcrypt =  require ("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true

    },
    lastname:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
     
    },
    tokens:[{
        token:{   
            type:String,
            required:true

        }
    }]
})
//generating tokens
employeeSchema.methods.generateAuthToken = async function(){
    try{
        const token =jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
       this.tokens= this.tokens.concat({token:token});
       await this.save();
       return token;

    }catch(err){
        res.send(`The error partis ${err}`);
        console.log(`The error partis ${err}`);

    }
}
//converting passwords into hash
employeeSchema.pre("save",async function(next){
    if (this.isModified("password")){
        console.log(`The current password is ${this.password}`);
      this.password =  await bcrypt.hash(this.password,10);
      console.log(`The current password is ${this.password}`);

      this.confirmpassword = undefined;
    }
    next();
})

const Register = new mongoose.model("Register",employeeSchema);
module.exports= Register;