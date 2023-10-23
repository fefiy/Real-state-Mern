const router = require("express").Router();
const {
  createResidency,
  getAllResidencies,
  getResidency,
} = require("../controller/residencyController");
const { verifyTokenUser} = require("../middleware/verifyToken")
router.post("/create", createResidency);
router.get("/allresd", getAllResidencies)
router.get("/:id", getResidency)

module.exports = router;
