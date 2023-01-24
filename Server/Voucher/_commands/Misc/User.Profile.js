const { Client, Message, MessageEmbed } = require("discord.js");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const moment = require("moment");
const { genEmbed } = require("../../../../Global/Init/Embed");
require("moment-duration-format");
module.exports = {
    Isim: "profil",
    Komut: ["me", "info"],
    Kullanim: "profil <@acar/ID>",
    Aciklama: "Belirlenen kişinin veya kullanan kişinin sunucu içerisindeki detaylarını ve discord içerisindeki bilgilerini aktarır.",
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
  let kullanici = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member;
  if(!kullanici) return message.channel.send(cevaplar.üyeyok);;
  let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member
  if(!uye) return message.channel.send(cevaplar.üyeyok);
  if(kullanici.bot) return message.channel.send(`${cevaplar.prefix} \`Kullanıcı BOT\` belirtilen kullanıcı bot olduğu için işlem iptal edildi.`);
  uye = message.guild.members.cache.get(kullanici.id)
  kullanici = message.guild.members.cache.get(uye.id)
  let yetkiliKullanim = await Users.findOne({ _id: uye.id })
  let cezapuanoku = await message.guild.members.cache.get(uye.id).cezaPuan() 
  let platform = { web: '`İnternet Tarayıcısı` `🌍`', desktop: '`PC (App)` `💻`', mobile: '`Mobil` `📱`' }
  let bilgi;
  let uyesesdurum;
  let yetkiliDurum;
  if(uye.presence && uye.presence.status !== 'offline') { bilgi = `\`•\` Bağlandığı Cihaz: ${platform[Object.keys(uye.presence.clientStatus)[0]]}` } else { bilgi = '`•` Bağlandığı Cihaz: Çevrimdışı `🔻`' }
  const embed = new genEmbed().setAuthor(kullanici.user.tag, kullanici.user.avatarURL({dynamic: true, size: 2048})).setThumbnail(kullanici.user.avatarURL({dynamic: true, size: 2048}))
  .addField(`${message.guild.emojiGöster(emojiler.uyeEmojiID)} **Kullanıcı Bilgisi**`, 
`\`•\` ID: \`${kullanici.id}\`
\`•\` Profil: ${kullanici}
\`•\` Oluşturulma Tarihi: \`${tarihsel(kullanici.user.createdAt)}\`
${bilgi}
\`•\` Ceza Puanı: \`${cezapuanoku}\`
\`•\` Katılma Tarihi: \`${tarihsel(uye.joinedAt)}\`
\`•\` Katılım Sırası: \`${(message.guild.members.cache.filter(a => a.joinedTimestamp <=uye.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}\`
\`•\` Rolleri (\`${uye.roles.cache.size - 1 >= 0 ? uye.roles.cache.size - 1 : 0}\`): ${uye.roles.cache.filter(x => x.name !== "@everyone").map(x => x).join(', ')}
${yetkiliKullanim ? yetkiliKullanim.Registrant ? `\`•\` Kayıt Eden Yetkili: ${message.guild.members.cache.get(yetkiliKullanim.Registrant) ? message.guild.members.cache.get(yetkiliKullanim.Registrant)  : `<@${yetkiliKullanim.Registrant}>`} `:"" :""}`)
  if(await uye.voice.channel) {
    uyesesdurum = `\`•\` Bulunduğu Kanal: ${uye.voice.channel}`
    uyesesdurum += `\n\`•\` Mikrofon Durumu: \`${uye.voice.selfMute ? '❌' : '✅'}\``
    uyesesdurum += `\n\`•\` Kulaklık Durumu: \`${uye.voice.selfDeaf ? '❌' : '✅'}\``
    if(uye.voice.selfVideo) uyesesdurum += `\n\`•\` Kamera Durumu: \`✅\``
    if(uye.voice.streaming) uyesesdurum += `\n\`•\` Yayın Durumu: \`✅\``
    embed.addField(`${message.guild.emojiGöster(emojiler.Terfi.icon)} __**Sesli Kanal Bilgisi**__`, uyesesdurum);
  }
if(roller.Yetkiler.some(x => uye.roles.cache.has(x)) || roller.kurucuRolleri.some(oku => uye.roles.cache.has(oku)) || uye.permissions.has('ADMINISTRATOR')) {
  if(yetkiliKullanim && yetkiliKullanim.Uses) {
    let uyari = yetkiliKullanim.Uses.Warns || 0
    let chatMute = yetkiliKullanim.Uses.Mutes || 0
    let sesMute = yetkiliKullanim.Uses.VoiceMute || 0
    let Kick = yetkiliKullanim.Uses.Kick || 0
    let ban = yetkiliKullanim.Uses.Ban || 0
    let jail = yetkiliKullanim.Uses.Jail || 0
    let forceban = yetkiliKullanim.Uses.Forceban || 0
    let toplam = uyari+chatMute+sesMute+Kick+ban+jail;
    yetkiliDurum = `toplam \`${toplam}\` yetki komutu kullanmış.\n(**${uyari}** uyarma, **${chatMute}** chat mute, **${sesMute}** ses mute, **${jail}** jail)\n(**${Kick}** atma, **${ban}** yasaklama, **${forceban}** kalkmaz yasaklama)`;
    embed.addField(`${message.guild.emojiGöster(emojiler.Terfi.icon)} **Yetki Kullanım Bilgisi**`, yetkiliDurum);
  }
}

message.channel.send({embeds: [embed]});



    }
};