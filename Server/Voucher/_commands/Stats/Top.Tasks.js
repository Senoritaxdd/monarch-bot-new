const { Client, Message, MessageEmbed} = require("discord.js");
const Invite = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "topgörev",
    Komut: ["toptasks","top-görev","top-tasks","topgorev"],
    Kullanim: "topgörev",
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
      data = data.filter(m => message.guild.members.cache.has(m._id));
      let topTagli = data.filter(x => x.Görev).sort((uye1, uye2) => {
        let uye2Toplam2 = 0;
        uye2Toplam2 = uye2.Görev
        let uye1Toplam2 = 0;
        uye1Toplam2 = uye1.Görev
        return uye2Toplam2-uye1Toplam2;
    }).slice(0, 20).map((m, index) => {
        let uyeToplam2 = 0;
        uyeToplam2 = m.Görev
        return `\` ${index == 0 ? `👑` : `${index+1}`} \` ${message.guild.members.cache.get(m._id).toString()} \`${uyeToplam2} Görev Puanı\` ${m._id == message.member.id ? `**(Siz)**` : ``}`;
    }).join('\n');
    let findedIndex = ''
    let findIndex = data.filter(x => x.Görev).sort((uye1, uye2) => {
        let uye2Toplam2 = 0;
        uye2Toplam2 = uye2.Görev
        let uye1Toplam2 = 0;
        uye1Toplam2 = uye1.Görev
        return uye2Toplam2-uye1Toplam2;
    }).map((m, index) => {
        let uyee = m.Görev;
    let sira = ``
    if(m._id === message.member.id) sira = `${index + 1}`
    if(m._id === message.member.id) {
        if(uyee != 0 && sira > 20) return findedIndex = `\` ${sira} \` ${message.guild.members.cache.get(m._id).toString()} \`${uyee} Görev Puanı\` **(Siz)**`
    }
    })
    message.channel.send({embeds: [embed.setDescription(`Aşağı da \`${message.guild.name}\` sunucusunun en iyi görev yapanların sıralaması belirtilmiştir.\n\n${topTagli ? `${topTagli}\n${findedIndex}` : `\`${message.guild.name}\` sunucusun da görev sıralama bilgileri bulunamadı.`}`)]})
    })

    }
};