const express = require("express");
const auth = require("../middleware/auth");
const rateLimit = require("../middleware/rateLimit");
const logger = require("../middleware/logger");
const requirePermission = require("../middlewares/requirePermission");
const P = require("../config/permissions");


const {
    createNote,
    getNote,
    updateNote,
    deleteNote,
} = require("../controllers/noteController");




const router = express.Router();
router.use(auth, logger);


router.post("/", requirePermission(P.CREATE_NOTES), createNote);
router.get("/", requirePermission(P.READ_NOTES), getNote);
router.put("/:/:id", requirePermission(P.UPDATE_NOTES), updateNote);
router.delete("/:/:id", requirePermission(P.DELETE_NOTES), deleteNote);

module.exports = router;