const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Jail = require('../../../../Global/Databases/Schemas/Punitives.Jails');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "unjail",
    Komut: ["cezalıçıkart", "cezalıçıkart"],
    Kullanim: "unjail <#No/@acar/ID>",
    Aciklama: "Belirlenen üyeyi cezalıdan çıkartır.",
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
    if(Number(args[0])) {
      let cezanobul = await Jail.findOne({No: args[0]});
      if(cezanobul) args[0] = cezanobul._id
    }
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <#No/@acar/ID>\``);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    let cezakontrol = await Jail.findById(uye.id)
    if(!cezakontrol) {
        message.channel.send(cevaplar.cezayok);
        message.react(message.guild.emojiGöster(emojiler.Iptal))
        return;
    };
    let cezabilgisi = await Punitives.findOne({ Member: uye.id, Active: true, Type: "Cezalandırılma" })
    if(cezabilgisi && cezabilgisi.Staff !== message.author.id && message.guild.members.cache.get(cezabilgisi.Staff) && !message.member.permissions.has("ADMINISTRATOR") && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) 
    return message.channel.send({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} Bu ceza ${cezabilgisi.Staff ? message.guild.members.cache.get(cezabilgisi.Staff) ? `${message.guild.members.cache.get(cezabilgisi.Staff)} (\`${cezabilgisi.Staff}\`)` : `${cezabilgisi.Staff}` :  `${cezabilgisi.Staff}`} Tarafından cezalandırılmış. **Bu Cezayı Açman Münkün Değil!**`).setFooter("yaptırım yapılan cezada yaptırımı yapan yetkili işlem uygulayabilir.")]}).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal))
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
    await Jail.deleteOne({ _id: uye.id })
    await Punitives.updateOne({ No: cezakontrol.No }, { $set: { "Active": false, Expried: Date.now(), Remover: message.member.id} }, { upsert: true }).exec();
    let User = await Users.findOne({_id: uye.id});
    if(!ayarlar.taglıalım && User && User.Name && User.Names && User.Gender) {
        if(uye && uye.manageable) uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${User.Name}`)
        if(User.Gender == "Erkek") uye.setRoles(roller.erkekRolleri)
        if(User.Gender == "Kadın") uye.setRoles(roller.kadınRolleri)
        if(User.Gender == "Kayıtsız") uye.setRoles(roller.kayıtsızRolleri)
        if(uye.user.username.includes(ayarlar.tag)) uye.roles.add(roller.tagRolü)
    } else {
        uye.setRoles(roller.kayıtsızRolleri)
        if(uye && uye.manageable) await uye.setNickname(`${ayarlar.tagsiz} İsim | Yaş`)
    }
    if(!User) {
        uye.setRoles(roller.kayıtsızRolleri)
        if(uye && uye.manageable) await uye.setNickname(`${ayarlar.tagsiz} İsim | Yaş`)
    }
    await message.channel.send(`${message.guild.emojiGöster(emojiler.Onay)} ${uye} üyesinin (\`#${cezakontrol.No}\`) ceza numaralı cezalandırılması kaldırıldı!`).then(x => {setTimeout(() => {
        x.delete()
    }, 10750)});;;
    if(uye) uye.send({embeds: [new genEmbed().setDescription(`${message.author} tarafından **${tarihsel(Date.now())}** tarihinde \`#${cezakontrol.No}\` ceza numaralı cezalandırılması kaldırıldı!`)]}).catch(x => {
      
    });
    let findChannel = message.guild.kanalBul("jail-log")
    if(findChannel) findChannel.send({embeds: [new genEmbed().setDescription(`${uye} uyesinin \`#${cezakontrol.No}\` numaralı cezalandırılması, **${tarihsel(Date.now())}** tarihinde ${message.member} tarafından kaldırıldı.`)]})
    message.react(message.guild.emojiGöster(emojiler.Onay))
    }
};