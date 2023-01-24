 const Users = require('../../../../Global/Databases/Schemas/Client.Users');
 const Settings = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
 const { genEmbed } = require('../../../../Global/Init/Embed');
 /**
 * @param {Client} client 
 */

  module.exports = async (oldUser, newUser) => {
    const _findServer = await Settings.findOne({ guildID: sistem.SERVER.ID })
    ayarlar = global.ayarlar = _findServer.Ayarlar
    roller = global.roller = _findServer.Ayarlar
    kanallar = global.kanallar = _findServer.Ayarlar
    if(oldUser.username == newUser.username || oldUser.bot || newUser.bot) return;
    let client = oldUser.client;
    let guild = client.guilds.cache.get(sistem.SERVER.ID);
    if(!guild) return;
    let user = guild.members.cache.get(oldUser.id);
    if(!user) return;
    let UserData = await Users.findOne({ _id: user.id });

    let embed = new genEmbed()
    if ((ayarlar && ayarlar.yasakTaglar && ayarlar.yasakTaglar.some(tag => newUser.username.includes(tag))) && (roller.yasaklıTagRolü && !user.roles.cache.has(roller.yasaklıTagRolü))) {
        user.setRoles(roller.yasaklıTagRolü)
        user.send(`**${user.guild.name}** sunucumuzun yasaklı taglarından birini kullanıcı adına aldığın için jaile atıldın! Tagı geri bıraktığında jailden çıkacaksın.`)
        guild.kanalBul("yasaklı-tag-log").send({embeds: [embed.setDescription(`${user} adlı üye ismine **${tarihsel(Date.now())}** tarihinde yasaklı tag aldığı için jaile atıldı.`)]})
        return;
    };

    if ((ayarlar && ayarlar.yasakTaglar && !ayarlar.yasakTaglar.some(tag => newUser.username.includes(tag))) && (roller.yasaklıTagRolü && user.roles.cache.has(roller.yasaklıTagRolü))) {
        user.send(`**${user.guild.name}** sunucumuzun yasaklı taglarından birine sahip olduğun için cezalıdaydın ve şimdi bu yasaklı tagı çıkardığın için cezalıdan çıkarıldın!`).catch();
        guild.kanalBul("yasaklı-tag-log").send({embeds: [embed.setDescription(`${user} adlı üye ismine **${tarihsel(Date.now())}** tarihinde yasaklı tagı çıkarttığı için cezalıdan çıkartıldı!`).setColor("GREEN")]})
        if(!ayarlar.taglıalım && UserData && UserData.Name && UserData.Names && UserData.Gender) {
            if(user && user.manageable) await user.setNickname(`${user.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${UserData.Name}`)
            if(UserData.Gender == "Erkek") await user.setRoles(roller.erkekRolleri)
            if(UserData.Gender == "Kadın") await user.setRoles(roller.kadınRolleri)
            if(UserData.Gender == "Kayıtsız") user.setRoles(roller.kayıtsızRolleri)
            if(user.user.username.includes(ayarlar.tag)) user.roles.add(roller.tagRolü)
        } else {
            user.setRoles(roller.kayıtsızRolleri)
            if(user && user.manageable) await user.setNickname(`${ayarlar.tagsiz} İsim | Yaş`)
        }
    };

    if(newUser.username.includes(ayarlar.tag) && !user.roles.cache.has(roller.tagRolü)){
        let addTagLog = guild.kanalBul("tag-aldı-log")
        if(addTagLog) addTagLog.send({embeds: [embed.setDescription(`${user} üyesi ismine \`${ayarlar.tag}\` tagı alarak ailemize katıldı!`).setColor("GREEN")]});
        if (roller.jailRolü && user.roles.cache.has(roller.jailRolü)) return;
        if (roller.yasaklıTagRolü && user.roles.cache.has(roller.yasaklıTagRolü)) return;
        user.roles.add(roller.tagRolü).catch();
        if(user.manageable) user.setNickname(user.displayName.replace(ayarlar.tagsiz, ayarlar.tag))

    } else if(!newUser.username.includes(ayarlar.tag) && user.roles.cache.has(roller.tagRolü)){
        let removeTagLog = guild.kanalBul("tag-çıkardı-log")
        if(removeTagLog) removeTagLog.send({embeds: [embed.setDescription(`${user} üyesi isminden \`${ayarlar.tag}\` tagı çıkararak <@&${roller.tagRolü}> ailemizden ayrıldı!`).setColor("RED")]});
        if (roller.jailRolü && user.roles.cache.has(roller.jailRolü)) return;
        if (roller.yasaklıTagRolü && user.roles.cache.has(roller.yasaklıTagRolü)) return;
        user.removeTagged(user.roles.cache)
        user.removeStaff(user.roles.cache)
        if(ayarlar.taglıalım) {
            await user.voice.disconnect().catch(err => {})
            await user.setNickname(`${user.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
            return await user.setRoles(roller.kayıtsızRolleri)   
        }
        await user.setNickname(user.displayName.replace(ayarlar.tag, ayarlar.tagsiz)).catch(err =>{})
        let tagRol = guild.roles.cache.get(roller.tagRolü);
        await user.roles.remove(user.roles.cache.filter(rol => tagRol.position <= rol.position)).catch(err =>{});

    }
  }
  
  module.exports.config = {
      Event: "userUpdate"
  };