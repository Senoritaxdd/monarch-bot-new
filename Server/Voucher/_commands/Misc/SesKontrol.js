const { Client, Message, MessageEmbed, Guild } = require("discord.js");
const { genEmbed } = require('../../../../Global/Init/Embed')
const joinedAt = require('../../../../Global/Databases/Schemas/Others/Users.JoinedAt');
const moment = require('moment')
module.exports = {
    Isim: "seskontrol",
    Komut: ["sesk", "n"],
    Kullanim: "seskontrol @acar/ID",
    Aciklama: "Belirlenen üyenin seste aktif veya haporleri ve kulaklığının açık veya kapalı olduğunu gösterir.",
    Kategori: "yönetim",
    Extend: true,
  /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.on("voiceStateUpdate", async (oldState, newState) => {
      if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
      if (!oldState.channelId && newState.channelId) await joinedAt.findOneAndUpdate({ _id: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
      let joinedAtData = await joinedAt.findOne({ _id: oldState.id });
      if (!joinedAtData) await joinedAt.findOneAndUpdate({ _id: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
      joinedAtData = await joinedAt.findOne({ _id: oldState.id });
      if (oldState.channelId && !newState.channelId) {
        await joinedAt.deleteOne({ _id: oldState.id });
      } else if (oldState.channelId && newState.channelId) {
        await joinedAt.findOneAndUpdate({ _id: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
      }
    })
  },
  /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   * @param {Guild} guild
   */
  onRequest: async (client, message, args) => {
    let embed = new genEmbed()
    if(roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt); 
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.react(message.guild.emojiGöster(emojiler.Iptal))
    if (!member.voice.channel) return message.channel.send({ embeds: [embed.setDescription(`${member} adlı kullanıcı herhangi bir ses kanalında değil.`)] });
            let joinedAtData = await joinedAt.findOne({ _id: member.id });
            let limit = member.voice.channel.userLimit || "~";
            let mic = member.voice.selfMute ? `kapalı` : `açık`
            let kulak = member.voice.selfDeaf ? `kapalı` : `açık`
            message.channel.send({ embeds: [embed.setDescription(`${member}, isimli üye <#${member.voice.channel.id}> (\`${member.voice.channel.members.size}/${limit}\` / \`${joinedAtData ? moment.duration(joinedAtData ? Date.now() - joinedAtData.date : 0).format("H [saat], m [dakika] s [saniye]") : "Süre bulunamadı"}\`) adlı ses kanalında bulunuyor ayrıca mikrofonu **${mic}**, kulaklığı **${kulak}**.`)] })
    }
};