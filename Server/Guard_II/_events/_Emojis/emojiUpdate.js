const { GuildMember, MessageEmbed, Message, Guild, GuildEmoji } = require("discord.js");
const fs = require('fs');
const { genEmbed } = require('../../../../Global/Init/Embed')
 /**
 * @param {GuildEmoji} oldEmoji
 * @param {GuildEmoji} newEmoji
 */


module.exports = async (oldEmoji, newEmoji) => {
    let embed = new genEmbed().setTitle("Sunucuda Emoji Oluşturuldu!")
    let entry = await newEmoji.guild.fetchAuditLogs({type: 'EMOJI_UPDATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "emoji" ,"Emoji Düzenleme!")) return;
    client.punitivesAdd(entry.executor.id, "jail")
    client.allPermissionClose()
    embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından (${newEmoji.guild.emojis.cache.get(oldEmoji.id)}) \`${oldEmoji.name}\` isimli emojiyi \`${newEmoji.name}\` olarak güncellediği eski haline getirilerek cezalandırıldı.`);
    await newEmoji.edit({ name: oldEmoji.name }, `${entry.executor.username} tarafından güncellenmeye çalışıldı.`)
    let loged = emoji.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await emoji.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
}

module.exports.config = {
    Event: "emojiUpdate"
}
