const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "cezalartemizle",
    Komut: ["cezalartemizle","siciltemizle"],
    Kullanim: "cezalartemizle",
    Aciklama: "Belirtilen ceza numarasının bütün bilgilerini gösterir.",
    Kategori: "-",
    Extend: false,
    
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
    if(!ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return;
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID>\``);
    let cezalar = await Punitives.findOne({Member: uye.id});
    if(!cezalar) return message.channel.send({embeds: [new genEmbed().setDescription(`${uye} isimli üyenin cezası bulunamadı.`)]});
    if(await Punitives.findOne({Member: uye.id, Active: true})) return message.channel.send({embeds: [new genEmbed().setDescription(`${uye} isimli üyenin aktif cezası bulunduğundan dolayı işlem iptal edildi.`)]});

    await message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} üyesinin tüm cezaları başarıyla temizlendi.`)]})
    await Punitives.updateMany({Member: uye.id}, { $set: { Member: `Silindi (${uye.id})`, No: "-99999", Remover: `Sildi (${message.author.id})`} }, { upsert: true });
    await message.react(message.guild.emojiGöster(emojiler.Onay))
    }
};