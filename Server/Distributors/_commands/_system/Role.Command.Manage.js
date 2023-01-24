const { Client, Message, MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");
const TalentPerms = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const task = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Tasks');
const { genEmbed } = require("../../../../Global/Init/Embed");
const ms = require('ms')
module.exports = {
    Isim: "tp",
    Komut: ["talentperm","talentperms","özelkomut","rolkomut"],
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
    if(!ayarlar.staff.includes(message.member.id) && message.guild.ownerId != message.member.id) return;  
    const embed = new genEmbed()
      let Tp = await TalentPerms.findOne({guildID: message.guild.id})
      
     if(args[0] == "ekle") {
      let TalentPerm = Tp.talentPerms
      let mesaj = await message.channel.send(`${message.guild.emojiGöster(emojiler.sarıYıldız)} Lütfen bir komut ismi giriniz. (**15 Saniye**, iptal etmek için \`iptal\` yazabililirsin)`);
      let komutPushlancak = {}
      var isimfilter = m => m.author.id == message.author.id
      let rollPush = []
      //message.guild.roles.cache.sort((a, b) => b.position - a.position).filter(x => !x.permissions.has("ADMINISTRATOR") && && x.name != "__________________" && x.name != "@everyone" && _statSystem.staffs.some(r => x.id != r.rol) && roller.erkekRolleri.some(r => x.id != r) && roller.kadınRolleri.some(r => x.id != r) && x.id != roller.boosterRolü && x.id != roller.vipRolü && x.id != roller.tagRolü && x.id != roller.jailRolü )
      message.guild.roles.cache.sort((a, b) => b.position - a.position).filter(x => roller.rolPanelRolleri.some(c => c == x)).forEach(data => {
        rollPush.push([
          {label: data.name, value: data.id, emoji: {id: message.guild.emojiGöster(emojiler.Terfi.miniicon).id}, description: "Rol ID: " +data.id},
        ])
      })

      let satır = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("kullanacakRoller")
        .setPlaceholder("İzin verilecek rolleri seçin!")
        .setMaxValues(5)
        .setMinValues(1)
        .setOptions(
            rollPush.slice(0, 25)
        )
    )
    await message.channel.awaitMessages({isimfilter, max: 1, time: 15000, errors: ["time"]})
    .then(async isim => {
    if (isim.first().content == ("iptal" || "i")) {
      isim.first().delete();
      mesaj.delete();
      return;
    };
    if (isim.first().content.includes(" ")) {
      mesaj.delete();
      isim.first().content;
      return message.channel.send(`${cevaplar.prefix} Komut ismi boşluk içeremez!`);
    }
    if ((TalentPerm && TalentPerm.find(a => a.Commands == isim.first().content)) || client.commands.get(isim.first().content )) {
      mesaj.delete();
      isim.first().content;
      return message.channel.send(`${cevaplar.prefix} ${isim.first().content} isminde zaten bir komut mevcut.`);
    }
    if (isim.first().content.length > 25) return message.channel.send(`${cevaplar.prefix} Eklemek istediğiniz komut 25 karakterden fazla isime sahip.`);
    komutPushlancak.Name = başHarfBüyült(isim.first().content);
    komutPushlancak.Commands = isim.first().content;
    isim.first().delete();
    await mesaj.edit({content: null, embeds: [new genEmbed().setColor("WHITE").setDescription(`Komutu kullanma izni verilcek rol(ler) aşağıda ki menüden seçiniz?`).setFooter(`en az 1 tane en fazla 5 tane rol seçilebilir!`)], components: [satır]});


    })

    const filter = i => i.user.id == message.member.id 
    const collector = mesaj.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 50000 })
 
    collector.on('collect', async i => { 
      if(i.customId == "kullanacakRoller") {
        let roles = roller.rolPanelRolleri
          var role = []
          for (let index = 0; index < i.values.length; index++) {
            let ids = i.values[index]
            role.push(ids)
          }
    
          komutPushlancak.Permission = role

          message.react(message.guild.emojiGöster(emojiler.Onay))
          mesaj.edit({components: [], content: null, embeds: [ new genEmbed().setFooter(`birden fazla rol etiketi veya rol idsi girebilirsiniz.`).setDescription(`${başHarfBüyült(komutPushlancak.Name)} komutunu ${role.map(x => message.guild.roles.cache.get(x)).join(", ")} rol(leri) verebilecek roller seçildi şimdi sırada vermek istediğiniz rolü yazın. (**10 Saniye**, iptal etmek için \`iptal\` yazın)`)]})
          await message.channel.awaitMessages({isimfilter, max: 1, time: 50000, errors: ["time"]})
          .then(async verilcekRole => {
            let acarsiksinananı = verilcekRole.first()
          if (verilcekRole.first().content == ("iptal" || "i")) {
            verilcekRole.first().delete();
            mesaj.delete();
            return;
          };
 
          let rolPushing = []
          if(acarsiksinananı.mentions.roles.size >= 1) {
            rolPushing = acarsiksinananı.mentions.roles.map(role => role.id)
          } else {
            let argss = acarsiksinananı.content.split(" ");
            argss = argss.splice(0)
            let rolVerAbime = argss.filter(role => message.guild.roles.cache.some(role2 => role == role2.id))
            rolPushing.push(...rolVerAbime)
          }
          komutPushlancak.Roles = rolPushing
          acarsiksinananı.delete();
          await TalentPerms.updateOne({guildID: message.guild.id}, { $push: {"talentPerms": komutPushlancak}}, {upsert: true}).exec()
          await mesaj.edit({components: [], embeds: [ new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} **${başHarfBüyült(komutPushlancak.Name)}** (\`${sistem.botSettings.Prefixs.map(x => x).join(", ")} prefixlerine sahip!\`) isimli alt komut başarıyla \`${tarihsel(Date.now())}\` tarihinde oluşturuldu.`).setFooter(`bu komut sadece rol ver/al için kullanılır ve loglanır.`).addField(`Kullanacak rol(ler)`, `${komutPushlancak.Permission.map(x => message.guild.roles.cache.get(x)).join(",")}`, true).addField(`Verilecek rol(ler)`,`${rolPushing.map(x => message.guild.roles.cache.get(x)).join(", ")}`,true)]});
      
          }).catch(err => {})
        }

      

    })

    collector.on("end", () => {
      mesaj.delete().catch(err => {})
    })


      
    }
    
    if(!args[0] && args[0] != "ekle") {
      let TalentPerm = Tp.talentPerms
      let komutlar = []
      let komutListe = []
      if(!TalentPerm || (TalentPerm && TalentPerm.length < 1)) return message.channel.send({embeds: [new genEmbed().setColor("WHITE").setDescription(`${message.guild.emojiGöster(emojiler.sarıYıldız)} \`${message.guild.name}\` sunucusuna ait **${TalentPerm ? 0 : 0}** alt komut bulunmaktadır.`).setFooter(`komut eklemek için: ${sistem.botSettings.Prefixs[0]}talentperm <ekle>`)]})
      TalentPerm.filter(x => !Array.isArray(x.Commands)).forEach(x =>  komutlar.push(x.Commands))
      TalentPerm.filter(x => !Array.isArray(x.Commands)).forEach(data => {
        komutListe.push([
          {label: başHarfBüyült(data.Commands), value: data.Commands, emoji: {id: message.guild.emojiGöster(emojiler.chatSusturuldu).id}, description: `${data.Roles.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x).name : "@rol bulunamadı").join(", ")} veriyor.`},
        ])
      })
      if(komutListe.length <= 0) return message.channel.send({embeds: [new genEmbed().setColor("WHITE").setDescription(`${message.guild.emojiGöster(emojiler.sarıYıldız)} \`${message.guild.name}\` sunucusuna ait **${TalentPerm ? 0 : 0}** alt komut bulunmaktadır.`).setFooter(`komut eklemek için: ${sistem.botSettings.Prefixs[0]}talentperm <ekle>`)]})
      let komutSil = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("komutSil")
        .setPlaceholder("Komut silmek için komutu aşağıdan seçin!")
        .setOptions(
          komutListe.slice(0, 25)
        )
      )
        let msg = await message.channel.send({components: [komutListe ? komutSil : null] ,embeds: [new genEmbed().setColor("WHITE").setFooter(`komut eklemek için: ${sistem.botSettings.Prefixs[0]}talentperm <ekle>`).setDescription(`${message.guild.emojiGöster(emojiler.sarıYıldız)} \`${message.guild.name}\` sunucusuna ait **${komutlar ? komutlar.length : 0}** alt komut bulunmaktadır.\n${komutlar ? "Komutlar: \`" + komutlar.join(", ") + "\`" : ''}`)]})
        const filter = i => i.user.id == message.member.id 
        const collector1 = msg.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 15000 })
     
        collector1.on('collect', async i => { 
          if(i.customId == "komutSil") {
            let roles = roller.rolPanelRolleri
              var role = []
              for (let index = 0; index < i.values.length; index++) {
                let ids = i.values[index]
                role.push(ids)
              }
              let komutBul = await TalentPerms.findOne({guildID: message.guild.id})
              const findCmd = komutBul.talentPerms.find(acar => acar.Commands == i.values[0]);
              await TalentPerms.updateOne({guildID: message.guild.id}, { $pull: { "talentPerms": findCmd } }, { upsert: true })
              msg.delete().catch(err => {})
              message.react(message.guild.emojiGöster(emojiler.Onay))
            }    
        
        })
    
        collector1.on("end", () => {
          msg.delete().catch(err => {})
        })
    
      }

}

};


function başHarfBüyült(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}