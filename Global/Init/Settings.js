const GUILDS_SETTINGS = require('../Databases/Schemas/Global.Guild.Settings');

class GUILD {
    static async fetch(id) {
        if(!id) return client.logger.log("Sunucu IDsini kontrol edin, sunucu verilerini getiremedim.", "error");
        await GUILDS_SETTINGS.updateOne({guildID: id}, {$set: { _id: 1 }}, {upsert: true})
        try {
            let Data = await GUILDS_SETTINGS.findOne({ guildID: id })
            ayarlar = client._settings = global.ayarlar = global._settings = kanallar = client._channels = global.kanallar = global.channels =  roller = client._roles = global.roller = global._roles = Data.Ayarlar
            emojiler = client._emojis = global.emojiler = global._emojis = require('../Settings/_emojis.json');
            cevaplar = client._reply = global.cevaplar = global._reply = require('../Settings/_reply');
        } catch (err) {}

    }
}

module.exports = { GUILD }