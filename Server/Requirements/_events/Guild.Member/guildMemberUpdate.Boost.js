const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require('../../../../Global/Init/Embed');

module.exports = async (oldMember, newMember) => {
    if (oldMember.roles.cache.has(roller.boosterRolü) && !newMember.roles.cache.has(roller.boosterRolü)) try {
        Users.findOne({ _id: newMember.id }, async (err, UserData) => {
          if (!UserData) return;
          let user = newMember;
          let guild = newMember.guild
          let kanalcik = guild.channels.cache.get(kanallar.chatKanalı)
          
          if (oldMember.roles.cache.has(roller.boosterRolü) && !newMember.roles.cache.has(roller.boosterRolü)) {
            if(ayarlar.taglıalım) {
              if(kanalcik) {
                kanalcik.send({embeds: [new genEmbed().setColor("#df2f8f").setDescription(`😭 ${user} üyesi takviyesini kaybetti ve kayıtsıza atıldı.`)]}).then(x => {
                  setTimeout(() => {
                      x.delete() 
                  }, 7500);
                })
              }
                await user.voice.disconnect().catch(err => {})
                await user.setNickname(`${user.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`)
                return await user.setRoles(roller.kayıtsızRolleri)   
            }
            if(!ayarlar.taglıalım && UserData && UserData.Name && UserData.Names && UserData.Gender) {
               if(kanalcik) {
                  kanalcik.send({embeds: [new genEmbed().setColor("#df2f8f").setDescription(`😭 ${user} isimli üye sunucumuzdan takviyesini çektiği için veya süresi bittiği için ismi tekrardan düzeltildi.`)]}).then(x => {
                   setTimeout(() => {
                       x.delete() 
                    }, 7500);
                  })
                }
                if(user && user.manageable) await user.setNickname(`${user.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${UserData.Name}`)
            } else {
                if(user && user.manageable) await user.setNickname(`${ayarlar.tagsiz} İsim | Yaş`)
            }
          };
        })
      } catch (error) {
        client.logger.log("Boost çekildiğinde isim düzeltilmesinde sorun oluştu.","error")
      }
}

module.exports.config = {
    Event: "guildMemberUpdate"
}