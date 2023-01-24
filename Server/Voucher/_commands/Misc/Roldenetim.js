const Discord = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "roldenetim",
    Komut: ["roldenetim"],
    Kullanim: "roldenetim <Rol-ID>",
    Aciklama: "Belirtilen bir rolün üyelerinin seste olup olmadığını ve rol bilgilerini gösterir.",
    Kategori: "yönetim",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let embed = new genEmbed()
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt); 
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
      if (!role) return message.reply({content: `${cevaplar.prefix} Denetleyebilmem için lütfen bir rol belirtiniz.`, ephemeral: true })
      let unVoice = role.members.filter(member => !member.voice.channel);
      let list = 1
      let veri = `${tarihsel(Date.now())} Tarihinde ${message.member.user.tag} tarafından istenmiştir!\n` + role.members.map((e) => e ? `#${list++} ••❯ ID: ${e.id} - İsim: ${e.displayName} - ${e.voice.channel ? "Seste" : "Seste Değil"}` : "sa").join("\n")
     
      await message.channel.send({
      content: `\` ••❯ \` Aşağıda **${tarihsel(Date.now())}** tarihinde istenen ${role} isimli rol bilgisi ve rol denetimi belirtilmiştir. (**Dosya içerisinde genel seste olan olmayan olarak üyeleri listelenmiştir.**)
${Discord.Formatters.codeBlock("fix", "Rol: " + role.name + " | " + role.id + " | " + role.members.size + " Toplam Üye | " + unVoice.size + " Seste Olmayan Üye")}`,
      files: [{
         attachment: Buffer.from(veri),
         name: `${role.id}-genelbilgisi.txt`
     }]})
      message.channel.send(`Aşağıda **${role.name}** (\`${role.id}\`) isimli rolünün seste olmayan üyeleri sıralandırılmıştır.`).then(xx => {
         const arr = Discord.Util.splitMessage(`${unVoice.map(e => `<@${e.id}>`).join(", ")}`, { maxLength: 1950, char: "\n" });
         arr.forEach(element => {
            message.channel.send(Discord.Formatters.codeBlock("diff", element));
         });
      })
   }
};