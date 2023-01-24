const {MessageButton,MessageActionRow, GuildMember} = require('discord.js')
const Upstaffs = require('../../Databases/Schemas/Plugins/Client.Users.Staffs');
const mongoose = require('mongoose');
const uPConf = require('./Sources/_settings');
const { genEmbed } = require('../../Init/Embed');
const Users = require('../../Databases/Schemas/Client.Users')
const Tasks = require('../../Databases/Schemas/Plugins/Client.Users.Tasks')
const Stats = require('../../Databases/Schemas/Plugins/Client.Users.Stats')


class Staff {

    static async showPoint(id) {
        let uP = await Upstaffs.findOne({_id: id})
        if(uP) return {
            Point: uP.Point || 0,
            ToplamPuan: uP.ToplamPuan || 0,
            Invite: uP.Invite || 0,
            Tag: uP.Tag || 0,
            Yetkili: uP.Yetkili || 0,
            Register: uP.Register || 0    
        }
        return undefined;
        
    }

    static async removePoint(id, pnt, tip) {
        if(!uPConf.system) return client.logger.log(`UpStaff Sistemi Kapalı fakat kullanılmaya çalışılıyor.`, "ups");
        const guild = client.guilds.cache.get(sistem.SERVER.ID)
        let uye = guild.members.cache.get(id)
        if(!uye) return;
        const uP = await Upstaffs.findOne({ _id: uye.id })
        if(!uye.user.username.includes(ayarlar.tag)) return;
        if(uP) {
            if(tip == "Invite") {
                if(uP.Mission && !uP.Mission.CompletedInvite && uP.Mission.Invite-1 >= 0)  await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Mission.Invite": -1 } }, {upsert: true});
                if (uP && uP.Invite-1 >= 0)  await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Invite": pnt } }, {upsert: true});
                if(uP && uP.Point -1 >= 0) return await Upstaffs.updateOne({ _id: uye.id }, { $inc: {"Point": pnt, "ToplamPuan": pnt } }, {upsert: true});
            }
            if(tip == "Taglı") {
                if(uP.Mission && !uP.Mission.CompletedTagged && uP.Mission.Tagged-1 >= 0)  await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Mission.Tagged": -1 } }, {upsert: true});
                if (uP && uP.Tag-1 >= 0) await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Tag": pnt } }, {upsert: true});              
                if(uP && uP.Point -1 >= 0) return await Upstaffs.updateOne({ _id: uye.id }, { $inc: {"Point": pnt, "ToplamPuan": pnt } }, {upsert: true});
            }
            if(tip == "Kayıt") {
                if (uP && uP.Register-1 >= 0) await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Register": pnt } }, {upsert: true});
                if(uP && uP.Point -1 >= 0) return await Upstaffs.updateOne({ _id: uye.id }, { $inc: {"Point": pnt, "ToplamPuan": pnt } }, {upsert: true});
            }
            if(uP.Yönetim) {
                if(tip == "Yetkili") {
                    if(uP.Mission && !uP.Mission.CompletedStaff && uP.Mission.Staff-1 >= 0)  await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Mission.Staff": -1 } }, {upsert: true});
                    if (uP && uP.Yetkili-1 >= 0) await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Yetkili": pnt } }, {upsert: true});
                    if(uP && uP.Point -1 >= 0) return await Upstaffs.updateOne({ _id: uye.id }, { $inc: {"Point": pnt, "ToplamPuan": pnt } }, {upsert: true});
                }
                if(tip == "Görev") {
                    if (uP && uP.Görev-1 >= 0) await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Görev": pnt } }, {upsert: true});
                    if(uP && uP.Point -1 >= 0) return await Upstaffs.updateOne({ _id: uye.id }, { $inc: {"Point": pnt, "ToplamPuan": pnt } }, {upsert: true});
                }
              }
        } else {
            return client.logger.log(`[${id}] ID'li yetkilinin puanı silinemedi!`,"log");
        }
    }

