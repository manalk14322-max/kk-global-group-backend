const express = require("express");
const { subscribeNewsletter } = require("../controllers/newsletterController");
const { validateNewsletter } = require("../middleware/validateMiddleware");

const router = express.Router();

router.post("/subscribe", validateNewsletter, subscribeNewsletter);

module.exports = router;
