const { GuildMember, MessageEmbed, GuildChannel } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

 /**
 * @param {GuildChannel} oldChannel
 * @param {GuildChannel} newChannel
 */


module.exports = async (oldChannel, newChannel) => {
    let embed =  new genEmbed().setTitle("Sunucuda Kanal İzni Oluşturuldu!")
    let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_OVERWRITE_CREATE'}).then(audit => audit.entries.first())
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "channels" ,"Kanal İzni Oluşturuldu!")) return;
    client.punitivesAdd(entry.executor.id, "ban")
    client.allPermissionClose()
    await newChannel.permissionOverwrites.set(oldChannel.permissionOverwrites.cache.array())
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`#${oldChannel.name}\` isimli kanalda izin oluşturdu ve yasaklandı.`);
    let loged = newChannel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await newChannel.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
}

module.exports.config = {
    Event: "channelUpdate"
}
