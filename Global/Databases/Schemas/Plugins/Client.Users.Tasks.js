const mongoose = require("mongoose");
const ms = require('ms')
const schema = mongoose.model('Task', new mongoose.Schema({
    guildID: String,
    roleID: String,
    Active: {type: Boolean, default: true},
    AllVoice: Number,
    Tagged: Number,
    Staff: Number,
    publicVoice: Number,
    Register: Number,
    Invite: Number, 
    Reward: Number,
    Date: {type: Number, default: Date.now()},
    Time: {type: Number },
    Users: Array,
    Completed: Object,

}));

module.exports = schema;