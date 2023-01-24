const { Client, Message, MessageEmbed } = require("discord.js");
const { genEmbed } = require('../../../../Global/Init/Embed')
let zaman = new Map();
module.exports = {
    Isim: "booster",
    Komut: ["b","boost","zengin"],
    Kullanim: "booster <Belirlenen Isim>",
    Aciklama: "Sunucuya takviye atan üyeler bu komut ile isim değişimi yapar.",
    Kategori: "diğer",
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
  onRequest: async (client, message, args) => {
      
      let embed = new genEmbed()
      if (!message.member.roles.cache.has(roller.boosterRolü) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.react(message.guild.emojiGöster(emojiler.Iptal));
      if (zaman.get(message.author.id) >= 1) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} Sunucu takviyecisi özellik komutunu sadece **15 Dakika** ara ile kullanabilirsin.`, ephemeral: true}), message.react(message.guild.emojiGöster(emojiler.Iptal));
      if(roller.Yetkiler.some(x => message.member.roles.cache.has(x)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) {
        let isim = args.join(' ');
        if (!isim) return message.react(message.guild.emojiGöster(emojiler.Iptal))
        let Nickname = message.member.nickname.replace(ayarlar.tagsiz, "").replace(ayarlar.tag, "").replace(" ", "").split(" | ")[0]
        if(Nickname && message.member.manageable) {
          message.member.setNickname(message.member.displayName.replace(Nickname, isim)).catch(err => {})
          zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
          setTimeout(() => {
            zaman.delete(message.author.id)
          }, 1000 * 60 * 15 * 1)
          return message.react(message.guild.emojiGöster(emojiler.Onay))
        } else {
          return message.react(message.guild.emojiGöster(emojiler.Iptal))
        }
      }
      let yazilacakIsim;
      let isim = args.join(' ');
      if (!isim) return message.react(message.guild.emojiGöster(emojiler.Iptal))
      yazilacakIsim = `${message.member.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${isim}`;
      if(message.member.manageable) {
      message.member.setNickname(`${yazilacakIsim}`).then(devam => {
      message.react(message.guild.emojiGöster(emojiler.Onay))
      	      zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
	    setTimeout(() => {
		    zaman.delete(message.author.id)
	    }, 1000 * 60 * 15 * 1)
      }).catch(acar =>  message.react(message.guild.emojiGöster(emojiler.Iptal)))
    } else {
      message.react(message.guild.emojiGöster(emojiler.Iptal))
    }
  }
};