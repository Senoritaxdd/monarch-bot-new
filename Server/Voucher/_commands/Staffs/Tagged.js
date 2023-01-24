const { Client, Message, MessageButton, MessageActionRow } = require("discord.js");

const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "taglı",
    Komut: ["tagaldır","tagli","tag"],
    Kullanim: "tag <@acar/ID>",
    Aciklama: "Belirlenen üyeyi komutu kullanan üyenin taglısı olarak belirler.",
    Kategori: "stat",
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
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return;
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return;
    if(message.author.id === uye.id) return;
    if(!uye.user.username.includes(ayarlar.tag)) return;
    if(Date.now()-uye.user.createdTimestamp < 1000*60*60*24*7) return message.reply(cevaplar.yenihesap).then(x => {
      setTimeout(() => {
        x.delete()
      }, 7500);
    });
    let kontrol = await Users.findOne({_id: uye.id})
    if(kontrol && kontrol.Tagged) return message.channel.send(`${cevaplar.prefix} ${uye} isimli üye zaten bir başkası tarafından taglı olarak belirlenmiş.`);
    embed.setDescription(`${message.member.toString()} isimli yetkili seni taglı olarak belirlemek istiyor. Kabul ediyor musun?`);
    const msg = await message.channel.send({content: uye.toString(), embeds: [embed]});
    msg.react("✅");
    msg.react("❌");
    var filter = (reaction, user) => ["✅", "❌"].includes(reaction.emoji.name) && user.id === uye.id
    const collector = msg.createReactionCollector({filter, time: 30000})
    collector.on("collect", async (reaction, user) => {
      msg.delete().catch()
      if (reaction.emoji.name === '✅') {
          message.react(message.guild.emojiGöster(emojiler.Onay))
          await Users.updateOne({ _id: uye.id }, { $set: { "Tagged": true, "TaggedGiveAdmin": message.member.id } }, { upsert: true }).exec();
          await Users.updateOne({ _id: message.member.id }, { $push: { "Taggeds": { id: uye.id, Date: Date.now() } } }, { upsert: true }).exec();
          message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye.toString()} üyesi ${message.author} tarafından \`${tarihsel(Date.now())}\` tarihinde başarıyla taglı olarak belirledi!`)], components: []});
          let taglıLog = message.guild.kanalBul("taglı-log")
          if(taglıLog) taglıLog.send({embeds: [embed.setDescription(`${uye} isimli üye \`${tarihsel(Date.now())}\` tarihinde ${message.author} tarafından taglı olarak belirlendi.`)]})      
          client.Upstaffs.addPoint(message.member.id,_statSystem.points.tagged, "Taglı")
        } else {
          embed.setColor("RED");
          message.channel.send({content: message.member.toString(), components: [],embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${uye.toString()} üyesi, taglı belirleme teklifini reddetti!`)]});
          message.react(message.guild.emojiGöster(emojiler.Iptal))
      }    
 });
 collector.on("end", async (collected, reason) => {
  if (reason === "time") {
      if (msg) embed.setColor("RED"),msg.reactions.removeAll(),message.react(message.guild.emojiGöster(emojiler.Iptal))
      if (msg) msg.edit({content: message.member.toString(), embeds: [embed.setDescription(`${uye.toString()}, 30 saniye boyunca cevap vermediği için işlem iptal edildi.`)] });
      if (msg) {
        setTimeout(() => {
          msg.delete().catch()
        }, 10000);
      }
  }
});

    }
};