const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Mute = require('../../../../Global/Databases/Schemas/Punitives.Vmutes');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "unvmute",
    Komut: ["unvoicemute", "unsesmute"],
    Kullanim: "unvmute <#No/@acar/ID>",
    Aciklama: "Belirlenen üyenin ses kanallarında ki susturulmasını kaldırır.",
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
    if(!roller.voiceMuteHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    if(Number(args[0])) {
        let cezanobul = await Mute.findOne({No: args[0]})
        if(cezanobul) args[0] = cezanobul._id
    }
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <#No/@acar/ID>\``);
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz);
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    let cezakontrol = await Mute.findById(uye.id) 
    if(!cezakontrol) {
        message.channel.send(cevaplar.cezayok);
        message.react(message.guild.emojiGöster(emojiler.Iptal))
        return;
    };  
    let cezabilgisi = await Punitives.findOne({ Member: uye.id, Active: true, Type: "Ses Susturulma" })
    if(cezabilgisi && cezabilgisi.Staff !== message.author.id && message.guild.members.cache.get(cezabilgisi.Staff) && !message.member.permissions.has("ADMINISTRATOR") && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) 
    return message.channel.send({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} Bu ceza ${cezabilgisi.Staff ? message.guild.members.cache.get(cezabilgisi.Staff) ? `${message.guild.members.cache.get(cezabilgisi.Staff)} (\`${cezabilgisi.Staff}\`)` : `${cezabilgisi.Staff}` :  `${cezabilgisi.Staff}`} Tarafından cezalandırılmış. **Bu Cezayı Açman Münkün Değil!**`).setFooter("yaptırım yapılan cezada yaptırımı yapan yetkili işlem uygulayabilir.")]}).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal))
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
    await Punitives.updateOne({ No: cezakontrol.No }, { $set: { "Active": false, Expried: Date.now(), Remover: message.member.id} }, { upsert: true }).exec();
    if(await Mute.findById(uye.id)) {
        await Mute.findByIdAndDelete(uye.id)
    }
    if(uye && uye.voice.channel) await uye.voice.setMute(false);
    let findChannel = message.guild.kanalBul("sesmute-log")
    if(findChannel) findChannel.send({embeds: [new genEmbed().setDescription(`${uye} uyesinin \`#${cezakontrol.No}\` numaralı seste susturulması, **${tarihsel(Date.now())}** tarihinde ${message.member} tarafından kaldırıldı.`)]})
    
    await message.channel.send(`${message.guild.emojiGöster(emojiler.sesMuteKaldırıldı)} ${uye} üyesinin (\`#${cezakontrol.No}\`) ceza numaralı ses kanallarındaki susturulması kaldırıldı!`).then(x => {setTimeout(() => {
        x.delete()
    }, 10500)});;
    if(uye) uye.send({embeds: [ new genEmbed().setDescription(`${message.author} tarafından **${tarihsel(Date.now())}** tarihinde \`#${cezakontrol.No}\` ceza numaralı ses kanallarındaki susturulman kaldırıldı.`)]}).catch(x => {

    });
    message.react(message.guild.emojiGöster(emojiler.Onay))
    }
};