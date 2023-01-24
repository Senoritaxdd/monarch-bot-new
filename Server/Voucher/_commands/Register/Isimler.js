const { Client, Message, MessageEmbed} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
module.exports = {
    Isim: "isimler",
    Komut: ["isimsorgu"],
    Kullanim: "isimler <@acar/ID>",
    Aciklama: "Belirlenen üyenin önceki isim ve yaşlarını gösterir.",
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
    if(!ayarlar.tag) return message.channel.send(cevaplar.ayarlamayok);
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt)
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    if (!uye) return message.channel.send(cevaplar.üyeyok);
    let isimveri = await Users.findById(uye.id)
    if(isimveri && isimveri.Names) {
    let isimler = isimveri.Names.length > 0 ? isimveri.Names.reverse().map((value, index) => `\`${ayarlar.tag} ${value.Name}\` (${value.State}) ${value.Staff ? "(<@"+ value.Staff + ">)" : ""}`).join("\n") : "";
	message.channel.send({embeds: [new genEmbed().setDescription(`${uye} üyesinin toplamda **${isimveri.Names.length || 0}** isim kayıtı bulundu.\n${isimler}`)]})
    } else {
         message.channel.send({embeds: [new genEmbed().setDescription(`${uye} üyesinin isim kayıtı bulunamadı.`)]});
     }
    }
};