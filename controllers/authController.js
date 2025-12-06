const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async(req, res) =>{
    try{
        const {name , email, password} = req.body;

        const userExists = await User.findOne({email});
        if(userExists) return res.status(400).json({message:"User already exists"});

        const hashed = await bcrypt.hash(password ,10);

        const user = await User.create({
            name, 
            email, 
            password: hashed,
        });
        res.json({message:"Signup success", user});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

exports.login = async(req, res) =>{
    try{
        const {email , password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid credentials"});

        const passMatch = await bcrypt.compare(password, user.password);
        if(!passMatch) return res.status(400).json({message:"Invalid credentials"});

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{
            expiresIn:"7d",
        });
        res.json({message:"Login success", token});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};