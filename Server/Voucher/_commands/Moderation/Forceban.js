const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Forcebans = require('../../../../Global/Databases/Schemas/Punitives.Forcebans');
const { genEmbed } = require('../../../../Global/Init/Embed');
module.exports = {
    Isim: "kalkmazban",
    Komut: ["acarban", "uzaoç","forceban"],
    Kullanim: "kalkmazban <@acar/ID> <Sebep>",
    Aciklama: "Belirlenen üyeyi sunucudan uzaklaştırır.",
    Kategori: "kurucu",
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
    if(!ayarlar.staff.includes(message.member.id)) return message.channel.send(cevaplar.noyt)
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
    let sunucudabul = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID> <Sebep>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(sunucudabul && sunucudabul.user.bot) return message.channel.send(cevaplar.bot);
    if(sunucudabul && message.member.roles.highest.position <= sunucudabul.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.channel.send(cevaplar.sebep);
    if(sunucudabul) {
        uye.addPunitives(1, message.member, sebep, message)
        message.react(message.guild.emojiGöster(emojiler.Onay))
    } else {
        let cezano = await Punitives.countDocuments().exec();
        cezano = cezano == 0 ? 1 : cezano + 1;
        let ceza = new Punitives({ 
            No: cezano,
            Member: uye.id,
            Staff: message.member.id,
            Type: "Kalkmaz Yasaklama",
            Reason: sebep,
            Date: Date.now()
        })
        ceza.save().catch(err => {})  
        islem = new Forcebans({
            No: cezano,
            _id: uye.id,
        })
        await islem.save();
        let findedChannel = message.guild.kanalBul("forceban-log")
        if(findedChannel) findedChannel.send({embeds: [new genEmbed().setFooter(`${ayarlar.embedSettings.Footer ? `${ayarlar.embedSettings.Footer} •` : ''} Ceza Numarası: #${cezano}`,ayarlar.embedSettings.Footer ? undefined : uye.avatarURL({dynamic: true})).setDescription(`${uye.toString()} üyesine, **${tarihsel(Date.now())}** tarihinde \`${sebep}\` nedeniyle işlem uygulandı.`)]})
        await message.channel.send(`${message.guild.emojiGöster(emojiler.Yasaklandı)} ${uye.toString()} isimli üyeye \`${sebep}\` sebebiyle "__Kalkmaz(**BOT**) Yasaklama__" türünde ceza-i işlem uygulandı. (\`Ceza Numarası: #${cezano}\`)`)
        await message.guild.members.ban(uye.id, { reason: `#${ceza.No} (${ceza.Reason})` }).catch(err => {})
        await Users.updateOne({ _id: message.member.id } , { $inc: { "Uses.Forceban": 1 } }, {upsert: true})
        message.react(message.guild.emojiGöster(emojiler.Onay))
    }
    }
};

  