const { MessageEmbed } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = async (oldState, newState) => {
    let embed = new genEmbed().setTitle("Sunucuda Bağlantı Kesildi!")
    let kanalcık = newState.channel
    if (kanalcık === null) {
        let entry = await (oldState, newState).guild.fetchAuditLogs({type: 'MEMBER_DISCONNECT'}).then(audit => audit.entries.first());
        if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000  || await client.checkMember(entry.executor.id, "member" ,"Sunucuda Bağlantı Kesme!")) return;
            client.punitivesAdd(entry.executor.id, "jail")
            //client.allPermissionClose()
            embed.setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından ${oldState.member} üyesinin bağlantısı kesildi. Bu işlemi yapan kişi sunucudan cezalandırıldı.`);
            let loged = oldState.guild.kanalBul("guard-log");
            if(loged) await loged.send({embeds: [embed]});
            const owner = await oldState.guild.fetchOwner();
            if(owner) owner.send({embeds: [embed]}).catch(err => {})
    }
}

module.exports.config = {
    Event: "voiceStateUpdate"
}
