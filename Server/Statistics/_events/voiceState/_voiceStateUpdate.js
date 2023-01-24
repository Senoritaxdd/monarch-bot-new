const { VoiceState } = require("discord.js");
const Stats = require("../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats");
const Upstaffs = require("../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs");
const Tasks = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Tasks');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
const mscik = require('ms')
const statRecods = new Map();
const moment = require('moment')

 /**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState 
 */

client.on("ready", async () => {
  client.logger.log("İstatistik, davet, yetki sistemi verileri güncellendi.", "stat")
  client.guilds.cache.get(sistem.SERVER.ID).channels.cache.filter(e => e.type == "GUILD_VOICE" && e.members.size > 0).forEach(channel => {
    channel.members.filter(member => !member.user.bot).forEach(member => {
      if(kanallar.ayrıkKanallar.some(x => channel.id == x)) {
        statRecods.set(member.id, {
          channel: channel.id,
          duration: Date.now()
        });
      } else {
        statRecods.set(member.id, {
          channel: channel.parentId || channel.id,
          duration: Date.now()
        });
      }
    });
  });

  setInterval(() => {
    statRecods.forEach((value, key) => {
      voiceInit(key, value.channel, getDuraction(value.duration));
      statRecods.set(key, {
        channel: value.channel,
        duration: Date.now()
      });
    });
  }, 1000);
});


module.exports = (oldState, newState) => {
if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

if (!oldState.channelId && newState.channelId) {
    if(kanallar.ayrıkKanallar.some(x => newState.channelId == x)) {
      statRecods.set(oldState.id, {
        channel: newState.channelId,
        duration: Date.now()
      });  
    } else {
      statRecods.set(oldState.id, {
        channel: newState.guild.channels.cache.get(newState.channelId).parentId || newState.channelId,
        duration: Date.now()
      });
    }
}


if (!statRecods.has(oldState.id)) {
  if(kanallar.ayrıkKanallar.some(x => newState.channelId == x) &&  kanallar.ayrıkKanallar.some(x => oldState.channelId == x)) {
      statRecods.set(oldState.id, {
        channel: newState.channelId,
        duration: Date.now()
      });
  } else {
    statRecods.set(oldState.id, {
      channel: newState.guild.channels.cache.get(oldState.channelId || newState.channelId).parentId || newState.channelId,
      duration: Date.now()
    });
  }
}
  let data = statRecods.get(oldState.id);
  let duration = getDuraction(data.duration);
  
  if (oldState.channelId && !newState.channelId) {
    voiceInit(oldState.id, data.channel, duration);
    statRecods.delete(oldState.id);
  } else if (oldState.channelId && newState.channelId) {
    voiceInit(oldState.id, data.channel, duration);
    if(kanallar.ayrıkKanallar.some(x => newState.channelId == x)) {
      statRecods.set(oldState.id, {
        channel: newState.channelId,
        duration: Date.now()
      });
    } else {
    statRecods.set(oldState.id, {
      channel: newState.guild.channels.cache.get(newState.channelId).parentId || newState.channelId,
      duration: Date.now()
    });
  }
  }
}

