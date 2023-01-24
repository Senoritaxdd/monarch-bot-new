const { Client, Message, MessageEmbed, MessageActionRow, MessageSelectMenu} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
module.exports = {
    Isim: "yardım",
    Komut: ["help", "yardim"],
    Kullanim: "yardım <@acar/ID>",
    Aciklama: "Belirtilen üyenin profil resmini büyültür.",
    Kategori: "Misc",
    Extend: false,
    
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
    let embed = new genEmbed()
    let Data = await GUILDS_SETTINGS.findOne({ _id: 1 })
    let Row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("yardimmenusu")
        .setPlaceholder("❇ Kategoriler aşağıda listelenmekte")
        .setOptions(
            {label: "Üye Komutları", description: "Genel tüm komutları içerir.", value: "diğer", emoji: {id: message.guild.emojiGöster(emojiler.Terfi.miniicon).id}},
            {label: "Ekonomi Komutları", description: "Genel tüm ekonomi komutlarını içerir.", value: "eco", emoji: {id: message.guild.emojiGöster(emojiler.Terfi.miniicon).id}},
            {label: "İstatistik Komutları", description: "Genel tüm stat komutlarını içerir.", value: "stat", emoji: {id: message.guild.emojiGöster(emojiler.Terfi.miniicon).id}},
            {label: "Teyit Komutları", description: "Genel tüm kayıt komutlarını içerir.", value: "teyit", emoji: {id: message.guild.emojiGöster(emojiler.Terfi.miniicon).id}},
            {label: "Yetkili Komutları", description: "Genel tüm yetkili komutlarını içerir.", value: "yetkili", emoji: {id: message.guild.emojiGöster(emojiler.Terfi.miniicon).id}},
            {label: "Yetenek ve Diğer Komutlar", description: "Genel tüm yetenek ve diğer komutlar içerir.", value: "talent", emoji: {id: message.guild.emojiGöster(emojiler.Terfi.miniicon).id}},
            {label: "Yönetim Komutları", description: "Genel tüm yönetim komutlarını içerir.", value: "yönetim", emoji: {id: message.guild.emojiGöster(emojiler.Terfi.miniicon).id}},
            {label: "Kurucu Komutları", description: "Genel tüm kurucu komutlarını içerir.", value: "kurucu", emoji: {id: message.guild.emojiGöster(emojiler.Terfi.miniicon).id}}
        )
    )



    const acar = await message.channel.send({components: [Row] ,embeds: [new genEmbed().setDescription(`:tada: Aşağıdaki kategorilerden komut yardımı almak istediğiniz kategoriyi seçin!`)]})
    var filter = i => i.user.id == message.member.id
    let collector = acar.createMessageComponentCollector({filter: filter, time: 30000, error: ["time"]})
    
    collector.on("collect", i => {
        if(i.customId == "yardimmenusu") {
           if(i.values == "talent") {
                acar.edit({embeds: [new genEmbed().setDescription(`${Data ?  Data.talentPerms ? Data.talentPerms.map(x => `\`${sistem.botSettings.Prefixs[0] + x.Commands + " <@acar/ID>"}\``).join("\n") : '' : ''}`)]})
           } else {
                acar.edit({embeds: [new genEmbed().setDescription(`${client.commands.filter(x => x.Extend != false && x.Kategori == `${i.values}`).map(x => `\`${sistem.botSettings.Prefixs[0] + x.Kullanim}\``).join("\n")}`)]})
           }
           i.deferUpdate()
        }
    })
    collector.on("end", () => {
        acar.edit({embeds: [new genEmbed().setDescription(`${client.commands.filter(x => x.Extend != false).map(x => `\`${sistem.botSettings.Prefixs[0] + x.Kullanim}\``).join("\n")}
        \`${Data ?  Data.talentPerms ? Data.talentPerms.map(x => sistem.botSettings.Prefixs[0] + x.Commands + " <@acar/ID>").join("\n") : '' : ''}\``)], components: []})
      })
    }
};