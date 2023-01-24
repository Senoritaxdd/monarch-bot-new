const Discord = { MessageEmbed } = require("discord.js");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const InviteData = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const { genEmbed } = require("../../../../Global/Init/Embed");
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
module.exports = {
    Isim: "detaydenetim",
    Komut: ["textdenetim","yazıdenetim"],
    Kullanim: "detaydenetim <@rol/ID>",
    Aciklama: "Belirlenen role sahip üyelerin tüm ses ve mesaj detaylarını gösterir.",
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
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))&& !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.react(message.guild.emojiGöster(emojiler.Iptal))
    const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!rol) return message.reply({content: `${cevaplar.prefix} Denetleyebilmem için lütfen bir rol belirtiniz.`, ephemeral: true })
    if (rol.members.size === 0) return message.reply({content: `${cevaplar.prefix} Belirtilen rolde üye bulunamadığından işlem iptal edildi.`, ephemeral: true }),message.react(message.guild.emojiGöster(emojiler.Iptal))
    message.channel.send(`${rol} Rolündeki üyelerin ses, ve mesaj bilgilerini gönderiyorum. Bu işlem biraz zaman alabilir.\n\n`)
    let datasizlar = []
    message.guild.members.cache.filter(x => x.roles.cache.get(rol.id)).forEach(async (uye) => {
        let dataCheck = await Stats.findOne({userID: uye.id})
        if(!dataCheck) {
          datasizlar.push(uye)
        }
    })
  
        let Geneldenetim = await Stats.find({})
        Geneldenetim = Geneldenetim.filter(s => message.guild.members.cache.get(s.userID) && message.guild.members.cache.get(s.userID).roles.cache.has(rol.id));
          Geneldenetim.sort((uye1, uye2) => {
            return uye2.totalVoiceStats-uye1.totalVoiceStats;
        }).forEach(async (m, index) => {
            let uyeToplam = m.totalVoiceStats ? m.totalVoiceStats : 0;
            let haftalikSesListe = '';
            let önemliler = '';
            if(m.voiceStats) m.voiceStats.forEach((value, key) => { 
            if(_statSystem.voiceCategorys.find(x => x.id == key)) {
              let kategori = _statSystem.voiceCategorys.find(x => x.id == key);
              let kategoriismi = kategori.isim 
              if(_statSystem.fullPointChannels.some(x => x == key)) {
                önemliler += `\` • \` **${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : `Diğer Odalar` : '#Silinmiş'}** : \`${client.sureCevir(value)}\`\n`
              } else {
                haftalikSesListe += `\` • \` ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : `Diğer Odalar` : '#Silinmiş'}: \`${client.sureCevir(value)}\`\n`
              }
             }
            });
            let haftalikChatToplam = 0;
            let haftalikChatListe = 0
            m.chatStats.forEach(c => haftalikChatToplam += c);
            m.chatStats.forEach((value, key) => { if(key == _statSystem.generalChatCategory) haftalikChatListe = value });
             let Mesaj = '';
            if(!uyeToplam) {
              let bull = message.guild.members.cache.get(m.userID)
              if(bull) {
                let dataCheck = await Stats.findOne({userID: bull.id})
                if(dataCheck.totalVoiceStats <= 0) {
                  if(!datasizlar.find(x => x.id == bull.id)) {
                    datasizlar.push(bull)
                  }
                }
              }
             // Mesaj = `üyesinin **Hiç bir ses bilgisine ulaşılamadı!** ${message.guild.emojiGöster(emojiler.Iptal)}`

            } else {
              if(!haftalikSesListe)  {
                let bull = message.guild.members.cache.get(m.userID)
                if(bull) {
                  let dataCheck = await Stats.findOne({userID: bull.id})
                  if(dataCheck.totalVoiceStats <= 0) {
                    if(!datasizlar.find(x => x.id == bull.id)) {
                      datasizlar.push(bull)
                    }
                  }
                }
               }
              if(haftalikSesListe) Mesaj = `Üyesinin ses ve genel chat istatistik bilgileri aşağıda detaylı bir şekilde sıralandırılmıştır,
${haftalikSesListe ? `\` ••❯ \` **Seste Bulunduğu Kategoriler Aşağıda Sıralandırılmıştır** \` ⬇️ \`\n\` • \` **Genel Toplam Ses**: \`${uyeToplam ? client.sureCevir(uyeToplam) : `0 dk`}\`\n${önemliler ? `${önemliler}` : ''}${haftalikSesListe}` : ''}${haftalikChatListe ? `\` ••❯ \` **${ayarlar ? ayarlar.serverName : message.guild.name} Chat**: \`${haftalikChatListe} ✉️\` (toplam: \`${haftalikChatToplam} ✉️\`)\n` : ''}`
            }
            if(Mesaj.length > 1) message.channel.send(`──────────────────────\n${index == 0 ? `👑` : `**${index+1}.**`} ${message.guild.members.cache.get(m.userID).toString()} ${Mesaj ? Mesaj : " üyesinin hiç bir verisi bulunamadı!" }`)

     })
     let veriler = datasizlar.map((x, ind) => `\` ${ind + 1} \` ${x} (\`${x.id}\`)`).join("\n")
     if(datasizlar.length >= 1) {
      await message.channel.send(`${datasizlar ? `──────────────────────\n\` ••❯ \` **Veritabanında Hiç Bir Aktifliği Olmayan Üyeler Aşağıda Belirtilmiştir!**`: undefined}`).catch(err => {})
      const arr = Discord.Util.splitMessage(veriler, { maxLength: 2000, char: "\n" });
      for (const newText of arr) {
        message.channel.send(`${veriler}`)
      }
    }
  }
};