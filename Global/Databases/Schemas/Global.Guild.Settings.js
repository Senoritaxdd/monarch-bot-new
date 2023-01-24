const mongoose = require('mongoose')

const schema = mongoose.model('Guild', new mongoose.Schema({
    _id: String,
    guildID: String,
    Date: {type: Date, default: Date.now()},
    Ayarlar: {type: Object, default: {
        staff: ["935539319614078986"]
    }},
    talentPerms: Object,
}));

module.exports = schema;