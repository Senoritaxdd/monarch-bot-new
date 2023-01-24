const { Client, Message, MessageEmbed} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Forcebans = require('../../../../Global/Databases/Schemas/Punitives.Forcebans');
const { genEmbed } = require('../../../../Global/Init/Embed');
module.exports = {
    Isim: "kalkmazban-kaldır",
    Komut: ["acarban-kaldır", "unforceban"],
    Kullanim: "kalkmazban-kaldır <@acar/ID>",
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
    if(message.author.id === uye.id) return message.channel.send(cevaplar.kendi);
        await Punitives.findOne({Member: uye.id, Type: "Kalkmaz Yasaklama", Active: true}).exec(async (err, res) => {
                 if(res) {
                    if(res.Staff !== message.author.id) return message.channel.send({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} Bu ceza ${res.Staff ? message.guild.members.cache.get(res.Staff) ? `${message.guild.members.cache.get(res.Staff)} (\`${res.Staff}\`)` : `${res.Staff}` :  `${res.Staff}`} Tarafından cezalandırılmış. **Bu Cezayı Açman Münkün Değil!**`).setFooter("yaptırım yapılan cezada yaptırımı yapan yetkili işlem uygulayabilir.")]}).then(x => {
                        message.react(message.guild.emojiGöster(emojiler.Iptal))
                        setTimeout(() => {
                            x.delete()
                        }, 7500);
                    });
                }
                if(res) await Punitives.updateOne({ No: res.No }, { $set: { "Active": false, Expried: Date.now(), Remover: message.member.id} }, { upsert: true }).exec();
                await message.guild.members.unban(uye.id).catch(err => {});
                let findChannel = message.guild.kanalBul("forceban-log");
                await Forcebans.deleteOne({ _id: uye.id })
                if(findChannel) await findChannel.send({embeds: [new genEmbed().setDescription(`${uye} uyesinin sunucudaki ${res ? `\`#${res.No}\` ceza numaralı kalkmaz yasaklaması` : "kalkmaz yasaklaması"}, **${tarihsel(Date.now())}** tarihinde ${message.author} tarafından kaldırıldı.`)]})
                await message.channel.send(`${message.guild.emojiGöster(emojiler.Tag)} ${uye} üyesinin ${res ? `(\`#${res.No}\`) ceza numaralı` : "sunucudaki"} kalkmaz yasaklaması kaldırıldı!`);
                message.react(message.guild.emojiGöster(emojiler.Onay))
        })
    
    }
};

  