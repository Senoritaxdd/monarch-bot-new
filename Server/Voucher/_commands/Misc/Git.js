const { Client, Message, MessageEmbed} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "git",
    Komut: ["git", "izinligit"],
    Kullanim: "izinligit @acar/ID",
    Aciklama: "Belirlenen üyeye izin ile yanına gider.",
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
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!message.member.voice.channel) return message.reply(`${cevaplar.prefix} Bir ses kanalında olman lazım.`).then(x => { setTimeout(() => {x.delete() }, 7500)});
    if (!member) return message.reply(`${cevaplar.prefix} Bir üye belirtmelisin.`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (message.member.id === member.id) return message.reply(`${cevaplar.prefix} Kendinin yanına da gitmezsin!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (message.member.voice.channel === member.voice.channel) return message.reply(`${cevaplar.prefix} Belirttiğin üyeyle aynı kanaldasın!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (!member.voice.channel) return message.reply(`${cevaplar.prefix} Belirtilen üye herhangi bir ses kanalında değil!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (member.user.bot) return message.reply(cevaplar.bot).then(x => { setTimeout(() => {x.delete() }, 7500)});
    if (message.member.permissions.has('ADMINISTRATOR') || roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) {
        message.react(message.guild.emojiGöster(emojiler.Onay))
        await message.member.voice.setChannel(member.voice.channel.id)
        return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${message.member} isimli yetkili ${member} (\`${member.voice.channel.name}\`) isimli üyenin odasına gitti!`)]}).then(x => setTimeout(() => {
            x.delete()
        }, 7500))
    }
    
    let msg = await message.channel.send({ content: `${member}`, embeds: [embed.setDescription(`${member}, ${message.author} adlı üye \`${member.voice.channel.name}\` odasına gelmek istiyor.\nKabul ediyor musun?`).setFooter("İstek 30 saniye içinde onaylanmazsa otomatik olarak iptal edilecektir.")] })
    let reactions = ["✅", "❌"];
    for (const reaction of reactions) await msg.react(reaction);
    const filter = (reaction, user) => { return reactions.some(emoji => emoji == reaction.emoji.name) && user.id === member.id }
    const collector = msg.createReactionCollector({ filter, time: 30000 })
    collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
            if (msg) msg.delete().catch(err => { });
            message.react(message.guild.emojiGöster(emojiler.Onay))
            await message.member.voice.setChannel(member.voice.channel.id)
            await message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${message.author}, ${member} isimli üye senin odaya gelme isteğini kabul etti.`)] })
            .then(x => setTimeout(() => {
                x.delete()
            }, 7500))
        } else if (reaction.emoji.name === "❌") {
            if (msg) msg.delete().catch(err => { });
            message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${message.author}, ${member} isimli üye senin odaya gelme isteğini onaylamadı.`)] }).then(x => setTimeout(() => {
                x.delete()
            }, 7500))
        }
    });
    collector.on("end", async (collected, reason) => {
        if (reason === "time") {
            if (msg) msg.delete().catch(err => { });
            message.channel.send({ embeds: [embed.setDescription(`${member}, 30 saniye boyunca cevap vermediği için işlem iptal edildi.`)] }).then(x => setTimeout(() => {
                x.delete()
            }, 7500))
        }
    });
    }
};