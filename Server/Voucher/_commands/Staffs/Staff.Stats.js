const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const InviteData = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const Tasks = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Tasks');
const moment = require('moment');
const { genEmbed } = require("../../../../Global/Init/Embed");
require('moment-duration-format');
require('moment-timezone');

module.exports = {
    Isim: "terfi",
    Komut: ["yetkim","ystat","yetkilistat","görev","görevim","görevlerim","tasks","task"],
    Kullanim: "yetkim <@acar/ID>",
    Aciklama: "Belirlenen üye veya kullanan üye eğer ki yetkiliyse onun yetki atlama bilgilerini gösterir.",
    Kategori: "stat",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.saatDakikaCevir = (date) => { return moment.duration(date).format('H [saat,] m [dakika]'); };
    client.acarSaatYap = (date) => { return moment.duration(date).format('H'); };
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!_statSystem.system) return; 
    let kullArray = message.content.split(" ");
    let kullaniciId = kullArray.slice(1);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(kullaniciId[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === kullaniciId.slice(0).join(" ") || x.user.username === kullaniciId[0]) || message.member;
    if (!_statSystem.staffs.some(x => message.member.roles.cache.has(x.rol)) && !roller.üstYönetimRolleri.some(x => message.member.roles.cache.has(x)) && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has('ADMINISTRATOR'))  return message.channel.send(cevaplar.noyt);
   // if(message.member.roles.cache.has(_statSystem.endstaff) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(`${cevaplar.prefix} \`Zaten son alt yetkidesin, bütün emeklerin için teşşekür ederiz.\``);
    const puanBilgisi = await Upstaffs.findOne({ _id: uye.id })
    const davetbilgisi = await InviteData.findOne({userID: uye.id}) || { regular: 0, bonus: 0, fake: 0, total: 0 };
   // const eskiRolcük = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => uye.roles.cache.has(x.rol) ))] || _statSystem.staffs[_statSystem.staffs.length-1];
   // const görevBilgisi = await Tasks.findOne({ Users: uye.id }) || await Tasks.findOne({ roleID: eskiRolcük ? eskiRolcük.rol : uye.roles.hoist.id  })
    Stats.findOne({ guildID: message.guild.id, userID: uye.id }, async (err, data) => {
      if(!puanBilgisi) return message.react(message.guild.emojiGöster(emojiler.Iptal))
        const yeniRol = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => x.No == (puanBilgisi ? puanBilgisi.staffNo : 0)))] || _statSystem.staffs[_statSystem.staffs.length-1];
        const eskiRol = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => x.No == (puanBilgisi ? puanBilgisi.staffExNo : 0)))] || _statSystem.staffs[_statSystem.staffs.length-1];
        const puanBelirt = _statSystem.staffs.find(x => x.No == puanBilgisi.staffNo) ? _statSystem.staffs.find(x => x.No == puanBilgisi.staffNo).Puan : eskiRol.Puan
        const puanBari = _statSystem.staffs.some(x => uye.roles.cache.has(x.rol)) && _statSystem.staffs.length > 0 ? `\`%${Math.floor((puanBilgisi ? puanBilgisi.Point.toFixed(1) : 0)/puanBelirt*100)}\` ${progressBar(puanBilgisi ? puanBilgisi.Point.toFixed(1) : 0, puanBelirt, 6, puanBilgisi.Point.toFixed(1))} \`${puanBilgisi ? puanBilgisi.Point.toFixed(1) : 0} / ${puanBelirt}\`` : "";
        


        let ToplamPuan = Number(0) 
        _statSystem.staffs.filter(x => x.Puan).forEach(x => {
        ToplamPuan += Number(x.Puan)
        })
        const genelpuanBari = _statSystem.staffs.some(x => uye.roles.cache.has(x.rol)) && _statSystem.staffs.length > 0 ? `\`%${Math.floor((puanBilgisi.ToplamPuan)/ToplamPuan*100)}\` ${progressBar(puanBilgisi ? puanBilgisi.ToplamPuan.toFixed(1) : 0, ToplamPuan, 6, puanBilgisi.ToplamPuan.toFixed(1))} \`${puanBilgisi ? puanBilgisi.ToplamPuan.toFixed(1) : 0} / ${ToplamPuan}\`` : "";
        
        let cezapuanoku = await uye.cezaPuan()
        let teyitoku = await Users.findOne({ _id: uye.id })
        let teyitbilgi;
        if(teyitoku) {
            if(teyitoku.Records) {
                    let erkekteyit = teyitoku.Records.filter(v => v.Gender === "Erkek").length
                    let kadınteyit = teyitoku.Records.filter(v => v.Gender === "Kadın").length
                    let toplamteyit = teyitoku.Records.length
                    teyitbilgi = `+${toplamteyit * _statSystem.points.record} Puan`
                } else { teyitbilgi = `0 Puan` }
            } else {
                teyitbilgi = `0 Puan`
        }
        let taglıÇek = await teyitoku ? teyitoku.Taggeds ? teyitoku.Taggeds.length || 0 : 0 : 0
        let yetkidurumu;
        if(yeniRol) yetkidurumu = `Şu an <@&${eskiRol.rol}> rolündesiniz. bir sonraki <@&${yeniRol.rol}> ${yeniRol.exrol ? "(" + yeniRol.exrol.filter(x => !uye.roles.cache.has(x)).map(x => message.guild.roles.cache.get(x)).join(",") + ")" : ""} rolüne(lerine) ulaşmak için \`${Number(puanBelirt-puanBilgisi.Point).toFixed(1)}\` puan kazanmanız gerekiyor. Şuan da \`%${Math.floor((puanBilgisi ? puanBilgisi.Point.toFixed(1) : 0)/puanBelirt*100)}\` oranında tamamladınız.`
        if(yeniRol.rol == eskiRol.rol) yetkidurumu = `Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz.`;
        if(roller.kurucuRolleri.some(x => uye.roles.cache.has(x))) yetkidurumu = `Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz.`;
        let siralases = '';
        let siralamesaj = `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Chat Puan: \`0 mesaj (Puan Etkisi: +0)\``
        let siralaMusicPuan = 0
        let simdises = '';
        let simdimesaj = `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Chat Puan: \`0 mesaj (Puan Etkisi: +0)\``
        let simdiMusicPuan = 0
        let simdiMusicDurma = 0
        if(data) {
            puanBilgisi.ToplamSesListe.forEach((value, key) => {
              if(_statSystem.musicRooms.some(x => x === key)) siralaMusicPuan += value
                    let kategori = _statSystem.voiceCategorys.find(x => x.id == key)
		    if(kategori) {
                     let kategoriismi = kategori.isim
                     let puan = 0;
                     if(puanBilgisi.ToplamSesListe) puanBilgisi.ToplamSesListe.forEach((v, k) => { if(k == key) puan = v })
                     siralases += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : kategoriismi : '#Silinmiş'}: \`+${Number(puan).toFixed(1)} Puan\`\n`
            	    }
            })
            if(simdiMusicPuan && simdiMusicPuan > 0) siralases += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Müzik Odalar: \`+${Number(siralaMusicPuan).toFixed(1)} Puan\`\n`
            data.chatStats.forEach((value, key) => {
                if(key == _statSystem.generalChatCategory) siralamesaj = `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? 'Chat Puan' ? 'Chat Puan' : message.guild.channels.cache.get(key).name : '#Silinmiş'}: \`+${puanBilgisi ? puanBilgisi.ToplamMesaj.toFixed(1) : 0} Puan\``
            });
            data.upstaffVoiceStats.forEach((value, key) => {
              if(_statSystem.accessPointChannels.some(x => x == key)) {
                if(_statSystem.musicRooms.some(x => x === key)) simdiMusicDurma += value    
                    
                  
                    let kategori = _statSystem.voiceCategorys.find(x => x.id == key)
                    if(kategori) {
		     let kategoriismi = kategori.isim
                     let puan = 0;
                     if(puanBilgisi.Ses) puanBilgisi.Ses.forEach((v, k) => { 
                      if(_statSystem.musicRooms.some(x => x === k)) simdiMusicPuan += v
                      if(k == key) puan = v
                      })
                     simdises += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? kategoriismi ? kategoriismi : kategoriismi : '#Silinmiş'}: \`${client.saatDakikaCevir(value)} (Puan Etkisi: +${Number(puan).toFixed(1)})\`\n`
                    }
                }
            })
            if(simdiMusicDurma && simdiMusicDurma > 0) simdises += `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Müzik Odalar: \`${client.saatDakikaCevir(simdiMusicDurma)} (Puan Etkisi: +${Number(simdiMusicPuan).toFixed(1)})\`\n`
            data.upstaffChatStats.forEach((value, key) => {
                if(key == _statSystem.generalChatCategory) simdimesaj = `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} ${message.guild.channels.cache.has(key) ? 'Chat Puan' ? 'Chat Puan' : message.guild.channels.cache.get(key).name : '#Silinmiş'}: \`${value} mesaj (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Mesaj.toFixed(1) : 0})\``
            });
        } 
         let embed = new genEmbed().setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true, size: 2048})).setThumbnail(uye.user.avatarURL({dynamic: true, size: 2048})).setDescription(`${uye} (${uye.roles.highest}) kullanıcısının yetki yükseltim bilgileri aşağıda belirtilmiştir.`)
        .addFields(
            { name: `${message.guild.emojiGöster(emojiler.Terfi.icon)} Puan Durumu`, value: `Puanınız: \`${puanBilgisi.Point.toFixed(1)}\` Gereken Puan: \`${Number(puanBelirt-puanBilgisi.Point).toFixed(1)}\`\n${puanBari}`},
            { name: `${message.guild.emojiGöster(emojiler.Terfi.icon)} Puan Detayları`, value: `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Kayıtlar: \`${teyitoku ? teyitoku.Records ? teyitoku.Records.length : 0 : 0} adet (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Register : 0})\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Taglılar: \`${taglıÇek} adet (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Tag : 0})\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Davetler: \`${davetbilgisi ? davetbilgisi.total ? davetbilgisi.total : 0 : 0} (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Invite : 0})\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Bonus: \`${puanBilgisi ? puanBilgisi.Bonus : 0} (Puan Etkisi: +${puanBilgisi ? puanBilgisi.Bonus : 0})\`
${simdimesaj}
${simdises}`},
{ name: `${message.guild.emojiGöster(emojiler.Terfi.icon)} Yetki Durumu`, value: yetkidurumu }
        )
        

        let genelpuandurumu = new genEmbed().setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true, size: 2048})).setThumbnail(uye.user.avatarURL({dynamic: true, size: 2048})).setDescription(`${uye} (${uye.roles.highest}) kullanıcısının \`${tarihsel(puanBilgisi.Baslama)}\` tarihinden itibaren kazandığı toplam puanlar ve detayları aşağıda belirtilmiştir.`).addFields(
            { name: `${message.guild.emojiGöster(emojiler.Terfi.icon)} Genel Puan Durumu`, value: `Toplam Puanınız: \`${puanBilgisi.ToplamPuan.toFixed(1)}\` Toplam Kalan Puan: \`${Number(ToplamPuan-puanBilgisi.ToplamPuan).toFixed(1)}\`\n${genelpuanBari}`},
            { name: `${message.guild.emojiGöster(emojiler.Terfi.icon)} Genel Puan Detayları`, value: `${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Kayıt: \`${teyitbilgi}\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Taglı: \`+${taglıÇek*_statSystem.points.tagged} Puan\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Davet: \`+${davetbilgisi ? davetbilgisi.total ? davetbilgisi.total : 0 : 0*_statSystem.points.invite} Puan\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Ceza-i Durum: \`${cezapuanoku} (Ceza Etkisi: -${cezapuanoku > 5 ? cezapuanoku/2 : cezapuanoku})\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Toplam Bonus: \`+${puanBilgisi ? puanBilgisi.ToplamBonus : 0} Puan\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Toplam Ses: \`+${puanBilgisi ? puanBilgisi.ToplamSes.toFixed(1) : 0} Puan\`
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Toplam Mesaj: \`+${puanBilgisi ? puanBilgisi.ToplamMesaj.toFixed(1) : 0} Puan\``},
{ name: `${message.guild.emojiGöster(emojiler.Terfi.icon)} Genel Ses Detayı`, value: `${siralases ? siralases : `${message.guild.emojiGöster(emojiler.Iptal)} Maalesef genel ses puan detayları bulunamadığından listelenemedi.`}`},
{ name: `${message.guild.emojiGöster(emojiler.Terfi.icon)} Yetki Durumu`, value: `Şu an <@&${eskiRol.rol}> rolünden, son ${message.guild.roles.cache.get(_statSystem.endstaff) ? message.guild.roles.cache.get(_statSystem.endstaff) : "@Rol Bulunamadı."} rolüne ulaşabilmek için \`${Number(ToplamPuan-puanBilgisi.ToplamPuan).toFixed(1)}\` puan kazanmanız gerekiyor, şuan da \`%${Math.floor((puanBilgisi.ToplamPuan)/ToplamPuan*100)}\` oranında tamamladınız.`}
      )

    const button1 = new MessageButton()
      .setCustomId('buttonana')
      .setLabel('Puan Detayları')
      .setEmoji(message.guild.emojiGöster(emojiler.Terfi.icon).id)
      .setStyle('PRIMARY');
    const button2 = new MessageButton()
      .setCustomId('buttongenel')
      .setLabel('Genel Puan Detayları')
      .setEmoji(message.guild.emojiGöster(emojiler.Icon).id)
      .setStyle('SUCCESS');
    const buttonkapat = new MessageButton()
      .setCustomId('buttoniptal')
      .setLabel('Kapat')
      .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
      .setStyle('DANGER');

     let görevBul = await Tasks.findOne({ roleID: eskiRol ? eskiRol.rol : uye.roles.hoist.id  }) || await Tasks.findOne({ Users: uye.id })
    let yönetimPaneli;

    if(görevBul) {
      let public = 0;
      let register = 0;
      let genelses = 0;
      let data = await Stats.findOne({ userID: uye.id });
      if(data) {
        data.taskVoiceStats.forEach(c => genelses += Number(c));
        data.taskVoiceStats.forEach((value, key) => {
            if(key == kanallar.publicKategorisi) public += Number(client.acarSaatYap(value))
            if(key == kanallar.streamerKategorisi) public += Number(client.acarSaatYap(value))
        });
        data.taskVoiceStats.forEach((value, key) => {
          if(key == kanallar.registerKategorisi) register += Number(client.acarSaatYap(value))
        })
      };
    
      yönetimPaneli = new genEmbed().setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true, size: 2048})).setThumbnail(uye.user.avatarURL({dynamic: true, size: 2048}))
    .setDescription(`${uye}, (${görevBul.roleID ? message.guild.roles.cache.get(görevBul.roleID) : "@Rol Bulunamadı."}) üyesinin rolüne ait görevleri aşağıda belirtilmiştir.
**Görev Tarihi**: \`${tarihsel(görevBul.Date)}\`
${görevBul.Reward ? `**Ödül(ler)**: \`${görevBul.Reward} Görev Puanı ve ${ayarlar.serverName} Parası\`` : ''}
${puanBilgisi ? puanBilgisi.Mission ? `**Tamamlanan Görev Sayısı**: \`${puanBilgisi.Mission.completedMission} Adet\`` : '' : '' }
${görevBul.Time ? `**Kalan Süre**: \`${moment.duration(görevBul.Time - Date.now()).format("d [gün], H [saat], m [dakika] s [saniye]")}\`` : ``}`)
if(görevBul.publicVoice >= 1 && görevBul.AllVoice >= 1) {
        if(!roller.teyitciRolleri.some(x => uye.roles.cache.has(x))) yönetimPaneli.addFields({ name: `${görevBul.publicVoice} Saat Public/Streamer Kanalında Takıl!`, value: `${public >= görevBul.publicVoice ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Ses) } ${yönetimBar(public ? public : 0, görevBul.publicVoice, 5, public)} \`${public >= görevBul.publicVoice ? `Tamamlandı!`: `${public} saat / ${görevBul.publicVoice} saat`}\``})
        if(roller.teyitciRolleri.some(x => uye.roles.cache.has(x))) yönetimPaneli.addFields({ name: `${görevBul.publicVoice} Saat Register Kanallarında Takıl!`, value: `${register >= görevBul.publicVoice ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Ses) } ${yönetimBar(register ? register : 0, görevBul.publicVoice, 5, register)} \`${register >= görevBul.publicVoice ? `Tamamlandı!`: `${register} saat / ${görevBul.publicVoice} saat`}\``})
        
        yönetimPaneli.addFields({ name: `${görevBul.AllVoice} Saat Tüm Ses Kanallarında Takıl!`, value: `${Number(client.acarSaatYap(genelses)) >= görevBul.AllVoice ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Mesaj) } ${yönetimBar(Number(client.acarSaatYap(genelses)) ? Number(client.acarSaatYap(genelses)) : 0, görevBul.AllVoice, 5, Number(client.acarSaatYap(genelses)))} \`${Number(client.acarSaatYap(genelses)) >= görevBul.AllVoice ? `Tamamlandı!`: `${Number(client.acarSaatYap(genelses))} saat / ${görevBul.AllVoice} saat`}\``})
       }
       if(roller.teyitciRolleri.some(x => uye.roles.cache.has(x)) && görevBul.Register >= 1) yönetimPaneli.addFields({ name: `${görevBul.Register} Kişiyi Kayıt Et!`, value: `${puanBilgisi.Mission.Register >= görevBul.Register ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Kek) } ${yönetimBar(puanBilgisi.Mission.Register ? puanBilgisi.Mission.Register : 0, görevBul.Register, 5, puanBilgisi.Mission.Register)} \`${puanBilgisi.Mission.Register >= görevBul.Register ? `Tamamlandı!`: `${puanBilgisi.Mission.Register} / ${görevBul.Register}`}\`` })
       if(görevBul.Invite >= 1) yönetimPaneli.addFields({ name: `${görevBul.Invite} Kişiyi Davet Et!`, value: `${puanBilgisi.Mission.Invite >= görevBul.Invite ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Kek) } ${yönetimBar(puanBilgisi.Mission.Invite ? puanBilgisi.Mission.Invite : 0, görevBul.Invite, 5, puanBilgisi.Mission.Invite)} \`${puanBilgisi.Mission.Invite >= görevBul.Invite ? `Tamamlandı!`: `${puanBilgisi.Mission.Invite} / ${görevBul.Invite}`}\`` })
       if(görevBul.Tagged >= 1) yönetimPaneli.addFields({ name: `${görevBul.Tagged} Kişiyi Taga Davet Et!`, value: `${puanBilgisi.Mission.Tagged >= görevBul.Tagged ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Taglı) } ${yönetimBar(puanBilgisi.Mission.Tagged ? puanBilgisi.Mission.Tagged : 0, görevBul.Tagged, 5, puanBilgisi.Mission.Tagged)} \`${puanBilgisi.Mission.Tagged >= görevBul.Tagged ? `Tamamlandı!`: `${puanBilgisi.Mission.Tagged} / ${görevBul.Tagged}`}\`` }) 
       if(görevBul.Staff >= 1) yönetimPaneli.addFields({ name: `${görevBul.Staff} Kişiyi Yetkiye Davet Et!`, value: `${puanBilgisi.Mission.Staff >= görevBul.Staff ? message.guild.emojiGöster(emojiler.Görev.OK) : message.guild.emojiGöster(emojiler.Görev.Yetkili) } ${yönetimBar(puanBilgisi.Mission.Staff ? puanBilgisi.Mission.Staff : 0, görevBul.Staff, 5, puanBilgisi.Mission.Staff)} \`${puanBilgisi.Mission.Staff >= görevBul.Staff ? `Tamamlandı!`: `${puanBilgisi.Mission.Staff} / ${görevBul.Staff}`}\`` })
       if(yeniRol && yeniRol.rol && !roller.kurucuRolleri.some(x => uye.roles.cache.has(x)) && !uye.roles.cache.has(_statSystem.endstaff) && eskiRol.rol != roller.başlangıçYetki)yönetimPaneli.addFields({name: `**Yönetim Durumu**`, value: `Şu an <@&${eskiRol.rol}> rolündesiniz. bir sonraki <@&${yeniRol.rol}> ${yeniRol.exrol ? "(" + yeniRol.exrol.map(x => message.guild.roles.cache.get(x)).join(",") + ")" : ""} rolüne yükselmek için gereken görevleri tamamlamalısınız ve toplantı günlerini beklemelisiniz. Tamamlanan görevler sonucunda toplam \`${puanBilgisi.Görev}\` Görev Puanı bulunmakta!`})
      } else {
        yönetimPaneli = new genEmbed().setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true, size: 2048})).setThumbnail(uye.user.avatarURL({dynamic: true, size: 2048})).setDescription(`${eskiRol ? message.guild.roles.cache.get(eskiRol.rol) : uye.roles.highest} rolüne ait veya size ait bir görev bulunamadı lütfen bir görev talep edin.`)
      }

    if(puanBilgisi && puanBilgisi.Yönetim) return await message.channel.send({embeds: [yönetimPaneli]})
    let msg = await message.channel.send({ embeds: [embed],  components: [new MessageActionRow().addComponents([button1, button2, buttonkapat])] })

      var filter = (button) => button.user.id === message.member.id;
      let collector = await msg.createMessageComponentCollector({filter, time: 15000 })

      collector.on("collect", async (button) => {
        if(button.customId === "buttonana") {
          msg.edit({embeds: [embed]})
            await button.deferUpdate()
        }
        if(button.customId === "buttongenel") {
            msg.edit({embeds: [genelpuandurumu]})
            await button.deferUpdate()
        }
        if(button.customId === "buttoniptal") {
          msg.delete()
        }
      });

      collector.on("end", async () => {
        msg.delete().catch(x => {})
      });

        function progressBar(value, maxValue, size, veri) {
            const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
            const emptyProgress = size - progress > 0 ? size - progress : 0;
            let progressStart;
            if(veri == 0) progressStart = `${message.guild.emojiGöster(emojiler.Terfi.başlangıçBar)}`
            if(veri > 0) progressStart = `${message.guild.emojiGöster(emojiler.Terfi.başlamaBar)}`
            const progressText = `${message.guild.emojiGöster(emojiler.Terfi.doluBar)}`.repeat(progress);
            const emptyProgressText = `${message.guild.emojiGöster(emojiler.Terfi.boşBar)}`.repeat(emptyProgress)
            const bar = progressStart + progressText + emptyProgressText + `${emptyProgress == 0 ? `${message.guild.emojiGöster(emojiler.Terfi.doluBitişBar)}` : `${message.guild.emojiGöster(emojiler.Terfi.boşBitişBar)}`}`;
            return bar;
        };

        function yönetimBar(value, maxValue, size, veri) {
            if(veri < 0) value = 0
            const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
            const emptyProgress = size - progress > 0 ? size - progress : 0;
            let progressStart;
            if(veri <= 0) progressStart = `${message.guild.emojiGöster(emojiler.Terfi.başlangıçBar)}`
            if(veri > 0) progressStart = `${message.guild.emojiGöster(emojiler.Terfi.başlamaBar)}`
            const progressText = `${message.guild.emojiGöster(emojiler.Terfi.doluBar)}`.repeat(progress);
            const emptyProgressText = `${message.guild.emojiGöster(emojiler.Terfi.boşBar)}`.repeat(emptyProgress)
            const bar = progressStart + progressText + emptyProgressText + `${emptyProgress == 0 ? `${message.guild.emojiGöster(emojiler.Terfi.doluBitişBar)}` : `${message.guild.emojiGöster(emojiler.Terfi.boşBitişBar)}`}`;
            return bar;
        };
   });
  }
};

