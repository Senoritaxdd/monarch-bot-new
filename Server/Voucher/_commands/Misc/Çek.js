const { Client, Message, MessageEmbed} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "çek",
    Komut: ["çek", "izinliçek"],
    Kullanim: "izinliçek @acar/ID",
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
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!message.member.voice.channel) return message.reply(`${cevaplar.prefix} Bir ses kanalında olman lazım.`).then(x => { setTimeout(() => {x.delete() }, 7500)});
    if (!member) return message.reply(`${cevaplar.prefix} Bir üye belirtmelisin.`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (message.member.id === member.id) return message.reply(`${cevaplar.prefix} Kendinin çekemezsin!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (message.member.voice.channel === member.voice.channel) return message.reply(`${cevaplar.prefix} Belirttiğin üyeyle aynı kanaldasın!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (!member.voice.channel) return message.reply(`${cevaplar.prefix} Belirtilen üye herhangi bir ses kanalında değil!`).then(x => { setTimeout(() => { x.delete() }, 7500)});
    if (member.user.bot) return message.reply(cevaplar.bot).then(x => { setTimeout(() => {x.delete() }, 7500)});
    if (message.member.roles.highest.position < uye.roles.highest.position) { 
    let msg = await message.channel.send({ content: `${member}`, embeds: [embed.setDescription(`${member}, ${message.author} adlı üye \`${message.member.voice.channel.name}\` odasına seni çekmek istiyor.\nKabul ediyor musun?`).setFooter("30 saniye içinde onaylanmazsa otomatik olarak iptal edilecektir.")] })
    let reactions = ["✅", "❌"];
    for (const reaction of reactions) await msg.react(reaction);
    const filter = (reaction, user) => { return reactions.some(emoji => emoji == reaction.emoji.name) && user.id === member.id }
    const collector = msg.createReactionCollector({ filter, time: 30000 })
    collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
            if (msg) msg.delete().catch(err => { });
            message.react(message.guild.emojiGöster(emojiler.Onay))
            await uye.voice.setChannel(message.member.voice.channel.id);
            await message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${message.author}, ${member} isimli üye senin odana gelme isteğini kabul etti.`)] })
            .then(x => setTimeout(() => {
                x.delete()
            }, 7500))
        } else if (reaction.emoji.name === "❌") {
            if (msg) msg.delete().catch(err => { });
            message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${message.author}, ${member} isimli üye senin odana gelme isteğini onaylamadı.`)] }).then(x => setTimeout(() => {
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
    } else {
        if (roller.teleportHammer.some(rol => message.member.roles.cache.has(rol)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || message.member.permissions.has('ADMINISTRATOR')) {
            await uye.voice.setChannel(message.member.voice.channel.id);
            message.react(message.guild.emojiGöster(emojiler.Onay))
            return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${message.member} isimli yetkili ${member} isimli üyeyi \`${message.member.voice.channel.name}\` isimli odaya çekti!`)]}).then(x => setTimeout(() => {
                x.delete()
            }, 7500))
        }
    }
    }
};