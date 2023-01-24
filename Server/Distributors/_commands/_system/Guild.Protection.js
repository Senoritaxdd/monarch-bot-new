const { Client, Message, Collection } = Discord = require("discord.js");
const util = require("util")
const { genEmbed } = require('../../../../Global/Init/Embed')
let kapatılanPermler = new Collection()
module.exports = {
    Isim: "proc",
    Komut: ["proc"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let type = args[0]
    if(!type) return message.react(message.guild.emojiGöster(emojiler.Iptal))
    
    switch (type) {
        case "on": {
            const perms = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS_AND_STICKERS", "MANAGE_WEBHOOKS"];
            let roller = message.guild.roles.cache.filter(rol => rol.editable).filter(rol => perms.some(yetki => rol.permissions.has(yetki)))
            message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${roller.map(x => x).join(", ")} rolün(lerin), koruması başarıyla **${tarihsel(Date.now())}** tarihinde açıldı ve izinleri kapatıldı.`)]}).then(x => {
                message.react(message.guild.emojiGöster(emojiler.Onay))
                setTimeout(() => {
                    x.delete()
                }, 8500);
            })
            roller.forEach(async (rol) => {
                await kapatılanPermler.set(rol.id, rol.permissions.bitfield)
                await rol.setPermissions(0n)
            })
            return;
        }
            
        case "off": {
            kapatılanPermler.forEach(async (bit, rol) => {
                await message.guild.roles.cache.get(rol).setPermissions(bit);
            })
            return message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${kapatılanPermler.map((x, key) => message.guild.roles.cache.get(key)).join(", ")} rolün(lerin), koruması başarıyla **${tarihsel(Date.now())}** tarihinde kapatıldı ve izinleri tekrardan açıldı.`)]}).then(x => {
                message.react(message.guild.emojiGöster(emojiler.Onay))
                setTimeout(() => {
                    x.delete()
                }, 8500);
            })
        }
    }
  
  }
};