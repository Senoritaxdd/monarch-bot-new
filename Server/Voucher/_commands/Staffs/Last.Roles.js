const { Client, Message, MessageButton, MessageActionRow } = require("discord.js");
const Unleash = require('../../../../Global/Databases/Schemas/Plugins/Guıild.Remove.Staffs');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "sonyetki",
    Komut: ["son-yetkisi","sonrolleri","sonroller","yetkibırakan"],
    Kullanim: "yetkibırakan <@acar/ID>",
    Aciklama: "Belirlenen üyeyi yetkiye davet etmek için istek gönderirsin.",
    Kategori: "yönetim",
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
        if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
        let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID>\``);
        if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
        let data = await Unleash.findOne({_id: uye.id})
        if(!data) return message.react(message.guild.emojiGöster(emojiler.Iptal));
        message.channel.send({embeds: [new genEmbed().setFooter("bu görüntüleme ektedir.").setTimestamp().setDescription(`:tada: ${uye} isimli eski yetkili üyenin eski rolleri aşağıda belirtilmiştir.\n
\` ••❯ \` **Rolleri Şunlardır**:\n${data ? data.unleashRoles.map(x => `\` • \` ${message.guild.roles.cache.get(x)} (\`${x}\`)`).join("\n") : `${message.guild.emojiGöster(emojiler.Onay)} Veritabanına bir rol veya bir veri bulunamadı!`}`)]})

    }
};