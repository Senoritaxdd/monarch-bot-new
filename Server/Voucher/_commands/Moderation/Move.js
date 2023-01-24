const { Client, Message, MessageEmbed} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

module.exports = {
    Isim: "taşı",
    Komut: ["kanal-taşı"],
    Kullanim: "taşı <@acar/ID> <Kanal ID>",
    Aciklama: "Belirlenen üyeyi sesten atar.",
    Kategori: "yetkili",
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
    if(!roller.teleportHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID> <Kanal ID>\``);
    let kanal = message.guild.channels.cache.get(args[1]);
    if(!kanal) return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID> <Kanal ID>\``);
    if(!kanal.type == "GUILD_VOICE") return message.channel.send(`${cevaplar.prefix} \`Ses kanalı değil!\` Belirtilen kanal ses kanalı değil.`).then(x => x.delete({timeout: 8500}));
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    if(!uye.voice.channel) return message.channel.send(`${cevaplar.prefix} \`Seste Bulunamadı!\` Belirtilen üye seste bulunamadı.`).then(x => x.delete({timeout: 8500}));
    await uye.voice.setChannel(kanal.id)
    message.react(message.guild.emojiGöster(emojiler.Onay));
    uye.send({embeds: [new genEmbed().setDescription(`${message.author} tarafından **${tarihsel(Date.now())}** tarihinde ${kanal.name} adlı kanala taşındın.`)]}).catch(x => {
     
  })
    }
};