const { Client, Message, MessageEmbed} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Beklet = new Set();
module.exports = {
    Isim: "kes",
    Komut: ["bağlantı-kes", "bkes"],
    Kullanim: "kes <@acar/ID> <Sebep>",
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

    if(!roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    if(Beklet.has(message.author.id)) return message.channel.send(`${cevaplar.prefix} \`Günlük Limit Aşıldı!\` ikiden fazla bağlantı kesme işlemi uygulandığı için.`).then(x => x.delete({timeout: 7500}));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID> <Sebep>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.channel.send(cevaplar.sebep);
    let findChannel = message.guild.kanalBul("bkes-log")
    if(findChannel) findChannel.send({embeds: [new genEmbed().setDescription(`${uye} üyesi ${message.author} tarafından ${tarihsel(Date.now())} tarihinde ${uye.voice.channel ? uye.voice.channel : "#Kanal Bulunamadı"} belirtilen sesli kanalından atıldı.`)]})
    await uye.voice.disconnect()
    message.react(message.guild.emojiGöster(emojiler.Onay));
  

    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR') && !ayarlar.staffs.includes(message.member.id)) Beklet.add(message.author.id);
        setTimeout(() => {
          Beklet.delete(message.author.id);
        }, 86400000);

    uye.send({embeds: [new genEmbed().setDescription(`${message.author} tarafından \`${sebep}\` sebebi ile **${tarihsel(Date.now())}** tarihinde bulunduğun sesten atıldın.`)]}).catch(x => {
      
  })
    }
};