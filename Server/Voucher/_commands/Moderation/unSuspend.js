const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Jail = require('../../../../Global/Databases/Schemas/Punitives.Jails');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "şüpheliçıkart",
    Komut: ["unsuspend", "unsuspect"],
    Kullanim: "şüpheliçıkart <@acar/ID> <Sebep>",
    Aciklama: "Belirtilen üye yeni bir hesapsa onu şüpheliden çıkartır.",
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
    if(!roller.jailHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID>\``);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    let cezakontrol = await Jail.findById(uye.id)
    if(cezakontrol) {
        message.channel.send(`${cevaplar.prefix} Belirtilen üye sistemsel tarafından cezalandırılmış, şüpheli çıkart komutu ile çıkartman münkün gözükmüyor.`).then(x => {
          setTimeout(() => {
            x.delete()
          }, 7500);
        });
        message.react(message.guild.emojiGöster(emojiler.Iptal))
        return;
    };
    let User = await Users.findOne({_id: uye.id});
    if(!ayarlar.taglıalım && User && User.Name && User.Names && User.Gender) {
        if(uye && uye.manageable) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${User.Name}`)
        if(User.Gender == "Erkek") await uye.setRoles(roller.erkekRolleri)
        if(User.Gender == "Kadın") await uye.setRoles(roller.kadınRolleri)
        if(User.Gender == "Kayıtsız") uye.setRoles(roller.kayıtsızRolleri)
        if(uye.user.username.includes(ayarlar.tag)) uye.roles.add(roller.tagRolü)
    } else {
        uye.setRoles(roller.kayıtsızRolleri)
        if(uye && uye.manageable) await uye.setNickname(`${ayarlar.tagsiz} İsim | Yaş`)
    }
    let findChannel = message.guild.kanalBul("şüpheli-log")
    if(findChannel) findChannel.send({embeds: [new genEmbed().setDescription(`${uye} uyesinin şüpheli durumu, **${tarihsel(Date.now())}** tarihinde ${message.member} tarafından kaldırıldı.`)]})
    
    await message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli üye şüpheli hesap konumundan çıkartıldı!`)]})
    .then(x => {
      setTimeout(() => {
        x.delete()
      }, 7500);
    })
    if(uye) uye.send({embeds: [new genEmbed().setDescription(`${message.author} tarafından **${tarihsel(Date.now())}** tarihinde şüpheliden çıkartıldın!`)]}).catch(x => {
      
    });
    message.react(message.guild.emojiGöster(emojiler.Onay))
    }
};