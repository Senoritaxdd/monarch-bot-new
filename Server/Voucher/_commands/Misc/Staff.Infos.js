const { Client, Message, MessageEmbed } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

module.exports = {
    Isim: "yetkilidurum",
    Komut: ["yetkili-ses","ses-yetkili","yetkili-durum"],
    Kullanim: "yetkilidurum",
    Aciklama: "",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {

    if(!ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return;
    let roles = message.guild.roles.cache.get(roller.altilkyetki);
    let yonetimRoles = message.guild.roles.cache.get(roller.altYönetimRolleri[0]);

    let onlineOlupSesteOlmayan = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.permissions.has('ADMINISTRATOR') &&
    !uye.roles.cache.has(roller.kurucuRolleri) &&
    uye.roles.highest.position >= roles.position &&
    uye.presence 
    && uye.presence.status !== "offline" && !uye.voice.channel)

    let yönetimAktifAmaSesteYok = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.permissions.has('ADMINISTRATOR') &&
    !uye.roles.cache.has(roller.kurucuRolleri) &&
    uye.roles.highest.position >= yonetimRoles.position &&
    uye.presence 
    && uye.presence.status !== "offline" && !uye.voice.channel)

    let yonetimToplam = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.permissions.has('ADMINISTRATOR') &&
    !uye.roles.cache.has(roller.kurucuRolleri) &&
    uye.roles.highest.position >= yonetimRoles.position)

    let yonetimSesteOlmayanlar = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.permissions.has('ADMINISTRATOR') &&
    !uye.roles.cache.has(roller.kurucuRolleri) &&
    uye.roles.highest.position >= yonetimRoles.position &&
    !uye.voice.channel)

    let sesteOlmayanYetkililer = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.permissions.has('ADMINISTRATOR') &&
    !uye.roles.cache.has(roller.kurucuRolleri) &&
    uye.roles.highest.position >= roles.position &&
    !uye.voice.channel)

    let toplamYetkililer = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.permissions.has('ADMINISTRATOR') &&
    !uye.roles.cache.has(roller.kurucuRolleri) &&
    uye.roles.highest.position >= roles.position &&
    !uye.voice.channel)

    let altYönetimSesteOlmayanlar  = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.permissions.has('ADMINISTRATOR') &&
    !uye.roles.cache.has(roller.kurucuRolleri) &&
    roller.altYönetimRolleri.some(x => uye.roles.cache.get(x)) &&
    !uye.voice.channel)

    let altYönetim = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.permissions.has('ADMINISTRATOR') &&
    !uye.roles.cache.has(roller.kurucuRolleri) &&
    roller.altYönetimRolleri.some(x => uye.roles.cache.get(x)))

    
    let ortaYönetimSesteOlmayanlar  = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.permissions.has('ADMINISTRATOR') &&
    !uye.roles.cache.has(roller.kurucuRolleri) &&
    roller.yönetimRolleri.some(x => uye.roles.cache.get(x)) &&
    !uye.voice.channel)

    let ortaYönetim = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.permissions.has('ADMINISTRATOR') &&
    !uye.roles.cache.has(roller.kurucuRolleri) &&
    roller.yönetimRolleri.some(x => uye.roles.cache.get(x)))


    let üstYönetimSesteOlmayanlar  = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.permissions.has('ADMINISTRATOR') &&
    !uye.roles.cache.has(roller.kurucuRolleri) &&
    roller.üstYönetimRolleri.some(x => uye.roles.cache.get(x)) &&
    !uye.voice.channel)

    let üstYönetim = message.guild.members.cache.filter(uye => !uye.user.bot && !uye.permissions.has('ADMINISTRATOR') &&
    !uye.roles.cache.has(roller.kurucuRolleri) &&
    roller.üstYönetimRolleri.some(x => uye.roles.cache.get(x)))

    message.channel.send({embeds: [new genEmbed().setDescription(`Aşağıda ki yetkili bilgileri \`${message.guild.name}\` sunucusuna ait anlık verilerdir.`)
    .addField(`${message.guild.emojiGöster(emojiler.Icon)} Genel Yetkili Bilgisi`, `
\` ••❯ \` Toplam Yetkili: \` ${toplamYetkililer.size} \`
\` ••❯ \` Seste Olmayan Yetkili: \` ${sesteOlmayanYetkililer.size} \`
\` ••❯ \` Aktif Olup Seste Olmayan Yetkili: \` ${onlineOlupSesteOlmayan.size} \`
\` ••❯ \` Toplam Yönetim: \` ${yonetimToplam.size} \`
\` ••❯ \` Seste Olmayan Yönetim: \` ${yonetimSesteOlmayanlar.size} \`
\` ••❯ \` Aktif Olup Seste Olmayan Yönetim: \` ${yönetimAktifAmaSesteYok.size} \`
`)
.addField(`${message.guild.emojiGöster(emojiler.Icon)} Alt Yönetim Bilgisi`, `
\` ••❯ \` Toplam Alt-Yönetim: \` ${altYönetim.size} \`
\` ••❯ \` Seste Olmayan Alt-Yönetim: \` ${altYönetimSesteOlmayanlar.size} \`
`)
.addField(`${message.guild.emojiGöster(emojiler.Icon)} Orta Yönetim Bilgisi`, `
\` ••❯ \` Toplam Orta-Yönetim: \` ${ortaYönetim.size} \`
\` ••❯ \` Seste Olmayan Orta-Yönetim: \` ${ortaYönetimSesteOlmayanlar.size} \`
`)
.addField(`${message.guild.emojiGöster(emojiler.Icon)} Üst Yönetim Bilgisi`, `
\` ••❯ \` Toplam Üst-Yönetim: \` ${üstYönetim.size} \`
\` ••❯ \` Seste Olmayan Üst-Yönetim: \` ${üstYönetimSesteOlmayanlar.size} \`
`)

    ]})
    }
}

