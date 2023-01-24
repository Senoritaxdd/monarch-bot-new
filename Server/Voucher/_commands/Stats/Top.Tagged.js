const { Client, Message, MessageEmbed } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
module.exports = {
    Isim: "toptaglı",
    Komut: ["toptaglılar"],
    Kullanim: "toptaglı",
    Aciklama: "",
    Kategori: "stat",
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
    let embed = new genEmbed()
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    Users.find().exec((err, data) => {
      data = data.filter(m => message.guild.members.cache.has(m._id));
      let topTagli = data.filter(x => x.Taggeds).sort((uye1, uye2) => {
        let uye2Toplam2 = 0;
        uye2Toplam2 = uye2.Taggeds.length
        let uye1Toplam2 = 0;
        uye1Toplam2 = uye1.Taggeds.length
        return uye2Toplam2-uye1Toplam2;
    }).slice(0, 20).map((m, index) => {
        let uyeToplam2 = 0;
        uyeToplam2 = m.Taggeds.length
        return `\` ${index == 0 ? `👑` : `${index+1}`} \` ${message.guild.members.cache.get(m._id).toString()} toplam taglıları \`${uyeToplam2} üye\` ${m._id == message.member.id ? `**(Siz)**` : ``}`;
    }).join('\n');
    let findedIndex = ''
    let qweqweqwe = data.filter(x => x.Taggeds).sort((uye1, uye2) => {
      let uye2Toplam2 = 0;
      uye2Toplam2 = uye2.Taggeds.length
      let uye1Toplam2 = 0;
      uye1Toplam2 = uye1.Taggeds.length
      return uye2Toplam2-uye1Toplam2;
  }).map((m, index) => {
      let uyeToplam2 = 0;
      uyeToplam2 = m.Taggeds.length
      let sira = ``
      if(m._id === message.member.id) sira = `${index + 1}`
      if(m._id === message.member.id) {
          if(uyeToplam2 != 0 && sira > 20) return findedIndex = `\` ${sira} \` ${message.guild.members.cache.get(m._id).toString()} toplam taglıları \`${uyeToplam2} üye\` **(Siz)**`
      }
     
  }).join('\n');


    message.channel.send({embeds: [embed.setDescription(`Aşağı da \`${message.guild.name}\` sunucusunun en iyi taglı çekenlerin sıralaması belirtilmiştir.\n\n${topTagli ? `${topTagli}\n${findedIndex}` : `\`${message.guild.name}\` sunucusun da taglı bilgileri bulunamadı.`}`)]})
    })
  }
};