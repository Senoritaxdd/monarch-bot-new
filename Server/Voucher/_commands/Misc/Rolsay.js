const Discord = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "rolsay",
    Komut: ["rol-say"],
    Kullanim: "rolsay <Rol-ID>",
    Aciklama: "Belirtilen roldeki üyeleri sayar.",
    Kategori: "yönetim",
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
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt); 
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    if (!role) return message.reply({content: `${cevaplar.prefix} Sayabilmem için lütfen bir rol belirtiniz.`, ephemeral: true })
    const member = role.members.map(e => `<@!${e.id}>`).join(",")
    await message.channel.send(Discord.Formatters.codeBlock("js", `Sunucumuzda ${role.name} | ${role.id} rolünde ${role.members.size < 1 ? "kimse bulunmuyor" : role.members.size + " kişi bulunuyor"}`))
    if (role.members.size >= 1) {
        const arr = Discord.Util.splitMessage(member, { maxLength: 1950, char: "," });
        arr.forEach(element => {
            message.channel.send(Discord.Formatters.codeBlock("js", element));
        });
    }
   }
};