const User = require("../model/userModel")
const bcrypt = require("bcrypt")

module.exports.register = async (req, res, next) => {
    try {
        const {uid, username, email, password} = req.body;
        const usernamecheck = await User.findOne({ email: email })
        if (usernamecheck) {
            return res.json({msg: "Username already used", status: false});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            uid: uid,
            email: email,
            password: hashedPassword, 
            username: username
        });
        return res.json({status: true, user})
    } catch (error) {
        console.log(error)
    }
};


module.exports.login = async (req, res, next) => {
    try {
        const {uid} = req.body;
        const data = await User.findOne({uid})
        return res.json(data)
    } catch (error) {
        console.log(error)
    }
}


module.exports.setAvatar = async (req, res, next) => {
    try {
        const {uid, avatar} = req.body;
        const data = await User.findOne({uid})
        data.isAvatarImageSet = true;
        data.avatarImage = avatar;
        const data1 = await User.findByIdAndUpdate(data._id, {$set: data}, {new:true});
        return res.json(data1)
    }
    catch (error){
        console.log(error)
    }
}


module.exports.allUsers = async (req, res, next) => {
    try {
        const users = await User.find({_id: {$ne: req.params.id}}).select([
            "email", "username", "avatarImage", "_id", "uid", "isAvatarImageSet"
        ]);
        const notifications = await User.find({_id: req.params.id}).select([
            "notifications"
        ]);
        const fetched_notifications = notifications[0].notifications
        const userss = users.map((user) => {
            return { ...user._doc };
        })
        
        const sorted_Notifications = fetched_notifications.sort((a,b) => new Date(b.time) - new Date(a.time))

        const sorted_contacts = sorted_Notifications.map((notification) => {
            return userss.find((contact) => contact._id.toString() === notification.from)
        })

        const notFoundContacts = userss.filter((contact) => {
            const contactsss = sorted_contacts.find((con) => con._id.toString() === contact._id.toString())
            if (!contactsss) {
                return contact
            }
            return
        })

        const final_contacts = [...sorted_contacts, ...notFoundContacts]

        return res.json(final_contacts)
    } catch (error) {
        console.log(error)
    }
}

module.exports.updateNotification = async (req, res, next) => {
    try {
        const {uid, from, lastMessage, time, notification} = req.body;
        console.log(req.body, 'request recieved')
        let data = await User.find({_id: uid}).select([
            "email", "username", "avatarImage", "_id", "uid", "notifications"
        ]);
        data = data[0]

        let notifications = []
        if(data){
            const prev_notification = data.notifications.filter((noti) => noti.from === from)
            if (prev_notification.length){
                notifications = data.notifications.map((noti) => {
                    if (notification === 1){
                        if(noti.from === from){
                            noti.notification_count += 1,
                            noti.lastMessage = lastMessage,
                            noti.time = time
                        }
                    }
                    else if (notification === 0){
                        if(noti.from === from){
                            noti.notification_count = 0
                        }
                    }
                    return noti
                })
            }
            else {
                notifications = data.notifications
                notifications.push({
                    from: from,
                    lastMessage: lastMessage,
                    time: time,
                    notification_count: 1
                })

            }
    
            data.notifications = notifications
            const data1 = await User.findByIdAndUpdate(data._id, {$set: data}, {new:true});
            return res.json({status: true, data1})
        }
        return res.json({status: false})
    } catch (error) {
        console.log(error)   
    }
}

module.exports.getAllContacts = async (req, res, next) => {
    try {
        const users = await User.find({_id: {$ne: req.params.id}}).select([
            "email", "username", "avatarImage", "_id", "uid", "isAvatarImageSet"
        ]);

        const userss = users.map((user) => {
            return { ...user._doc };
        })
        
        return res.json(userss)
    } catch (error) {
        console.log(error)
    }
}


module.exports.getNotifications = async (req, res, next) => {
    try {
        const users = await User.find({_id: req.params.id}).select([
            "notifications"
        ]);
        const userss = users.map((user) => {
            return { ...user._doc };
        })
        return res.json(userss)
    } catch (error) {
        console.log(error)
    }
}