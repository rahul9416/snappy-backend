const {addMessage, getAllMessages, deleteAllMessages} = require("../controllers/msgsController")

const router = require("express").Router();

router.post("/addMsg", addMessage)
router.post("/getAllMsgs", getAllMessages)
router.post("/deleteAllMsgs", deleteAllMessages)

module.exports = router