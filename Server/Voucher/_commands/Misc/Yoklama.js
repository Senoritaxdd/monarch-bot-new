const { Client, Message, MessageEmbed, Guild } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "yoklama",
    Komut: ["yokla"],
    Kullanim: "yoklama",
    Aciklama: "Seste etkinlik yapmanızı sağlar.",
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
   * @param {Guild} guild
   */
  onRequest: async function (client, message, args, guild) {
 let embed = new genEmbed()
 if(!ayarlar && !roller && !roller.Katıldı || !roller.üstYönetimRolleri || !roller.yönetimRolleri || !roller.kurucuRolleri || !roller.altYönetimRolleri) return message.channel.send(cevaplar.notSetup)
  if(!message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(message.guild.emojiGöster(emojiler.Iptal))
  if(!message.member.voice || message.member.voice.channelId != kanallar.toplantıKanalı) return;
  
  let members = message.guild.members.cache.filter(member => member.roles.cache.has(roller.Katıldı) && member.voice.channelId != kanallar.toplantıKanalı);
  members.forEach((member, index) => {
    setTimeout(() => {
      member.roles.remove(roller.Katıldı).catch();
    }, 1 * 1250)
  });
  let verildi = message.member.voice.channel.members.filter(member => !member.roles.cache.has(roller.Katıldı) && !member.user.bot)
  verildi.forEach((member, index) => {
    setTimeout(() => {
      member.roles.add(roller.Katıldı).catch();
    }, 1 * 1000)
  });
  message.channel.send({embeds: [embed.setDescription(`Katıldı rolü dağıtılmaya başlandı! \`${verildi.size}\` üyeye verilecek.\nKatıldı rolü alınmaya başladı! \`${members.size}\` üyeden alınacak.\n__NOT:__ Bu işlem biraz uzun sürebilir.`)]}).catch();
    }
};