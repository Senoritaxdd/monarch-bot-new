const { GuildMember, MessageEmbed, GuildChannel, Permissions } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");


 /**
 * @param {GuildChannel} oldChannel
 * @param {GuildChannel} newChannel
 */


module.exports = async (oldChannel, newChannel) => {
    let embed = new genEmbed().setTitle("Sunucuda Kanal İzni Düzenlendi!")
    let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_OVERWRITE_UPDATE'}).then(audit => audit.entries.first())
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "channels" ,"Kanal İzni Düzenlendi!")) return;
    client.punitivesAdd(entry.executor.id, "ban")
    client.allPermissionClose()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`#${oldChannel.name}\` isimli kanalda izni düzenledi ve yasaklandı.`);
    await newChannel.permissionOverwrites.set(oldChannel.permissionOverwrites.cache.array());
    let loged = newChannel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await newChannel.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
}

module.exports.config = {
    Event: "channelUpdate"
}
