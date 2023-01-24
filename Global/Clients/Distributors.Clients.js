const { Client, Collection, Constants, Intents } = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice')
const fs = require('fs')
const Query = require("./Distributors.Query");
const GUILD_ROLE_DATAS = require("../Databases/Schemas/Guards/Backup/Guild.Roles")

// SENKRON
const GUARD_SETTINGS = require('../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
const GUILD_SETTINGS = require('../../Global/Databases/Schemas/Global.Guild.Settings');
// SENKRON

// GUARD LİMİT
const ms = require('ms');
const dataLimit = new Map()
// GUARD LİMİT

const { bgBlue, black, green } = require("chalk");
const sistem = global.sistem = require('../Settings/_system.json');
const DISCORD_LOGS = require('discord-logs')
class ACAR extends Client {
      constructor (...options) {
            super({
                options,
                intents: [32767],
            });
            DISCORD_LOGS(this)
            Object.defineProperty(this, "location", { value: process.cwd() });
            this.sistem = this.system = require('../Settings/_system.json');
            this.users.getUser = GetUser;
            this.getUser = GetUser;
            async function GetUser(id) { try { return await this.users.fetch(id); } catch (error) { return undefined; } };
            this.logger = require('../Functions/Logger');
            this.genEmbed = global.genEmbed = require('../Init/Embed');
            require('../Functions/Dates');
            require('../Functions/Numbers');
            require('../Prototypes/_sources');
            require('../Prototypes/_user');
            this.botName;
            this.commands = new Collection();
            this.aliases = new Collection();
            this.setMaxListeners(10000);
            this.Distributors = global.Distributors = [];
            
	    this.Upstaffs = require('../Plugins/Staff/_index');
            this.Economy = require('../Plugins/Economy/_index');
            this._statSystem = global._statSystem = require('../../Global/Plugins/Staff/Sources/_settings');

            this.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
                .on("disconnect", () => this.logger.log("Bot is disconnecting...", "disconnecting"))
                .on("reconnecting", () => this.logger.log("Bot reconnecting...", "reconnecting"))
                .on("error", (e) => this.logger.log(e, "error"))
                .on("warn", (info) => this.logger.log(info, "warn"));

              //  process.on("unhandledRejection", (err) => { this.logger.log(err, "caution") });
                process.on("warning", (warn) => { this.logger.log(warn, "varn") });
                process.on("beforeExit", () => { console.log('Sistem kapatılıyor...'); });
                process.on("uncaughtException", err => {
                    const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
                        console.error("Beklenmedik Hata: ", hata);
                       // process.exit(1);
                });
            
        }

        async fetchCommands(active = true) {
            if(!active) return;
            let dirs = fs.readdirSync("./_commands", { encoding: "utf8" });
            this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} ${dirs.length} category in client loaded.`, "category");
            dirs.forEach(dir => {
                let files = fs.readdirSync(`../../Server/${this.botName}/_commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
                this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} ${files.length} commands loaded in ${dir} category.`, "load");
                files.forEach(file => {
                    let referans = require(`../../Server/${this.botName}/_commands/${dir}/${file}`);
                    if(referans.onLoad != undefined && typeof referans.onLoad == "function") referans.onLoad(this);
                    this.commands.set(referans.Isim, referans);
                    if (referans.Komut) referans.Komut.forEach(alias => this.aliases.set(alias, referans));
                });
            });
        }
    
        async fetchEvents(active = true) {
            if(!active) return;
            let dirs = fs.readdirSync('./_events', { encoding: "utf8" });
            dirs.forEach(dir => {
                let files = fs.readdirSync(`../../Server/${this.botName}/_events/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
                files.forEach(file => {
                    let referans = require(`../../Server/${this.botName}/_events/${dir}/${file}`);
                    this.on(referans.config.Event, referans);
                });
            });
        }
        
        startDistributors() {
            sistem.TOKENS.SECURITY.DISTS.forEach(async (token) => {
                let botClient = new Client({
                    fetchAllMembers: true,
                    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS,Intents.FLAGS.GUILD_PRESENCES],
                    presence: { status: "invisible" },
                  });
                  botClient.on("ready", () => {
                    this.logger.log(`${botClient.user.tag} isimli dağıtıcı başarıyla aktif oldu.`, "dist")
                    botClient.queryTasks = new Query();
                    botClient.queryTasks.init(1000);
                    Distributors.push(botClient)
                  })
                  await botClient.login(token).catch(err => {
                    this.logger.log(`${black.bgHex('#D9A384')("Dağıtıcı Token Arızası")}`,"error")
                  })
            })
        }

        closeDistributors() { 
            if(this.Distributors && this.Distributors.length) {
                if(this.Distributors.length >= 1) {
                    this.Distributors.forEach(x => {
                        x.destroy()
                    })
                }
            }
        }

        async checkMember(id, type, process = "İşlem Bulunamadı.") {
            let guild = this.guilds.cache.get(sistem.SERVER.ID)
            if(!guild) return false;
            let uye = guild.members.cache.get(id)
            if(!uye) return;
            let Whitelist = await GUARD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
            let Sunucu = await GUILD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
            if(!Sunucu) return false;
            if(!Whitelist) return false;
            let guildSettings = Sunucu.Ayarlar
            if(!guildSettings) return false;
            if(uye.id === this.user.id || uye.id === uye.guild.ownerId || Whitelist.unManageable.some(g => uye.id === g || uye.roles.cache.has(g)) || guildSettings.staff.includes(uye.id)) return true;
            if(Whitelist.fullAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
            if(!type) return false;
            switch (type) {
                case "guild": {
                    if(Whitelist.guildAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "emoji": {
                    if(Whitelist.emojiAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "bot": {
                    if(Whitelist.botAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "member": {
                    if(Whitelist.memberAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "channels": {
                    if(Whitelist.channelsAccess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
                case "roles": {
                    if(Whitelist.rolesAcess.some(g => uye.id === g || uye.roles.cache.has(g))) return this.checkProcessLimit(uye, Whitelist.auditLimit, Whitelist.auditInLimitTime, process)  
                    return false;
                }
            }
            return false;
        }

        async checkProcessLimit(uye, limit, zaman, process) {
            let id = uye.id
            let limitController = dataLimit.get(id) || []
            let type = { _id: id, proc: process, date: Date.now() }
            limitController.push(type)
            dataLimit.set(id, limitController)
            setTimeout(() => { if (dataLimit.has(id)) { dataLimit.delete(id) } }, ms(zaman))
            if (limitController.length >= limit) { 
                let loged = uye.guild.kanalBul("guard-log");
                let taslak = `${uye} (\`${uye.id}\`) isimli güvenli listesinde ki yönetici işlem sınırını aştığı için "__${process}__" zoruyla cezalandırıldı.
\`\`\`fix
Son Yapılan işlemleri;
${limitController.sort((a, b) => b.date - a.date).map((x, index) => `${index+1}. | ${x.proc} | ${tarihsel(x.date)}`).join("\n")}
                \`\`\``
                if(loged) loged.send(taslak);
                let Sunucu = await GUILD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                let guildSettings = Sunucu.Ayarlar
                if(Sunucu && guildSettings) {
                    guildSettings.staff.forEach(x => {
                        let botOwner = uye.guild.members.cache.get(x)
                        if(botOwner) botOwner.send(taslak).catch(err => {})
                    })
                }
                let taç = uye.guild.members.cache.get(uye.guild.ownerId)
                if(taç) taç.send(taslak).catch(err => {})
                return false 
            } else {
                return true
            }
        }    

        async queryManage(oldData, newData) {
            const guildSettings = require('../Databases/Schemas/Global.Guild.Settings');
            let veriData = await guildSettings.findOne({ guildID: sistem.SERVER.ID })
            let sunucuData = veriData.Ayarlar 
            if(sunucuData) {              
                if(oldData === sunucuData.tagRolü) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.tagRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.muteRolü) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.muteRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.voicemuteRolü) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.voicemuteRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.jailRolü) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.jailRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.şüpheliRolü) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.şüpheliRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.yasaklıTagRolü) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.yasaklıTagRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.vipRolü) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.vipRolü": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.Katıldı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.Katıldı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.altilkyetki) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.altilkyetki": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.etkinlikKatılımcısı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.etkinlikKatılımcısı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.cekilisKatılımcısı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.cekilisKatılımcısı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.TerfiLog) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.TerfiLog": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.kurallarKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.kurallarKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.hoşgeldinKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.hoşgeldinKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.chatKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.chatKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.toplantıKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.toplantıKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.davetKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.davetKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.publicKategorisi) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.publicKategorisi": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.registerKategorisi) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.registerKategorisi": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.streamerKategorisi) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.streamerKategorisi": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.photoChatKanalı) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.photoChatKanalı": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.sleepRoom) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.sleepRoom": newData}}, {upsert: true})
                }
                if(oldData === sunucuData.başlangıçYetki) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$set: {"Ayarlar.başlangıçYetki": newData}}, {upsert: true})
                }
                if(sunucuData.erkekRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.erkekRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.erkekRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.kadınRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.kadınRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.kadınRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.kayıtsızRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.kayıtsızRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.kayıtsızRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.Yetkiler.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.Yetkiler": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.Yetkiler": newData}}, {upsert: true})
                }
                if(sunucuData.teyitciRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.teyitciRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.teyitciRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.kurucuRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.kurucuRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.kurucuRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.banKoru.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.banKoru": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.banKoru": newData}}, {upsert: true})
                }
                if(sunucuData.ayrıkKanallar.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.ayrıkKanallar": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.ayrıkKanallar": newData}}, {upsert: true})
                }
                if(sunucuData.izinliKanallar.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.izinliKanallar": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.izinliKanallar": newData}}, {upsert: true})
                }
                if(sunucuData.rolPanelRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.rolPanelRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.rolPanelRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.üstYönetimRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.üstYönetimRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.üstYönetimRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.altYönetimRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.altYönetimRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.altYönetimRolleri": newData}}, {upsert: true})
                }
                if(sunucuData.yönetimRolleri.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.yönetimRolleri": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.yönetimRolleri": newData}}, {upsert: true})
                }

                if(sunucuData.banHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.banHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.banHammer": newData}}, {upsert: true})
                }
                if(sunucuData.jailHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.jailHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.jailHammer": newData}}, {upsert: true})
                }
                if(sunucuData.voiceMuteHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.voiceMuteHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.voiceMuteHammer": newData}}, {upsert: true})
                }
                if(sunucuData.muteHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.muteHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.muteHammer": newData}}, {upsert: true})
                }
                if(sunucuData.teleportHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.teleportHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.teleportHammer": newData}}, {upsert: true})
                }
                if(sunucuData.warnHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.warnHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.warnHammer": newData}}, {upsert: true})
                }
                if(sunucuData.abilityHammer.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.abilityHammer": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.abilityHammer": newData}}, {upsert: true})
                }
                if(sunucuData.coinChat.includes(oldData)) {
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$pull: {"Ayarlar.coinChat": oldData}}, {upsert: true})
                    await guildSettings.updateOne({guildID: sistem.SERVER.ID}, {$push: {"Ayarlar.coinChat": newData}}, {upsert: true})
                }

                
            }
        }
        rolVer(sunucu, role) {
            let length = (sunucu.members.cache.filter(member => member && !member.roles.cache.has(role.id) && !member.user.bot).array().length + 5);
            const sayı = Math.floor(length / Distributors.length);
            for (let index = 0; index < Distributors.length; index++) {
              const bot = Distributors[index];
              if (role.deleted) {
                client.logger.log(`[${role.id}] - ${bot.user.tag}`);
                break;
              }
              const members = bot.guilds.cache.get(sunucu.id).members.cache.filter(member => !member.roles.cache.has(role.id) && !member.user.bot).array().slice((index * sayı), ((index + 1) * sayı));
              if (members.length <= 0) return;
              for (const member of members) {
                member.roles.add(role.id)
              }
            }
          }

          rolKur(role, newRole) {
            GUILD_ROLE_DATAS.findOne({ roleID: role }, async (err, data) => {
              let length = (data.members.length + 5);
              const sayı = Math.floor(length / Distributors.length);
              if (sayı < 1) sayı = 1;
              const channelPerm = data.channelOverwrites.filter(e => client.guilds.cache.get(sistem.SERVER.ID).channels.cache.get(e.id))
              for await (const perm of channelPerm) {
                const bott = Distributors[1]
                const guild2 = bott.guilds.cache.first()
                let kanal = guild2.channels.cache.get(perm.id);
                let newPerm = {};
                perm.allow.forEach(p => {
                  newPerm[p] = true;
                });
                perm.deny.forEach(p => {
                  newPerm[p] = false;
                });
                kanal.permissionOverwrites.create(newRole, newPerm).catch(error => client.logger.error(error));
              }
              for (let index = 0; index < Distributors.length; index++) {
                const bot = Distributors[index];
                const guild = bot.guilds.cache.first();
                if (newRole.deleted) {
                  client.logger.log(`[${role}] - ${bot.user.tag} - Rol Silindi Dağıtım İptal`, "log");
                  break;
                }
                const members = data.members.filter(e => guild.members.cache.get(e) && !guild.members.cache.get(e).roles.cache.has(newRole)).slice((index * sayı), ((index + 1) * sayı));
                if (members.length <= 0) {
                  client.logger.log(`[${role}] Olayında kayıtlı üye olmadığından veya rol üyelerine dağıtıldığından dolayı rol dağıtımı gerçekleştirmedim.`, "log");
                  break;
                }
                for await (const user of members) {
                  const member = guild.members.cache.get(user)
                  member.roles.add(newRole.id)
                }
              }
              const newData = new GUILD_ROLE_DATAS({
                roleID: newRole.id,
                name: newRole.name,
                color: newRole.hexColor,
                hoist: newRole.hoist,
                position: newRole.position,
                permissions: newRole.permissions.bitfield,
                mentionable: newRole.mentionable,
                time: Date.now(),
                members: data.members.filter(e => newRole.guild.members.cache.get(e)),
                channelOverwrites: data.channelOverwrites.filter(e => newRole.guild.channels.cache.get(e.id))
              });
              newData.save();
            }).catch(err => { })
          }

        async punitivesAdd(id, type) {
            let uye = client.guilds.cache.get(sistem.SERVER.ID).members.cache.get(id);
            if (!uye) return;
        
            if (type == "jail") { 
            if(uye.voice.channel) await uye.voice.disconnect().catch(err => {})
            return await uye.roles.cache.has(roller.boosterRolü) ? uye.roles.set([roller.boosterRolü, roller.şüpheliRolü]) : uye.roles.set([roller.şüpheliRolü]).catch(err => {}); 
            }
        
            if (type == "ban") return await uye.ban({ reason: "Guard Tarafından Siki Tuttu." }).catch(err => {}) 
        };
        
        async allPermissionClose() {
            let sunucu = client.guilds.cache.get(sistem.SERVER.ID);
            if(!sunucu) return;
            const perms = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS_AND_STICKERS", "MANAGE_WEBHOOKS"];
            sunucu.roles.cache.filter(rol => rol.editable).filter(rol => perms.some(yetki => rol.permissions.has(yetki))).forEach(async (rol) => rol.setPermissions(0n));
        }

        connect(token) {
            if(!token) {
                this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} Tokeni girilmediğinden dolayı bot kapanıyor...`,"error");
                process.exit()
                return;
            }
            this.login(token).then(acar => {
                this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} BOT kullanıma aktif edilmiştir.`,"botReady")
                this.user.setPresence({ activities: [{name:sistem.botStatus.Name}], status:sistem.botStatus.Status })
                this.on("ready", async () => { 
                    let kanal = this.channels.cache.get(sistem.botStatus.voiceChannelID)
                    if(kanal) joinVoiceChannel({ channelId: kanal.id, guildId: kanal.guild.id, adapterCreator: kanal.guild.voiceAdapterCreator});
                    await this.startDistributors()
                })
                    

            }).catch(acar => {
                this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} Botun tokeni doğrulanamadı. 5 Saniye sonra tekrardan denenecektir...`,"reconnecting")
                setTimeout(() => {
                    this.login().catch(acar => {
                        this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} => Bot tokeni tamamiyle doğrulanamadı.. Bot kapanıyor...`,"error")
                        process.exit()
                    })
                }, 5000 )
            })
        }
        
}

module.exports = { ACAR }