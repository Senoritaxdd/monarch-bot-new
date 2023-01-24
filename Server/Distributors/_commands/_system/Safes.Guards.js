const { Client, Message, Util, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");

const GUARD_SETTINGS = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
const ms = require('ms')
const moment = require('moment')
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "güvenlik",
    Komut: ["yarram", "guard-settings","guards","acarguard"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
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
    let mention = message.mentions.roles.first() || message.mentions.users.first() || message.guild.roles.cache.get(args[0]) || message.guild.members.cache.get(args[0])
    let guardSettings = await GUARD_SETTINGS.findOne({guildID: message.guild.id})
    let işlem = `${moment.duration(ms(guardSettings.auditInLimitTime)).format('Y [yılda,] M [ayda,] d [günde,] h [saatde,] m [Dakikada]')}`
    let option = ["dokunulmaz", "full", "sunucu", "bot", "roller", "kanallar", "sağtık", "emojisticker"]
    let OnePage = new genEmbed().setAuthor(message.guild.name,message.guild.iconURL({dynamic: true}))
    .setDescription(`Güvenlik sistemi \`${message.guild.name}\` isimli sunucunun tüm ayarlarının korumasını sağlar, bu panelden bu işlemleri yaparken limite tabi tutulması gereken kişiler bu komut yardımıyla listeye eklenir ve güvenlik sistemi belli limit karşılığı işlem yapmalarına izin verir fakat bu limit aşıldığında cezalandırma işlemini yapmaktadır ardından sunucu sahibi ve bot hesabına DM, Sms(MMS), Whatsapp, Telegram yoluyla bildirmektedir, bildirme sonucu cevap verilince otomatik olarak işlem yapılır.`)
    .addField("Güvenlik Bilgisi",`${message.guild.emojiGöster(emojiler.Terfi.miniicon)} İşlem Limiti (\`Açık\`): \`${işlem} ${guardSettings.auditLimit || 0} İşlem\` olarak ayarlanmış.
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Güvenlik Durumu: ${guardSettings.guildProtection ? "`Açık (Ultra Koruma!)`": "`Kapalı (Korumasız!)`"} olarak ayarlanmış.
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Dağıtıcı Durumu: \`2 Adet Self-Bot ve 4 Adet Bot\` bulunmaktadır.
${message.guild.emojiGöster(emojiler.Terfi.miniicon)} Tahmini Dağıtım Süresi: \`287 üye / 0.09dk\` olarak hesaplanmış
**NOT:** Bu tahmini süre önceki dağıtımların ortalamasını almaktadır, son dağıtma \`${tarihsel(Date.now() - ms("5M"))}\` tarihinde olmuş ve \`142 üyeye 0.02dk\` dağıtmış. Ve bundan önce \`5+\` daha dağıtım olmuş.`,false)
.addField("Nasıl Eklenir?", `Örn: \`${sistem.botSettings.Prefixs[0]}guards <@acar/@Rol/ID(Rol,Üye)> <${option.map(x => x).join(", ")}>\` komutu ile ekleyebilir/çıkartabilirsiniz.

\`\`\`fix
                 Güvenlik Listesindekiler\`\`\``)
.addField("Limitsiz Full Yönetim", `${guardSettings.unManageable.length >= 1 ? guardSettings.unManageable.map((x, index) => `\`${index + 1}.\` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, true)
.addField("Limitli Full Yönetim", `${guardSettings.fullAccess.length >= 1 ? guardSettings.fullAccess.map((x, index) => `\`${index + 1}.\` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, true)
.addField("Sadece Limitli Sunucu (Düzenle)", `${guardSettings.guildAccess.length >= 1 ? guardSettings.guildAccess.map((x, index) => `\`${index + 1}.\` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, true)
.addField("Sadece Limitli Bot (Ekle/Çıkar)", `${guardSettings.botAccess.length >= 1 ? guardSettings.botAccess.map((x, index) => `\`${index + 1}.\` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, true)
.addField("Sadece Limitli Roller (Oluştur/Kaldır/Düzenle)", `${guardSettings.rolesAcess.length >= 1 ? guardSettings.rolesAcess.map((x, index) => `\`${index + 1}.\` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, true)
.addField("Sadece Limitli Kanallar (Oluştur/Kaldır/Düzenle)", `${guardSettings.channelsAccess.length >= 1 ? guardSettings.channelsAccess.map((x, index) => `\`${index + 1}.\` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, true)
.addField("Sadece Limitli Sağ-Tık (Rol/Ban/Kick/Sustur/Bağlantı)", `${guardSettings.memberAccess.length >= 1 ? guardSettings.memberAccess.map((x, index) => `\`${index + 1}.\` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, true)
.addField("Sadece Limitli Emoji/Sticker (Oluştur/Kaldır/Düzenle)", `${guardSettings.emojiAccess.length >= 1 ? guardSettings.emojiAccess.map((x, index) => `\`${index + 1}.\` ${message.guild.roles.cache.get(x) || message.guild.members.cache.get(x) || x}`).join("\n") : 'Listede sonuç bulunamadı!'}`, true)
.addField("**NOT:**","Listede ki üyelerin/rollerin limitleri dolduğu anda ceza-i işlemleri sanki liste dışındaymış gibi işlem yapmaktadır.", true)
if(args[0]) {
        if(!mention) return message.reply(`${cevaplar.prefix} Lütfen Bir Rol(ler) veya Üye(ler) belirleyiniz!`); 
        if(!option.some(x => args[1] == x)) return message.reply(`${cevaplar.prefix} Lütfen bir koruma ismi belirtleyiniz: \`${option.map(x => x).join(", ")}\``); 
        if(args[1] === "dokunulmaz") {
            await Dokunulmaz(mention.id)
            message.channel.send({embeds: [new genEmbed().setDescription(`${mention}, etiketli/isim(ler)/rol(ler), **${tarihsel(Date.now())}** tarihinde \`${message.guild.name}\` Limitsiz Full güvenli olarak güncellendi.`)]})
            message.react(message.guild.emojiGöster(emojiler.Onay))
        }
        if(args[1] === "full") {
            await fullGüvenli(mention.id)
            message.channel.send({embeds: [new genEmbed().setDescription(`${mention}, etiketli/isim(ler)/rol(ler), **${tarihsel(Date.now())}** tarihinde \`${message.guild.name}\` Limitli Full güvenli olarak güncellendi.`)]})
            message.react(message.guild.emojiGöster(emojiler.Onay))
        }
        if(args[1] === "sunucu") {
            await sunucuGüvenli(mention.id)
            message.channel.send({embeds: [new genEmbed().setDescription(`${mention}, etiketli/isim(ler)/rol(ler), **${tarihsel(Date.now())}** tarihinde \`${message.guild.name}\` "__Sadece sunucu ayarları__" olarak güncellendi.`)]})
            message.react(message.guild.emojiGöster(emojiler.Onay))
        }
        if(args[1] === "bot") {
            await botGüvenli(mention.id)
            message.channel.send({embeds: [new genEmbed().setDescription(`${mention}, etiketli/isim(ler)/rol(ler), **${tarihsel(Date.now())}** tarihinde \`${message.guild.name}\` "__Sadece Bot Ekleme/Çıkarma__" olarak güncellendi.`)]})
            message.react(message.guild.emojiGöster(emojiler.Onay))
        }
        if(args[1] === "roller") {
            await rolGüvenli(mention.id)
            message.channel.send({embeds: [new genEmbed().setDescription(`${mention}, etiketli/isim(ler)/rol(ler), **${tarihsel(Date.now())}** tarihinde \`${message.guild.name}\` "__Sadece Rol Oluştur/Kaldır/Düzenle__" olarak güncellendi.`)]})
            message.react(message.guild.emojiGöster(emojiler.Onay))
        }
        if(args[1] === "kanallar") {
            await kanalGüvenli(mention.id)
            message.channel.send({embeds: [new genEmbed().setDescription(`${mention}, etiketli/isim(ler)/rol(ler), **${tarihsel(Date.now())}** tarihinde \`${message.guild.name}\` "__Sadece Kanal Oluştur/Kaldır/Düzenle__" olarak güncellendi.`)]})
            message.react(message.guild.emojiGöster(emojiler.Onay))
        }
        if(args[1] === "sağtık") {
            await üyeGüvenli(mention.id)
            message.channel.send({embeds: [new genEmbed().setDescription(`${mention}, etiketli/isim(ler)/rol(ler), **${tarihsel(Date.now())}** tarihinde \`${message.guild.name}\` "__Sadece Sağ-Tık Rol(Ver/Al) / Ban(Yasakla/Kaldır) /Kick__" olarak güncellendi.`)]})
            message.react(message.guild.emojiGöster(emojiler.Onay))
        }
        if(args[1] === "emojisticker") {
            await emojiGüvenli(mention.id)
            message.channel.send({embeds: [new genEmbed().setDescription(`${mention}, etiketli/isim(ler)/rol(ler), **${tarihsel(Date.now())}** tarihinde \`${message.guild.name}\` "__Sadece Emoji ve Sticker Yükle/Düzenle/Sil__" olarak güncellendi.`)]})
            message.react(message.guild.emojiGöster(emojiler.Onay))
        }
    } else {
       return message.channel.send({embeds: [OnePage]}) 
    }

}
};

async function başHarfBüyült(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

async function fullGüvenli(id) {
    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
    if(guardSettings.fullAccess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"fullAccess": id} }, {upsert: true})
    if(!guardSettings.fullAccess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"fullAccess": id} }, {upsert: true})
}

async function botGüvenli(id) {
    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
    if(guardSettings.botAccess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"botAccess": id} }, {upsert: true})
    if(!guardSettings.botAccess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"botAccess": id} }, {upsert: true})
}

async function emojiGüvenli(id) {
    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
    if(guardSettings.emojiAccess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"emojiAccess": id} }, {upsert: true})
    if(!guardSettings.emojiAccess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"emojiAccess": id} }, {upsert: true})
}

async function kanalGüvenli(id) {
    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
    if(guardSettings.channelsAccess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"channelsAccess": id} }, {upsert: true})
    if(!guardSettings.channelsAccess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"channelsAccess": id} }, {upsert: true})
}

async function sunucuGüvenli(id) {
    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
    if(guardSettings.guildAccess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"guildAccess": id} }, {upsert: true})
    if(!guardSettings.guildAccess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"guildAccess": id} }, {upsert: true})
}

async function üyeGüvenli(id) {
    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
    if(guardSettings.memberAccess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"memberAccess": id} }, {upsert: true})
    if(!guardSettings.memberAccess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"memberAccess": id} }, {upsert: true})
}

async function rolGüvenli(id) {
    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
    if(guardSettings.rolesAcess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"rolesAcess": id} }, {upsert: true})
    if(!guardSettings.rolesAcess.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"rolesAcess": id} }, {upsert: true})
}

async function Dokunulmaz(id) {
    let guardSettings = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
    if(guardSettings.unManageable.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"unManageable": id} }, {upsert: true})
    if(!guardSettings.unManageable.includes(id)) return await GUARD_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"unManageable": id} }, {upsert: true})
}

