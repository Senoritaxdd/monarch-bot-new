const mongoose = require("mongoose");

const schema = mongoose.model('Stat', new mongoose.Schema({
    guildID: String,
    userID: String,
    voiceStats: {type: Map, default: new Map()},
    taskVoiceStats: {type: Map, default: new Map()},
    upstaffVoiceStats: {type: Map, default: new Map()},
    voiceCameraStats: {type: Map, default: new Map()},
    voiceStreamingStats: {type: Map, default: new Map()},
    totalVoiceStats: {type: Number, default: 0},
    chatStats: {type: Map, default: new Map()},
    upstaffChatStats: {type: Map, default: new Map()},
    totalChatStats: {type: Number, default: 0}
}));

module.exports = schema;