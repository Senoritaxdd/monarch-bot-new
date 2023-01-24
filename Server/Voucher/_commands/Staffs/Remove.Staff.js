const { Client, Message, MessageButton, MessageActionRow } = require("discord.js");
const Upstaff = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "yetkiçek",
    Komut: ["yçek","ytçek","yetkicek","ycek"],
    Kullanim: "yetkiçek <@acar/ID>",
    Aciklama: "Belirlenen üyeyi komutu kullanan üyenin taglısı olarak belirler.",
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
    let embed = new genEmbed()
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    let kontrol = await Users.findOne({_id: uye.id}) || { Staff: false}
    if(kontrol && !kontrol.Staff) return message.channel.send(`${cevaplar.prefix} ${uye}, isimli üye yetkili olarak tanımlı değil!`);
    uye.removeStaff(uye.roles.cache, true)
    let altYetki = message.guild.roles.cache.get(roller.altilkyetki)
    if(altYetki) await uye.roles.remove(uye.roles.cache.filter(rol => altYetki.position <= rol.position)).catch(err => {});
    let yetkiliLog = message.guild.kanalBul("yetki-çek-log")
    if(yetkiliLog) yetkiliLog.send({embeds: [embed.setDescription(`${message.author} isimli yetkili ${uye.toString()} isimli üyenin \`${tarihsel(Date.now())}\` tarihinde yetkisini aldı!`)]})
     message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye.toString()} isimli üyenin yetkisi alındı.`)]})
    .then(x => {
      message.react(message.guild.emojiGöster(emojiler.Onay))
      setTimeout(() => {
        x.delete()
      }, 7500);
    }) 
    
    }
};