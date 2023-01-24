const { Client, Message, MessageButton, MessageActionRow, MessageSelectMenu} = require("discord.js");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");

module.exports = {
    Isim: "rol",
    Komut: ["rol"], 
    Kullanim: "rol <@acar/ID>",
    Aciklama: "",
    Kategori: "yönetim",
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
    if(!ayarlar.staff.includes(message.member.id) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) &&  !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return;
    if(!roller.rolPanelRolleri) return message.channel.send(cevaplar.notSetup);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.react(message.guild.emojiGöster(emojiler.Iptal));
    let rolList = [];
    let oyunRolleri = message.guild.roles.cache.sort((a, b) => b.position - a.position).filter(rol => roller.rolPanelRolleri.some(x => rol.id == x) && message.member.roles.highest.comparePositionTo(message.guild.roles.cache.get(rol.id)) > 1).forEach(x => {
      rolList.push([
        { label: x.name, description: "ID: "+ x.id, emoji: {id: message.guild.emojiGöster(emojiler.Terfi.miniicon).id} ,value: x.id}        
      ])
    })
   let rolcükler = new MessageActionRow().addComponents(
      new MessageSelectMenu()
      .setCustomId(`rolveral`)
      .setPlaceholder('Rol vermek/almak için rol seçiniz!')
      .addOptions([
          rolList.slice(0, 25)
      ]),
    )
    let msg = await message.channel.send({embeds: [new genEmbed().setColor("WHITE").setDescription(`${uye} isimli üyeye verilmesini istediğiniz rolü aşağıda ki menüden seçiniz!`).setFooter("menüden seçerek işleminizi tamamlayabilirsiniz.")], components: [rolcükler]})

    const filter = i => i.user.id == message.member.id 
    const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 30000 })
 
    collector.on('collect', async i => { 
      if(i.customId == "rolveral") {
        let role = [i.values[0]]
          if(role.some(x => message.member.roles.highest.comparePositionTo(message.guild.roles.cache.get(x)) < 1)) {
            message.react(message.guild.emojiGöster(emojiler.Iptal))
            msg.delete().catch(err => {})
            return i.reply({content: `${message.guild.emojiGöster(emojiler.Iptal)} ${role.map(x => message.guild.roles.cache.get(x)).join(", ")} rol(ler) yetkinin üstünde olduğu için işlem yapılamadı.`, ephemeral: true })
          }
            if(uye.roles.cache.has(i.values[0])) {
              await Users.updateOne({ _id: uye.id }, { $push: { "Roles": { rol: i.values[0], mod: message.author.id, tarih: Date.now(), state: "Kaldırma" } } }, { upsert: true }).exec() 
              message.guild.kanalBul("rol-al-log").send({embeds: [new genEmbed().setDescription(`${uye} isimli üyeden **${tarihsel(Date.now())}** tarihinde ${message.author} tarafından ${role.map(x => message.guild.roles.cache.get(x)).join(",")} adlı ${role.length > 1 ? 'rolleri' : "rol"} geri alındı.`)]})
              await uye.roles.remove(i.values[0])
              i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} ${uye}, isimli üyenin ${role.map(x => message.guild.roles.cache.get(x)).join(", ")} rolleri üzerinden kaldırıldı!`, ephemeral: true })
            
            } else {
              await Users.updateOne({ _id: uye.id }, { $push: { "Roles": { rol: i.values[0], mod: message.author.id, tarih: Date.now(), state: "Ekleme" } } }, { upsert: true }).exec()
              message.guild.kanalBul("rol-ver-log").send({embeds: [new genEmbed().setDescription(`${uye} isimli üyeye **${tarihsel(Date.now())}** tarihinde ${message.author} tarafından ${role.map(x => message.guild.roles.cache.get(x)).join(",")} adlı ${role.length > 1 ? 'rolleri' : "rol"} verildi.`)]})  
              await uye.roles.add(i.values[0])
              i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} ${uye}, isimli üyenin ${role.map(x => message.guild.roles.cache.get(x)).join(", ")} rolleri üzerine verildi!`, ephemeral: true })
            }
          message.react(message.guild.emojiGöster(emojiler.Onay))
          msg.delete().catch(err => {})
        }
      

    })

    collector.on("end", () => {
      msg.delete().catch(err => {})
    })

    }
};
