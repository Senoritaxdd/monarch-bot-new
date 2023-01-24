const { MessageEmbed, MessageButton, MessageActionRow,  MessageSelectMenu } = require("discord.js");
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const Invites = require('../../../../Global/Databases/Schemas/Global.Guild.Invites');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaff = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');

const moment = require('moment');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "yükselt",
    Komut: ["yukselt"],
    Kullanim: "yükselt <@acar/ID>",
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
    let Upstaffs = await Upstaff.findOne({_id: uye.id})
if(!Upstaffs ) {
    message.react(message.guild.emojiGöster(emojiler.Iptal))
} else {
    let yetkiBilgisi = _statSystem.staffs[_statSystem.staffs.indexOf(_statSystem.staffs.find(x => uye.roles.cache.has(x.rol)))]
    let rolBul =  _statSystem.staffs[_statSystem.staffs.indexOf(yetkiBilgisi)+1];
    if(!rolBul) return message.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} ${uye} isimli üye son yetkiye ulaştığı için yükseltme işlemi yapılamaz.`, ephemeral: true})
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
	 await Stats.updateOne({guildID: sistem.SERVER.ID, userID: uye.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})      
await Upstaff.updateOne({ _id: uye.id }, { $set: { "Point": 0, "staffNo": Number(rolBul.No) + Number(1), "staffExNo": rolBul.No, "Yetkili": 0, "Görev": 0, "Invite": 0,  "Tag": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0 }}, {upsert: true});
      message.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli yetkili, \`${message.guild.roles.cache.get(rolBul.rol).name}\` rolüne yükseltildi.`, ephemeral: true }).then(x => {
        setTimeout(() => {
            x.delete()
        }, 7500);
        message.react(message.guild.emojiGöster(emojiler.Onay))
      })


        

    
}

    }
};

