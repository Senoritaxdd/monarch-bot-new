const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const Jail = require('../../../../Global/Databases/Schemas/Punitives.Jails')
const { genEmbed } = require("../../../../Global/Init/Embed");
const getLimit = client.fetchJailLimit = new Map();
module.exports = {
    Isim: "jail",
    Komut: ["cezalı","cezalandır"],
    Kullanim: "cezalı <@acar/ID>",
    Aciklama: "Belirtilen üyeyi cezalandırır.",
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
    if(!ayarlar && !roller && !roller.jailHammer || !roller.üstYönetimRolleri || !roller.yönetimRolleri || !roller.kurucuRolleri || !roller.altYönetimRolleri) return message.channel.send(cevaplar.notSetup)
    if(!roller.jailHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt)
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID>\``);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    const sebeps = [
        { label: "Kışkırtma, Trol ve Dalgacı Davranış", description: "2 Gün", emoji: {name: "1️⃣"} , value: "1", date: "2d", type: 3},
        { label: "Flood,Spam ve Capslock Kullanımı", description: "5 Gün", emoji: {name: "2️⃣"} ,value: "2", date: "5d", type: 3},
        { label: "Metin Kanallarını Amacı Dışında Kullanmak", description: "1 Gün", emoji: {name: "3️⃣"} ,value: "3", date: "1d", type: 3},
        { label: "Küfür, Argo, Hakaret ve Rahatsız Edici Davranış", description: "5 Gün", emoji: {name: "4️⃣"} ,value: "4", date: "5d", type: 3},
        { label: "Dini, Irki ve Siyasi değerlere Hakaret", description: "14 Gün", emoji: {name: "5️⃣"} ,value: "5", date: "14d", type: 3},
        { label: "Sunucu Kötüleme ve Kişisel Hakaret", description: "5 Gün", emoji: {name: "6️⃣"} ,value: "6", date: "5d", type: 3},
        { label: "Abartı, Küfür ve Taciz Kullanımı", description: "14 Gün", emoji: {name: "7️⃣"}, value: "7", date: "14d", type: 3},
    ]
    let jailButton = new MessageButton()
    .setCustomId(`onayla`)
    .setLabel(await Jail.findById(uye.id) ? `Aktif Cezalandırılması Mevcut!` : getLimit.get(message.member.id) >= ayarlar.jailLimit ? `Limit Doldu (${getLimit.get(message.member.id) || 0} / ${ayarlar.jailLimit})` : 'İşlemi Onaylıyorum!')
    .setEmoji(message.guild.emojiGöster(emojiler.Cezalandırıldı).id)
    .setStyle('SUCCESS')
    .setDisabled(await Jail.findById(uye.id) ? true : getLimit.get(message.member.id) >= ayarlar.jailLimit ? true : false )
    let iptalButton =  new MessageButton()
    .setCustomId(`iptal`)
    .setLabel('İşlemi İptal Et')
    .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
    .setStyle('DANGER')
    let jailOptions = new MessageActionRow().addComponents(
            jailButton,
            iptalButton
    );

    let msg = await message.channel.send({embeds: [new genEmbed().setDescription(`${uye} isimli üyeyi cezalandırmak istiyor musun?`)], components: [jailOptions]}).catch(err => {})

    const filter = i => i.user.id == message.member.id 
    const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 30000 })

    collector.on('collect', async i => {
        if (i.customId === `onayla`) {
            i.update({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Cezalandırıldı)} ${uye} isimli üyesini hangi sebep ile cezalandırmak istiyorsun?\n${!roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) && !ayarlar.staff.includes(message.member.id) && !message.member.permissions.has('ADMINISTRATOR') ? Number(ayarlar.jailLimit) ? `Kullanılabilir Limit: \`${getLimit.get(message.member.id) || 0} / ${ayarlar.jailLimit}\`` : `` : ``}`)], components: [new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setCustomId(`sebep`)
                .setPlaceholder('Cezalandırmak istediğiniz sebepi seçiniz!')
                .addOptions([
                    sebeps.filter(x => x.type == 3)
                ]),
            )]})
            }
        if (i.customId === `sebep`) {
           let seçilenSebep = sebeps.find(x => x.value == i.values[0])
           if(seçilenSebep) {
                if(Number(ayarlar.jailLimit)) {
                    if(!message.member.permissions.has('ADMINISTRATOR') && !ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) {
                        getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) + 1)
                        setTimeout(() => {
                            getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) - 1)
                        },1000*60*5)
                    }
                }
                i.deferUpdate()  
                msg.delete().catch(err => {})
                message.react(message.guild.emojiGöster(emojiler.Onay)).catch(err => {})
                uye.removeStaff()
                uye.dangerRegistrant()
                return uye.addPunitives(seçilenSebep.type, message.member, seçilenSebep.label, message, seçilenSebep.date)
        } else {
               return i.update({components: [], embeds: [ new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} İşlem sırasında hata oluştu lütfen bot sahibine başvurun.`)]})
           }
         }
        if (i.customId === `iptal`) {
            return await i.update({ content: `${message.guild.emojiGöster(emojiler.Iptal)} ${uye} isimli üyenin cezalandırılma işlemi başarıyla iptal edildi.`, components: [], embeds: [] });
        }
    });
    collector.on("end", async i => {
        msg.delete().catch(err => {})
    })

    }
};

