const { Client, Message, MessageEmbed} = require("discord.js");
const Invite = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "topdavet",
    Komut: ["topinvite"],
    Kullanim: "topinvite",
    Aciklama: "Sunucu içerisindeki tüm davet sıralaması görüntülenir",
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
    Invite.find().exec((err, data) => {
      data = data.filter(m => message.guild.members.cache.has(m.userID));
      let topTagli = data.filter(x => x.total).sort((uye1, uye2) => {
        let uye2Toplam2 = 0;
        uye2Toplam2 = uye2.total
        let uye1Toplam2 = 0;
        uye1Toplam2 = uye1.total
        return uye2Toplam2-uye1Toplam2;
    }).slice(0, 20).map((m, index) => {
        let uyeToplam2 = 0;
        uyeToplam2 = m.total
        return `\` ${index == 0 ? `👑` : `${index+1}`} \` ${message.guild.members.cache.get(m.userID).toString()} toplam **${m.total}** üye davet etmiş. ${m.userID == message.member.id ? `**(Siz)**` : ``}`;
    }).join('\n');
    let findedIndex = '';
    let werwerwe = data.filter(x => x.total).sort((uye1, uye2) => {
      let uye2Toplam2 = 0;
      uye2Toplam2 = uye2.total
      let uye1Toplam2 = 0;
      uye1Toplam2 = uye1.total
      return uye2Toplam2-uye1Toplam2;
  }).map((m, index) => {
      let uyeToplam2 = 0;
      uyeToplam2 = m.total
      let sira = ``
      if(m.userID === message.member.id) sira = `${index + 1}`
      if(m.userID === message.member.id) {
          if(uyeToplam2 != 0 && sira > 20) return findedIndex = `\` ${sira} \` ${message.guild.members.cache.get(m.userID).toString()} toplam **${uyeToplam2}** üye davet etmiş. **(Siz)**`
      }

  }).join('\n');
    message.channel.send({embeds: [embed.setDescription(`Aşağı da \`${message.guild.name}\` sunucusunun en iyi davet yapanların sıralaması belirtilmiştir.\n\n${topTagli ? `${topTagli}\n${findedIndex}` : `\`${message.guild.name}\` sunucusun da davet bilgileri bulunamadı.`}`)]})
    })

    }
};

