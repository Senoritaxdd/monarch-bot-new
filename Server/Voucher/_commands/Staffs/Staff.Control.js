const { MessageEmbed, MessageButton, MessageActionRow,  MessageSelectMenu } = require("discord.js");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const Invites = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaff = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const Unleash = require('../../../../Global/Databases/Schemas/Plugins/Guıild.Remove.Staffs');
const moment = require('moment');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "yetki",
    Komut: ["yetkilianaliz","upstaff","staff"],
    Kullanim: "yetki <@acar/ID>",
    Aciklama: "Belirlenen yetkilinin sunucu içerisinde ki bilgileri gösterir ve yükseltir düşürür.",
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
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let kullanıcı = message.mentions.users.first() || message.guild.members.cache.get(args[0])
    if (!kullanıcı) return message.react(message.guild.emojiGöster(emojiler.Iptal))
    let uye = message.guild.members.cache.get(kullanıcı.id);
    if (!uye) return message.react(message.guild.emojiGöster(emojiler.Iptal))
    if(uye.id == message.member.id) return message.react(message.guild.emojiGöster(emojiler.Iptal))
    if(!uye.user.username.includes(ayarlar.tag)) return message.react(message.guild.emojiGöster(emojiler.Iptal));
    if(roller.kayıtsızRolleri.some(x => uye.roles.cache.has(x))) return message.react(message.guild.emojiGöster(emojiler.Iptal));
    if(Date.now()-uye.user.createdTimestamp < 1000*60*60*24*7 && !ayarlar.staff.includes(message.member.id)) return message.react(message.guild.emojiGöster(emojiler.Iptal)); 
    let userData = await Users.findOne({_id: uye.id}) 
    let taglıUser = await userData ? userData.Taggeds ? `${userData.Taggeds.length} üye` || `Veri bulunamadı.` : `Veri bulunamadı.` : `Veri bulunamadı.`
    let teyitUser = await userData ? userData.Records ? `${userData.Records.length} üye` || `Veri bulunamadı.` : `Veri bulunamadı.` : `Veri bulunamadı.`
    let yetkiliUser = await userData ? userData.Staffs ? `${userData.Staffs.length} üye` || `Veri bulunamadı.` : `Veri bulunamadı.` : `Veri bulunamadı.`
    let davetUser = await Invites.findOne({userID: uye.id}) || { regular: 0, bonus: 0, fake: 0, total: 0 };
    let Upstaffs = await Upstaff.findOne({_id: uye.id})
    let data = await Stats.findOne({ userID: uye.id })
    
          let haftalikSesToplam = 0;
          let haftalikSesListe = '';
          let haftalikChatToplam = 0;
          let haftalikChatListe = '';
          let müzikToplam = 0;
  if(data) {
    if(data.voiceStats) {
      data.voiceStats.forEach((value, key) => {
            if(_statSystem.musicRooms.some(x => x === key)) müzikToplam += value
      });
      data.voiceStats.forEach(c => haftalikSesToplam += c);
      data.upstaffVoiceStats.forEach((value, key) => { 
      if(_statSystem.voiceCategorys.find(x => x.id == key)) {
        let kategori = _statSystem.voiceCategorys.find(x => x.id == key);
        let kategoriismi = kategori.isim 
        haftalikSesListe += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : `Diğer Odalar` : '#Silinmiş'}: \`${client.sureCevir(value)}\`\n`
       }
      });
      if(müzikToplam && müzikToplam > 0) haftalikSesListe += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Müzik Odalar: \`${client.sureCevir(müzikToplam)}\``
    }
    data.chatStats.forEach(c => haftalikChatToplam += c);
    data.upstaffChatStats.forEach((value, key) => {
            if(key == _statSystem.generalChatCategory) haftalikChatListe = `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? `${ayarlar.serverName} Chat` ? `${ayarlar.serverName} Chat` : message.guild.channels.cache.get(key).name : '#Silinmiş'}: \`${value} mesaj\``
    });
  
  }
  let rolBilgileri = []
  let rolLer = []
  let rolGetir = _statSystem.staffs.filter(x => !uye.roles.cache.has(x.rol)).forEach(rol => {
    let rolBilgi = message.guild.roles.cache.get(rol.rol)
    if(rolBilgi) {
        rolLer.push(rol.rol)
       rolBilgileri.push([
           {label: rolBilgi.name, description: "", emoji: {id: message.guild.emojiGöster(emojiler.Terfi.icon).id}, value: rol.rol}
       ])
    }
})

  let button1 = new MessageButton()
  .setCustomId('ykslt')
  .setLabel('⏫ Yükseltme' + ` ${Upstaffs ? '' : '(Yetki Seçilmeli)'}`)
  .setDisabled(Upstaffs ? false : true)
  .setStyle('SECONDARY')
  let button2 = new MessageButton()
  .setCustomId('dsr')
  .setLabel('⏬ Düşürme' + ` ${Upstaffs ? '' : '(Yetki Seçilmeli)'}`)
  .setDisabled(Upstaffs ? false : true)
  .setStyle('SECONDARY')
  let button4 = new MessageButton()
  .setCustomId('bilgilendirme')
  .setLabel('❗ Bilgilendirme')
  .setStyle('PRIMARY')
  let button3 = new MessageButton()
  .setCustomId('buttoniptal')
  .setLabel('Kapat')
  .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
  .setStyle('DANGER')
  
  let rolMenu =  new MessageSelectMenu()
  .setCustomId(`seç`)
  .setPlaceholder('💠 Hızlı yetki düzenleme listesi')
  .addOptions([
      rolBilgileri.reverse().slice(0, 25)
  ])
  
  
  let satir1 = new MessageActionRow().addComponents(
      button1,
      button2,
      button4,
      button3
  )
  
  let satir2 = new MessageActionRow().addComponents(
      rolMenu
  )

