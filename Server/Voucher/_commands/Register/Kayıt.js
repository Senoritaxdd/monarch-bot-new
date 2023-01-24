const { Client, Message, MessageButton, MessageActionRow } = require("discord.js");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const {genEmbed} = require('../../../../Global/Init/Embed');
module.exports = {
    Isim: "kayıt",
    Komut: ["kay","k"],
    Kullanim: "kayıt @acar/ID <isim> <yaş>",
    Aciklama: "Belirtilen üye sunucuda kayıtsız bir üye ise kayıt etmek için kullanılır.",
    Kategori: "teyit",
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
    let regPanelEmbed = new genEmbed();
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt)
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID> <Isim> <Yaş>\``);
    let uyarısıVar = await Punitives.findOne({Member: uye.id, Type: "Uyarılma"})
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(roller.erkekRolleri.some(x => uye.roles.cache.has(x))) return message.channel.send(cevaplar.kayıtlı);
    if(roller.kadınRolleri.some(x => uye.roles.cache.has(x))) return message.channel.send(cevaplar.kayıtlı);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(ayarlar.taglıalım && ayarlar.taglıalım != false && !uye.user.username.includes(ayarlar.tag) && !uye.roles.cache.has(roller.boosterRolü) && !uye.roles.cache.has(roller.vipRolü) && !message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.taglıalım).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(Date.now()-uye.user.createdTimestamp < 1000*60*60*24*7 && !message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.yenihesap).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(uye.roles.cache.has(roller.şüpheliRolü) && uye.roles.cache.has(roller.jailRolü) && uye.roles.cache.has(roller.yasaklıTagRolü) && !message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.cezaliüye).then(x => x.delete({timeout: 5000}))    
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if (yaş < ayarlar.minYaş) return message.channel.send(cevaplar.yetersizyaş).then(x => { setTimeout(() => {x.delete()}, 5000)})
    if(!isim || !yaş) return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID> <Isim> <Yaş>\``);
    setName = `${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${isim} | ${yaş}`;
    if(uyarısıVar) {
        regPanelEmbed.setDescription(`${uye} (\`${setName}\`) isimli üyenin **__Cezalarını & Uyarılarını__** kontrol ediniz ve daha sonra kayıt işlemini tamamlanabilmesi için, lütfen aşağıda ki düğmelerden cinsiyetini seçiniz.\n\n\`30 Saniye\` içerisinde tepki vermezseniz, işlem otomatik olarak iptal edilir.`)
    } else {
        regPanelEmbed.setDescription(`${uye} (\`${setName}\`) isimli üyenin kayıt işlemini tamamlanabilmesi için, lütfen aşağıda ki düğmelerden cinsiyetini seçiniz.\n\n\`30 Saniye\` içerisinde tepki vermezseniz, işlem otomatik olarak iptal edilir.`)
    }
    const genderSelect = new MessageActionRow().addComponents(
				new MessageButton()
	                .setCustomId('erkekyaxd')
	                .setLabel('Erkek')
	                .setStyle('SECONDARY')
                    .setEmoji(message.guild.emojiGöster(emojiler.erkekTepkiID).id),
                new MessageButton()
	                .setCustomId('lesbienaq')
	                .setLabel('Kadın')
	                .setStyle('SECONDARY')
                    .setEmoji(message.guild.emojiGöster(emojiler.kadınTepkiID).id),
                new MessageButton()
	                .setCustomId('iptal')
	                .setLabel('İptal')
	                .setStyle('DANGER')
                    .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
			);
            const filter = i => i.user.id === message.member.id;
            const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
let regPanel = await message.channel.send({embeds: [regPanelEmbed], components: [genderSelect], ephemeral: true} )

collector.on('collect', async i => {
	if (i.customId === 'erkekyaxd') {
        await regPanel.edit({ embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli üye **Erkek** olarak kayıt edildi.`)], components: [] }).then(x => {
            setTimeout(() => {
                x.delete()
            }, 10000);
        })
        uye.setNickname(`${setName}`).catch(err => message.channel.send(cevaplar.isimapi));
        uye.Register(`${isim} | ${yaş}`, "Erkek", message.member);
        client.Upstaffs.addPoint(message.member.id,_statSystem.points.record, "Kayıt")
		message.react(message.guild.emojiGöster(emojiler.Onay).id)
	}
    if (i.customId === 'lesbienaq') {
        await regPanel.edit({ embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli üye **Kadın** olarak kayıt edildi.`)], components: [] }).then(x => {
            setTimeout(() => {
                x.delete()
            }, 10000);
        })
        uye.setNickname(`${setName}`).catch(err => message.channel.send(cevaplar.isimapi));
        uye.Register(`${isim} | ${yaş}`, "Kadın", message.member);
        client.Upstaffs.addPoint(message.member.id,_statSystem.points.record, "Kayıt")
		message.react(message.guild.emojiGöster(emojiler.Onay).id)
	}
    if (i.customId === 'iptal') {
        await i.deferUpdate();
        regPanel.delete().catch(err => {})
		message.react(message.guild.emojiGöster(emojiler.Iptal).id).catch(err => {})
        
	}
});
collector.on('end', collected => {});
    }
};

