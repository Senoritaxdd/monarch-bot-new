const {MessageButton, MessageActionRow, MessageSelectMenu} = Discord = require('discord.js');
const GUILD_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
let özellikler = [
    { name: "tag", type: "tekil", category: "guild"},
    { name: "tagsiz", type: "tekil", category: "guild"},
    { name: "minYaş", type: "tekil" , category: "register"},
    { name: "serverName", type: "tekil" , category: "guild"},
    { name: "taglıalım", type: "acmali" , category: "guild"},
    { name: "otoKayıt", type: "acmali", category: "guild" },
    { name: "otoIsim", type: "acmali", category: "guild" },
    { name: "kufurEngel", type: "acmali" , category: "guild"},
    { name: "reklamEngel", type: "acmali" , category: "guild"},
    { name: "kayıtsızLimit", type: "tekil", category: "limit"},
    { name: "muteLimit", type: "tekil", category: "limit"},
    { name: "voiceMuteLimit", type: "tekil", category: "limit"},
    { name: "jailLimit", type: "tekil", category: "limit"},
    { name: "banLimit", type: "tekil", category: "limit"},
    { name: "kayıtsızRolleri", type: "roller" , category: "register"},
    { name: "erkekRolleri", type: "roller", category: "register" },
    { name: "kadınRolleri", type: "roller" , category: "register"},
    { name: "teyitciRolleri", type: "roller" , category: "register"},
    { name: "tagRolü", type: "rol" , category: "register"},
    { name: "boosterRolü", type: "rol" , category: "guild"},
    { name: "vipRolü", type: "rol" , category: "role"},
    { name: "kurucuRolleri", type: "roller" , category: "role"},
    { name: "altYönetimRolleri", type: "roller" , category: "role"},
    { name: "yönetimRolleri", type: "roller" , category: "role"},
    { name: "üstYönetimRolleri", type: "roller" , category: "role"},
    { name: "roleManager", type: "roller" , category: "role"},
    { name: "banHammer", type: "roller" , category: "punitives"},
    { name: "jailHammer", type: "roller" , category: "punitives"},
    { name: "voiceMuteHammer", type: "roller" , category: "punitives"},
    { name: "muteHammer", type: "roller" , category: "punitives"},
    { name: "teleportHammer", type: "roller" , category: "role"},
    { name: "abilityHammer", type: "roller" , category: "role"},
    { name: "warnHammer", type: "roller" , category: "punitives"},
    { name: "muteRolü", type: "rol", category: "punitives" },
    { name: "jailRolü", type: "rol" , category: "punitives"},
    { name: "şüpheliRolü", type: "rol", category: "punitives" },
    { name: "yasaklıTagRolü", type: "rol" , category: "punitives"},
    { name: "Katıldı", type: "rol" , category: "guild"},
    { name: "banKoru", type: "roller" , category: "role"},
    { name: "Yetkiler", type: "roller" , category: "role"},
    { name: "altilkyetki", type: "rol", category: "role"},
    { name: "etkinlikKatılımcısı", type: "rol" , category: "guild"},
    { name: "cekilisKatılımcısı", type: "rol" , category: "guild"},
    { name: "TerfiLog", type: "kanal" , category: "channel"},
    { name: "coinChat", type: "kanallar" , category: "channel"},
    { name: "izinliKanallar", type: "kanallar" , category: "channel"},
    { name: "hoşgeldinKanalı", type: "kanal" , category: "register"},
    { name: "chatKanalı", type: "kanal" , category: "channel"},
    { name: "kurallarKanalı", type: "kanal" , category: "channel"},
    { name: "toplantıKanalı", type: "kanal" , category: "channel"},
    { name: "davetKanalı", type: "kanal" , category: "channel"},
    { name: "publicKategorisi", type: "kanal" , category: "channel"},
    { name: "registerKategorisi", type: "kanal", category: "register" },
    { name: "streamerKategorisi", type: "kanal" , category: "channel"},
    { name: "photoChatKanalı", type: "kanal", category: "channel" },
    { name: "spotifyKanalı", type: "kanal", category: "channel" },
    { name: "sleepRoom", type: "kanal", category: "channel" },
    { name: "ayrıkKanallar", type: "kanallar" , category: "channel"},
    { name: "başlangıçYetki", type: "rol", category: "role"},
    { name: "rolPanelRolleri", type: "roller", category: "role"},
    { name: "statRozet", type: "acmali", category: "stat"},
    { name: "statRozetOne", type: "rol", category: "stat"},
    { name: "statRozetTwo", type: "rol", category: "stat"},
    { name: "statRozetThree", type: "rol", category: "stat"},
    { name: "statRozetFour", type: "rol", category: "stat"},
    { name: "statRozetFive", type: "rol", category: "stat"},

 // Tekil, Rol, Kanal, Roller, Acmali, Cogul
  ];
  const { Client, Message } = require("discord.js");
