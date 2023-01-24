const { Client, Message, MessageEmbed} = require("discord.js");
const Kullanici = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "teyit",
    Komut: ["Teyit", "kayıtbilgi","kayıt-bilgi"],
    Kullanim: "teyit <@acar/ID>",
    Aciklama: "Belirtilen üye ve komutu kullanan üyenin teyit bilgilerini gösterir.",
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
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member.user;
    if (!uye) return message.channel.send(cevaplar.üyeyok);
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let teyit = await Kullanici.findOne({ _id: uye.id }) || [];
    let teyitBilgisi;
    if(teyit.Records){
      let erkekTeyit = teyit.Records.filter(v => v.Gender === "Erkek").length
      let kizTeyit = teyit.Records.filter(v => v.Gender === "Kadın").length
      let bazıları = teyit.Records.filter(v => message.guild.members.cache.get(v.User)).slice(0, 7).map((value, index) => message.guild.members.cache.get(value.User)).join(", ")
      let çıkanlar = teyit.Records.filter(v => !message.guild.members.cache.get(v.User)).length

      teyitBilgisi = `${uye} toplam **${erkekTeyit+kizTeyit}** üye kayıt etmiş! (**${erkekTeyit}** erkek, **${kizTeyit}** kadın, **${çıkanlar}** çıkanlar)\n${erkekTeyit+kizTeyit > 0 ? `Kaydettiği bazı kişiler: ${bazıları}`  : ''}`;
    } else { 
      teyitBilgisi = `${uye} isimli üyenin teyit bilgisi bulunamadı.`
    }
    message.channel.send({embeds: [new genEmbed().setAuthor(uye.tag, uye.avatarURL({dynamic: true})).setDescription(teyitBilgisi)]});
    }
};