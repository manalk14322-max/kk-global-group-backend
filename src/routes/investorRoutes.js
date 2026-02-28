const express = require("express");
const { applyInvestor, getMyApplications } = require("../controllers/investorController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validateInvestorApply } = require("../middleware/validateMiddleware");

const router = express.Router();

router.post("/apply", protect, authorizeRoles("investor"), validateInvestorApply, applyInvestor);
router.get("/my-applications", protect, authorizeRoles("investor"), getMyApplications);

module.exports = router;
