const { MessageAttachment } = require('discord.js');

const Mute = require('../../../../Global/Databases/Schemas/Punitives.Mutes')
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const { genEmbed } = require('../../../../Global/Init/Embed');
const usersMap = new Map();
const LIMIT = 3;
const TIME = 10000;
const DIFF = 1000;

const capsEngel  = /[^A-ZĞÜŞİÖÇ]/g;
const emojiEngel =  /<a?:.+?:\d+>|[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;
const etiketEngel =  /<@!?&?\d+>/g;
const reklamlar = ["http://","https://","cdn.discordapp.com","discordapp.com","discord.app", "discord.gg","discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az", ".cf"]
const inviteEngel = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
const kufurEngel = new RegExp(["amcık","orospu","piç","sikerim","sikik","amına","pezevenk","orospu","evladı","göt","yarrak","o ç","siktir","bacını","karını","amk","sik","amq","anaskm","AMK","YARRAK","sıkerım"].join("|"), 'gi')


 /**
 * @param {Client} client 
 */

module.exports = async (message) => {
    if(message.webhookID || message.author.bot || message.channel.type === "dm") return;
    let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    const _set = _findServer.Ayarlar
    if(_set.staff.includes(message.member.id)) return;
    if(message.member.permissions.has("ADMINISTRATOR")) return;
    if(_set.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return;
    if (message.channel.id == kanallar.photoChatKanalı && message.attachments.size < 1) await message.delete();
    if (message.content.replace(capsEngel, "").length >= message.content.length / 4) {
        if (message.content.length <= 12) { 
		// else
	} else {
       	  if (message.deletable) message.delete().catch(err => err);
	}
    }
    if (_set.kufurEngel === true && message.content.match(kufurEngel)) message.delete().catch(err => {});
    if (message.activity && message.channel.id !== _set.spotifyKanalı && message.activity.partyId.startsWith("spotify:")) message.delete().catch(err => {})
    if(usersMap.has(message.author.id)) {
        const userData = usersMap.get(message.author.id);
        const {lastMessage, timer} = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let msgCount = userData.msgCount;
        
            if(difference > DIFF) {
                clearTimeout(timer);
                userData.msgCount = 1;
                userData.lastMessage = message;
                    userData.timer = setTimeout(() => {
                        usersMap.delete(message.author.id);
                    }, TIME);
                usersMap.set(message.author.id, userData)
            } else {
                    msgCount++;
                    if(parseInt(msgCount) === LIMIT) {
                        let datas = await Mute.findById(message.member.id)
                        if(datas) return;
                        sonMesajlar(message)
                        message.member.addPunitives(5, message.guild.members.cache.get(client.user.id) ? message.guild.members.cache.get(client.user.id) : message.member, "Metin Kanallarında Flood Yapmak!", message, "1m", true)
                        return usersMap.delete(message.author.id);
                     } else {
          userData.msgCount = msgCount;
          usersMap.set(message.author.id, userData)
        }}}
         else{
        let fn = setTimeout(() => {
          usersMap.delete(message.author.id)
        }, TIME);
        usersMap.set(message.author.id, {
        msgCount: 1,
        lastMessage: message,
        timer: fn
        
        })
        }
    if (_set.reklamEngel === true && message.content.match(inviteEngel)) {
        const invites = await message.guild.invites.fetch();
        if ((message.guild.vanityURLCode && message.content.match(inviteEngel).some((i) => i === message.guild.vanityURLCode)) || invites.some((x) => message.content.match(inviteEngel).some((i) => i === x))) return;
        message.delete().catch(err => {});
    }
    if(_set.kufurEngel === true && reklamlar.some(word => message.content.toLowerCase().includes(word))) message.delete().catch(err => {})

}

module.exports.config = {
    Event: "messageCreate"
};

client.on('messageUpdate', async (oldMessage, newMessage) => {
    let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    const _set = _findServer.Ayarlar 
    if(newMessage.webhookID || newMessage.author.bot || newMessage.channel.type === "dm") return;
    if(_set.staff.includes(newMessage.member.id)) return;
    if(newMessage.member.permissions.has("ADMINISTRATOR")) return;
    if(_set.kurucuRolleri.some(oku => newMessage.member.roles.cache.has(oku))) return;
    if (newMessage.channel.id == kanallar.photoChatKanalı && newMessage.attachments.size < 1) await message.delete();
    if (_set.kufurEngel === true && newMessage.content.match(kufurEngel)) newMessage.delete().catch(err => {});
    if (newMessage.activity && newMessage.channel.id !== _set.spotifyKanalı && newMessage.activity.partyId.startsWith("spotify:")) newMessage.delete().catch(err => {})
    if (newMessage.content.replace(capsEngel, "").length >= newMessage.content.length / 2) {
        if (newMessage.content.length <= 15) return;
        if (newMessage.deletable) newMessage.delete().catch(err => err);
    }
    if (_set.reklamEngel === true && newMessage.content.match(inviteEngel)) {
        const invites = await newMessage.guild.invites.fetch();
        if ((newMessage.guild.vanityURLCode && newMessage.content.match(inviteEngel).some((i) => i === newMessage.guild.vanityURLCode)) || invites.some((x) => newMessage.content.match(inviteEngel).some((i) => i === x))) return;
        newMessage.delete().catch(err => {});
    }
    if(_set.kufurEngel === true && reklamlar.some(word => newMessage.content.toLowerCase().includes(word))) newMessage.delete().catch(err => {})
   
});


client.on("messageDelete", async (message, channel) => {
    if(message.webhookId || message.author.bot || message.channel.type === "dm") return;
      if (message.author.bot) return;
      let silinenMesaj = message.guild.kanalBul("mesaj-log")
      const embed = new genEmbed()
      .setAuthor(`Mesaj Silindi`, message.author.avatarURL())
      .setDescription(`${message.author.tag} üyesi bir mesaj sildi.`)
      .addField("Kanal Adı", `${message.channel.name}`, true)
      .addField("Silinen Mesaj", "```" + message.content + "```")
      .setThumbnail(message.author.avatarURL())
      silinenMesaj.send({ embeds: [embed]}).catch(err => {})
      
});
client.on("messageUpdate", async (oldMessage, newMessage) => {
    if(newMessage.webhookId || newMessage.author.bot || newMessage.channel.type === "dm") return;
      let guncellenenMesaj = newMessage.guild.kanalBul("mesaj-log")
      if (oldMessage.content == newMessage.content) return;
      let embed = new genEmbed()
      .setAuthor(`Mesaj Düzenlendi`, newMessage.author.avatarURL())
      .setDescription(`${newMessage.author} üyesi bir mesaj düzenledi`)
      .addField("Eski Mesaj", `${oldMessage.content}`, true)
      .addField("Yeni Mesaj", `${newMessage.content}`, true)
      .addField("Kanal Adı", `${newMessage.channel.name}`, true)
      .setThumbnail(newMessage.author.avatarURL())
      guncellenenMesaj.send({embeds: [embed]}).catch(err => {})
});


async  function sonMesajlar(message) {
    let messages = await message.channel.messages.fetch({ limit: 100 });
             let filtered = messages.filter((x) => x.author.id === message.author.id).array().splice(0, 10);
             message.channel.bulkDelete(filtered);
   } 