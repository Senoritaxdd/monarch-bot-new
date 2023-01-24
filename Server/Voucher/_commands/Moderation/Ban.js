const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require('../../../../Global/Init/Embed');
const getLimit = new Map();

module.exports = {
    Isim: "ban",
    Komut: ["yargı", "yasakla", "sg", "ananısikerim"],
    Kullanim: "ban <@acar/ID> <Sebep>",
    Aciklama: "Belirlenen üyeyi sunucudan uzaklaştırır.",
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
    if(!ayarlar && !roller && !roller.banHammer || !roller.üstYönetimRolleri || !roller.yönetimRolleri || !roller.kurucuRolleri || !roller.altYönetimRolleri) return message.channel.send(cevaplar.notSetup)
    if(!roller.banHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
    let sunucudabul = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID> <Sebep>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    if(sunucudabul && sunucudabul.user.bot) return message.channel.send(cevaplar.bot);
    if(sunucudabul && message.member.roles.highest.position <= sunucudabul.roles.highest.position) return message.channel.send(cevaplar.yetkiust);
    if(sunucudabul && roller.banKoru.some(oku => sunucudabul.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.channel.send(cevaplar.yetkilinoban); 
    if(getLimit.get(message.member.id) >= ayarlar.banLimit) return message.reply(`${cevaplar.prefix} \`Yasaklama\` komutu kullanım hakkınız dolmuştur.`);
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.channel.send(cevaplar.sebep);
    if(sunucudabul) {
        uye.dangerRegistrant()
        uye.addPunitives(2, message.member, sebep, message)
        message.react(message.guild.emojiGöster(emojiler.Onay))
    } else {
        let cezano = await Punitives.countDocuments().exec();
        cezano = cezano == 0 ? 1 : cezano + 1;
        let ceza = new Punitives({ 
            No: cezano,
            Member: uye.id,
            Staff: message.member.id,
            Type: "Yasaklama",
            Reason: sebep,
            Date: Date.now()
        })
        ceza.save().catch(err => {})
        let findedChannel = message.guild.kanalBul("ban-log")
        if(findedChannel) findedChannel.send({embeds: [new genEmbed().setFooter(`${message.guild.name ? `${message.guild.name} •` : ''} Ceza Numarası: #${cezano}`,message.guild.name ? message.guild.iconURL({dynamic: true}) : uye.avatarURL({dynamic: true})).setDescription(`${uye.toString()} üyesine, **${tarihsel(Date.now())}** tarihinde \`${sebep}\` nedeniyle ${message.member} tarafından ceza-i işlem uygulandı.`)]})
        await message.channel.send(`${message.guild.emojiGöster(emojiler.Yasaklandı)} ${uye.toString()} isimli üyeye \`${sebep}\` sebebiyle "__Yasaklama__" türünde ceza-i işlem uygulandı. (\`Ceza Numarası: #${cezano}\`)`)
        await message.guild.members.ban(uye.id, { reason: `#${ceza.No} (${ceza.Reason})` }).catch(err => {})
        await Users.updateOne({ _id: message.member.id } , { $inc: { "Uses.Ban": 1 } }, {upsert: true})
        message.react(message.guild.emojiGöster(emojiler.Onay))
    }
    if(Number(ayarlar.banLimit)) {
        if(!message.member.permissions.has('ADMINISTRATOR') && !ayarlar.staff.includes(message.member.id) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) {
            getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) + 1)
            setTimeout(() => {
                getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) - 1)
            },1000*60*5)
        }
    }
    }
};

  