const express = require("express");
const {signup,login,createProfile} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/:id",createProfile);
module.exports = router;