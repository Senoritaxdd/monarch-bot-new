const { Client, ContextMenuInteraction, MessageEmbed } = require("discord.js");
const moment = require('moment')
moment.locale("tr");
const ms = require("ms");

module.exports = {
    name: "Küfür, Argo (15 dk.)",
    description: "Bir uye cekersiniz!",
    type: 'MESSAGE',
    /**
     *
     * @param {Client} client
     * @param {ContextMenuInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, int, args) => {
        let kanal = int.guild.channels.cache.get(int.channelId)
        let msg = await kanal.messages.fetch(int.targetId)
        let message = msg
        let check = await client.users.fetch(message.author.id)
        let uye = message.guild.members.cache.get(check.id)
        let yetkili = message.guild.members.cache.get(int.member.id)
        if(!roller.muteHammer.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku))  && !message.member.permissions.has('ADMINISTRATOR')) return await int.followUp({content: `${cevaplar.noyt}`, ephemeral: true})
        if(uye.user.bot) return await int.followUp({content: `${cevaplar.bot}`, ephemeral: true});
        if(yetkili.id === uye.id) return await int.followUp({content: `${cevaplar.kendi}`, ephemeral: true});
        if(!uye.manageable) return await int.followUp({content: `${cevaplar.dokunulmaz}`, ephemeral: true});
        if(yetkili.roles.highest.position <= uye.roles.highest.position) return await int.followUp({content: `${cevaplar.yetkiust}`, ephemeral: true});
        const Mute = require('../../../../Global/Databases/Schemas/Punitives.Mutes');
        let chatMuteCheck = await Mute.findById(uye.id)
		if(chatMuteCheck) return await int.followUp({content: `${cevaplar.prefix} Belirtilen ${uye} üyesi daha önce susturulma türünde cezalandırılma işlemi yapılmış.`, ephemeral: true});
        await int.followUp({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla ${uye} isimli üyeye gereken ceza işlemi yapıldı!`, ephemeral: true});
        return uye.addPunitives(5, yetkili, "Küfür, Argo ve Rahatsız Edici Davranış!", message, "15m")
    }
};