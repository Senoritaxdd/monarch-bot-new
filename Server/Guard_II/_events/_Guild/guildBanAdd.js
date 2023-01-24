const { GuildMember, MessageEmbed, Message } = require("discord.js");
const fs = require('fs');
const { genEmbed } = require("../../../../Global/Init/Embed");

 /**
 * @param {Guild} guild
 * @param {GuildMember} user
 */


module.exports = async (ban) => {
    let embed = new genEmbed()
    .setTitle("Sunucuda Sağ-Tık Yasaklama Atıldı!")
    let entry = await ban.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "member" ,"Sağ-Tık Yasaklama!")) return;
    client.punitivesAdd(entry.executor.id, "jail")
    client.allPermissionClose()
    await ban.guild.members.unban(ban.user.id, "Sağ Tık İle Banlandığı İçin Geri Açıldı!").catch(console.error);
    embed.setDescription(`${ban.user} (\`${ban.user.id}\`) üyesi, ${entry.executor} (\`${entry.executor.id}\`) tarafından sunucudan \`Sağ-Tık\` ile yasaklandı! yasaklayan kişi ise yasaklandı.`);
    let loged = ban.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await ban.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
}

module.exports.config = {
    Event: "guildBanAdd"
}
