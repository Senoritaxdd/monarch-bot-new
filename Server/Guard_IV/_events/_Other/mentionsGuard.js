const { GuildMember, MessageEmbed, GuildChannel, Permissions, Message } = require("discord.js");
const fs = require('fs');
const { genEmbed } = require("../../../../Global/Init/Embed");

 /**
 * @param {Message} oldMessage
 * @param {Message} newMessage
 */


module.exports = async (oldMessage, newMessage) => {
    let embed = new genEmbed().setTitle("Sunucuda Duyuru Atıldı!")
    if ((newMessage.content.includes('@everyone') || newMessage.content.includes('@here'))) { 
        let uye = newMessage.member;
        if(!uye.permissions.has('MENTION_EVERYONE')) return;
        if(await client.checkMember(uye.id, undefined ,"İzinsiz Duyuru Atıldı!")) return;
        await newMessage.delete()
        client.punitivesAdd(uye.id, "jail")
       // client.allPermissionClose()
        embed.setDescription(`${uye} (\`${uye.id}\`) üyesi \`@everyone & @here\` yetkisine sahip olup kullanım sağladığı için cezalandırıldı.`);
        let loged = newMessage.guild.kanalBul("guard-log");
        if(loged) await loged.send({embeds: [embed]});
        const owner = await newMessage.guild.fetchOwner();
        if(owner) owner.send({embeds: [embed]}).catch(err => {})
    }
}

module.exports.config = {
    Event: "messageUpdate"
}


/**
 * @param {Client} client 
 * @param {Message} message
 */

client.on("messageCreate", async (message) => {
    let embed = new genEmbed().setTitle("Sunucuda Duyuru Atıldı!")
    if ((message.content.includes('@everyone') || message.content.includes('@here'))) { 
        let uye = message.member;
        if(!uye.permissions.has('MENTION_EVERYONE')) return;
        if(await client.checkMember(uye.id, undefined ,"İzinsiz Duyuru Atıldı!")) return;
        await message.delete()
        client.punitivesAdd(uye.id, "jail")
        //client.allPermissionClose()
        embed.setDescription(`${uye} (\`${uye.id}\`) üyesi \`@everyone & @here\` yetkisine sahip olup kullanım sağladığı için cezalandırıldı.`);
        let loged = message.guild.kanalBul("guard-log");
        if(loged) await loged.send({embeds: [embed]});
        const owner = await message.guild.fetchOwner();
        if(owner) owner.send({embeds: [embed]})
    }
})