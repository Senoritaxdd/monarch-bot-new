const { Client, Message, MessageEmbed} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Kullanici = require('../../../../Global/Databases/Schemas/Client.Users')
module.exports = {
    Isim: "topteyit",
    Komut: ["Topteyit"],
    Kullanim: "topteyit",
    Aciklama: "Sunucu genelindeki teyit sıralamasını gösterir.",
    Kategori: "teyit",
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
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
        const all = await Kullanici.find().sort();
    let teyit = all.filter(m => message.guild.members.cache.has(m._id) && m.Records).sort((uye1, uye2) => {
        let uye2Toplam2 = 0;
        uye2Toplam2 = uye2.Records.length
        let uye1Toplam2 = 0;
        uye1Toplam2 = uye1.Records.length
        return uye2Toplam2-uye1Toplam2;
    })
    .slice(0, 20)
    .map((value, index) => `\` ${index == 0 ? `👑` : index+1} \` ${value._id ? message.guild.members.cache.get(value._id) ? message.guild.members.cache.get(value._id) : `<@${value._id}>` : `<@${value._id}>`} toplam teyitleri \`${value.Records.filter(v => v.Gender === "Erkek").length + value.Records.filter(v => v.Gender === "Kadın").length}\` (\`${value.Records.filter(v => v.Gender === "Erkek").length || 0}\` Erkek, \`${value.Records.filter(v => v.Gender === "Kadın").length || 0}\` Kadın)  ${value._id == message.member.id ? `**(Siz)**` : ``}`)
    let findedIndex = ''
    let tqeqweyit = all.filter(m => message.guild.members.cache.has(m._id) && m.Records).sort((uye1, uye2) => {
        let uye2Toplam2 = 0;
        uye2Toplam2 = uye2.Records.length
        let uye1Toplam2 = 0;
        uye1Toplam2 = uye1.Records.length
        return uye2Toplam2-uye1Toplam2;
    }).map((value, index) => {
        let geneltoplamkayıtlar = value.Records.length
        let sira = ``
        if(value._id === message.member.id) sira = `${index + 1}`
        if(value._id === message.member.id) {
            if(geneltoplamkayıtlar != 0 && sira > 20) return findedIndex = `\` ${sira} \` ${message.guild.members.cache.get(value._id).toString()} toplam teyitleri \`${value.Records.filter(v => v.Gender === "Erkek").length + value.Records.filter(v => v.Gender === "Kadın").length}\` (\`${value.Records.filter(v => v.Gender === "Erkek").length || 0}\` Erkek, \`${value.Records.filter(v => v.Gender === "Kadın").length || 0}\` Kadın) **(Siz)**`
        }
        
    })
    message.channel.send({embeds: [new genEmbed().setDescription(`Aşağı da \`${message.guild.name}\` sunucusunun en iyi kayıt yapanların sıralaması belirtilmiştir.\n\n${teyit.join("\n") + `\n${findedIndex}` || `\`${message.guild.name}\` sunucusun da teyit bilgileri bulunamadı.`}`)]})
    }
};
