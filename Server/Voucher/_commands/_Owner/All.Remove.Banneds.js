const { Client, Message, Util} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives')
module.exports = {
    Isim: "af",
    Komut: ["toplu-ban-kaldır","bantemizle"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "kurucu",
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
    if(!ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) return;
    const banneds = await message.guild.bans.fetch()
    await banneds.forEach(async member => {
      await message.guild.members.unban(member.user.id, `Yetkili: ${message.author.id}`)
      await Punitives.findOne({Member: member.user.id, Type: "Yasaklama", Active: true}).exec(async (err, res) => {
        if(res) await Punitives.updateOne({ No: res.No }, { $set: { "Active": false, Expried: Date.now(), Remover: message.member.id} }, { upsert: true }).exec();
      })
    });
    if (message) await message.react(message.guild.emojiGöster(emojiler.Onay))
    }
};