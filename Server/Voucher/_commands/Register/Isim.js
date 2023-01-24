const { Client, Message} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');

module.exports = {
    Isim: "isim",
    Komut: ["i","nick"],
    Kullanim: "isim <@acar/ID> <İsim> <Yaş>",
    Aciklama: "Belirtilen üyenin ismini ve yaşını güncellemek için kullanılır.",
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
    if(!ayarlar.tag) return message.channel.send(cevaplar.ayarlamayok);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt)
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID> <Isim> <Yaş>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi).then(x => setTimeout(() => {x.delete()}, 7500))
    if(uye.user.bot) return message.channel.send(cevaplar.bot);
    if(!uye.manageable) return message.channel.send(cevaplar.dokunulmaz).then(x => setTimeout(() => {x.delete()}, 7500))
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(cevaplar.yetkiust).then(x => setTimeout(() => {x.delete()}, 7500))
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if (yaş < ayarlar.minYaş) return message.channel.send(cevaplar.yetersizyaş).then(x => setTimeout(() => {x.delete()}, 7500))
    if(!isim || !yaş) return message.channel.send(cevaplar.argümandoldur + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID> <Isim> <Yaş>\``);
    setName = `${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${isim} | ${yaş}`;
    uye.setNickname(`${setName}`).catch(err => message.channel.send(cevaplar.isimapi));
    var filter = msj => msj.author.id === message.author.id && msj.author.id !== client.user.id;
    let isimveri = await Users.findById(uye.id) || []
    let isimler = isimveri.Names ? isimveri.Names.length > 0 ? isimveri.Names.reverse().map((value, index) => `\`${value.Name}\` (${value.State}) ${value.Staff ? "(<@"+ value.Staff + ">)" : ""}`).join("\n") : "" : [] 
    uye.Rename(`${isim} | ${yaş}`, message.member, "İsim Güncelleme")
    let isimLog = message.guild.kanalBul("isim-log")
    if(isimLog) isimLog.send({embeds: [new genEmbed().setDescription(`${uye} isimli üyenin ismi ${message.member} tarafından \`${tarihsel(Date.now())}\` tarihinde "${isim} | ${yaş}" olarak güncellendi.`)]})
    message.channel.send({embeds: [new genEmbed().setDescription(`${uye} üyesinin ismi "${isim} | ${yaş}" olarak değiştirildi${isimveri.Names ? isimveri.Names.length > 0 ? 
        `, bu üye daha önce bu isimlerle kayıt olmuş.\n\n${message.guild.emojiGöster(emojiler.Iptal)} üyesinin toplamda **${isimveri.Names.length}** isim kayıtı bulundu
${isimler}\n\nÜyesinin önceki isimlerine \`${sistem.botSettings.Prefixs[0]}isimler <@acar/ID>\` komutuyla bakarak kayıt işlemini\n gerçekleştirmeniz önerilir.`
: "." : "."}`)]}).then(msg => {
        message.react(message.guild.emojiGöster(emojiler.Onay));
    })

    }
};

