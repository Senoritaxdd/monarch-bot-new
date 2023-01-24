const { Message } = require("discord.js");
const { Upstaff } =require('../../../../Global/Plugins/Staff/_index');
const Stats = require("../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats");
const veriler = new Map();
const verileriki = new Map();

 /**
 * @param {Message} message 
 */


client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild || message.webhookID || message.channel.type === "dm" || sistem.botSettings.Prefixs.some(x => message.content.startsWith(x))) return;
    Stats.findOne({ guildID: message.guild.id, userID: message.author.id }, (err, data) => {
        let kanalID = message.channel.parentId || message.channel.id;
        if (!data) {
            let voiceMap = new Map();
            let chatMap = new Map();
            let voiceCameraMap = new Map();
            let voiceStreamingMap = new Map();
            chatMap.set(kanalID, 1);
            let newMember = new Stats({
                guildID: message.guild.id,
                userID: message.author.id,
                voiceStats: voiceMap,
                taskVoiceStats: voiceMap,
                upstaffVoiceStats: voiceMap,
                voiceCameraStats: voiceCameraMap,
                voiceStreamingStats:  voiceStreamingMap,     
                totalVoiceStats: 0,
                chatStats: chatMap,
                upstaffChatStats: chatMap,
                totalChatStats: 1
            });
            newMember.save() 
        } else {
            let lastData = data.chatStats.get(kanalID) || 0;
            let lastStaffData = data.upstaffChatStats.get(kanalID) || 0;
            data.chatStats.set(kanalID, Number(lastData)+1);
            if(_statSystem.system && _statSystem.staffs.some(x => message.member.roles.cache.has(x.rol))) data.upstaffChatStats.set(kanalID, Number(lastStaffData)+1);
            data.totalChatStats++;
            data.save();
    };
  }); 
})


module.exports = async (message) => {
    if(message.content && message.content.length < 5) return;
    if(message.webhookId || message.author.bot || message.channel.type === "dm" || !message.guild || sistem.botSettings.Prefixs.some(x => message.content.startsWith(x))) return;
    
    if(message.member.roles.cache.has(roller.jailRolü) || message.member.roles.cache.has(roller.şüpheliRolü) || message.member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => message.member.roles.cache.has(rol)))) return;
    if(!message.member.user.username.includes(ayarlar.tag) && !message.member.roles.cache.has(roller.tagRolü)) return;
    if(message.channel.id !== kanallar.chatKanalı) return;
    if (_statSystem.staffs.some(x => message.member.roles.cache.has(x.rol))) {
        const veri = veriler.get(message.author.id);
        if (veri && (veri % _statSystem.howMessagePoint) === 0) { 
          veriler.set(message.author.id, veri + 1);
          await client.Upstaffs.addPoint(message.author.id, _statSystem.points.message, "Mesaj")
        } else veriler.set(message.author.id, veri ? veri + 1 : 1);  
      }
}

module.exports.config = {
    Event: "messageCreate"
}


client.on("messageCreate", async (message) => {
  if(message.content && message.content.length < 5) return;
  if(message.webhookId || message.author.bot || message.channel.type === "dm" || !message.guild || sistem.botSettings.Prefixs.some(x => message.content.startsWith(x))) return;
  if(message.member.roles.cache.has(roller.jailRolü) || message.member.roles.cache.has(roller.şüpheliRolü) || message.member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => message.member.roles.cache.has(rol)))) return;
  if(message.channel.id !== kanallar.chatKanalı) return;
  const veri = verileriki.get(message.author.id);
  if (veri && (veri % _statSystem.howMessagePoint) === 0) { 
    verileriki.set(message.author.id, veri + 1);
  } else verileriki.set(message.author.id, veri ? veri + 1 : 1);  
});

