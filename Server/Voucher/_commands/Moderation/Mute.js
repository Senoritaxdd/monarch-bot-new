const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const Mute = require('../../../../Global/Databases/Schemas/Punitives.Mutes');
const voiceMute = require('../../../../Global/Databases/Schemas/Punitives.Vmutes');
const ms = require('ms');
const { genEmbed } = require("../../../../Global/Init/Embed");
let selectSebep;
let selectMute;
const getLimitVoiceMute = new Map();
const getLimitMute = new Map()
module.exports = {
    Isim: "mute",
    Komut: ["chatmute", "voicemute","sesmute","sustur","sessustur","vmute","cmute","metinsustur","chatsustur","v-mute","c-mute"],
    Kullanim: "mute <@acar/ID>",
    Aciklama: "Belirlenen üyeyi ses ve metin kanallarında susturur.",
    Kategori: "yetkili",
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
    if(!roller.muteHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.voiceMuteHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt)
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID>\``);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    const sebeps = [
        { label: "Kışkırtma, Trol ve Dalgacı Davranış", description: "5 Dakika", emoji: {name: "1️⃣"} , value: "1", date: "5m", type: 5},
        { label: "Flood,Spam ve Capslock Kullanımı", description: "10 Dakika", emoji: {name: "2️⃣"} ,value: "2", date: "10m", type: 5},
        { label: "Metin Kanallarını Amacı Dışında Kullanmak", description: "10 Dakika", emoji: {name: "3️⃣"} ,value: "3", date: "10m", type: 5},
        { label: "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış", description: "15 Dakika", emoji: {name: "4️⃣"} ,value: "4", date: "15m", type: 5},
        { label: "Dini, Irki ve Siyasi değerlere Hakaret", description: "14 Gün", emoji: {name: "5️⃣"} ,value: "5", date: "14d", type: 5},
        { label: "Sunucu Kötüleme ve Kişisel Hakaret", description: "1 Saat", emoji: {name: "6️⃣"} ,value: "6", date: "1h", type: 5},
        { label: "Abartı, Küfür ve Taciz Kullanımı", description: "30 Dakika", emoji: {name: "7️⃣"}, value: "7", date: "30m", type: 5},
        { label: "Kışkırtma, Trol ve Dalgacı Davranış", description: "15 Dakika", emoji: {name: "1️⃣"} , value: "8", date: "15m", type: 4},
        { label: "Abartı, Küfür ve Taciz Kullanımı", description: "15 Dakika", emoji: {name: "2️⃣"} ,value: "9", date: "15m", type: 4},
        { label: "Ses Kanallarını Amacı Dışında Kullanmak", description: "15 Dakika", emoji: {name: "3️⃣"} ,value: "10", date: "15m", type: 4},
        { label: "Özel Odalara İzinsiz Giriş ve Trol", description: "30 Dakika", emoji: {name: "4️⃣"} ,value: "11", date: "30m", type: 4},
        { label: "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış", description: "15 Dakika", emoji: {name: "5️⃣"} ,value: "12", date: "15m", type: 4},
        { label: "Soundpad, Efekt ve Ses Programları Kullanımı", description: "1 Saat", emoji: {name: "6️⃣"} ,value: "13", date: "1h", type: 4},
        { label: "Dini, Irki ve Siyasi değerlere Hakaret", description: "14 Gün", emoji: {name: "7️⃣"} ,value: "14", date: "14d", type: 4},
        { label: "Sunucu Kötüleme ve Kişisel Hakaret", description: "1 Saat", emoji: {name: "8️⃣"} ,value: "15", date: "1h", type: 4} 

    ]
    let chatMuteButton = new MessageButton()
    .setCustomId(`chatmute`)
    .setLabel(`Metin Kanallarında ${roller.muteHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has('ADMINISTRATOR') ? await Mute.findById(uye.id) ? `(Aktif Cezası Var!)` : getLimitMute.get(message.member.id) >= ayarlar.muteLimit ? `(Limit ${getLimitMute.get(message.member.id)}/${ayarlar.muteLimit})` : `${!roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) && !ayarlar.staff.includes(message.member.id) && !message.member.permissions.has('ADMINISTRATOR') ? Number(ayarlar.muteLimit) ? `(Limit: ${getLimitMute.get(message.member.id) || 0}/${ayarlar.muteLimit})`: `` : ``}` : "(Yetki Yok)"}`)
    .setEmoji(message.guild.emojiGöster(emojiler.chatSusturuldu).id)
    .setStyle('PRIMARY')
    .setDisabled(roller.muteHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has('ADMINISTRATOR') ? await Mute.findById(uye.id) ? true : getLimitMute.get(message.member.id) >= ayarlar.muteLimit ? true : false : true)
    let voiceMuteButton = new MessageButton()
    .setCustomId(`voicemute`)
    .setLabel(`Ses Kanallarında ${roller.voiceMuteHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has('ADMINISTRATOR') ? await voiceMute.findById(uye.id) ? `(Aktif Cezası Var!)` : getLimitVoiceMute.get(message.member.id) >= ayarlar.voiceMuteLimit ? `(Limit Doldu ${getLimitVoiceMute.get(message.member.id)}/${ayarlar.voiceMuteLimit})` : `${!roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) && !ayarlar.staff.includes(message.member.id) && !message.member.permissions.has('ADMINISTRATOR') ? Number(ayarlar.voiceMuteLimit) ? `(Limit: ${getLimitVoiceMute.get(message.member.id) || 0}/${ayarlar.voiceMuteLimit})`: `` : ``}` : "(Yetki Yok)"}`)
    .setEmoji(message.guild.emojiGöster(emojiler.sesSusturuldu).id)
    .setStyle('PRIMARY')
    .setDisabled(roller.voiceMuteHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has('ADMINISTRATOR') ? await voiceMute.findById(uye.id) ? true : getLimitVoiceMute.get(message.member.id) >= ayarlar.voiceMuteLimit ? true : false : true)
    let iptalButton =  new MessageButton()
    .setCustomId(`iptal`)
    .setLabel('İşlemi İptal Et')
    .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
    .setStyle('DANGER')
    let muteOptions = new MessageActionRow().addComponents(
            chatMuteButton,
            voiceMuteButton,
            iptalButton,
    );

    let msg = await message.channel.send({embeds: [new genEmbed().setDescription(`${uye} isimli üyeyi hangi türde susturmak istiyorsun?`)], components: [muteOptions]}).catch(err => {})

    const filter = i => i.user.id == message.member.id 
    const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 30000 })

    collector.on('collect', async i => {
        if (i.customId === `chatmute`) {
        selectMute = 5
        i.update({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.chatSusturuldu)} ${uye} isimli üyesini hangi sebep ile **metin kanallarından** susturmamı istiyorsun?`)], components: [new MessageActionRow().addComponents(
            new MessageSelectMenu()
            .setCustomId(`sebep`)
            .setPlaceholder('Susturmak istediğiniz sebepi seçiniz!')
            .addOptions([
                sebeps.filter(x => x.type == 5)
            ]),
        )]})
        }
        if (i.customId === `voicemute`) {
            selectMute = 4
            i.update({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.sesSusturuldu)} ${uye} isimli üyesini hangi sebep ile **ses kanallarından** susturmamı istiyorsun?`)], components: [new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setCustomId(`sebep`)
                .setPlaceholder('Susturmak istediğiniz sebepi seçiniz!')
                .addOptions([
                    sebeps.filter(x => x.type == 4)
                ]),
            )]})
            }
        if (i.customId === `sebep`) {
           let seçilenSebep = sebeps.find(x => x.value == i.values[0])
           if(seçilenSebep) {
               if(selectMute == 4) {
                if(Number(ayarlar.voiceMuteLimit)) {
		let voiceMuteCheck = await voiceMute.findById(uye.id)
		if(voiceMuteCheck) return await i.reply({content: `Belirtiğin ${uye} üyesinin, aktif bir susturulma cezası mevcut!`, ephemeral: true}),msg.delete().catch(err => {}),message.react(message.guild.emojiGöster(emojiler.Iptal))
                    if(!message.member.permissions.has('ADMINISTRATOR') && !ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) {
                        getLimitVoiceMute.set(`${message.member.id}`, (Number(getLimitVoiceMute.get(`${message.member.id}`) || 0)) + 1)
                            setTimeout(() => {
                                getLimitVoiceMute.set(`${message.member.id}`, (Number(getLimitVoiceMute.get(`${message.member.id}`) || 0)) - 1)
                            },1000*60*5)
                        }
                    }
                }
               if(selectMute == 5) {
		let chatMuteCheck = await Mute.findById(uye.id)
		if(chatMuteCheck) return await i.reply({content: `Belirtiğin ${uye} üyesinin, aktif bir susturulma cezası mevcut!`, ephemeral: true}),msg.delete().catch(err => {}),message.react(message.guild.emojiGöster(emojiler.Iptal))
                if(Number(ayarlar.muteLimit)) {
                    if(!message.member.permissions.has('ADMINISTRATOR') && !ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) {
                        getLimitMute.set(`${message.member.id}`, (Number(getLimitMute.get(`${message.member.id}`) || 0)) + 1)
                            setTimeout(() => {
                                getLimitMute.set(`${message.member.id}`, (Number(getLimitMute.get(`${message.member.id}`) || 0)) - 1)
                            },1000*60*5)
                        }
                    }
                }
                i.deferUpdate()  
                msg.delete().catch(err => {})
                message.react(message.guild.emojiGöster(emojiler.Onay)).catch(err => {})
              return uye.addPunitives(seçilenSebep.type, message.member, seçilenSebep.label, message, seçilenSebep.date)
        } else {
               return i.update({components: [], embeds: [ new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} İşlem sırasında hata oluştu lütfen bot sahibine başvurun.`)]})
           }
         }
        if (i.customId === `iptal`) {
            return await i.reply({ content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla mute işlemleri menüsü kapatıldı.`, components: [], embeds: [] });
        }
    });
    collector.on("end", async i => {
        msg.delete().catch(err => {})
    })

    }
};



function yetkiKontrol(message, type = 0) {
    if(type = 1) if(roller.voiceMuteHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has('ADMINISTRATOR')) return true
    
    if(type = 2) if(roller.muteHammer.some(oku => message.member.roles.cache.has(oku)) || roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) || roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  || message.member.permissions.has('ADMINISTRATOR')) return true
}