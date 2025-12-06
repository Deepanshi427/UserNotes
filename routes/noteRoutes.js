const express = require("express");
const auth = require("../middleware/auth");
const {
    createNote,
    getNote,
    updateNote,
    deleteNote,
} = require("../controllers/noteController");

const router = express.Router();


router.post("/notes", auth, createNote);
router.get("/notes", auth, getNote);
router.put("/notes/:id", auth, updateNote);
router.delete("/notes/:id", auth, deleteNote);

module.exports = router;