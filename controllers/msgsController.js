const msgModel = require("../model/msgModel")

module.exports.addMessage = async(req, res, next) => {
    try {
        const {from, to, message} = req.body;
        const data = await msgModel.create({
            message: {
                text: message,
                users: [from, to],
                sender: from,
            }
        })
        if(data) return res.json({msg: "Message added successfully"});
        return res.json({msg: "Failed to add message to database"}); 
    } catch (error) {
        next(error);
    }
};

function filterMessagesByUser(messages, userIds) {
    return messages.filter(message => {
      return message.message.users.every(user => userIds.includes(user));
    });
}

module.exports.getAllMessages = async(req, res, next) => {
    try {
        const {froms, tos} = req.body;
        const messages = await msgModel.find({
            "message.users": {
                $all: [froms, tos],
            }
        }).sort({updatedAt: 1});

        const a = filterMessagesByUser(messages, [froms, tos]);
        const data1 = a.map((msg) => {
            return {
                fromSelf: msg.message.sender.toString() === froms,
                msgs: msg.message.text,
                timeStamp: new Date(msg.createdAt),
            };
        })
        return res.json(data1)

    } catch (error) {
        return res.json({msg: 'Not able to Fetch messages'})
    }
};

module.exports.deleteAllMessages = async(req, res, next) => {
    try {
        const {froms, tos} = req.body;
        await msgModel.deleteMany({
            "message.users": {
                $all: [froms, tos],
            }
        });

        return res.json({msg: 'Data Deleted Successfully'})

    } catch (error) {
        return res.json({msg: 'Not able to Fetch messages'})
    }
}
