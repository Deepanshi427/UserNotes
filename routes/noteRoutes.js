const express = require("express");
const auth = require("../middleware/auth");
const rateLimit = require("../middleware/rateLimit");
const logger = require("../middleware/logger");

const {
    createNote,
    getNote,
    updateNote,
    deleteNote,
} = require("../controllers/noteController");

const router = express.Router();
router.use(auth, logger, createNote);

router.post("/notes", auth, createNote);
router.get("/notes", auth, getNote);
router.put("/notes/:id", auth, updateNote);
router.delete("/notes/:id", auth, deleteNote);

module.exports = router;