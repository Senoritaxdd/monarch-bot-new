const { MessageEmbed } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = async channel => {
    let embed = new genEmbed().setTitle("Sunucuda Kanal Oluşturuldu!")
    let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "channels" ,"Kanal Oluşturma!")) return;
    client.punitivesAdd(entry.executor.id, "ban")
    client.allPermissionClose()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`#${channel.name}\` isimli kanal oluşturuldu ve oluşturulduğu gibi silinip yapan kişi yasaklandı.`);
    await channel.delete({reason: `Guard tarafından tekrardan silindi.`});   
    let loged = channel.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await channel.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
}

module.exports.config = {
    Event: "channelCreate"
}