module.exports.config = {
    Event: "voiceStateUpdate"
} 
client.acarSaatYap = (date) => { return moment.duration(date).format('H'); };
function getDuraction(ms) {
    return Date.now() - ms;
  };
  
 async function voiceInit(memberID, categoryID, duraction) {
    Stats.findOne({guildID: sistem.SERVER.ID, userID: memberID}, async (err, data) => {
      if (!data) {
        let voiceMap = new Map();
        let chatMap = new Map();
        let voiceCameraMap = new Map();
        let voiceStreamingMap = new Map();
        voiceMap.set(categoryID, duraction);
        let newMember = new Stats({
          guildID: sistem.SERVER.ID,
          userID: memberID,
          voiceStats: voiceMap,
          taskVoiceStats: voiceMap,
          upstaffVoiceStats: voiceMap,
          voiceCameraStats: voiceCameraMap,
          voiceStreamingStats:  voiceStreamingMap,       
          totalVoiceStats: duraction,
          chatStats: chatMap,
          upstaffChatStats: chatMap,
          totalChatStats: 0
        });
        newMember.save();
      } else {
        let lastUserData = data.voiceStats.get(categoryID) || 0;
        let lastTaskData = data.taskVoiceStats.get(categoryID) || 0;
        let lastStaffData = data.upstaffVoiceStats.get(categoryID) || 0;
        data.voiceStats.set(categoryID, Number(lastUserData)+duraction);
        let uye = client.guilds.cache.get(sistem.SERVER.ID).members.cache.get(memberID)
        if(uye) {
          if(_statSystem.system) {
            if(_statSystem.staffs.some(x => uye.roles.cache.has(x.rol))) data.upstaffVoiceStats.set(categoryID,  Number(lastStaffData)+duraction)
            let data2 = await Upstaffs.findOne({_id: uye.id})
            if(data2 && data2.Mission) data.taskVoiceStats.set(categoryID, Number(lastTaskData)+duraction), checkTasks(uye, data2)
          };
        }
        data.totalVoiceStats = Number(data.totalVoiceStats)+duraction;
        data.save();
      };
    }).catch(err => {});
  }


  async function checkTasks (uye, data2) {
    let data = await Stats.findOne({guildID: sistem.SERVER.ID, userID: uye.id})
    let logEmbed = new genEmbed().setThumbnail("https://preview.redd.it/qlne8pqzf0301.png?auto=webp&s=70da263d61a6d13378ff2b4aaab10e0bfa233fcf")
    let exRoleYetki = _statSystem.staffs.find(x => x.No == data2.staffExNo);
     let MissionData = await Tasks.findOne({roleID: exRoleYetki ? exRoleYetki.rol : 0, Active: true}) || await Tasks.findOne({ Users: uye.id })
    let görevLog = uye.guild.kanalBul("görev-tamamlayan")
    if(!MissionData) return;
    let public = 0;
    let register = 0;
    let genelses = 0;
    
    if(data) {
      data.taskVoiceStats.forEach(c => genelses += Number(c));
      if(roller.teyitciRolleri.some(x => uye.roles.cache.has(x))) {
        data.taskVoiceStats.forEach((value, key) => {
          if(key == kanallar.registerKategorisi) public += Number(value)  
        })
      } else {
        data.taskVoiceStats.forEach((value, key) => {
            if(key == kanallar.publicKategorisi) public += Number(value)  
            if(key == kanallar.streamerKategorisi) public += Number(value)  
        });
      }

      if(!data2.Mission.CompletedAllVoice) {
        if(Number(client.acarSaatYap(genelses)) >= MissionData.AllVoice) {
          if(MissionData.AllVoice <= 0) return; 
          if(görevLog) görevLog.send({embeds: [logEmbed.setDescription(`${uye} isimli görev sahibi, **Genel Ses** görevini ${tarihsel(Date.now())} tarihinden tamamlayarak \`${MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}  Görev Puanı\` kazandı.`)]})
          await Users.updateOne({_id: uye.id}, {$inc: {"Coin": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}}, {upsert: true})
          await Upstaffs.updateOne({_id: uye.id}, {$set: {"Mission.CompletedAllVoice": true}},{upsert: true})
          //await Stats.updateOne({guildID: sistem.SERVER.ID, userID: uye.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})
          await Upstaffs.updateOne({ _id: uye.id }, { $inc: { 
            "Mission.completedMission": 1,
            "Point": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
            "ToplamPuan": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
            "Görev": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
        } }, {upsert: true}); 
        await client.Economy.updateBalance(uye.id, Number(MissionData.Reward), "add", 1) 
        return;
        }
      }

      if(!data2.Mission.CompletedPublicVoice) {
        if(Number(client.acarSaatYap(public)) >= MissionData.publicVoice) {
          if(MissionData.public <= 0) return; 
          if(görevLog) görevLog.send({embeds: [logEmbed.setDescription(`${uye} isimli görev sahibi, **Public, Register, Streamer** görevini ${tarihsel(Date.now())} tarihinden tamamlayarak \`${MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}  Görev Puanı\` kazandı.`)]})
          await Users.updateOne({_id: uye.id}, {$inc: {"Coin": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks}}, {upsert: true})
          await Upstaffs.updateOne({_id: uye.id}, {$set: {"Mission.CompletedPublicVoice": true}},{upsert: true})
          //await Stats.updateOne({guildID: sistem.SERVER.ID, userID: uye.id}, {$set: {"taskVoiceStats": new Map()}}, {upsert: true})
          await Upstaffs.updateOne({ _id: uye.id }, { $inc: { 
            "Mission.completedMission": 1,
            "Point": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
            "ToplamPuan": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
            "Görev": MissionData.Reward ? MissionData.Reward  : uPConf.points.tasks,
        } }, {upsert: true}); 
        await client.Economy.updateBalance(uye.id, Number(MissionData.Reward), "add", 1) 
        return;
        }
      }


    }   
  }