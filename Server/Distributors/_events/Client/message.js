const { Message, MessageEmbed } = require("discord.js");
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');

 /**
 * @param {Message} message 
 */

module.exports = async (message) => { 
  
    // Sync Data's
    let Data = await GUILDS_SETTINGS.findOne({ _id: 1 })
    ayarlar = client._settings = global.ayarlar = global._settings = kanallar = client._channels = global.kanallar = global.channels =  roller = client._roles = global.roller = global._roles = Data.Ayarlar
    emojiler = client._emojis = global.emojiler = global._emojis = require('../../../../Global/Settings/_emojis.json');
    cevaplar = client._reply = global.cevaplar = global._reply = require('../../../../Global/Settings/_reply');
    // Sync Data's

    if (!global.sistem.botSettings.Prefixs.some(x => message.content.startsWith(x)) || !message.channel || message.channel.type == "dm") return;
    let args = message.content.substring(global.sistem.botSettings.Prefixs.some(x => x.length)).split(" ");
    let komutcuklar = args[0].toLocaleLowerCase()
    let acar = message.client;
    args = args.splice(1);
    let calistirici;

    if(acar.commands.has(komutcuklar) || acar.aliases.has(komutcuklar)) {
      if (!(ayarlar && ayarlar.staff && ayarlar.staff.includes(message.member.id)) && message.guild.ownerId != message.member.id && client.user.id != message.member.id ) return;
          calistirici = acar.commands.get(komutcuklar) || acar.aliases.get(komutcuklar);
          if(calistirici) calistirici.onRequest(acar, message, args);
    } 

};

module.exports.config = {
    Event: "messageCreate"
};
