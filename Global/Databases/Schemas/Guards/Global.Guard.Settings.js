const mongoose = require("mongoose");

const schema = mongoose.model('Guard', new mongoose.Schema({
    guildID: String,
    guildProtection: {type: Boolean, default: true},

    // Dokunulmaz
    unManageable: {type: Array, default: []},
    
    // İzinler
    fullAccess: {type: Array, default: []},
    guildAccess: {type: Array, default: []},
    emojiAccess: {type: Array, default: []},
    rolesAcess: {type: Array, default: []},
    botAccess: {type: Array, default: []},
    channelsAccess: {type: Array, default: []},
    memberAccess: {type: Array, default: []},
    
    auditLimit: {type: Number, default: 19},
    auditInLimitTime: {type: String, default: "2m"},

}));

module.exports = schema;