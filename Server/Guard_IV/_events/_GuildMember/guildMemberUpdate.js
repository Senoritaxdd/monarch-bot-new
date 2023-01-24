const { GuildMember, MessageEmbed, Message, Guild } = require("discord.js");
const fs = require('fs');
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');

 /**
 * @param {GuildMember} oldMember
 * @param {GuildMember} newMember
 */

module.exports = async (oldMember, newMember) => {
    const permissionStaff = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS_AND_STICKERS", "MANAGE_WEBHOOKS"];
    let embed = new genEmbed()
    .setTitle("Sunucuda Sağ-Tık Rol Verildi/Alındı!")
    if (newMember.roles.cache.size > oldMember.roles.cache.size) {
    let entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "member" ,"Sağ-Tık Rol/Ver Alma!")) return;
        if (permissionStaff.some(p => oldMember.permissions.has(p) && newMember.permissions.has(p))) {
            client.punitivesAdd(entry.executor.id, "jail")
            client.allPermissionClose()
            await newMember.roles.set(oldMember.roles.cache.map(r => r.id))  
            embed.setDescription(`${newMember} (__${newMember.id}__) üyesine ${entry.executor} (__${entry.executor.id}__) tarafından Sağtık Yetki İşlemi Yapıldı! Veren kişi cezalandırıldı ve verilen kişiden rol geri alındı.`);
            let loged = newMember.guild.kanalBul("guard-log");
            if(loged) await loged.send({embeds: [embed]});
            const owner = await newMember.guild.fetchOwner();
            if(owner) owner.send({embeds: [embed]}).catch(err => {})
        }
    };
}

module.exports.config = {
    Event: "guildMemberUpdate"
}


client.on("guildMemberNicknameUpdate", async (member, oldNickname, newNickname) => {
    let embed = new genEmbed()
    let entry = await member.guild.fetchAuditLogs({
        limit: 1,
        type: "GUILD_MEMBER_UPDATE"
    }).then(audit => audit.entries.first());
    if(entry && entry.executor && entry.executor.bot) return;
    if(entry && entry.executor && !entry.executor.bot) {
        if(await client.checkMember(entry.executor.id, "member" ,"Sağ-Tık İsim Değiştirme!")) {
            await Users.updateOne({_id: member.id}, {$push: { "Names": { Staff: entry.executor.id, Name: newNickname == null ? member.user.username : newNickname, State: "Sağ-Tık Değiştirme", Date: Date.now() }}}, {upsert: true})
            let Log = member.guild.kanalBul("isim-log")
            if(Log) Log.send({embeds: [embed.setDescription(`${member} (__${member.id}__) üyesinin ismi \`${oldNickname} => ${newNickname}\` olarak ${entry.executor} (__${entry.executor.id}__) tarafından **${tarihsel(Date.now())}** güncellendi.`)]})
        }
    }
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "member" ,"Sağ-Tık İsim Değiştirme!")) return;
    client.punitivesAdd(entry.executor.id, "jail")
    member.setNickname(oldNickname).catch(err => {})
    embed.setDescription(`${member} (__${member.id}__) üyesinin ismi \`${oldNickname} => ${newNickname}\` olarak ${entry.executor} (__${entry.executor.id}__) tarafından izinsiz olarak güncellendi ve cezalandırıldı.`);
    let loged = member.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await member.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
})


client.on("voiceChannelMute", async (member, muteType) => {
    let embed = new genEmbed()
    let entry = await member.guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_UPDATE"
    }).then(audit => audit.entries.first());
    let checkRegister = member.guild.channels.cache.get(member.voice.channelId)
    if(entry && entry.executor && !entry.executor.bot && checkRegister && checkRegister.parentId) {
        if(checkRegister.parentId == kanallar.registerKategorisi || checkRegister.parentId == kanallar.streamerKategorisi) {
            embed.setDescription(`${member} (__${member.id}__) üyesine ${entry.executor} (__${entry.executor.id}__) tarafından ${checkRegister} kanalında Sağ-tık susturma işlemi yapıldı!`);
            let muted = member.guild.kanalBul("sesmute-log");
            if(muted) return muted.send({embeds: [embed]});
        }
    }
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "member" ,"Sağ-Tık Susturma İşlemi!")) return;
    client.punitivesAdd(entry.executor.id, "jail")
    //client.allPermissionClose()
    embed.setDescription(`${member} (__${member.id}__) üyesine ${entry.executor} (__${entry.executor.id}__) tarafından Sağ-tık susturma işlemi yapıldı! yapan kişi ise cezalandırıldı.`);
    let loged = member.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await member.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
});