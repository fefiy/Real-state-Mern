const router = require("express").Router();

const {
    bookVisit,
    cancelBooking,
    createUser,
    getAllBookings,
    getAllFavorites,
    toFav,
    login,
    verifyEmail
} = require("../controller/userController");
const { verifyTokenUser} = require("../middleware/verifyToken")
router.post("/login", login)
router.get("/:id/verify/:token/", verifyEmail  )
router.post("/register" , createUser);
router.post("/bookVisit/:id", verifyTokenUser, bookVisit);
router.post("/allBookings", getAllBookings);
router.post("/removeBooking/:id", verifyTokenUser, cancelBooking);
router.post("/toFav/:rid",  verifyTokenUser, toFav);
router.post("/allFav/",  getAllFavorites);

module.exports = router;
