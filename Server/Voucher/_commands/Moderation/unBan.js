const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "unban",
    Komut: ["yasaklama-kaldır","bankaldır","yasaklamakaldır"],
    Kullanim: "unban <@acar/ID>",
    Aciklama: "Belirlenen üyenin yasaklamasını kaldırır.",
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
    if(!roller.banHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])    
    if(!uye) return message.channel.send(cevaplar.üye + ` \`${sistem.botSettings.Prefixs[0]}${module.exports.Isim} <@acar/ID>\``);
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
    await Punitives.findOne({Member: uye.id, Type: "Yasaklama", Active: true}).exec(async (err, res) => {
        message.guild.bans.fetch().then(async(yasaklar)=> {
            if(yasaklar.size == 0) return message.channel.send(cevaplar.yasaklamayok)
            let yasakliuye = yasaklar.find(yasakli => yasakli.user.id == uye.id)
            if(!yasakliuye) return message.channel.send(`${cevaplar.prefix} \`Belirtilen Üye Yasaklı Değil!\` lütfen geçerli bir yasaklama giriniz.`);
            if(res) {
                if(res.Staff !== message.author.id && message.guild.members.cache.get(res.Staff) && !message.member.permissions.has("ADMINISTRATOR") && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x))) return message.channel.send({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} Bu ceza ${res.Staff ? message.guild.members.cache.get(res.Staff) ? `${message.guild.members.cache.get(res.Staff)} (\`${res.Staff}\`)` : `${res.Staff}` :  `${res.Staff}`} Tarafından cezalandırılmış. **Bu Cezayı Açman Münkün Değil!**`).setFooter("yaptırım yapılan cezada yaptırımı yapan yetkili işlem uygulayabilir.")]}).then(x => {
                    message.react(message.guild.emojiGöster(emojiler.Iptal))
                    setTimeout(() => {
                        x.delete()
                    }, 7500);
                });
            }
            if(res) await Punitives.updateOne({ No: res.No }, { $set: { "Active": false, Expried: Date.now(), Remover: message.member.id} }, { upsert: true }).exec();
            await message.guild.members.unban(uye.id);
            let findChannel = message.guild.kanalBul("ban-log");
            if(findChannel) await findChannel.send({embeds: [new genEmbed().setDescription(`${uye} uyesinin sunucudaki ${res ? `\`#${res.No}\` ceza numaralı yasaklaması` : "yasaklaması"}, **${tarihsel(Date.now())}** tarihinde ${message.author} tarafından kaldırıldı.`)]})
            await message.channel.send(`${message.guild.emojiGöster(emojiler.Tag)} ${uye} üyesinin ${res ? `(\`#${res.No}\`) ceza numaralı` : "sunucudaki"} yasaklaması kaldırıldı!`);
            message.react(message.guild.emojiGöster(emojiler.Onay))
        })
    })
    }
};