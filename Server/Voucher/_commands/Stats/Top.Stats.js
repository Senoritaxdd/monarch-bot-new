const {MessageEmbed} = require("discord.js");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "top",
    Komut: ["topmesaj","topstat","topses"],
    Kullanim: "top",
    Aciklama: "Belirlenen üye veya kullanan üye eğer ki yetkiliyse onun yetki atlama bilgilerini gösterir.",
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
     const embed = new genEmbed()
    Stats.find({guildID: message.guild.id}).exec((err, data) => {
        data = data.filter(m => message.guild.members.cache.has(m.userID));
        let genelsesbirinci;
        let publicbirinci;
        let mesajbirinci;
        let streamerbirinci;

        genelPublic = ``
        let PublicListele = data.sort((uye1, uye2) => {
            let uye2Toplam = 0;
            if(uye2.voiceStats) uye2.voiceStats.forEach((x, key) => {
                if(key == kanallar.publicKategorisi) uye2Toplam += x
            });
            let uye1Toplam = 0;
            if(uye1.voiceStats) uye1.voiceStats.forEach((x, key) => {
                if(key == kanallar.publicKategorisi) uye1Toplam += x
            });
            return uye2Toplam-uye1Toplam;
        }).slice(0, 5).map((m, index) => {
            let uyeToplam = 0;
            if(index == 0) publicbirinci = message.guild.members.cache.get(m.userID).toString()
            m.voiceStats.forEach((x, key) => { if(key == kanallar.publicKategorisi) uyeToplam += x });
            return `\` ${index + 1} \` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam)}\` ${m.userID == message.member.id ? `**(Siz)**` : ``}`;
        }).join('\n');
        genelStreamer = ``
        let streamerListele = data.sort((uye1, uye2) => {
            let uye2Toplam = 0;
            if(uye2.voiceStats) uye2.voiceStats.forEach((x, key) => {
                if(key == kanallar.streamerKategorisi) uye2Toplam += x
            });
            let uye1Toplam = 0;
            if(uye1.voiceStats) uye1.voiceStats.forEach((x, key) => {
                if(key == kanallar.streamerKategorisi) uye1Toplam += x
            });
            return uye2Toplam-uye1Toplam;
        }).slice(0, 5).map((m, index) => {
            let uyeToplam = 0;
            if(index == 0) streamerbirinci = message.guild.members.cache.get(m.userID).toString()
            m.voiceStats.forEach((x, key) => { if(key == kanallar.streamerKategorisi) uyeToplam += x });
            return `\` ${index + 1} \` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam)}\` ${m.userID == message.member.id ? `**(Siz)**` : ``}`;
        }).join('\n');
       let genelSes = ``;
       let sesSıralaması = data.sort((uye1, uye2) => {
            let uye2Toplam2 = 0;
            if(uye2.voiceStats) uye2.voiceStats.forEach(x => uye2Toplam2 += x);
            let uye1Toplam2 = 0;
            if(uye1.voiceStats) uye1.voiceStats.forEach(x => uye1Toplam2 += x);
            return uye2Toplam2-uye1Toplam2;
        }).slice(0, 5).map((m, index) => {
            let uyeToplam2 = 0;
            if(index == 0) genelsesbirinci = message.guild.members.cache.get(m.userID).toString()
            if(m.voiceStats) m.voiceStats.forEach(x => uyeToplam2 += x);
            return `\` ${index + 1} \` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyeToplam2)}\` ${m.userID == message.member.id ? `**(Siz)**` : ``}`;
        }).join('\n');
        let genelMesaj = ``
        let mesajSıralaması = data.sort((uye1, uye2) => {
            let uye2Toplam = 0;
            if(uye2.voiceStats) uye2.chatStats.forEach(x => uye2Toplam += x);
            let uye1Toplam = 0;
            if(uye1.voiceStats) uye1.chatStats.forEach(x => uye1Toplam += x);
            return uye2Toplam-uye1Toplam;
        }).slice(0, 5).map((m, index) => {
            let uyeToplam = 0;
            if(m.voiceStats) m.chatStats.forEach(x => uyeToplam += x);
            if(index == 0) mesajbirinci = message.guild.members.cache.get(m.userID).toString()
            return `\` ${index + 1} \` ${message.guild.members.cache.get(m.userID).toString()} \`${Number(uyeToplam)} mesaj\` ${m.userID == message.member.id ? `**(Siz)**` : ``}`;
        }).join('\n');

            // SIRALAMA BUL

         let AMCIKKK = data.sort((uye1, uye2) => {
            let uye2Toplam = 0;
            if(uye2.voiceStats) uye2.voiceStats.forEach((x, key) => {
                if(key == kanallar.publicKategorisi) uye2Toplam += x
            });
            let uye1Toplam = 0;
            if(uye1.voiceStats) uye1.voiceStats.forEach((x, key) => {
                if(key == kanallar.publicKategorisi) uye1Toplam += x
            });
            return uye2Toplam-uye1Toplam;
        }).map((m, index) => {
            let uyee = 0;
            let sira = ``
            if(m.userID === message.member.id) sira = `${index + 1}`
            if(m.userID === message.member.id) m.voiceStats.forEach((x, key) => { if(key == kanallar.publicKategorisi) uyee += x });
            if(m.userID === message.member.id) {
                if(uyee != 0 && sira > 5) return genelPublic = `\` ${sira} \` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyee)}\` **(Siz)**`
              }
            
           
            
        })

        let YARRAMMMM = data.sort((uye1, uye2) => {
            let uye2Toplam = 0;
            if(uye2.voiceStats) uye2.chatStats.forEach(x => uye2Toplam += x);
            let uye1Toplam = 0;
            if(uye1.voiceStats) uye1.chatStats.forEach(x => uye1Toplam += x);
            return uye2Toplam-uye1Toplam;
        }).map((m, index) => {
            let uyee = 0;
            let sira = ``
            if(m.userID === message.member.id) sira = `${index + 1}`
            if(m.userID === message.member.id) {
                if(m.voiceStats) m.chatStats.forEach(x => uyee += x);
            }
            if(m.userID === message.member.id) {
                if(uyee != 0 && sira > 5) return genelMesaj = `\` ${sira} \` ${message.guild.members.cache.get(m.userID).toString()} \`${uyee} mesaj\` **(Siz)**`
            } 
            
        })
        let kamerayigotunesokim = data.sort((uye1, uye2) => {
            let uye2Toplam = 0;
            if(uye2.voiceStats) uye2.voiceStats.forEach((x, key) => {
                if(key == kanallar.streamerKategorisi) uye2Toplam += x
            });
            let uye1Toplam = 0;
            if(uye1.voiceStats) uye1.voiceStats.forEach((x, key) => {
                if(key == kanallar.streamerKategorisi) uye1Toplam += x
            });
            return uye2Toplam-uye1Toplam;
        }).map((m, index) => {
            let uyee = 0;
            let sira = ``
            if(m.userID === message.member.id) sira = `${index + 1}`
            if(m.userID === message.member.id) m.voiceStats.forEach((x, key) => { if(key == kanallar.streamerKategorisi) uyee += x });
            if(m.userID === message.member.id) {
              if(uyee != 0 && sira > 5) return genelStreamer = `\` ${sira} \` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyee)}\` **(Siz)**`
            }
        })
        let amgotmeme = data.sort((uye1, uye2) => {
            let uye2Toplam2 = 0;
            if(uye2.voiceStats) uye2.voiceStats.forEach(x => uye2Toplam2 += x);
            let uye1Toplam2 = 0;
            if(uye1.voiceStats) uye1.voiceStats.forEach(x => uye1Toplam2 += x);
            return uye2Toplam2-uye1Toplam2;
        }).map((m, index) => {
            let uyee = 0;
            let sira = ``
            if(m.userID === message.member.id) sira = `${index + 1}`
            if(m.userID === message.member.id && m.voiceStats) m.voiceStats.forEach(x => uyee += x);
            if(m.userID === message.member.id) {
                if(uyee != 0 && sira > 5) return genelSes = `\` ${sira} \` ${message.guild.members.cache.get(m.userID).toString()} \`${client.sureCevir(uyee)}\` **(Siz)**`
            }
        })

        embed.setThumbnail(message.guild.iconURL({dynamic: true}))
        embed.setDescription(`\`${message.guild.name}\` sunucusuna ait \`Haftalık\` ses ve mesaj sıralaması aşağıda sıralandırılmıştır.\n\n\n`);
        embed.addField("` ••❯ ` Haftanın En İyileri", `
\` 👑 Public \` ${publicbirinci.id == message.member.id ? publicbirinci + " **(Siz)**" : publicbirinci}
\` 👑 Streamer \` ${streamerbirinci.id == message.member.id ? streamerbirinci + " **(Siz)**" : streamerbirinci}
\` 👑 Genel \` ${genelsesbirinci.id == message.member.id ? genelsesbirinci + " **(Siz)**" : genelsesbirinci}
\` 👑 Mesaj \` ${mesajbirinci.id == message.member.id ? mesajbirinci + " **(Siz)**" : mesajbirinci}`)
        embed.addField(`${message.guild.emojiGöster(emojiler.voiceDeaf)} Genel Ses Sıralaması`, sesSıralaması ? sesSıralaması + `\n${genelSes ? genelSes : `\` - \` ${message.member} \`Sıralamada bulunmuyorsun.\``}` : "` ••❯ ` Veritabanında bir kayıt bulunamadı.",false);
        embed.addField(`${message.guild.emojiGöster(emojiler.voiceDeaf)} Genel Public Sıralaması`, PublicListele ? PublicListele + `\n${genelPublic ? genelPublic : `\` - \` ${message.member} \`Sıralamada bulunmuyorsun.\``}` : "` ••❯` Veritabanında bir kayıt bulunamadı.",false);
        embed.addField(`${message.guild.emojiGöster(emojiler.sesMuteKaldırıldı)} Genel Streamer Sıralaması`, streamerListele ? streamerListele + `\n${genelStreamer ? genelStreamer : `\` - \` ${message.member} \`Sıralamada bulunmuyorsun.\``}` : "Veritabanında bir kayıt bulunamadı..", false);
        embed.addField(`${message.guild.emojiGöster(emojiler.chatMuteKaldırıldı)} Genel Mesaj Sıralaması`, mesajSıralaması ? mesajSıralaması + `\n${genelMesaj ? genelMesaj : `\` - \` ${message.member} \`Sıralamada bulunmuyorsun.\``}` : "` ••❯ ` Veritabanında bir kayıt bulunamadı.",false);

    
     
        message.channel.send({embeds: [embed]})
    });
  }
};