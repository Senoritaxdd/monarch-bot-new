const Discord = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "denetim",
    Komut: ["denetim"],
    Kullanim: "denetim",
    Aciklama: "Belirtilen bir rolün üyelerinin seste olup olmadığını ve rol bilgilerini gösterir.",
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
    if (!args[0] || !args[0].toLowerCase() === "rol" && !args[0].toLowerCase() === "kanal") return message.channel.send({ embeds: [embed.setDescription(`Lütfen \`rol/kanal\` olmak üzere geçerli bir eylem belirtiniz ${emojiler.dikkat}`)]})
    if (args[0].toLowerCase() === "rol") {
      const audit = await message.guild.fetchAuditLogs({ type: 'ROLE_DELETE' }).then(a => a.entries)
      const denetim = audit.filter(e => Date.now() - e.createdTimestamp < 1000 * 60 * 60).map(e => `${message.guild.emojiGöster(emojiler.Iptal)} ID: ${e.target.id} (\`@${e.changes.filter(e => e.key === 'name').map(e => e.old)}\`)`)
      if (!denetim.length) return message.channel.send({ embeds: [embed.setDescription(`Son 1 saat de silinmiş herhangi bir rol bulunamadı!`)]})
      let arr = '';
      denetim.forEach(element => {
         arr += element + "\n"
      });
      message.channel.send({embeds: [embed.setDescription(`Son 1 saat içinde **${denetim.length || 0}** adet rol silinmiş.`).addField(`Roller`, arr)]})
    } else if (args[0].toLowerCase() === "kanal") {
      const audit = await message.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' }).then(a => a.entries)
      const denetim = audit.filter(e => Date.now() - e.createdTimestamp < 1000 * 60 * 60).map(e => `${message.guild.emojiGöster(emojiler.chatSusturuldu)} ID: ${e.target.id} (\`${e.changes.filter(e => e.key === 'name').map(e => e.old)}\`)`)
      if (!denetim.length) return message.channel.send({ embeds: [embed.setDescription(`Son 1 saat de silinmiş herhangi bir kanal bulunamadı!`)]})
      let arr = '';
      denetim.forEach(element => {
         arr += element + "\n"
      });
      message.channel.send({embeds: [embed.setDescription(`Son 1 saat içinde **${denetim.length || 0}** adet kanal silinmiş.`).addField(`Kanallar`, arr)]})
    }
   }
};