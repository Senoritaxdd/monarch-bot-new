const { VoiceState, MessageEmbed } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Sestekiler = new Map()
 /**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState 
 */

 module.exports = async (oldState, newState) => {
        let logKanali = newState.guild.kanalBul("ses-log")
        if (!oldState.channelId && newState.channelId) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi ${newState.channel} adlı sesli kanala **katıldı!**`).catch();
        if (oldState.channelId && !newState.channelId) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi \`${newState.guild.channels.cache.get(oldState.channelId).name}\` adlı sesli kanaldan **ayrıldı!**`).catch();
        if(oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            let audit = await newState.guild.fetchAuditLogs();
            let entry = audit.entries.first();
            if(entry && entry.action == 'MEMBER_MOVE' && entry.executor.id !== newState.id && entry.executor.id !== client.user.id) return logKanali.send(`:arrow_up_down: \`${newState.member.displayName}\` üyesi \`${newState.guild.members.cache.get(entry.executor.id).displayName}\` (\` ${entry.executor.id} \`) tarafından ${oldState.channel} adlı ses kanalından ${newState ? newState.channel : oldState ? oldState.channel : "#kanalyok"} adlı ses kanalına **taşındı!**`)
            if(!entry || entry.executor.id !== client.user.id) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi ses kanalını **değiştirdi!** (\`${newState.guild.channels.cache.get(oldState.channelId).name}\` => ${newState.channel})`).catch();
        }
        if (oldState.channelId && oldState.selfMute && !newState.selfMute) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi ${newState.channel} adlı sesli kanalda kendi susturmasını **kaldırdı!**`).catch();
        if (oldState.channelId && !oldState.selfMute && newState.selfMute) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi ${newState.channel} adlı sesli kanalda kendini **susturdu!**`).catch();
        if (oldState.channelId && oldState.selfDeaf && !newState.selfDeaf) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi ${newState.channel} adlı sesli kanalda kendi sağırlaştırmasını **kaldırdı!**`).catch();
        if (oldState.channelId && !oldState.selfDeaf && newState.selfDeaf) return logKanali.send(`\`${newState.guild.members.cache.get(newState.id).displayName} (${newState.id})\` üyesi ${newState.channel} adlı sesli kanalda kendini **sağırlaştırdı!**`).catch();
        if(oldState.channelId && !oldState.streaming && newState.channelId && newState.streaming) return logKanali.send(`:desktop: \`${newState.member.displayName} (${newState.id})\` üyesi ${newState.channel} adlı ses kanalında **yayın açtı!**`);
        if(oldState.channelId && oldState.streaming && newState.channelId && !newState.streaming) return logKanali.send(`:desktop: \`${newState.member.displayName} (${newState.id})\` üyesi ${newState.channel} adlı ses kanalında **yayını kapattı!**`);
        if(oldState.channelId && !oldState.selfVideo && newState.channelId && newState.selfVideo) return logKanali.send(`:desktop: \`${newState.member.displayName} (${newState.id})\` üyesi ${newState.channel} adlı ses kanalında **kamerasını açtı!**`);
        if(oldState.channelId && oldState.selfVideo && newState.channelId && !newState.selfVideo) return logKanali.send(`:desktop: \`${newState.member.displayName} (${newState.id})\` üyesi ${newState.channel} adlı ses kanalında **kamerasını kapattı!**`)
    }

module.exports.config = {
    Event: "voiceStateUpdate"
}


/**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 */

client.on("voiceStateUpdate", async (oldState, newState) => {
    let embed = new genEmbed()
    if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
    if(newState.member.permissions.has('ADMINISTRATOR') 
    || newState.member.roles.cache.has(roller.boosterRolü)
    || roller.üstYönetimRolleri.some(oku => newState.member.roles.cache.has(oku)) 
    || roller.altYönetimRolleri.some(oku => newState.member.roles.cache.has(oku)) 
    || roller.kurucuRolleri.some(oku => newState.member.roles.cache.has(oku)) 
    || roller.yönetimRolleri.some(oku => newState.member.roles.cache.has(oku))) return;
    let logKanali = newState.guild.kanalBul("nsfw-log")
    if (oldState.member.nickname) {
        let ageLimit = oldState.member.nickname.includes("|") && oldState.member.nickname.split("| ")[1] || 0
    if (!oldState.channelId && newState.channelId) {
        if (newState.channel && newState.channel.name.includes("+18")) {
            if(ageLimit < 18) {
                await logKanali.send({content: `${newState.member}`, embeds: [embed.setDescription(`${newState.member} üyesi **18 yaşından** küçük olmasına rağmen +18 kanallara giriş yaptığından dolayı \`${newState.channel.name}\` isimli kanaldan atıldı!`)]})
                await newState.member.send(`${newState.member} **18 yaşından** küçük olduğun için \`${newState.channel.name}\` isimli kanaldan atıldın!`).catch(e => { });
                await newState.member.voice.disconnect().catch(e => { });
            }
        }
    }
    if (oldState.channelId && newState.channelId) {
        if (newState.channel && newState.channel.name.includes("+18")) {
            if(ageLimit < 18) {
                await logKanali.send({content: `${newState.member}`, embeds: [embed.setDescription(`${newState.member} üyesi **18 yaşından** küçük olmasına rağmen +18 kanallara giriş yaptığından dolayı \`${newState.channel.name}\` isimli kanaldan atıldı!`)]})
                await newState.member.send(`${newState.member} **18 yaşından** küçük olduğun için \`${newState.channel.name}\` isimli kanaldan atıldın!`).catch(e => { });
                await newState.member.voice.disconnect().catch(e => { });
            }
        }
    }
}


})