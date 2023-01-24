 const Users = require('../../../../Global/Databases/Schemas/Client.Users')
 /**
 * @param {Client} client 
 */

module.exports = async (member) => {
  if(member.guild.id !== sistem.SERVER.ID) return;
  if(member.roles.cache.has(roller.jailRolü) || member.roles.cache.has(roller.şüpheliRolü) || member.roles.cache.has(roller.yasaklıTagRolü) || (roller.kayıtsızRolleri && roller.kayıtsızRolleri.some(rol => member.roles.cache.has(rol)))) return;
  member.Left(user.roles.cache)
  
}

module.exports.config = {
    Event: "guildMemberRemove"
};

client.on("guildMemberRemove", async (member) => {
  if(member.guild.id !== sistem.SERVER.ID) return;
  let entry = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());
  if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000) return
  await Users.updateOne({ _id: entry.executor.id } , { $inc: { "Uses.Kick": 1 } }, { upsert: true }).exec();
})