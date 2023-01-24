const { Message, MessageEmbed } = require("discord.js");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const Settings = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const { genEmbed } = require("../../../../Global/Init/Embed");
const commandBlocks = require('../../../../Global/Databases/Schemas/Others/Users.Command.Blocks');
const ms = require('ms');
const spamCommandCount = new Map()

 /**
 * @param {Message} message 
 */

module.exports = async (message) => { 
  
    // Sync Data's
    let Data = await GUILDS_SETTINGS.findOne({ _id: 1 })
    ayarlar = client._settings = global.ayarlar = global._settings = kanallar = client._channels = global.kanallar = global.channels =  roller = client._roles = global.roller = global._roles = Data.Ayarlar
    emojiler = client._emojis = global.emojiler = global._emojis = require('../../../../Global/Settings/_emojis.json');
    cevaplar = client._reply = global.cevaplar = global._reply = require('../../../../Global/Settings/_reply');
    // Sync Data's

    if (message.author.bot || !global.sistem.botSettings.Prefixs.some(x => message.content.startsWith(x)) || !message.channel || message.channel.type == "dm") return;
    let args = message.content.substring(global.sistem.botSettings.Prefixs.some(x => x.length)).split(" ");
    let komutcuklar = args[0].toLocaleLowerCase()
    let acar = message.client;
    args = args.splice(1);
    let calistirici;
    let TalentPerms;
    if(await Data.talentPerms) {

     TalentPerms = await Data.talentPerms.filter(x => !Array.isArray(x.Commands)).find(x => x.Commands == komutcuklar) || await Data.talentPerms.filter(x => Array.isArray(x.Commands)).find(x => x.Commands.some(kom => kom == komutcuklar))

    }

    if([".tag", "!tag"].includes(message.content.toLowerCase())) { 
      if((!message.mentions.members.first() || !message.guild.members.cache.get(args[0]))) return ayarlar.tag ? message.channel.send(`\`${ayarlar.tag}\``) : message.channel.send(`\`❌\` Bu sunucuya ait veritabanında tag ayarı bulunamadı. Lütfen tag belirleyiniz...`).then(x => {
      client.logger.log("Bu sunucuya ait veritabanında tag ayarı bulunamadı. Lütfen tag belirleyiniz...","error")
      setTimeout(() => {
          x.delete()
        }, 7500);
      }) 
    }
    if([".link", "!link"].includes(message.content.toLowerCase())) return message.channel.send(message.guild.vanityURLCode ? `discord.gg/${message.guild.vanityURLCode}` : `discord.gg/${(await message.channel.createInvite()).code}`);
    
    if((kanallar.izinliKanallar && !kanallar.izinliKanallar.some(x => message.channel.id == x)) && !message.member.permissions.has('ADMINISTRATOR') && !ayarlar.staff.includes(message.member.id) && !["temizle","sil","snipe","afk","kilit"].some(x => komutcuklar == x) ) return;
    if(message.member.roles.cache.has(roller.jailRolü) || message.member.roles.cache.has(roller.şüpheliRolü) || message.member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => message.member.roles.cache.has(rol)))) return;
    
    if(acar.commands.has(komutcuklar) || acar.aliases.has(komutcuklar) || TalentPerms) {
      if (!ayarlar.staff.includes(message.member.id) && !message.member.permissions.has('ADMINISTRATOR') && !message.member.roles.cache.has(roller.kurucuRolleri)) {
        let cBlock = await commandBlocks.findOne({_id: message.member.id })
        if(cBlock) return;
        let spamDedection = spamCommandCount.get(message.author.id) || []
        let cmd = { lastContent: message.content, Channel: message.channel.id, Command: komutcuklar }
        spamDedection.push(cmd)
        spamCommandCount.set(message.author.id, spamDedection)
        if (spamDedection.length >= 12) {
          let kanalBul = message.guild.kanalBul("safe-command-log")
          if(kanalBul) kanalBul.send({embeds: [new genEmbed()
            .setDescription(`${message.author} isimli üye sürekli komut kullanımı sebebiyle bot tarafından otomatik yasaklandı, bu yasaklanmanın itirazını Sunucu sahibi ve bot sahibine iletmelidir.`)
            .addField(`Son Gönderilen İçerikler`, `${spamDedection.map(x => `\`${x.lastContent}\``).join("\n")}`,true)
            .addField("Son Kullanılan Komutlar", `${spamDedection.map((x,index) => `\`${index+1}.\` \`${sistem.botSettings.Prefixs[0]}${x.Command}\` (${message.guild.channels.cache.get(x.Channel)})` ).join("\n")}`, true)
          ]})
          message.channel.send(`${message.guild.emojiGöster(emojiler.chatSusturuldu)} ${message.author} Sürekli olarak komut kullanımı sebebiyle bot tarafından komut kullanımınız \`Devre-Dışı\` bırakıldı.`).then(x => {
          setTimeout(() => {
            x.delete()
          }, 7500);
          })
          
          await commandBlocks.updateOne({_id: message.member.id}, { $set: { Date: Date.now(), lastData: spamDedection } }, {upsert: true}).exec()
          if(spamCommandCount.has(message.author.id)) spamCommandCount.delete(message.author.id);
        }
        setTimeout(() => { if (spamCommandCount.has(message.author.id)) { spamCommandCount.delete(message.author.id) } }, ms("1m"))
      }  
      try {
          await Users.updateOne({ _id: message.author.id }, { $push: { "CommandsLogs": { Komut: komutcuklar, Kanal: message.channel.id, Tarih: Date.now() } } }, { upsert: true }).exec();
          client.logger.log(`${message.author.tag} (${message.author.id}) komut kullandı "${komutcuklar}" kullandığı kanal "${message.channel.name}"`, "cmd");
          if(TalentPerms) {
            let embed = new genEmbed()
            var rolismi = TalentPerms.Name || "Belirsiz"
            let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if((TalentPerms.Permission && TalentPerms.Permission.length && !TalentPerms.Permission.some((id) => message.member.roles.cache.has(id))) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} Bu komutu kullanabilmek için ${TalentPerms.Permission ? TalentPerms.Permission.map(x => message.guild.roles.cache.get(x)).join(", ") + " rollerine sahip olmalısın!": ""}`)]}); 
            if (!uye) return message.channel.send({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} ${TalentPerms.Roles.map(x => message.guild.roles.cache.get(x)).join(", ")} ${TalentPerms.Roles.length > 1 ? 'rollerini' : "rolü"} verebilmem için lütfen bir üyeyi etiketle __Örn:__ \`${sistem.botSettings.Prefixs[0]}${komutcuklar} @acar/ID\`!`)]}).then(x => setTimeout(() => { x.delete() }, 7500));
            if (TalentPerms.Roles.some(role => uye.roles.cache.has(role))) {
              await Users.updateOne({ _id: uye.id }, { $push: { "Roles": { rol: TalentPerms.Roles, mod: message.author.id, tarih: Date.now(), state: "Kaldırma" } } }, { upsert: true }).exec() 
              TalentPerms.Roles.forEach(x => uye.roles.remove(x))
              message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye}, isimli üyeden ${TalentPerms.Roles.map(x => message.guild.roles.cache.get(x)).join(", ")} ${TalentPerms.Roles.length > 1 ? 'rolleri' : "rolü"} geri alındı.`)]}).catch().then(x => setTimeout(() => { x.delete() }, 7500));
              message.react(message.guild.emojiGöster(emojiler.Onay))
              message.guild.kanalBul("rol-al-log").send({embeds: [embed.setDescription(`${uye} isimli üyeden **${tarihsel(Date.now())}** tarihinde ${message.author} tarafından ${TalentPerms.Roles.map(x => message.guild.roles.cache.get(x)).join(", ")} adlı ${TalentPerms.Roles.length > 1 ? 'rolleri' : "rol"} geri alındı.`)]})
            }
            else  { 
              await Users.updateOne({ _id: uye.id }, { $push: { "Roles": { rol: TalentPerms.Roles, mod: message.author.id, tarih: Date.now(), state: "Ekleme" } } }, { upsert: true }).exec()
              uye.roles.add(TalentPerms.Roles); 
              message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye}, isimli üyeye ${TalentPerms.Roles.map(x => message.guild.roles.cache.get(x)).join(", ")} ${TalentPerms.Roles.length > 1 ? 'rolleri' : "rolü"} rolü verildi.`)]}).catch().then(x => setTimeout(() => { x.delete() }, 7500));
              message.react(message.guild.emojiGöster(emojiler.Onay))
              message.guild.kanalBul("rol-ver-log").send({embeds: [embed.setDescription(`${uye} isimli üyeye **${tarihsel(Date.now())}** tarihinde ${message.author} tarafından ${TalentPerms.Roles.map(x => message.guild.roles.cache.get(x)).join(", ")} adlı ${TalentPerms.Roles.length > 1 ? 'rolleri' : "rol"} verildi.`)]})  
            }
          }
          calistirici = acar.commands.get(komutcuklar) || acar.aliases.get(komutcuklar);
          if(calistirici) calistirici.onRequest(acar, message, args);
      } catch (err) {
        message.channel.send({content: `Bu komut çalıştırılırken hata oluştu... \`\`\`${err}\`\`\` `}).then(x => { 
          client.logger.log(`${komutcuklar} isimli komut çalıştırılırken hata oluştu.`,"error")
          setTimeout(() => {
            x.delete()
          }, 7500)
        })
     }
    } 

};

module.exports.config = {
    Event: "messageCreate"
};
