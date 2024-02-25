const {register, login, setAvatar, allUsers, updateNotification, getNotifications, getAllContacts} = require("../controllers/userController")

const router = require("express").Router();

router.post("/register", register)
router.post("/login", login)
router.post("/setAvatar", setAvatar)
router.get("/allUsers/:id", allUsers)
router.post("/updateNotification", updateNotification)
router.get("/getNotifications/:id", getNotifications)
router.get("/getAllContacts/:id", getAllContacts)

module.exports = router