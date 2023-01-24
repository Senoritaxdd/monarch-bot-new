const { GuildMember, MessageEmbed, Message } = require("discord.js");
const fs = require('fs');
const { genEmbed } = require("../../../../Global/Init/Embed");

 /**
 * @param {GuildMember} member
 */


module.exports = async (member) => {
    let embed = new genEmbed()
    .setTitle("Sunucuda Sağ-Tık Üye Atıldı!")
    let entry = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "member" ,"Sağ-Tık Atma!")) return;
    client.punitivesAdd(entry.executor.id, "jail")
    client.allPermissionClose()
    embed.setDescription(`${member} (\`${member.id}\`) üyesi, ${entry.executor} (\`${entry.executor.id}\`) tarafından sunucudan \`Sağ-Tık\` ile atıldı! atan kişi ise yasaklandı.`);
    let loged = guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
}

module.exports.config = {
    Event: "guildMemberRemove"
}
