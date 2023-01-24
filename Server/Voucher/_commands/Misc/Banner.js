const { Client, Message, MessageEmbed} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "banner",
    Komut: ["arkaplan", "arkap" ],
    Kullanim: "banner <@acar/ID>",
    Aciklama: "Belirtilen üyenin arka plan resmini büyültür.",
    Kategori: "diğer",
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
    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    const bannerHash = (await client.api.users[victim.id].get()).banner;
    if(!bannerHash) return message.channel.send(`${cevaplar.prefix} Belirtilen Üyenin Arkaplanı Bulunmadı!`)
    const banner = !bannerHash ? `https://images-ext-2.discordapp.net/external/-OXbEcwb-h30h0TQmUM7xCOemMmn4lZeJtZMpSgWMtg/%3Fsize%3D4096/https/cdn.discordapp.com/banners/852681367853465610/a_364822477a2e994552905134288a64b2.gif` : `https://cdn.discordapp.com/banners/${
      victim.id
    }/${bannerHash}${bannerHash.startsWith("a_") ? ".gif" : ".png"}?size=4096`; 
    let avatar = victim.avatarURL({ dynamic: true, size: 2048 });
    embed
        .setAuthor(victim.tag, avatar)
	    .setDescription(`[Arkaplan Resmi İçin TIKLA](${banner})`)
	    .setImage(banner)
    message.channel.send({embeds: [embed]});
    }
};