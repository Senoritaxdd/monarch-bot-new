const { MessageEmbed, MessageAttachment} = require("discord.js");
const Canvas = require("canvas");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const Upstaff = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const moment = require('moment');
const { genEmbed } = require("../../../../Global/Init/Embed");
const ms = require('ms')
require('moment-duration-format');
require('moment-timezone');
module.exports = {
    Isim: "stat",
    Komut: ["stat","seslerim","mesajlarım"],
    Kullanim: "stat <@acar/ID>",
    Aciklama: "Belirlenen üye veya kendinizin istatistik bilgilerine bakarsınız",
    Kategori: "stat",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.sureCevir = (duration) => {  
      let arr = []
      if (duration / 3600000 > 1) {
        let val = parseInt(duration / 3600000)
        let durationn = parseInt((duration - (val * 3600000)) / 60000)
        arr.push(`${val} saat`)
        arr.push(`${durationn} dk.`)
      } else {
        let durationn = parseInt(duration / 60000)
        arr.push(`${durationn} dk.`)
      }
      return arr.join(", ") };
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */
  
  onRequest: async function (client, message, args) { 
    let embed = new genEmbed()
    let kullArray = message.content.split(" ");
    let kullaniciId = kullArray.slice(1);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(kullaniciId[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullaniciId.slice(0).join(" ") || x.user.username === kullaniciId[0]) || message.member;
      Stats.findOne({ guildID: message.guild.id, userID: uye.id }, async (err, data) => {
        let Upstaffs = await Upstaff.findOne({_id: uye.id})
        if (!data) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} \`${message.guild.name}\` sunucuna ait bir istatistik verisi bulunamadı.`, ephemeral: true})
        let haftalikSesToplam = 0;
        let haftalikSesListe = '';
        let canvasSesListe = ''
        let canvasChatListe = ''
        let müzikOdalar = '';
        let müzikToplam = 0;
        let public = 0;
        let register = 0;
        if(data.voiceStats) {
          data.voiceStats.forEach(c => haftalikSesToplam += c);
          data.voiceStats.forEach((value, key) => {
                if(key == kanallar.publicKategorisi) public += value
          });
          
     

          data.voiceStats.forEach((value, key) => {
            if(_statSystem.musicRooms.some(x => x === key)) müzikToplam += value
          });
          data.voiceStats.forEach((value, key) => { 
          if(_statSystem.voiceCategorys.find(x => x.id == key)) {
            let kategori = _statSystem.voiceCategorys.find(x => x.id == key);
            let kategoriismi = kategori.isim 
               haftalikSesListe += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : `Diğer Odalar` : '#Silinmiş'}: \`${client.sureCevir(value)}\`\n`
               canvasSesListe += `${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : `Diğer Odalar` : '#Silinmiş'}: ${client.sureCevir(value)}\n`
                
            }
        
          });
          if(müzikToplam > 0) haftalikSesListe += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Müzik Odalar: \`${client.sureCevir(müzikToplam)}\``, canvasSesListe += `Müzik Odalar: ${client.sureCevir(müzikToplam)}`
        }
        let haftalikChatToplam = 0;
        data.chatStats.forEach(c => haftalikChatToplam += c);
        let haftalikChatListe = '';
        data.chatStats.forEach((value, key) => {
        if(_statSystem.chatCategorys.find(x => x.id == key)) {
        let kategori = _statSystem.chatCategorys.find(x => x.id == key);
        let mesajkategoriismi = kategori.isim
        haftalikChatListe += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? mesajkategoriismi ? mesajkategoriismi : message.guild.channels.cache.get(key).name : '#Silinmiş'}: \`${value}\`\n`
        canvasChatListe += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? mesajkategoriismi ? mesajkategoriismi : message.guild.channels.cache.get(key).name : '#Silinmiş'}: ${value} mesaj\n`  
        }
        });
        if(uye.id == message.member.id) {
          if(ayarlar && ayarlar.statRozet) {
            let rozetbir = roller.statRozetOne
            let rozetiki = roller.statRozetTwo
            let rozetuc = roller.statRozetThree
            let rozetdort = roller.statRozetFour
            let rozetbes = roller.statRozetFive
            if(parseInt(public) < ms("14h")) {
              uye.roles.remove(rozetbir).catch(err => {})
              uye.roles.remove(rozetiki).catch(err => {})
              uye.roles.remove(rozetuc).catch(err => {})
              uye.roles.remove(rozetdort).catch(err => {})
              uye.roles.remove(rozetbes).catch(err => {})
            }
            if(parseInt(public) < ms("15h")) embed.addField("` ••❯ ` Rozet Durumu", `Ah güzel dostum henüz bir rozete sahip değilsin. <@&${rozetbir}> rozetini elde etmek için sohbet kanallarıda  \`${getContent(ms("15h") - public)}\` geçirmen gerekiyor.`, false)
            if(parseInt(public) > ms("15h") && parseInt(public) < ms("30h")) embed.addField("` ••❯ ` Rozet Durumu", `Tebrikler <@&${rozetbir}> rozetine sahipsin! Bir sonraki <@&${rozetiki}> rozetini elde etmek için sohbet kanallarıda  \`${getContent(ms("30h") - public)}\` geçirmen gerekiyor.`, false)
            if(parseInt(public) > ms("30h") && parseInt(public) < ms("45h")) embed.addField("` ••❯ ` Rozet Durumu", `Tebrikler <@&${rozetiki}> rozetine sahipsin! Bir sonraki <@&${rozetuc}> rozetini elde etmek için sohbet kanallarıda  \`${getContent(ms("45h") - public)}\` geçirmen gerekiyor.`, false)
            if(parseInt(public) > ms("45h") && parseInt(public) < ms("60h")) embed.addField("` ••❯ ` Rozet Durumu", `Tebrikler <@&${rozetuc}> rozetine sahipsin! Bir sonraki <@&${rozetdort}> rozetini elde etmek için sohbet kanallarıda  \`${getContent(ms("60h") - public)}\` geçirmen gerekiyor.`, false)
            if(parseInt(public) > ms("60h") && parseInt(public) < ms("80h")) embed.addField("` ••❯ ` Rozet Durumu", `Tebrikler <@&${rozetdort}> rozetine sahipsin! Bir sonraki <@&${rozetbes}> rozetini elde etmek için sohbet kanallarıda  \`${getContent(ms("80h") - public)}\` geçirmen gerekiyor.`, false)
            if(parseInt(public) > ms("80h")) embed.addField("` ••❯ ` Rozet Durumu", `İnanılmazsın! <@&${rozetbes}> rozetine sahipsin! Bu rozeti taşımak sana bir his vermeli!`, false)
            if(parseInt(public) > ms("15h") && parseInt(public) < ms("30h") && !uye.roles.cache.has(rozetbir)) {
              if(parseInt(public) > ms("15h") && parseInt(public) < ms("30h") && !uye.roles.cache.has(rozetbir)) {
                uye.roles.add(rozetbir)
                embed.addField("✨ Tebrikler, yeni rozet!", `Toplam sohbet odalarında süren 15 saati geçtiği için <@&${rozetbir}> rolünü kazandın! Bir sonraki <@&${rozetiki}> rolünü elde etmek için \`${getContent(ms("30h") - public)}\` geçirmen gerekiyor.`, false)
              }
            }
            if(parseInt(public) > ms("30h") && parseInt(public) < ms("45h") && !uye.roles.cache.has(rozetiki)) {
              if(!uye.roles.cache.has(rozetiki)) {
                uye.roles.remove(rozetbir).catch(err => {})
                uye.roles.add(rozetiki)
                embed.addField("✨ Tebrikler, yeni rozet!", `Toplam sohbet odalarında süren 30 saati geçtiği için <@&${rozetiki}> rolünü kazandın! Bir sonraki <@&${rozetuc}> rolünü elde etmek için \`${getContent(ms("45h") - public)}\` geçirmen gerekiyor.`, false)
              }
            }
            if(parseInt(public) > ms("45h") && parseInt(public) < ms("60h") && !uye.roles.cache.has(rozetuc)) {
              if(!uye.roles.cache.has(rozetuc)) {
                uye.roles.remove(rozetiki).catch(err => {})
                uye.roles.add(rozetuc)
                embed.addField("✨ Tebrikler, yeni rozet!", `Toplam sohbet odalarında süren 45 saati geçtiği için <@&${rozetuc}> rolünü kazandın! Bir sonraki <@&${rozetdort}> rolünü elde etmek için \`${getContent(ms("60h") - public)}\` geçirmen gerekiyor.`, false)
              }
            }
            if(parseInt(public) > ms("60h") && parseInt(public) < ms("80h") && !uye.roles.cache.has(rozetdort)) {
              if(!uye.roles.cache.has(rozetdort)) {
                uye.roles.remove(rozetuc).catch(err => {})
                uye.roles.add(rozetdort)
                embed.addField("✨ Tebrikler, yeni rozet!", `Toplam sohbet odalarında süren 60 saati geçtiği için <@&${rozetdort}> rolünü kazandın! Bir sonraki <@&${rozetbes}> rolünü elde etmek için \`${getContent(ms("80h") - public)}\` geçirmen gerekiyor.`, false)
              }
            }
            if(parseInt(public) > ms("80h") && !uye.roles.cache.has(rozetbes)) {
              if(!uye.roles.cache.has(rozetbes)) {
                uye.roles.remove(rozetdort).catch(err => {})
                uye.roles.add(rozetbes)
                embed.addField("✨ Tebrikler, yeni rozet!", `Toplam sohbet odalarında süren 80 saati geçtiği için <@&${rozetbes}> rolünü kazandın! Üstün aktifliğinden dolayı sana teşekkür ederiz.`, false)
              }
            }
          }
        }
        if(ayarlar && !ayarlar.statRozet) embed.setThumbnail(uye.user.avatarURL({dynamic: true, size: 2048}))
        if(Upstaffs && Upstaffs.Görev) embed.setFooter(uye.user.tag + ` ${Upstaffs.Görev} Görev Puanı Bulunmakta!`, uye.user.avatarURL({dynamic: true, size: 2048}))
        if(args[0] == "kart") {
          const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');
        
            let fontSize = 70;
        
            do {
                ctx.font = `${fontSize -= 10}px sans-serif`;
            } while (ctx.measureText(text).width > canvas.width - 300);
        
            return ctx.font;
        };
        const canvas = Canvas.createCanvas(670, 630);
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(0 + Number(30), 0);
            ctx.lineTo(0 + 670 - Number(30), 0);
            ctx.quadraticCurveTo(0 + 670, 0, 0 + 670, 0 + Number(30));
            ctx.lineTo(0 + 670, 0 + 630 - Number(30));
            ctx.quadraticCurveTo(
            0 + 670,
            0 + 630,
            0 + 670 - Number(30),
            0 + 630
            );
            ctx.lineTo(0 + Number(30), 0 + 630);
            ctx.quadraticCurveTo(0, 0 + 630, 0, 0 + 630 - Number(30));
            ctx.lineTo(0, 0 + Number(30));
            ctx.quadraticCurveTo(0, 0, 0 + Number(30), 0);
            ctx.closePath();
            ctx.clip();
            const background = await Canvas.loadImage("https://pbs.twimg.com/ext_tw_video_thumb/1412375853967757314/pu/img/rbpfJo63APiPJGKi.jpg");  
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
          ctx.font ='35px bebas neue',
            ctx.fillStyle = '#ffffff';
            let isimchecker = uye.user.tag
            let size = isimchecker.length
            let i = 0
              if(size < 4) i = 2.99
              if(size > 4) i = 2.99
              if(size > 9) i = 3.20
              if(size > 12) i = 3.40
              if(size > 15) i = 3.60 
            ctx.fillText(`${uye.user.tag}`, canvas.width / i, canvas.height / 3);
          
          ctx.font ='23px bebas neue',
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${Upstaffs ? `   ${Upstaffs.Görev} Görev Puanı Bulunmakta` : "Daha önce görev puanı bulunamadı"}`, canvas.width / 4.95 , canvas.height / 2.46);
  
          ctx.font ='23px bebas neue',
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`Toplam Ses Bilgisi: ${client.sureCevir(haftalikSesToplam)}\n${canvasSesListe}`, canvas.width / 11, canvas.height / 2.05);
        
              const avatar = await Canvas.loadImage(uye.user.displayAvatarURL({ format: 'png' }));
         ctx.save();
            roundedImage(ctx, 250, 20, 150, 150, 25);
            ctx.clip();
          ctx.drawImage(avatar, 250, 20, 150, 150);
          ctx.closePath();
        
          // Clip off the region you drew on
          ctx.clip();
        
          function roundedImage(ctx, x, y, width, height, radius) {
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
        }
          
          const attachment = new MessageAttachment(canvas.toBuffer(), 'acar.png');
          message.react(message.guild.emojiGöster(emojiler.Onay))
          return message.reply({ content: `:tada: Aşağıda ${message.member.id == uye.id ? `**${message.guild.name}** sunucusuna ait sesli sohbet bilgi kartın görüntüleniyor.` : `${uye} isimli üyenin **${message.guild.name}** sunucusuna ait sesli sohbet bilgi kartı görüntüleniyor.`}`, files: [attachment]})
        } 
        message.channel.send({embeds: [embed
            .setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true, size: 2048}))
            .setDescription(`${uye} (${uye.roles.highest}) üyesinin \`${message.guild.name}\` sunucusunda haftalık ses ve mesaj bilgileri aşağıda belirtilmiştir.`)
            .addField(`${message.guild.emojiGöster(emojiler.voiceDeaf)} Ses Sıralaması`,`${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Toplam: \`${client.sureCevir(haftalikSesToplam)}\`
${haftalikSesListe ? haftalikSesListe ? haftalikSesListe : haftalikSesListe : `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Ses istatistiği bulunamadı.`}`, ayarlar.statRozet )                        
  .addField(`${message.guild.emojiGöster(emojiler.chatMuteKaldırıldı)} Mesaj Sıralaması`,`${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Toplam: \`${haftalikChatToplam}\`
${haftalikChatListe ? haftalikChatListe ? haftalikChatListe : haftalikChatListe : `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Mesaj istatistiği bulunamadı.`}`, ayarlar.statRozet)]}
          );
       });
  }
};

function capitalizeIt(str) {
  if (str && typeof (str) === "string") {
    str = str.split(" ");
    for (var i = 0, x = str.length; i < x; i++) {
      if (str[i]) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
      }
    }
    return str.join(" ");
  } else {
    return str;
  }
}
function getContent(duration) {
  let arr = []
  if (duration / 3600000 > 1) {
    let val = parseInt(duration / 3600000)
    let durationn = parseInt((duration - (val * 3600000)) / 60000)
    arr.push(`${val} saat`)
    arr.push(`${durationn} dk.`)
  } else {
    let durationn = parseInt(duration / 60000)
    arr.push(`${durationn} dk.`)
  }
  return arr.join(", ")
}