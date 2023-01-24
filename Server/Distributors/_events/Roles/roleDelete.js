const { MessageEmbed , Guild} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const roleBackup = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Roles");
/**
 * @param {Guild} role 
 */

module.exports = async role => {
    let embed = new genEmbed().setTitle("Sunucuda Rol Silindi!")
    let entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "roles" ,"Rol Silme!")) return;
    client.punitivesAdd(entry.executor.id, "ban")
    client.allPermissionClose()
    const roleData = await roleBackup.findOne({ roleID: role.id })
    const newRole = await role.guild.roles.create({

      name: roleData ? roleData.name : role.name,
      color: roleData ? roleData.color : role.color,
      hoist: roleData ? roleData.hoist : role.hoist,
      position: roleData ? roleData.position : role.rawPosition,
      permissions: roleData ? roleData.permissions : role.permissions,
      mentionable: roleData ? roleData.mentionable : role.mentionable,

      reason: "Rol Silindiği İçin Tekrar Oluşturuldu!"
    });
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından **@${role.name}** (\`${role.id}\`) isimli rol silindi ve yapan kişi yasaklandı.\n**NOT:** Rol otomatik olarak kurulmaya başlandı.`).setFooter("otomatik olarak sunucu ayarına göz attı.");
    let loged = role.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await role.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]})
    let data = await roleBackup.findOne({ roleID: role.id })
    if(!data) return client.logger.log(`[${role.id}] ID'li rol silindi fakat herhangi bir veri olmadığı için işlem yapılmadı.`,"log");
    await client.rolKur(role.id, newRole)
    await client.queryManage(role.id, newRole.id)
}

module.exports.config = {
    Event: "roleDelete"
}