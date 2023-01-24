const { MessageEmbed, MessageButton, MessageActionRow, Util } = require("discord.js");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const InviteData = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const Tasks = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Tasks');
const moment = require('moment');
const ms = require('ms')
const { genEmbed } = require("../../../../Global/Init/Embed");
require('moment-duration-format');
require('moment-timezone');
const table = require('table');

module.exports = {
    Isim: "görevyönetim",
    Komut: ["görevsistemi","görev-yönetim"],
    Kullanim: "görevsistemi <ver-dağıt-günlük-temizle-kaldır-güncelle-senkron>",
    Aciklama: "Belirlenen üye veya kullanan üye eğer ki yetkiliyse onun yetki atlama bilgilerini gösterir.",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.yetkiliSesSureCevir = (date) => { return moment.duration(date).format('H'); };
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let embed = new genEmbed()
    if(!ayarlar.staff.includes(message.member.id) && !message.member.permissions.has("ADMINISTRATOR") && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) return message.react(message.guild.emojiGöster(emojiler.Iptal));
    let process = ["ver", "temizle", "listele"]
    let seçenek = args[0]
    if(!seçenek && process.some(x => args[0] != x)) return message.channel.send(`${cevaplar.prefix} Lütfen doğru argüman kullanın! "${process.map(x => x).join(",")}" geçerlidir.`);
    if(seçenek == "listele") {
      await Tasks.find({}).exec(async (err, res) => {
        if(err) return message.channel.send('Hata: `Bazı hatalar oluştu :(`').then(x => x.delete({timeout: 5000}));
        let data = [["ID","Rol İsmi", "Genel Tüm Sesler","Public, Streamer ve Kayıt", "Davet", "Kayıt", "Taglı", "Yetkili","Ödül","Oluşturulma Tarihi"]];
        data = data.concat(res.map((value, index) => {          
            return [
                `#${index + 1}`,
                `${message.guild.roles.cache.get(value.roleID) ? message.guild.roles.cache.get(value.roleID).name : "@Rol Yok!"}`,
                `${value.AllVoice} Saat`,
                `${value.publicVoice} Saat`,
                `${value.Invite}`,
                `${value.Register}`,
                `${value.Tagged}`,
                `${value.Staff}`,
                `${value.Reward}`,
                `${tarihsel(value.Date)}`,
            ]
        }));
        let veriler = table.table(data, {
          border: {
            topBody: `─`,
            topJoin: `┬`,
            topLeft: `┌`,
            topRight: `┐`,
        
            bottomBody: `─`,
            bottomJoin: `┴`,
            bottomLeft: `└`,
            bottomRight: `┘`,
        
            bodyLeft: `│`,
            bodyRight: `│`,
            bodyJoin: `│`,
        
            joinBody: `─`,
            joinLeft: `├`,
            joinRight: `┤`,
            joinJoin: `┼`
          },
          drawHorizontalLine: function (index, size) {
              return index === 0 || index === 1 || index === size;
          }
       });
       message.channel.send({content: `${message.guild.emojiGöster(emojiler.Tag)} \`${message.guild.name}\` isimli sunucunun görev listesi aşağıda belirtilmiştir.`})
       const arr = Util.splitMessage(veriler, { maxLength: 2000, char: "\n" });
       for (const newText of arr) {
         message.channel.send(`\`\`\`${newText}\`\`\``)
       }
      })
    }
    if(seçenek == "forcedelete") {
      let belirle = await Tasks.findOne({roleID: args[1]}) 
      if(!belirle) return message.react(message.guild.emojiGöster(emojiler.Iptal));
      let uyeler = belirle.Users
      if(uyeler) {
        uyeler.forEach(async (uye) => {
          await Upstaffs.updateOne({_id: uye}, {$set: {"Mission": {
            Tagged: 0,
            Register: 0,
            Invite: 0,
            Staff: 0,
            completedMission: 0,
            CompletedStaff: false,
            CompletedInvite: false,
            CompletedAllVoice: false,
            CompletedPublicVoice: false,
            CompletedTagged: false,
            CompletedRegister: false,
          }}}, {upsert: true})
          await Stats.updateOne({guildID: sistem.SERVER.ID, userID: uye}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})
        })
     message.channel.send(`${message.guild.emojiGöster(emojiler.sarıYıldız)} ${belirle.Users.filter(x => message.guild.members.cache.get(x)).map(x => message.guild.members.cache.get(x).user.tag).slice(0,2).join(", ")} ${uyeler.size > 2 ? `ve ${uyeler.size - 2} daha fazlası...` : ''} üyeler(üyelerin) \`${args[1]}\` idli rolüne ait görev bilgileri temizlendi. `)
      }
      await Tasks.deleteOne({roleID: args[1]})
      setTimeout(() => {
        message.react(message.guild.emojiGöster(emojiler.Onay))
      }, 1750)
    }
    if(seçenek == "temizle") {
      let belirle = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.mentions.members.first() || message.guild.members.cache.get(args[1])
      if(!belirle) return message.react(message.guild.emojiGöster(emojiler.Iptal));
      let logKanal = message.guild.kanalBul("görev-log")
      if(message.guild.roles.cache.get(belirle.id)) {
        let uyeler = belirle.members
        let görevData = await Tasks.findOne({roleID: belirle.id})
        if(!görevData) return message.react(message.guild.emojiGöster(emojiler.Iptal));
        if(logKanal) await logKanal.send({embeds: [embed.setDescription(`${belirle} rolününe ait olan ${uyeler.map(x => x).slice(0,2).join(", ")} ${uyeler.size > 2 ? `ve ${uyeler.size - 2} daha fazlası...` : ''} üyeler(üyelerin) \`${tarihsel(Date.now())}\` tarihinde ${message.member} tarafından tüm görev bilgileri temizlendi.`)]})
        let loading = await message.channel.send(`${message.guild.emojiGöster(emojiler.sarıYıldız)} ${uyeler.map(x => x.user.tag).slice(0,2).join(", ")} ${uyeler.size > 2 ? `ve ${uyeler.size - 2} daha fazlası...` : ''} üyeler(üyelerin) \`${belirle.name}\` rolüne ait görev bilgileri temizleniyor... `)
        uyeler.forEach(async (uye) => {
          await Tasks.findOneAndUpdate({ $pull: { Users: uye.id }})
          await Upstaffs.updateOne({_id: uye.id}, {$set: {"Mission": {
            Tagged: 0,
            Register: 0,
            Invite: 0,
            Staff: 0,
            completedMission: 0,
            CompletedStaff: false,
            CompletedInvite: false,
            CompletedAllVoice: false,
            CompletedPublicVoice: false,
            CompletedTagged: false,
            CompletedRegister: false,
          }}}, {upsert: true})
          await Stats.updateOne({guildID: sistem.SERVER.ID, userID: uye.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})
        })
        setTimeout(async () => {
          await Tasks.deleteOne({roleID: belirle.id})
          loading.edit({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla **${uyeler.size}** üyenin görev bilgileri temizlendi.`}).then(x => {
            setTimeout(() => {
              loading.delete()
            }, 7500)
            message.react(message.guild.emojiGöster(emojiler.Onay))
          })
        }, 2000)

      } else if(message.guild.members.cache.get(belirle.id)) {
        let görevData = await Tasks.findOne({Users: belirle.id})
        if(!görevData) return message.react(message.guild.emojiGöster(emojiler.Iptal));
        await Tasks.findOneAndUpdate({ $pull: { Users: belirle.id }})
        await Upstaffs.updateOne({_id: belirle.id}, {$set: {"Mission": {
          Tagged: 0,
          Register: 0,
          Invite: 0,
          Staff: 0,
          completedMission: 0,
          CompletedStaff: false,
          CompletedInvite: false,
          CompletedAllVoice: false,
          CompletedPublicVoice: false,
          CompletedTagged: false,
          CompletedRegister: false,
        }} }, {upsert: true})
         await Stats.updateOne({guildID: sistem.SERVER.ID, userID: belirle.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})
        if(logKanal) await logKanal.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${belirle} üyesinin \`${tarihsel(Date.now())}\` tarihinde ${message.member} tarafından tüm görevleri temizlendi.`)]})
        message.channel.send(`${message.guild.emojiGöster(emojiler.sarıYıldız)} ${belirle} üyesinin tüm görev bilgileri başarıyla temizlendi. `)
        message.react(message.guild.emojiGöster(emojiler.Onay))
      
      }
    }
    
    if(seçenek == "ver") {
      let rol = message.mentions.roles.first() || message.guild.roles.cache.get([args[1]]) || await message.guild.rolBul(args[1])
      if(!rol) return message.reply({content: `${cevaplar.prefix} Lütfen görev verebilmem için bir rol etiketlemelisin.`, ephemeral: true}),message.react(message.guild.emojiGöster(emojiler.Iptal));
      let genelSes = args[2]
      if(!genelSes) return message.reply({content: `${cevaplar.prefix} Lütfen Tüm Ses Kanalları görevi için bir saat belirleyin.`, ephemeral: true}),message.react(message.guild.emojiGöster(emojiler.Iptal));
      let publicSes = args[3]
      if(!publicSes) return message.reply({content: `${cevaplar.prefix} Lütfen Public/Streamer/Register görevi için bir saat belirleyin.`, ephemeral: true}),message.react(message.guild.emojiGöster(emojiler.Iptal));
        
      let Taglı = args[4]
      if(!Taglı) return message.reply({content: `${cevaplar.prefix} Lütfen Taglı görevi için bir miktar belirleyin.`, ephemeral: true}),message.react(message.guild.emojiGöster(emojiler.Iptal));
        
      let Yetkili = args[5]
      if(!Yetkili) return message.reply({content: `${cevaplar.prefix} Lütfen Yetkili görevi için bir miktar belirleyin.`, ephemeral: true}),message.react(message.guild.emojiGöster(emojiler.Iptal));
        
      let Register = args[6]
      if(!Register) return message.reply({content: `${cevaplar.prefix} Lütfen Kayıt görevi için bir miktar belirleyin.`, ephemeral: true}),message.react(message.guild.emojiGöster(emojiler.Iptal));
        
      let Invite = args[7]
      if(!Invite) return message.reply({content: `${cevaplar.prefix} Lütfen Davet görevi için bir miktar belirleyin.`, ephemeral: true}),message.react(message.guild.emojiGöster(emojiler.Iptal));
        
      let Ödül = args[8]
      if(!Ödül) return message.reply({content: `${cevaplar.prefix} Lütfen bir görev puanı ve ${ayarlar.serverName} coin belirleyin.`, ephemeral: true}),message.react(message.guild.emojiGöster(emojiler.Iptal));
      let Süre = args[9]
      let görevPush;
      let görevData = await Tasks.findOne({Active: true, roleID: rol.id})
      if(görevData) {
        await Tasks.deleteOne({Active: true, roleID: rol.id})
      }
      görevPush = { Active: true, AllVoice: genelSes, publicVoice: publicSes, Tagged: Taglı, Staff: Yetkili, Register: Register, Invite: Invite, Reward: Ödül }
      let amcıklar = []
      let verilcekÜyeler = message.guild.roles.cache.get(rol.id).members
      message.guild.roles.cache.get(rol.id).members.forEach(async (orospuevladı) => {
        amcıklar.push(orospuevladı.id)
        await Stats.updateOne({guildID: sistem.SERVER.ID, userID: orospuevladı.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})
        await Users.updateOne({_id: orospuevladı.id}, {$set: { "Staff": true }}, { upsert:true })
        await Upstaffs.updateOne({_id: orospuevladı.id}, { $set: {"Mission": {
          Tagged: 0,
          Register: 0,
          Invite: 0,
          Staff: 0,
          completedMission: 0,
          CompletedStaff: false,
          CompletedInvite: false,
          CompletedAllVoice: false,
          CompletedPublicVoice: false,
          CompletedTagged: false,
          CompletedRegister: false,
        }, "Yönetim": true }})
      })
      
      await Tasks.updateOne({roleID: rol.id}, {$set: görevPush, $push: {Users: amcıklar}}, {upsert: true}).exec()
      let görevBilgilendirme = message.guild.kanalBul("görev-bilgi")
      if(görevBilgilendirme) görevBilgilendirme.send({content: `${message.guild.roles.cache.get(rol.id)}`, embeds: [embed.setTitle(`${message.guild.emojiGöster(emojiler.sarıYıldız)} Bir Görev Daha Eklendi!`).setDescription(`${message.guild.emojiGöster(emojiler.Görev.Kek)} ${rol} rolünde bulunan ${verilcekÜyeler.map(x => x).slice(0,2).join(", ")} ${verilcekÜyeler.size > 2 ? `ve ${verilcekÜyeler.size - 2} daha fazlası...` : ''} üyeye(üyelerine) görev taktim edildi.`)]})
      verilcekÜyeler.forEach(sünnetsizibneler => {
        sünnetsizibneler.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.sarıYıldız)} ${sünnetsizibneler} sana bir görev verildi görev bilgilerini öğrenmek için lütfen **${sistem.botSettings.Prefixs[0]}yetkim** komutundan detaylı bakabilirsin.`)]}).catch(err => {
        })
      })
      message.react(message.guild.emojiGöster(emojiler.Onay))
    }


  
  }
};