    static async addPoint(id, pnt, tip, categoryID) {
        if(!uPConf.system) return client.logger.log(`UpStaff Sistemi Kapalı fakat kullanılmaya çalışılıyor.`, "ups");
        const guild = client.guilds.cache.get(sistem.SERVER.ID) 
        let uye = guild.members.cache.get(id);
        if(!uye) return;
        const uP = await Upstaffs.findOne({ _id: uye.id })
        // if(uye.permissions.has('ADMINISTRATOR')) return;
        if(!uye.user.username.includes(ayarlar.tag)) return;
        if(!uP) {
            if(!uPConf.staffs.some(x => uye.roles.cache.has(x.rol))) return;
            if(pnt < 0) return;
            if(uye.roles.cache.has(uPConf.endstaff)) return;
            await Upstaffs.updateOne({ _id: uye.id }, { $set: { "staffNo": 1, "staffExNo": 0, "Point": pnt, "ToplamPuan": pnt, "Baslama": Date.now() } }, {upsert: true}); 
            if(tip == "Invite") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Invite": pnt } }, {upsert: true});
            if(tip == "Taglı") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Tag": pnt } }, {upsert: true});
            if(tip == "Kayıt") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Register": pnt } }, {upsert: true});
            if(tip == "Mesaj") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Mesaj": pnt, "ToplamMesaj": pnt } }, {upsert: true});
            if(tip == "Bonus") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Bonus": pnt, "ToplamBonus": pnt } }, {upsert: true});        
            if(tip == "Yetkili") await await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Yetkili": pnt } }, {upsert: true}); 
            if(tip == "Görev") await await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Görev": pnt } }, {upsert: true});        
            if(tip == "Ses") {
                await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "ToplamSes": pnt} }, {upsert: true}); 
                await Upstaffs.findOne({_id: uye.id},  async (err, data) => {
                        let sespuan = data.Ses.get(categoryID) || 0;
                        let toplamsespuan = data.ToplamSesListe.get(categoryID) || 0;
                        var setle = Number(sespuan) + Number(pnt)
                        var setleiki = Number(toplamsespuan) + Number(pnt)
                        data.Ses.set(categoryID, Number(setle));
                        data.ToplamSesListe.set(categoryID, Number(setleiki));
                        data.save();
                }).catch(err => {})       
            }
            return;
        }
 
        if(uP.Yönetim && uP.Mission && !uP.Mission.Completed) {
            let logEmbed = new genEmbed().setThumbnail("https://preview.redd.it/qlne8pqzf0301.png?auto=webp&s=70da263d61a6d13378ff2b4aaab10e0bfa233fcf")
            let exRoleYetki = uPConf.staffs.find(x => x.No == uP.staffExNo);
            let MissionData = await Tasks.findOne({roleID: exRoleYetki ? exRoleYetki.rol : 0}) || await Tasks.findOne({Users: uye.id})
            let görevLog = uye.guild.kanalBul("görev-tamamlayan")
            if(MissionData) {
                if(tip == "Invite" && MissionData.Invite >= 1 && !uP.Mission.CompletedInvite) {
                    await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Mission.Invite": 1 } }, {upsert: true});
                    if(uP.Mission.Invite + 1 >= MissionData.Invite) {
                        if(görevLog) görevLog.send({embeds: [logEmbed.setDescription(`${uye} isimli görev sahibi, **Davet** görevini ${tarihsel(Date.now())} tarihinden tamamlayarak \`${MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}  Görev Puanı\` kazandı.`)]})
                        await Users.updateOne({_id: uye.id}, {$inc: {"Coin": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}}, {upsert: true})
                        await Upstaffs.updateOne({_id: uye.id}, {$set: {"Mission.CompletedInvite": true}},{upsert: true})
                        await Upstaffs.updateOne({ _id: uye.id }, { $inc: { 
                            "Mission.completedMission": 1,
                            "Point": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
                            "ToplamPuan": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
                            "Görev": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
                        } }, {upsert: true}); 
                        await client.Economy.updateBalance(uye.id, Number(MissionData.Reward), "add", 1) 
                    }
                }
                if(tip == "Taglı" && MissionData.Tagged >= 1 && !uP.Mission.CompletedTagged) {
                    await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Mission.Tagged": 1 } }, {upsert: true});
                    if(uP.Mission.Tagged + 1 >= MissionData.Tagged) {
                        if(görevLog) görevLog.send({embeds: [logEmbed.setDescription(`${uye} isimli görev sahibi, **Taglı** görevini ${tarihsel(Date.now())} tarihinden tamamlayarak \`${MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}  Görev Puanı\` kazandı.`)]})
                        await Users.updateOne({_id: uye.id}, {$inc: {"Coin": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}}, {upsert: true})
                        await Upstaffs.updateOne({_id: uye.id}, {$set: {"Mission.CompletedTagged": true}},{upsert: true})
                        await Upstaffs.updateOne({ _id: uye.id }, { $inc: { 
                            "Mission.completedMission": 1,
                            "Point": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
                            "ToplamPuan": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
                            "Görev": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
                        } }, {upsert: true}); 
                        await client.Economy.updateBalance(uye.id, Number(MissionData.Reward), "add", 1) 
                    }
                }
                if(tip == "Kayıt" && MissionData.Register >= 1 && !uP.Mission.CompletedRegister) {
                    if(!roller.teyitciRolleri.some(x => uye.roles.cache.has(x))) return;
                    await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Mission.Register": 1 } }, {upsert: true});
                    if(uP.Mission.Register + 1 >= MissionData.Register) {
                        if(görevLog) görevLog.send({embeds: [logEmbed.setDescription(`${uye} isimli görev sahibi, **Kayıt** görevini ${tarihsel(Date.now())} tarihinden tamamlayarak \`${MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}  Görev Puanı\` kazandı.`)]})
                        await Users.updateOne({_id: uye.id}, {$inc: {"Coin": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}}, {upsert: true})
                        await Upstaffs.updateOne({_id: uye.id}, {$set: {"Mission.CompletedRegister": true}},{upsert: true})
                        await Upstaffs.updateOne({ _id: uye.id }, { $inc: { 
                            "Mission.completedMission": 1,
                            "Point": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
                            "ToplamPuan": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
                            "Görev": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
                        } }, {upsert: true}); 
                        await client.Economy.updateBalance(uye.id, Number(MissionData.Reward), "add", 1) 
                    }
                }
                if(tip == "Yetkili" && MissionData.Staff >= 1 && !uP.Mission.CompletedStaff) {
                    await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Mission.Staff": 1 } }, {upsert: true});
                    if(uP.Mission.Staff + 1 >= MissionData.Staff) {
                        if(görevLog) görevLog.send({embeds: [logEmbed.setDescription(`${uye} isimli görev sahibi, **Yetkili** görevini ${tarihsel(Date.now())} tarihinden tamamlayarak \`${MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}  Görev Puanı\` kazandı.`)]})
                        await Users.updateOne({_id: uye.id}, {$inc: {"Coin": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}}, {upsert: true})
                        await Upstaffs.updateOne({_id: uye.id}, {$set: {"Mission.CompletedStaff": true}},{upsert: true})
                        await Upstaffs.updateOne({ _id: uye.id }, { $inc: { 
                            "Mission.completedMission": 1,
                            "Point": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
                            "ToplamPuan": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
                            "Görev": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
                        } }, {upsert: true});
                        await client.Economy.updateBalance(uye.id, Number(MissionData.Reward), "add", 1) 
                    }
                }   
                
               return
            } 
            
        }
        if(uye.roles.cache.has(uPConf.endstaff)) return;
        if(uP.Yönetim) return;
        if(!uPConf.staffs.some(x => uye.roles.cache.has(x.rol))) return;
        await Upstaffs.updateOne({ _id: uye.id }, { $inc: {"Point": pnt, "ToplamPuan": pnt } }, {upsert: true});
        if(tip == "Invite") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Invite": pnt } }, {upsert: true});
		if(tip == "Taglı") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Tag": pnt } }, {upsert: true});
		if(tip == "Kayıt") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Register": pnt } }, {upsert: true});
        if(tip == "Mesaj") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Mesaj": pnt, "ToplamMesaj": pnt } }, {upsert: true});
        if(tip == "Bonus") await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Bonus": pnt, "ToplamBonus": pnt } }, {upsert: true});
        if(uP.Yönetim && tip == "Yetkili") await await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Yetkili": pnt } }, {upsert: true}); 
        if(uP.Yönetim && tip == "Görev") await await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "Görev": pnt } }, {upsert: true});          
        if(tip == "Ses") {
            await Upstaffs.updateOne({ _id: uye.id }, { $inc: { "ToplamSes": pnt} }, {upsert: true}); 
            await Upstaffs.findOne({_id: uye.id },  async (err, data) => {
                    let sespuan = data.Ses.get(categoryID) || 0;
                    let toplamsespuan = data.ToplamSesListe.get(categoryID) || 0;
                    var setle = Number(sespuan) + Number(pnt)
                    var setleiki = Number(toplamsespuan) + Number(pnt)
                    data.Ses.set(categoryID, Number(setle));
                    data.ToplamSesListe.set(categoryID, Number(setleiki));
                    data.save();
            }).catch(err => {})   
        }

        let exRoleYetki = uPConf.staffs.find(x => x.No == uP.staffExNo);
        if(exRoleYetki.exrol) {
        if(!exRoleYetki.exrol.some(x => uye.roles.cache.has(x))) uye.roles.add(exRoleYetki.exrol)
        }
        let Yetki = uPConf.staffs.find(x => x.No == uP.staffNo)
        if(!Yetki) return;
        let yeniPuan = Yetki.Puan
        if(!yeniPuan) return;
        if (uP && uPConf.staffs.some(x => uP.Point >= yeniPuan)) {
          if(Yetki.Atlama) return;
          let yeniYetki = uPConf.staffs.filter(x => x.No == uP.staffNo);
          yeniYetki = yeniYetki[yeniYetki.length-1];
          if(roller.altYönetimRolleri.some(x => yeniYetki.exrol == x) || roller.yönetimRolleri.some(x => yeniYetki.exrol == x) || roller.üstYönetimRolleri.some(x => yeniYetki.exrol == x)) {
          await Upstaffs.updateOne({_id: uye.id}, { $set: {"Yönetim": true }}, {upsert: true}).exec()
            setTimeout(() => {
                uye.roles.remove([...roller.banHammer, ...roller.jailHammer, ...roller.voiceMuteHammer, ...roller.muteHammer, ...roller.teleportHammer, ...roller.abilityHammer, roller.altilkyetki]).catch(err => {})
            }, 2000);
          } 
          const eskiYetki = uPConf.staffs[uPConf.staffs.indexOf(yeniYetki)-1];
          if (eskiYetki) uye.roles.remove(eskiYetki.rol).catch(err => {});
          if(eskiYetki) {
              setTimeout(() => {
                uye.roles.remove(eskiYetki.rol).catch(err => {});
              }, 2000);
          }
            if(yeniYetki && !uye.roles.cache.has(yeniYetki.rol)) {
                await uye.roles.add(yeniYetki.rol)
                if(yeniYetki.exrol) setTimeout(async () => {
                    await uye.roles.add(yeniYetki.exrol)
                }, 1000);
              }

          let embed = new genEmbed()
          let yetkiAtladınKanal = guild.kanalBul(kanallar.TerfiLog)
          if(yetkiAtladınKanal)  yetkiAtladınKanal.send({embeds: [embed.setDescription(`:tada: ${uye.toString()} üyesi gereken puana ulaştı ve ${yeniYetki.exrol ? `<@&${yeniYetki.rol}>, `+ yeniYetki.exrol.map(x => uye.guild.roles.cache.get(x)).join(", ") : Array.isArray(yeniYetki.rol) ? yeniYetki.rol.map(x => `<@&${x}>`).join(", ") : `<@&${yeniYetki.rol}>`} isimli yetki rol(leri) verildi!`)]});
          await Upstaffs.updateOne({ _id: uye.id }, { $set: { "Point": 0, "staffNo": uP.staffNo += 1, "staffExNo": uP.staffNo -= 1, "Invite": 0,  "Tag": 0, "Yetkili": 0, "Görev": 0, "Register": 0, "Ses": new Map(), "Mesaj": 0, "Bonus": 0 }}, {upsert: true});
          await Stats.updateOne({userID: uye.id}, {$set: { "upstaffVoiceStats": new Map(), "upstaffChatStats": new Map()}}, {upsert: true})
	  await client.Economy.updateBalance(uye.id, Number(yeniPuan), "add", 1)
	} 
        
    }

}

module.exports = Staff 