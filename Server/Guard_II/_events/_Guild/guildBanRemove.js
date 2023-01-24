const { GuildMember, MessageEmbed } = require("discord.js");
const fs = require('fs');
const { genEmbed } = require("../../../../Global/Init/Embed");

 /**
 * @param {Guild} guild
 * @param {GuildMember} user
 */

module.exports = async (ban) => {
    let embed = new genEmbed().setTitle("Sunucuda Yasaklama Kaldırıldı!")
    let entry = await ban.guild.fetchAuditLogs({type: 'MEMBER_BAN_REMOVE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "member" ,"Yasaklama Kaldırma!")) return;
    client.punitivesAdd(entry.executor.id, "jail")
    client.allPermissionClose()
    await ban.guild.members.ban(ban.user.id, { reason: "Yasaklaması Kaldırıldığından Dolayı Tekrar Yasaklandı." });
    embed.setDescription(`${ban.user} (\`${user.id}\`) üyesinin yasaklaması, ${entry.executor} (\`${entry.executor.id}\`) tarafından kaldırıldığı için, kaldıran kişi cezalandırılıp kaldırdığı üye tekrar banlandı.`);
    let loged = ban.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await ban.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
}

module.exports.config = {
    Event: "guildBanRemove"
}
