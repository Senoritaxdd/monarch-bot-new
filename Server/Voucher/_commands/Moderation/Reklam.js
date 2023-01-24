const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const Jail = require('../../../../Global/Databases/Schemas/Punitives.Jails')
const { genEmbed } = require("../../../../Global/Init/Embed");
const getLimit = new Map();
module.exports = {
    Isim: "reklam",
    Komut: ["ads","reklam-cezalandır"],
    Kullanim: "reklam <@acar/ID>",
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
    if(!roller.jailHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt)
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID>\``);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    let jailButton = new MessageButton()
    .setCustomId(`onayla`)
    .setLabel(await Jail.findById(uye.id) ? `Aktif Cezalandırılması Mevcut!` : getLimit.get(message.member.id) >= ayarlar.reklamLimit ? `Limit Doldu (${getLimit.get(message.member.id) || 0} / ${ayarlar.reklamLimit})` : 'İşlemi Onaylıyorum!')
    .setEmoji(message.guild.emojiGöster(emojiler.Cezalandırıldı).id)
    .setStyle('SUCCESS')
    .setDisabled(await Jail.findById(uye.id) ? true : getLimit.get(message.member.id) >= ayarlar.reklamLimit ? true : false )
    let iptalButton =  new MessageButton()
    .setCustomId(`iptal`)
    .setLabel('İşlemi İptal Et')
    .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
    .setStyle('DANGER')
    let jailOptions = new MessageActionRow().addComponents(
            jailButton,
            iptalButton
    );

    let msg = await message.channel.send({embeds: [new genEmbed().setDescription(`${uye} isimli üyeyi **reklam** nedeniyle cezalandırmak istiyor musun?\n${!roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)) && !ayarlar.staff.includes(message.member.id) && !message.member.permissions.has('ADMINISTRATOR') ? Number(ayarlar.reklamLimit) ? `Kullanılabilir Limit: \`${getLimit.get(message.member.id) || 0} / ${ayarlar.reklamLimit}\`` : `` : ``}`)], components: [jailOptions]}).catch(err => {})

    const filter = i => i.user.id == message.member.id 
    const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 30000 })

    collector.on('collect', async i => {
        if (i.customId === `onayla`) {
            i.deferUpdate()  
            msg.delete().catch(err => {})
            message.react(message.guild.emojiGöster(emojiler.Onay)).catch(err => {})
            uye.removeStaff()
            uye.dangerRegistrant()
            if(Number(ayarlar.reklamLimit)) {
                if(!message.member.permissions.has('ADMINISTRATOR') && !ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) {
                    getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) + 1)
                    setTimeout(() => {
                        getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) - 1)
                    },1000*60*5)
                }
            }
            return uye.addPunitives(3, message.member, "Sunucu içerisinde reklam yapmak!", message)

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

