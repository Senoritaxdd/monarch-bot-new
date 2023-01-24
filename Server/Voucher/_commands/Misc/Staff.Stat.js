const { Client, Message, MessageEmbed} = require("discord.js");
module.exports = {
    Isim: "yetkilisay",
    Komut: ["yetkilis-say"],
    Kullanim: "yetkilisay",
    Aciklama: "Seste olmayan yetkilileri belirtir.",
    Kategori: "kurucu",
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
    if(!ayarlar.staff.includes(message.member.id) && !message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.react(message.guild.emojiGöster(emojiler.Iptal));

    let roles = message.guild.roles.cache.get(roller.altilkyetki);
    let üyeler = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.permissions.has('ADMINISTRATOR') && !uye.roles.cache.has(roller.kurucuRolleri) && uye.roles.highest.position >= roles.position && uye.presence && uye.presence.status !== "offline" && !uye.voice.channel)
    var filter = m => m.author.id === message.author.id && m.author.id !== client.user.id && !m.author.bot;
    if(üyeler.size == 0) return message.react(message.guild.emojiGöster(emojiler.Iptal));
    message.channel.send(`Online olup seste olmayan <@&${roles.id}> rolündeki ve üzerinde ki yetkili sayısı: ${üyeler.size ? üyeler.size : 0} `)
       message.channel.send(``+ üyeler.map(x => "<@" + x.id + ">").join(",") + ``)
    }
};