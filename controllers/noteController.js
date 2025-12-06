const Note = require("../models/Note");
exports.createNote = async(req ,res) =>{
    try{
        const {title, description} = req.body;
        if(!title || !description){
            return res.status(400).json({message:"All fields required"});
        }
        const  note = await Note.create({
            title,
            description, 
            userId: req.user.id,
        });
        res.status(201).json({message:"Note created", note});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

exports.getNote = async(req ,res) =>{
    try{
        const notes = await Note.find({userId: req.user.id});
        res.json(notes);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

exports.updateNote = async(req ,res)=>{
    try{
        const{title , description } = req.body;

        const note = await Note.findOneAndUpdate(

            {_id: req.params.id, userId:req.user.id},
            {title , description},
            {new : true}
        );
        if(!note) return res.status(404).json({message:"Note not found"});
        res.json({message:"Note updated", note});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

exports.deleteNote = async (req , res) => {
    try{
        const note= await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });
        if(!note) return res.status(400).json({message:"Note not found"});

        res.json({message:"Note deleted"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};