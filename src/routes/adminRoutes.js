const express = require("express");
const {
  getAllContacts,
  getAllInvestors,
  getAllNewsletters,
  approveInvestor,
  rejectInvestor,
  getDashboardStats,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/contacts", getAllContacts);
router.get("/investors", getAllInvestors);
router.get("/newsletters", getAllNewsletters);
router.put("/investor/:id/approve", approveInvestor);
router.put("/investor/:id/reject", rejectInvestor);
router.get("/dashboard", getDashboardStats);

module.exports = router;
