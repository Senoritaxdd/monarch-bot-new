const { GuildMember, Guild, TextChannel, Message, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
const ms = require('ms');
const GUILDS_SETTINGS = require('../Databases/Schemas/Global.Guild.Settings')
const Upstaff = require('../Databases/Schemas/Plugins/Client.Users.Staffs');
const Stats = require('../Databases/Schemas/Plugins/Client.Users.Stats')
// Schema's
    const Users = require('../Databases/Schemas/Client.Users');
    const Punitives = require('../Databases/Schemas/Global.Punitives');
    const Forcebans = require('../Databases/Schemas/Punitives.Forcebans');
    const Jails = require('../Databases/Schemas/Punitives.Jails');
    const Vmutes = require('../Databases/Schemas/Punitives.Vmutes');
    const Mutes = require('../Databases/Schemas/Punitives.Mutes');
    const Unleash = require('../Databases/Schemas/Plugins/Guıild.Remove.Staffs');
const { genEmbed } = require("../Init/Embed");
// Schema's

/**
 * @param {Array} roles 
 * @returns {GuildMember} 
 */

GuildMember.prototype.setRoles = function (roles = []) {
    let rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(roles);
    return this.roles.set(rol).catch(err => {});
}

 /**
 * @param {Array} roles 
 * @returns {GuildMember} 
 */

GuildMember.prototype.recordSetRoles = function (roles = []) {
    let rol;
    if(!roller.vipRolü) return client.logger.log("VIP rolü ayarlanmamış sunucu içerisinden ayarlamalarını yapın.","error");
    if(this.roles.cache.has(roller.vipRolü)) { rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(roles).concat(roller.vipRolü) } 
    else { rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(roles)};
    return this.roles.set(rol).catch(err => {});
}

 /**
 * @param {String} name
 * @param {String} gender 
 * @param {String} registrant
 * @param {String} state
 * @returns {GuildMember} 
 */

GuildMember.prototype.Register = async function (name, gender = undefined, registrant = undefined) {
    let userData = await Users.findOne({_id: this.id})

    // Fiziksel Kayıt Mantığımız
    let rol;
    let rolver;
    if(gender == "Erkek") {
        rol = roller.erkekRolleri.map(x => this.guild.roles.cache.get(x)).join(",")
        rolver = roller.erkekRolleri
    } else if(gender == "Kadın") {
        rol = roller.kadınRolleri.map(x => this.guild.roles.cache.get(x)).join(",")
        rolver = roller.kadınRolleri
    }
    await this.recordSetRoles(rolver).then(acar => { if(this.user.username.includes(ayarlar.tag)) this.roles.add(roller.tagRolü) });

    let seskanal = registrant.guild.channels.cache.filter(x => x.parentId == kanallar.publicKategorisi && x.type == "GUILD_VOICE" && x.id != kanallar.sleepRoom && !kanallar.ayrıkKanallar.some(kanal => x.id == kanal.id) && !_statSystem.musicRooms.some(kanal => x.id == kanal.id)).random()
    let chatkanalı = registrant.guild.channels.cache.get(kanallar.chatKanalı)
    setTimeout(() => {
        if(this) this.send({content: `Hey! Teyit odasında kayıt olduktan sonra zaman geçiremezsin, otomatik olarak sohbet odalarından \`${seskanal.name}\` kanalına seni taşıdım.`}).catch(err => {})
        if(this.voice) this.voice.setChannel(seskanal).catch(err => {})
    }, 5000);
    if(kanallar.chatKanalı) {
	let kanal = this.guild.channels.cache.get(kanallar.chatKanalı)
	if(kanal) {
        if(this.user.username.includes(ayarlar.tag)) {
            kanal.send(`:tada: ${this} Ailemize Katıldı! ailemize hoş geldin, İyi Eğlenceler.`).then(x => {setTimeout(() => { x.delete() }, 15250)})
        } else {
            kanal.send(`:tada: ${this} Aramıza Katıldı! sende bizden biri olmak ister misin? ozaman ${ayarlar.serverName} tagı (\` ${ayarlar.tag} \`) almalısın şimdiden, İyi Eğlenceler.`).then(x => {setTimeout(() => { x.delete() }, 20000)}) 
        }
	}
    }
    // Fiziksel Kayıt Mantığımız
   
    await Users.updateOne({_id: this.id}, 
            { $set: { "Name": name, "Gender": gender, "Registrant": registrant.id }, $push: { "Names": { Staff: registrant.id, Name: name, State: rol, Date: Date.now() }}}, 
    {upsert: true})
    await Users.updateOne({_id: registrant.id }, { $push: {"Records": { User: this.id, Gender: gender, Date: Date.now() }}  }, {upsert: true})
    

    let kayıtLog = this.guild.kanalBul("kayıt-log")
    if(kayıtLog) kayıtLog.send({embeds: [new genEmbed().setDescription(`${this} isimli üye ${registrant} yetkili tarafından \`${tarihsel(Date.now())}\` tarihinde **${gender}** olarak \`${this.guild.name}\` sunucusuna kayıt edildi.`)]})

}

 /**
 * @param {String} name 
 * @param {String} registrant
 * @param {String} state
 * @returns {GuildMember} 
 */

GuildMember.prototype.Rename = async function (name, registrant = undefined, state = undefined) {
    let userData = await Users.findOne({_id: this.id})
    await Users.updateOne({_id: this.id}, { $set: { "Name": name }, $push: { "Names": { Staff: registrant.id, Name: name, State: state, Date: Date.now() }}}, 
    {upsert: true})
    if(userData && userData.Name) {
     
    } 
}

GuildMember.prototype.removeStaff = async function(lastRole, manuel) {
    let userData = await Users.findOne({_id: this.id})
    if(userData && userData.Staff && userData.StaffGiveAdmin) {
        let Yetkili = await Users.findOne({_id: userData.StaffGiveAdmin })
          if(Yetkili && Yetkili.Staffs) {
              const LanYarramBakSikildiler = this.guild.members.cache.get(userData.StaffGiveAdmin)
              if(LanYarramBakSikildiler) LanYarramBakSikildiler.send({embeds: [new genEmbed().setDescription(`${LanYarramBakSikildiler} Merhaba, ${this} (\`${this}\`) isimli çektiğin yetkili yetkiyi \`${tarihsel(Date.now())}\` tarihinde bıraktı.`).setFooter("bu bilgilendirmeye mesajına uyarak, lütfen eski yetkilini sunucuya tekrardan davet et.")]}).catch(err => { })
              const findUser = Yetkili.Staffs.find(acar => acar.id == this.id);
              await Users.updateOne({ _id: userData.StaffGiveAdmin }, { $pull: { "Staffs": findUser } }, { upsert: true })
              client.Upstaffs.removePoint(userData.StaffGiveAdmin, -_statSystem.points.staff, "Yetkili")
          }
    }
    if(userData && userData.Staff) {
        await Users.updateOne({ _id: this.id }, { $set: { "Staff": false, "StaffGiveAdmin": new String() } }, { upsert: true })
        await Upstaff.deleteOne({_id: this.id})
        await Stats.updateOne({ userID: this.id }, { upstaffVoiceStats: new Map(), upstaffChatStats: new Map(), taskVoiceStats: new Map() });
	if(!lastRole) lastRole = this.roles.cache
        if(!manuel) {
            let altYetki = this.guild.roles.cache.get(roller.altilkyetki)
            let arr = []
            lastRole.filter(rol => altYetki.position <= rol.position).forEach(async (rol) => {
                await arr.push(rol.id)
            })
            if(arr.length <= 0) {
                lastRole.forEach(rol => {
                    arr.push(rol.id)
                })
            }
            await Unleash.updateOne({_id: this.id}, {$set: {"unleashRoles": arr}, $inc: {"unleashPoint": 1}}, {upsert: true})
            let yetkiyiBırakan = this.guild.kanalBul("yetki-bırakan")
            if(yetkiyiBırakan) yetkiyiBırakan.send({content: `${[...roller.altYönetimRolleri, ...roller.yönetimRolleri, ...roller.üstYönetimRolleri].map(x => this.guild.roles.cache.get(x))}`, embeds: [new genEmbed().setFooter("bu bilgilendirme mesajına uyarak, lütfen eski yetkilimizi sunucuda tekrardan yetkiye davet edin.").setDescription(`${this} isimli eski yetkili, yetkiyi **${tarihsel(Date.now())}** tarihinde saldı.`).addField("Son rolleri şunlardır", `${arr.map(x => this.guild.roles.cache.get(x)).join(", ")}`)]}) 
        }
    }
}

GuildMember.prototype.removeTagged = async function () {
    let userData = await Users.findOne({_id: this.id})
    if(userData && userData.Tagged && userData.TaggedGiveAdmin) {
        let Yetkili = await Users.findOne({_id: userData.TaggedGiveAdmin }) 
           if(Yetkili && Yetkili.Taggeds) {
                const koşKoşBabanıSikiyorlar = this.guild.members.cache.get(userData.TaggedGiveAdmin)
                const findUser = Yetkili.Taggeds.find(acar => acar.id == this.id);
                await Users.updateOne({ _id: userData.TaggedGiveAdmin }, { $pull: { "Taggeds": findUser } }, { upsert: true })
                client.Upstaffs.removePoint(userData.TaggedGiveAdmin, -_statSystem.points.tagged, "Taglı")
            } 
          await Users.updateOne({ _id: this.id }, { $set: { "Tagged": false, "TaggedGiveAdmin": new String() } }, { upsert: true })
        }
}

GuildMember.prototype.dangerRegistrant = async function () {
    let userData = await Users.findOne({_id: this.id})
    if(userData && userData.Name && userData.Registrant) {
        let Yetkili = await Users.findOne({_id: userData.Registrant }) 
          if(Yetkili && Yetkili.Records) {
              const koşAnanıSikiyorlar = this.guild.members.cache.get(userData.Registrant)
              if(koşAnanıSikiyorlar) koşAnanıSikiyorlar.send({content: `${koşAnanıSikiyorlar.toString()}`, embeds: [new genEmbed().setDescription(`Merhaba! kayıt ettiğin ${this}, **${tarihsel(Date.now())}** tarihinde kural dışı eylem sergiledi.`)]}).catch(err => {})
            } 
      }
}

 /**
 * @returns {GuildMember} 
 */
  GuildMember.prototype.Delete = async function (type = "default") {
    let userData = await Users.findOne({_id: this.id})
    if(userData && userData.Name && userData.Registrant) {
        let Yetkili = await Users.findOne({_id: userData.Registrant }) || {}
          if(Yetkili && Yetkili.Records) {
              const koşAnanıSikiyorlar = this.guild.members.cache.get(userData.Registrant)
              const findUser = Yetkili.Records.find(acar => acar.User == this.id);
              await Users.updateOne({ _id: userData.Registrant }, { $pull: { "Records": findUser } }, { upsert: true })
              await client.Upstaffs.removePoint(userData.Registrant, -_statSystem.points.record, "Kayıt")
          } 
      }
}

 /**
  * @returns {GuildMember}
  */

GuildMember.prototype.cezaPuan = async function() {
        let res = await Punitives.find({ Member: this.id })
        if (!res) return 0
        let filArray = res.map(x => (x.Type))
        let Mute = filArray.filter(x => x == "Metin Susturulma").length || 0
        let VMute = filArray.filter(x => x == "Ses Susturulma").length || 0
        let Jail = filArray.filter(x => x == "Cezalandırılma").length || 0
        let Ban = filArray.filter(x => x == "Yasaklama").length || 0
        let kalkamayanAmcıkBan = filArray.filter(x => x == "Kalkmaz Yasaklama").length || 0
        // let Warn = filArray.filter(x => x == "Uyarılma").length || 0
        let cezaPuanı = (Mute * 5) + (VMute * 8) + (Jail * 15) + (Ban * 30) + (kalkamayanAmcıkBan * 50)
        return cezaPuanı;
}

 /**
  * @returns {GuildMember}
  */

GuildMember.prototype.Left = async function () {
    let userData = await Users.findOne({_id: this.id})
    if(userData && userData.Name) {
        await Users.updateOne({_id: this.id}, 
            { $push: { "Names": { Name: userData.Name, State: "Sunucudan Ayrılma", Date: Date.now() }}}, 
        {upsert: true})
    } 
    if(userData && userData.Tagged && userData.TaggedGiveAdmin) {
        let Yetkili = await Users.findOne({_id: userData.TaggedGiveAdmin }) || {}
           if(Yetkili && Yetkili.Taggeds) {
                const koşKoşBabanıSikiyorlar = this.guild.members.cache.get(userData.TaggedGiveAdmin)
                const findUser = Yetkili.Taggeds.find(acar => acar.id == this.id);
                await Users.updateOne({ _id: userData.TaggedGiveAdmin }, { $pull: { "Taggeds": findUser } }, { upsert: true })
                await client.Upstaffs.removePoint(userData.StaffGiveAdmin, -_statSystem.points.tagged, "Taglı")
            } 
          await Users.updateOne({ _id: this.id }, { $set: { "Tagged": false, "TaggedGiveAdmin": new String() } }, { upsert: true })
        }

    // Yetkiliyse Yetkili Sisteminden Çıkartma
    if(userData && userData.Staff && userData.StaffGiveAdmin) {
        let Yetkili = await Users.findOne({_id: userData.StaffGiveAdmin }) || {}
          if(Yetkili && Yetkili.Staffs) {
              const BabanıSikeyim = this.guild.members.cache.get(userData.StaffGiveAdmin)
              if(BabanıSikeyim) BabanıSikeyim.send({embeds: [new genEmbed().setDescription(`${BabanıSikeyim} Merhaba, ${this} (\`${this}\`) isimli çektiğin yetkili yetkiyi sunucudan çıkarak \`${tarihsel(Date.now())}\` tarihinde bıraktı.`).setFooter("bu bilgilendirmeye mesajına uyarak, lütfen eski yetkilini sunucuya tekrardan davet et.")]}).catch(err => { })
              const findUser = Yetkili.Staffs.find(acar => acar.id == this.id);
              await Users.updateOne({ _id: userData.StaffGiveAdmin }, { $pull: { "Staffs": findUser } }, { upsert: true })
              client.Upstaffs.removePoint(userData.StaffGiveAdmin, -_statSystem.points.staff, "Yetkili")
          } 
      }
      if(userData && userData.Staff) {
        await Users.updateOne({ _id: this.id }, { $set: { "Staff": false, "StaffGiveAdmin": new String() } }, { upsert: true })
        await Upstaff.deleteOne({_id: this.id})
        await Stats.deleteOne({userID: this.id})
        let altYetki = this.guild.roles.cache.get(roller.altilkyetki)
        let arr = []
        this.roles.cache.filter(rol => altYetki.position <= rol.position).forEach(async (rol) => {
            await arr.push(rol.id)
        })
        if(arr.length <= 0) {
            lastRole.forEach(rol => {
                arr.push(rol.id)
            })
        }
        await Unleash.updateOne({_id: this.id}, {$set: {"unleashRoles": arr}, $inc: {"unleashPoint": 1}}, {upsert: true})
        let yetkiyiBırakan = this.guild.kanalBul("yetki-bırakan")
        if(yetkiyiBırakan) yetkiyiBırakan.send({content: `${[...roller.altYönetimRolleri, ...roller.yönetimRolleri, ...roller.üstYönetimRolleri].map(x => this.guild.roles.cache.get(x))}`,embeds: [new genEmbed().setFooter("bu bilgilendirme mesajına uyarak, lütfen eski yetkilimizi sunucumuza davet edin.").setDescription(`${this} isimli eski yetkili, yetkiyi sunucudan ayrılarak **${tarihsel(Date.now())}** tarihinde yetkisini saldı.`).addField("Son rolleri şunlardır", `${arr.map(x => this.guild.roles.cache.get(x)).join(", ")}`)]}) 
    }
}

/**
 * 
 * @param {String} type 
 * @param {GuildMember} staff 
 * @param {String} reason 
 * @param {String} message 
 * @param {Date} duration 
 * @returns 
 */



GuildMember.prototype.addPunitives = async function(type, staff, reason = "Sebep belirtilmedi.", message, duration, muteFlood) {
    let cezano = await Punitives.countDocuments().exec();
    cezano = cezano == 0 ? 1 : cezano + 1;
        if(type == 1) type = "Kalkmaz Yasaklama"
        if(type == 2) type = "Yasaklama"
        if(type == 3) type = "Cezalandırılma"
        if(type == 4) type = "Ses Susturulma"
        if(type == 5) type = "Metin Susturulma"   
        if(type == 6) type = "Uyarılma"
        let ceza;
        let islem;
        if(duration) {
            ceza = new Punitives({ 
                No: cezano,
                Member: this.id,
                Staff: staff.id,
                Type: type,
                Reason: reason,
                Duration: Date.now()+ms(duration),
                Date: Date.now()
            })
        } else {
            ceza = new Punitives({ 
                No: cezano,
                Member: this.id,
                Staff: staff.id,
                Type: type,
                Reason: reason,
                Date: Date.now()
            })
        }
        ceza.save().catch(e => console.error(e));
        let logKanal = [
            {type: "Kalkmaz Yasaklama", channel: "forceban-log"},
            {type: "Yasaklama", channel: "ban-log"},
            {type: "Cezalandırılma", channel: "jail-log"},
            {type: "Ses Susturulma", channel: "sesmute-log"},
            {type: "Metin Susturulma", channel: "mute-log"},
            {type: "Uyarılma", channel: "uyarı-log"},
        ]
        let _findLogChannel = logKanal.find(x => x.type == type)
        if(_findLogChannel) {
            let findedChannel = message.guild.kanalBul(_findLogChannel.channel)
            if(findedChannel) findedChannel.send({embeds: [new genEmbed().setFooter(`${ayarlar ? ayarlar.embedSettings ? ayarlar.embedSettings.Footer ? `${ayarlar.embedSettings.Footer}` : message.guild.name : message.guild.name : message.guild.name } • Ceza Numarası: #${cezano}`,this.user.avatarURL({dynamic: true})).setDescription(`${this.toString()} üyesine, **${tarihsel(Date.now())}** tarihinde ${duration ? `**${moment.duration(ms(duration)).format('Y [Yıl,] M [Ay,] d [Gün,] h [Saat,] m [Dakika]')}** boyunca` : ``} \`${reason}\` nedeniyle ${staff.toString()} tarafından ceza-i işlem uygulandı.`)]})
        }
        if(muteFlood) await message.channel.send(`${message.guild.emojiGöster(emojiler.chatSusturuldu)} ${this.toString()} Sohbet kanallarında fazla hızlı mesaj gönderdiğiniz için \`1 Dakika\` süresince susturuldunuz. (Ceza Numarası: \`#${cezano}\`)`)
        if(!muteFlood) await message.channel.send(`${type == "Metin Susturulma" ? message.guild.emojiGöster(emojiler.chatSusturuldu) : type == "Ses Susturulma" ? message.guild.emojiGöster(emojiler.sesSusturuldu) : type == "Yasaklama" ? message.guild.emojiGöster(emojiler.Yasaklandı) : type == "Cezalandırılma" ? message.guild.emojiGöster(emojiler.Cezalandırıldı) : type == "Kalkmaz Yasaklama" ? message.guild.emojiGöster(emojiler.Yasaklandı) : type == "Uyarılma" ? message.guild.emojiGöster(emojiler.Onay) : message.guild.emojiGöster(emojiler.Onay)} ${this.toString()} isimli üyeye \`${reason}\` sebebiyle "__${type}__" türünde ${duration ? `\`${moment.duration(ms(duration)).format('Y [yıl,] M [ay,] d [gün,] h [saat,] m [dakika]')}\` boyunca` : ``} ceza-i işlem uygulandı. (\`Ceza Numarası: #${cezano}\`)`)
        if(!muteFlood) await this.send({embeds: [new genEmbed().setFooter(`${ayarlar ? ayarlar.embedSettings ? ayarlar.embedSettings.Footer ? `${ayarlar.embedSettings.Footer}` : message.guild.name : message.guild.name : message.guild.name } • Ceza Numarası: #${cezano}`,this.user.avatarURL({dynamic: true})).setDescription(`${staff.toString()} tarafından **${reason}** sebebiyle "${type}" türünde ${duration ? `\`${moment.duration(ms(duration)).format('Y [yıl,] M [ay,] d [gün,] h [saat,] m [dakika]')}\` boyunca` : ``} işlem uygulandı.`)]}).catch(err => {
           
        })
        switch(type) {
            case "Kalkmaz Yasaklama": {
                await this.guild.members.ban(this.id, { reason: `#${ceza.No} (${ceza.Reason})` }).catch(err => {})
                await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Forceban": 1 } }, {upsert: true})
                islem = new Forcebans({
                    No: ceza.No,
                    _id: this.id,
                })
                return await islem.save();
            }
            case "Yasaklama": {
                await this.guild.members.ban(this.id, { reason: `#${ceza.No} (${ceza.Reason})` }).catch(err => {})
                return await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Ban": 1 } }, {upsert: true})
            }
            case "Atılma": {
                return await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Kick": 1 } }, {upsert: true});
            }
            case "Cezalandırılma": {
                await this.voice.disconnect().catch(err => {})
                if(this && this.manageable) await this.setRoles(roller.jailRolü)

                await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Jail": 1 } }, {upsert: true})
                if(duration) {
                    islem = new Jails({
                        No: ceza.No,
                        _id: this.id,
                        Duration: Date.now()+ms(duration),
                    })
                } else {
                    islem = new Jails({
                        No: ceza.No,
                        _id: this.id,
                    })
                }
                return await islem.save();
            }
            case "Ses Susturulma": {
                if(this && this.voice) await this.voice.setMute(true)
                await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.VoiceMute": 1 } }, {upsert: true})
                if(duration) { 
                    islem = new Vmutes({
                        No: ceza.No,
                        _id: this.id,
                        Duration: Date.now()+ms(duration),
                    })
                } else {
                    islem = new Vmutes({
                        No: ceza.No,
                        _id: this.id,
                    })
                }
                return await islem.save();
            }
            case "Metin Susturulma": {
                if(this && this.manageable) await this.roles.add(roller.muteRolü)
                await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Mutes": 1 } }, {upsert: true})
                if(duration) {
                    islem = new Mutes({
                        No: ceza.No,
                        _id: this.id,
                        Duration: Date.now()+ms(duration),
                    })
                } else {
                    islem = new Mutes({
                        No: ceza.No,
                        _id: this.id,
                    })
                }
                return await islem.save();
            }
            case "Uyarılma": {
                return await Users.updateOne({ _id: staff.id } , { $inc: { "Uses.Warns": 1 } }, {upsert: true})
            }
        }
} 



