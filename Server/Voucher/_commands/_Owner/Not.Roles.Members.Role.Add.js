const { Client, Message, MessageEmbed} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

module.exports = {
    Isim: "rolsuzver",
    Komut: ["rolsüzver"],
    Kullanim: "rolsüzver",
    Aciklama: "",
    Kategori: "kurucu",
    Extend: false,
    
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
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.react(message.guild.emojiGöster(emojiler.Iptal))
    let rolsuzuye =  message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guildId).size == 0);
    rolsuzuye.forEach(roluolmayanlar => { 
    roller.kayıtsızRolleri.some(x => roluolmayanlar.roles.add(x).catch(err => {})) 
    });
    message.channel.send({embeds: [embed.setDescription(`Sunucuda rolü olmayan \`${rolsuzuye.size}\` üyeye kayıtsız rolü verilmeye başlandı!`).setFooter(`bu işlem biraz zaman alabilir.`)]}).then(x => {
        setTimeout(() => {
            x.delete()
        }, 7500);
    })

    message.react(message.guild.emojiGöster(emojiler.Onay))
    }
};