const { genEmbed } = require('../../../../Global/Init/Embed');
  module.exports = {
      Isim: "setup",
      Komut: ["server","install","settings","sunucu-yönet","bot-yönet","sunucuyönet","kurulum","lisans"],
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
      if(!(ayarlar && ayarlar.staff && ayarlar.staff.includes(message.member.id)) && message.guild.ownerId != message.member.id) return message.channel.send(cevaplar.noyt)
      const buttonSatir = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId("restleaq")
        .setLabel("Tüm Botları Yeniden Başlat")
        .setStyle("SECONDARY")
        .setEmoji("927196659056791602"),
        new MessageButton()
        .setCustomId("seçenekkur")
        .setLabel("Rol Alma & Seçenek Kurulumu")
        .setStyle("SECONDARY")
        .setEmoji("812726381417857074"),
        new MessageButton()
        .setCustomId("logkur")
        .setLabel("Log Kanal Kurulumu")
        .setStyle("SECONDARY")
        .setEmoji("925127916382220379"),
        new MessageButton()
        .setCustomId("emojikur")
        .setLabel("Emojileri Yükleme")
        .setStyle("SECONDARY")
        .setEmoji("927315417146458113"),

      )
      const buttonSatir3 = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId('ayarlistesi')
        .setLabel('⚡ Ayarlanabilir Genel Ayarlar')
        .setStyle("PRIMARY"),
        new MessageButton()
        .setCustomId('ayarlar')
        .setLabel('🔨 Yapılan Ayarları Görüntüle')
        .setStyle('SUCCESS')
      )
       
        let Database = await GUILD_SETTINGS.findOne({guildID: message.guild.id}).exec()
        const data = Database.Ayarlar
        let secim = args[0];
        const embed = new genEmbed() .setColor("WHITE")   
        if (!secim || !özellikler.some(ozellik => ozellik.name.toLowerCase() == secim.toLowerCase())) {
            return message.channel.send({embeds: [embed.setDescription(`🛠 \`${message.guild.name}\` sunucusunun, Bot, Sunucu, Lisans , Veritabanı ve ayarlanabilir ayarlarını buradan güncelleyebilir düzeltebilirsiniz ayrıca lisans, üyelik ve paket işlemlerini ister buradan ister de websitesi kontrolü üzerinden yapabilirsiniz.`)], components: [buttonSatir,buttonSatir3]}).then(x => {
                const filter = i =>  i.user.id === message.member.id;

                const collector = message.channel.createMessageComponentCollector({ filter, time: 35000 });
                
                collector.on('collect', async i => {
                  if(i.customId === 'emojikur') {
                    await i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla istek gönderildi! komutu bu paneli açmadan kullanmak için: **${sistem.botSettings.Prefixs[0]}emojikur** komutu ile kullanabilirsiniz.`, ephemeral: true})
                    message.react(message.guild.emojiGöster(emojiler.Onay))
                    x.delete().catch(err => {})
                    let kom = client.commands.find(x => x.Isim == "emojikur")
                    kom.onRequest(client, message, args)
                  }
                  if(i.customId === 'logkur') {
                    await i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla istek gönderildi! komutu bu paneli açmadan kullanmak için: **${sistem.botSettings.Prefixs[0]}logkur** komutu ile kullanabilirsiniz.`, ephemeral: true})
                    message.react(message.guild.emojiGöster(emojiler.Onay))
                    x.delete().catch(err => {})
                    let kom = client.commands.find(x => x.Isim == "logkur")
                    kom.onRequest(client, message, args)
                  }
                  if(i.customId == "seçenekkur") {
                    await i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla istek gönderildi! komutu bu paneli açmadan kullanmak için: **${sistem.botSettings.Prefixs[0]}seçenek** komutu ile kullanabilirsiniz.`, ephemeral: true})
                    message.react(message.guild.emojiGöster(emojiler.Onay))
                    x.delete().catch(err => {})
                    let kom = client.commands.find(x => x.Isim == "seçenek")
                    kom.onRequest(client, message, args)
                  }
                  if(i.customId == "restleaq") {
                    const children = require("child_process");
                    message.react(message.guild.emojiGöster(emojiler.Onay)),
                    x.delete().catch(err => {})
                    const ls = children.exec(`pm2 restart all`);
                    ls.stdout.on('data', async function (data) {
                      await i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarılı! ${ayarlar ? ayarlar.serverName ? ayarlar.serverName :  message.guild.name : message.guild.name} sunucusunun tüm botları yeniden başlatıldı!`, ephemeral: true})
                    });
  
                  }
                  if(i.customId === "ayarlistesi") {
                    await i.reply({content: `\` ••❯ \` **Değiştirilmek isteyen ayar nasıl değiştirilir?** \`${sistem.botSettings.Prefixs[0]}setup <@ayarismi> <Yeni Ayar İçeriği>\`
\` ••❯ \` **Sunucunun tag veya ismi nasıl değiştirilir?** \`${sistem.botSettings.Prefixs[0]}datareplace <@Tag/SunucuIsmi> <YeniTag/YeniSunucuIsmi>\`

\` ••❯ \` **${message.guild.name} Sunucusuna Ait Ayarlanabilir Özellikler** (\`${özellikler.length} adet bulunmaktadır.\`): ${özellikler.map(o => `${o.name}`).join(", ")}`, ephemeral: true}), message.react(message.guild.emojiGöster(emojiler.Onay)), x.delete().catch(err => {})
                  }
                    if (i.customId === 'ayarlar') {
                      let sunucu = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "guild")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - ${element.map(tag => `${tag}`).join(', ') ||  "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        
                      }).join('\n');
                      let register = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "register")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - ${element.map(tag => `${tag}`).join(', ') ||  "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        
                      }).join('\n');
                      let limit = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "limit")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - ${element.map(tag => `${tag}`).join(', ') ||  "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        
                      }).join('\n');
                      let role = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "role")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - ${element.map(tag => `${tag}`).join(', ') ||  "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        
                      }).join('\n');
                      let punitives = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "punitives")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - ${element.map(tag => `${tag}`).join(', ') ||  "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        
                      }).join('\n');
                      let channel = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "channel")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - ${element.map(tag => `${tag}`).join(', ') ||  "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        
                      }).join('\n');
                      let stat = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a && v.category == "stat")).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - ${element.map(tag => `${tag}`).join(', ') ||  "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        
                      }).join('\n');
                      let listeTum = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a)).map(o => {
                        let element = data[o];
                        let ozellik = özellikler.find(z => z.name == o);
                        if (ozellik.type == "tekil") return `\` • \` ${o} - \`${element || "` Ayarlı Değil! `"}\``
                        else if(ozellik.type == "cogul") return `\` • \` ${o} - ${element.map(tag => `${tag}`).join(', ') ||  "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "roller") return `\` • \` ${o} - ${element.map(role => message.guild.roles.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanallar") return `\` • \` ${o} - ${element.map(role => message.guild.channels.cache.get(role)).join(', ') || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "rol") return `\` • \` ${o} - ${message.guild.roles.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "kanal") return `\` • \` ${o} - ${message.guild.channels.cache.get(element) || "` Ayarlı Değil! `"}`
                        else if(ozellik.type == "acmali") return `\` • \` ${o} - \`${element ? "Açık!" : "Kapalı!"}\``
                        
                      }).join('\n');
                      await i.reply({content: 'Başarıyla! Tüm sunucu içinde yapılan ayarları aşağıda ki düğmelerden seçerek listeleyebilirsiniz.', ephemeral: true});
                      let Rows = new MessageActionRow().addComponents(
                        new MessageButton()
                        .setCustomId("ayarlar_tum")
                        .setLabel("Tüm Ayarları Görüntüle")
                        .setStyle("DANGER")
                        .setEmoji("925127916537413692"),
                        new MessageButton()
                        .setCustomId("ayarlar_sunucu")
                        .setLabel("Genel Sunucu Ayarları")
                        .setStyle("PRIMARY")
                        .setEmoji("925128101774647296"),
                        new MessageButton()
                        .setCustomId("ayarlar_role")
                        .setLabel("Rol Ayarları")
                        .setStyle("PRIMARY")
                        .setEmoji("927297098272083988"),
                        new MessageButton()
                        .setCustomId("ayarlar_channel")
                        .setLabel("Kanal Ayarları")
                        .setStyle("PRIMARY")
                        .setEmoji("927297745071534140"),
                        new MessageButton()
                        .setCustomId("ayarlar_punitives")
                        .setLabel("Cezalandırma Ayarları")
                        .setStyle("PRIMARY")
                        .setEmoji("927297796317540392"),
                      )
                      let RowsTWO = new MessageActionRow().addComponents(
                        new MessageButton()
                        .setCustomId("ayarlar_register")
                        .setLabel("Teyit Ayarları")
                        .setStyle("SECONDARY")
                        .setEmoji("927298179467198464"),
                        new MessageButton()
                        .setCustomId("ayarlar_limit")
                        .setLabel("Limit Ayarları")
                        .setStyle("SECONDARY")
                        .setEmoji("927298481046052985"),
                        new MessageButton()
                        .setCustomId("ayarlar_stat")
                        .setLabel("Diğer Ayarlar")
                        .setStyle("SECONDARY")
                        .setEmoji("925128103741775892"),
                      )
                      x.delete().catch(err => {})
                      let ayarlist = await message.channel.send({embeds: [new genEmbed().setColor("WHITE").setDescription(`:tada: Aşağıda ki ayarlar kategorisinden hangi yapılan ayar listesini görüntülemek istediğini seçerek görüntüleyebilirsiniz.`)], components: [Rows, RowsTWO]}).then(msg => {
                        const filter = i =>  i.user.id === message.member.id && (i.customId == "ayarlar_sunucu" 
|| i.customId == "ayarlar_tum" 
|| i.customId == "ayarlar_register" 
|| i.customId == "ayarlar_limit"
|| i.customId == "ayarlar_role"
|| i.customId == "ayarlar_punitives"
|| i.customId == "ayarlar_channel"
|| i.customId == "ayarlar_stat" )
                        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });
                        collector.on('collect', async (i) => {
if(i.customId == "ayarlar_tum") {
  await i.reply({content: "Aşağı da listelenmekte olan tüm sunucu ayarları görüntülenmektedir.", ephemeral: true})

const arr = Discord.Util.splitMessage(`
\`\`\`fix
Tüm Sunucu Ayarları (Genel [Kategori İçermez])\`\`\`
\` ••❯ \` **Doğru Kullanım!** \`${sistem.botSettings.Prefixs[0]}setup <[ayar ismi]> <[yeni ayar]>\`
${listeTum}`, { maxLength: 2000, char: "\n" });
for (const newText of arr) {
  message.channel.send({embeds: [new genEmbed().setColor("DARK_GOLD").setDescription(`${newText}`)], ephemeral: true})
}

}


                          if(i.customId == "ayarlar_sunucu") await i.reply({embeds: [ new genEmbed().setDescription(`
  \`\`\`fix
  Genel Sunucu Ayarları (Rol & Kanal & Diğer) \`\`\`
\` ••❯ \` **Doğru Kullanım!** \`${sistem.botSettings.Prefixs[0]}setup <[ayar ismi]> <[yeni ayar]>\`
${sunucu}`)], ephemeral: true})
  if(i.customId == "ayarlar_register") await i.reply({embeds: [ new genEmbed().setDescription(`
\`\`\`fix
Kayıt Ayarlar (Rol & Kanal & Diğer)\`\`\`
\` ••❯ \` **Doğru Kullanım!** \`${sistem.botSettings.Prefixs[0]}setup <[ayar ismi]> <[yeni ayar]>\`
${register}`)], ephemeral: true})
if(i.customId == "ayarlar_limit") await i.reply({embeds: [ new genEmbed().setDescription(`
\`\`\`fix
Limit Ayarları\`\`\`
\` ••❯ \` **Doğru Kullanım!** \`${sistem.botSettings.Prefixs[0]}setup <[ayar ismi]> <[yeni ayar]>\`
${limit}`)], ephemeral: true})
if(i.customId == "ayarlar_role") await i.reply({embeds: [ new genEmbed().setDescription(`
\`\`\`fix
Rol Ayarları\`\`\`
\` ••❯ \` **Doğru Kullanım!** \`${sistem.botSettings.Prefixs[0]}setup <[ayar ismi]> <[yeni ayar]>\`
${role}`)], ephemeral: true})
if(i.customId == "ayarlar_punitives") await i.reply({embeds: [ new genEmbed().setDescription(`
\`\`\`fix
Ceza Ayarları (Rol & Kanal & Diğer)\`\`\`
\` ••❯ \` **Doğru Kullanım!** \`${sistem.botSettings.Prefixs[0]}setup <[ayar ismi]> <[yeni ayar]>\`
${punitives}`)], ephemeral: true})
if(i.customId == "ayarlar_channel") await i.reply({embeds: [ new genEmbed().setDescription(`
\`\`\`fix
Kanal Ayarları\`\`\`
\` ••❯ \` **Doğru Kullanım!** \`${sistem.botSettings.Prefixs[0]}setup <[ayar ismi]> <[yeni ayar]>\`
${channel}`)], ephemeral: true})
if(i.customId == "ayarlar_stat") await i.reply({embeds: [ new genEmbed().setDescription(`
\`\`\`fix
Diğer Ayarlar (Rol & Kanal & Diğer)\`\`\`
\` ••❯ \` **Doğru Kullanım!** \`${sistem.botSettings.Prefixs[0]}setup <[ayar ismi]> <[yeni ayar]>\`
${stat}`)], ephemeral: true})
                        })
                        collector.on('end', collected => {
                          msg.delete().catch(err => {})
                        });
                      })

                    }
                  
                });
                
                collector.on('end', collected => {
                  x.delete().catch(err => {})
                });
            })
 
        }
        let ozellik = özellikler.find(o => o.name.toLowerCase() === secim.toLowerCase());
        if (ozellik.type == "tekil"){
          let metin = args.splice(1).join(" ");
          if (!metin) return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} "__${ozellik.name}__" isimli ayarı nasıl yapmamı düşünüyorsun?`)]}).then(x => setTimeout(() => {
              x.delete()
          }, 7500));
          await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: String(metin)}}, {upsert: true}).exec().catch(e => console.log(e))
          return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla "__${ozellik.name}__" isimli ayar veritabanına \`${metin}\` olarak ayarlandı.`)]}).then(x => setTimeout(() => {
            x.delete()
        }, 7500));
        }
        else if (ozellik.type == "roller") {
          let roller;
          if(message.mentions.roles.size >= 1)
            roller = message.mentions.roles.map(role => role.id);
          else roller = args.splice(1).filter(role => message.guild.roles.cache.some(role2 => role == role2.id));
          if(roller.length <= 0) return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} "__${ozellik.name}__" isimli ayarı nasıl yapmamı düşünüyorsun?`)]}).then(x => setTimeout(() => {
            x.delete()
        }, 7500));
            await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: roller}}, {upsert: true}).exec().catch(e => console.log(e))
          return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla "__${ozellik.name}__" isimli rol ayarını ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak tanımladın.`)]})
        }
        else if (ozellik.type == "kanallar") {
          let kanallar1;
          if(message.mentions.channels.size >= 1)
          kanallar1 = message.mentions.channels.map(role => role.id);
          else kanallar1 = args.splice(1).filter(role => message.guild.channels.cache.some(role2 => role == role2.id));
          if(kanallar1.length <= 0) return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} "__${ozellik.name}__" isimli ayarı nasıl yapmamı düşünüyorsun?`)]}).then(x => setTimeout(() => {
            x.delete()
        }, 7500));
            await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: kanallar1}}, {upsert: true}).exec().catch(e => console.log(e))
          return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla "__${ozellik.name}__" isimli kanal ayarını ${kanallar1.map(role => message.guild.channels.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak tanımladın.`)]})
        }
        else if (ozellik.type == "rol") {
          let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(' '));
          if(!rol) return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} "__${ozellik.name}__" isimli ayarı nasıl yapmamı düşünüyorsun?`)]}).then(x => setTimeout(() => {
            x.delete()
        }, 7500));
          await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: rol.id}}, {upsert: true}).exec().catch(e => console.log(e))
          return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla "__${ozellik.name}__" isimli rol ayarını ${rol} olarak tanımladın.`)]})
        }
        else if (ozellik.type == "kanal"){
          let channel = message.guild.channels.cache.get(args.splice(1)[0]) || message.mentions.channels.first();
          if(!channel) return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} "__${ozellik.name}__" isimli ayarı nasıl yapmamı düşünüyorsun?`)]}).then(x => setTimeout(() => {
            x.delete()
        }, 7500));
        await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: channel.id}}, {upsert: true}).exec().catch(e => console.log(e))
          return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla "__${ozellik.name}__" isimli kanal ayarını ${channel} olarak tanımladın.`)]})
        }
        else if (ozellik.type == "cogul"){
          let tag = args.splice(1).join(' ');
          if(!tag) return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} "__${ozellik.name}__" isimli ayarı nasıl yapmamı düşünüyorsun?`)]}).then(x => setTimeout(() => {
            x.delete()
        }, 7500));
          let arr = Object.keys(data || []).filter(x => x == ozellik.name && x != ozellik.name) || []
          let index = arr.find(e => e == tag);
          if(index) arr.splice(arr.indexOf(tag), 1);
          else arr.push(tag);
          await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: arr}}, {upsert: true}).exec().catch(e => console.log(e))
          return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla "__${ozellik.name}__" isimli ayara \`${tag}\` ayarın eklendi. \`${arr.join(", ")}\` bulunuyor.`)]})
        }
        else if (ozellik.type == "acmali"){
            let ozellikGetir = data[ozellik.name]
            await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${ozellik.name}`]: !ozellikGetir}}, {upsert: true}).exec().catch(e => console.log(e))
            return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla "__${ozellik.name}__" isimli ayar ${!ozellikGetir ? "açıldı!" : "kapatıldı!"}`)]})
        }
  }
  };

  