let msg;
if(!Upstaffs ) {
  let yetkiSalma = await Unleash.findOne({_id: uye.id})
  if(yetkiSalma) {
    if(yetkiSalma.unleashPoint >= 2 && !ayarlar.staff.includes(message.member.id)) {
      return message.channel.send({embeds: [new genEmbed().setFooter(`${yetkiSalma.unleashPoint} yetki salma hakkı bulunmakta.`).setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${uye} isimli üyesi birden fazla kez yetki saldığından dolayı işlem yapılamıyor.`)]}).then(x => {
        setTimeout(() => {
          x.delete()
        }, 12500);
        message.react(message.guild.emojiGöster(emojiler.Iptal))
      })
    }
  }
  msg = await message.channel.send({content: `${uye} üyesi yetkili değil, yetki vermek istiyorsanız aşağıda ki menüden seçiniz!`, components: [satir2]})
} else {
  let yetkibul = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => uye.roles.cache.has(x.rol)))]
  let altyetkisi =  _statSystem.staffs[_statSystem.staffs.indexOf(yetkibul)-1];
  let üstyetkisi = _statSystem.staffs[_statSystem.staffs.indexOf(yetkibul)+1];
  let yetkiSalma = await Unleash.findOne({_id: uye.id})
  if(yetkiSalma) {
    if(yetkiSalma.unleashPoint >= 2 && !ayarlar.staff.includes(message.member.id)) {
      return message.channel.send({embeds: [new genEmbed().setFooter(`${yetkiSalma.unleashPoint} yetki salma hakkı bulunmakta.`).setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${uye} isimli üyesi birden fazla kez yetki saldığından dolayı işlem yapılamıyor.`)]}).then(x => {
        setTimeout(() => {
          x.delete()
        }, 12500);
        message.react(message.guild.emojiGöster(emojiler.Iptal))
      })
    }
  }
  message.react(message.guild.emojiGöster(emojiler.Onay))
    msg = await message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.sarıYıldız)} ${uye} (\`${uye.id}\`) adlı üyenin yetkili verileri.\n
${userData ? userData.StaffGiveAdmin ? `\` ••❯ \` Sorumlusu: ${message.guild.members.cache.get(userData.StaffGiveAdmin)}` : `\` ••❯ \` Sorumlusu: \`Belirlenmedi.\`` : `\` ••❯ \` Sorumlusu: \`Belirlenmedi.\``}
${Upstaffs ? Upstaffs.Baslama ? `\` ••❯ \` Yetkiye Başlama Tarihi: \`${tarihsel(Upstaffs.Baslama)}\`` : `\` ••❯ \` Yetkiye Başlama Tarihi: \`Belirlenemedi.\``: `\` ••❯ \` Yetkiye Başlama Tarihi: \`Belirlenemedi.\``}
${Upstaffs ? Upstaffs.Görev >= 1 ? `\` ••❯ \` Yetki Görev Puanı: \`${Upstaffs.Görev} Görev Puanı\`\n` : `` : ``}${yetkibul ? `\` ••❯ \` Şuan ki Yetkisi: ${message.guild.roles.cache.get(yetkibul.rol) ? message.guild.roles.cache.get(yetkibul.rol) : uye.roles.hoist} ${Upstaffs.Yönetim ? "(\`Yönetim\`)" : "(\`Normal Yetkili\`)"}` : `` }
${yetkiSalma ? `\` ••❯ \` Yetki Salma Hakkı: \`${yetkiSalma.unleashPoint ? yetkiSalma.unleashPoint : 0} Hak\` ${yetkiSalma.unleashPoint >= 1 ? `(${yetkiSalma.unleashPoint == 1 ? `**Tolerans:** \`+1 Hak => %50.23\`` : `\`Hak Doldu!\``})
\` ••❯ \` Yetki Salmadan Önceki Rolleri:\n${yetkiSalma ? yetkiSalma.unleashRoles.map(x => `\` • \` ${message.guild.roles.cache.get(x)} (\`${x}\`)`).join("\n") : `${message.guild.emojiGöster(emojiler.Onay)} Veritabanına bir rol veya bir veri bulunamadı!`}` : ``}\n` : ``}${altyetkisi ? `\` ⏬ \` **Düşürülme** İşleminde Alacağı Yetki: ${altyetkisi.rol ? message.guild.roles.cache.get(altyetkisi.rol)  : "@rol bulunamadı"}\n` : `` }${üstyetkisi ? `\` ⏫ \` **Yükseltilme** İşleminde Alacağı Yetki: ${üstyetkisi.rol ? message.guild.roles.cache.get(üstyetkisi.rol) : "@rol bulunamadı"}` : `` }`).setFooter('yetki seçimi, yükseltme ve düşürme işlemlerinde verilen görevler veyada puanlama tablosu sıfırlanır.')],  components: [satir2, satir1] })
        

    
}

var filter = (button) => button.user.id === message.member.id;
let collector = await msg.createMessageComponentCollector({filter, errors: ["time"], time: 20000 })

    collector.on("collect", async (button) => {
      if(button.customId === "bilgilendirme") {
        button.reply({embeds: [new genEmbed().setDescription(`Aşağıda belirtilen (\`Yükselt/Düşür\`) işlemlerini yapmak artık çok basit tek tık düğme ile anında yükseltme ve düşürme işlemi yapılabilmektedir fakat komut severler için ekstra olarak komutlarımız vardır.\n
\` YÜKSELTME \` **${sistem.botSettings.Prefixs[0]}yükselt <@acar/ID>**
\` DÜŞÜRME \` **${sistem.botSettings.Prefixs[0]}düşür <@acar/ID>**

komutları kullanılabilir veyada listeden vermek istenilen yetki anında üzerine alt yetkileri ile verilmektedir bu yetkileri websitesi üzerinden sadece taç sahibi ayarlayabilir.`)], ephemeral: true})
      }
      if(button.customId === "dsr") {
        let yetkiBilgisi = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => uye.roles.cache.has(x.rol)))]
        let rolBul =  _statSystem.staffs[_statSystem.staffs.indexOf(yetkiBilgisi)-1];
        if(!rolBul) return button.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} ${uye} isimli üye en alt yetkide daha fazla düşüremezsin.`, ephemeral: true})
        if(Upstaffs && !Upstaffs.StaffGiveAdmin) await Users.updateOne({_id: uye.id}, {$set: {"StaffGiveAdmin": message.member.id}}, {upsert: true})
        if(roller.altYönetimRolleri.some(x => rolBul.exrol == x) || roller.yönetimRolleri.some(x => rolBul.exrol == x) || roller.üstYönetimRolleri.some(x => rolBul.exrol == x)) {
            await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": true }}, {upsert: true})
              setTimeout(() => {
                  uye.roles.remove([...roller.banHammer, ...roller.jailHammer, ...roller.voiceMuteHammer, ...roller.muteHammer, ...roller.teleportHammer, ...roller.abilityHammer, roller.altilkyetki]).catch(err => {})
              }, 2000);
        } else {
            await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": false }}, {upsert: true})
        }
        if(rolBul && !uye.roles.cache.has(rolBul.rol)) {
            await uye.roles.add(rolBul.rol)
            if(rolBul.exrol) setTimeout(async () => {
              await uye.roles.add(rolBul.exrol)
            }, 1000);
          }
          let bunasilrolaq = []
          _statSystem.staffs.filter(x => x.rol != rolBul.rol).forEach(x => bunasilrolaq.push(x))
          bunasilrolaq.forEach(x => { 
            if(uye.roles.cache.has(x.rol)) uye.roles.remove(x.rol)
            x.exrol.filter(c => uye.roles.cache.has(c)).forEach(u => {
                uye.roles.remove(u)
            })
           })
           await Upstaff.updateOne({_id: uye.id}, {$set: {"Mission": {
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
           }}}, {upsert: true});
           let logKanalı = message.guild.kanalBul("terfi-log")
           if(logKanalı) logKanalı.send({embeds: [embed.setDescription(`${message.member} yöneticisi, ${uye} isimli üyeyi ${message.guild.roles.cache.get(rolBul.rol)} isimli rolüne düşürdü.`).setFooter(`bu işlem veritabanında kayıtlı kalır.`)]})
          await Stats.updateOne({userID: uye.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true}) 
          await Upstaff.updateOne({ _id: uye.id }, { $set: { "Point": 0, "staffNo": Number(rolBul.No) + Number(1), "staffExNo": rolBul.No, "Yetkili": 0, "Görev": 0, "Invite": 0,  "Tag": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0 }}, {upsert: true});
          button.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli yetkili, \`${message.guild.roles.cache.get(rolBul.rol).name}\` rolüne düşürüldü.`, ephemeral: true }).then(x => {message.react(message.guild.emojiGöster(emojiler.Onay))})
          msg.delete().catch(err => {})
      }

      if(button.customId === "ykslt") {
        let yetkiBilgisi = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => uye.roles.cache.has(x.rol)))]
        let rolBul =  _statSystem.staffs[_statSystem.staffs.indexOf(yetkiBilgisi)+1];
        if(!rolBul) return button.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} ${uye} isimli üye son yetkiye ulaştığı için yükseltme işlemi yapılamaz.`, ephemeral: true})
        if(Upstaffs && !Upstaffs.StaffGiveAdmin) await Users.updateOne({_id: uye.id}, {$set: {"StaffGiveAdmin": message.member.id}}, {upsert: true})
        if(roller.altYönetimRolleri.some(x => rolBul.exrol == x) || roller.yönetimRolleri.some(x => rolBul.exrol == x) || roller.üstYönetimRolleri.some(x => rolBul.exrol == x)) {
            await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": true }}, {upsert: true})
              setTimeout(() => {
                  uye.roles.remove([...roller.banHammer, ...roller.jailHammer, ...roller.voiceMuteHammer, ...roller.muteHammer, ...roller.teleportHammer, ...roller.abilityHammer, roller.altilkyetki]).catch(err => {})
              }, 2000);
        } else {
            await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": false }}, {upsert: true})
        }
        if(rolBul && !uye.roles.cache.has(rolBul.rol)) {
            await uye.roles.add(rolBul.rol)
            if(rolBul.exrol) setTimeout(async () => {
              await uye.roles.add(rolBul.exrol)
            }, 1000);
          }
          let bunasilrolaq = []
          _statSystem.staffs.filter(x => x.rol != rolBul.rol).forEach(x => bunasilrolaq.push(x))
          bunasilrolaq.forEach(x => { 
            if(uye.roles.cache.has(x.rol)) uye.roles.remove(x.rol)
            x.exrol.filter(c => uye.roles.cache.has(c)).forEach(u => {
                uye.roles.remove(u)
            })
           })
           await Upstaff.updateOne({_id: uye.id}, {$set: {"Mission": {
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
           }}}, {upsert: true});
           let logKanalı = message.guild.kanalBul("terfi-log")
           if(logKanalı) logKanalı.send({embeds: [embed.setDescription(`${message.member} yöneticisi, ${uye} isimli üyeyi ${message.guild.roles.cache.get(rolBul.rol)} isimli rolüne yükseltti.`).setFooter(`bu işlem veritabanında kayıtlı kalır.`)]})
          await Stats.updateOne({userID: uye.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true}) 
          await Upstaff.updateOne({ _id: uye.id }, { $set: { "Point": 0, "staffNo": Number(rolBul.No) + Number(1), "staffExNo": rolBul.No, "Yetkili": 0, "Görev": 0, "Invite": 0,  "Tag": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0 }}, {upsert: true});
          button.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli yetkili, \`${message.guild.roles.cache.get(rolBul.rol).name}\` rolüne yükseltildi.`, ephemeral: true }).then(x => {message.react(message.guild.emojiGöster(emojiler.Onay))})
          msg.delete().catch(err => {})
      }


      if(button.customId === "seç") {
	if(!Upstaffs) {
		client.Upstaffs.addPoint(message.member.id,_statSystem.points.staff, "Yetkili")
		await Users.updateOne({ _id: uye.id }, { $set: { "Staff": true, "StaffGiveAdmin": message.member.id } }, { upsert: true }).exec();
          	await Users.updateOne({ _id: message.member.id }, { $push: { "Staffs": { id: uye.id, Date: Date.now() } } }, { upsert: true }).exec();
          	let yetkiliLog = message.guild.kanalBul("yetki-ver-log")
          	if(yetkiliLog) yetkiliLog.send({embeds: [embed.setDescription(`${uye} isimli üye \`${tarihsel(Date.now())}\` tarihinde ${message.author} tarafından yetkili olarak başlatıldı.`)]})   
	}

        let rolId = button.values[0] || roller.başlangıçYetki
        let rolBul = _statSystem.staffs.find(x => x.rol === rolId)
        if(Upstaffs && !Upstaffs.StaffGiveAdmin) await Users.updateOne({_id: uye.id}, {$set: {"StaffGiveAdmin": message.member.id}}, {upsert: true})
        await Users.updateOne({_id: uye.id}, {$set: {"Staff": true}},{upsert: true}).exec()
        if(roller.altYönetimRolleri.some(x => rolBul.exrol == x) || roller.yönetimRolleri.some(x => rolBul.exrol == x) || roller.üstYönetimRolleri.some(x => rolBul.exrol == x)) {
            await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": true }}, {upsert: true})
              setTimeout(() => {
                  uye.roles.remove([...roller.banHammer, ...roller.jailHammer, ...roller.voiceMuteHammer, ...roller.muteHammer, ...roller.teleportHammer, ...roller.abilityHammer, roller.altilkyetki]).catch(err => {})
              }, 2000);
        } else {
            await Upstaff.updateOne({_id: uye.id}, { $set: {"Yönetim": false }}, {upsert: true})
        }
        if(rolBul && !uye.roles.cache.has(rolBul.rol)) {
            await uye.roles.add(rolBul.rol)
            if(rolBul.exrol) setTimeout(async () => {
              await uye.roles.add(rolBul.exrol)
            }, 1000);
          }
          let bunasilrolaq = []
          _statSystem.staffs.filter(x => x.rol != rolId).forEach(x => bunasilrolaq.push(x))
          bunasilrolaq.forEach(x => { 
            if(uye.roles.cache.has(x.rol)) uye.roles.remove(x.rol)
            x.exrol.filter(c => uye.roles.cache.has(c)).forEach(u => {
                uye.roles.remove(u)
            })
           })
           await Upstaff.updateOne({_id: uye.id}, {$set: {"Mission": {
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
           }}}, {upsert: true});
           let logKanalı = message.guild.kanalBul("terfi-log")
           if(logKanalı) logKanalı.send({embeds: [embed.setDescription(`${message.member} yöneticisi, ${uye} isimli üyeyi ${message.guild.roles.cache.get(rolBul.rol)} isimli rolüne ekledi.`).setFooter(`bu işlem veritabanında kayıtlı kalır.`)]})
          await Stats.updateOne({userID: uye.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true}) 
          await Upstaff.updateOne({ _id: uye.id }, { $set: { "Point": 0, "staffNo": Number(rolBul.No) + Number(1), "staffExNo": rolBul.No, "Yetkili": 0, "Görev": 0, "Invite": 0,  "Tag": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0 }}, {upsert: true});
          button.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli yetkili, \`${message.guild.roles.cache.get(rolBul.rol).name}\` rolüne eklendi.`, ephemeral: true }).then(x => {message.react(message.guild.emojiGöster(emojiler.Onay))})
          msg.delete().catch(err => {})
       }

      if(button.customId === "buttoniptal") {
          msg.delete().catch(err => {})
      }
    });

    collector.on("end", async () => {
      msg.delete().catch(x => {})
    });
    }
};

