const { MessageEmbed } = require('discord.js');

class genEmbed extends MessageEmbed {
    constructor(...options) {
        super(options)
            this.setColor("RANDOM")
            this.setAuthor(client.guilds.cache.get(sistem.SERVER.ID).name, client.guilds.cache.get(sistem.SERVER.ID).iconURL({dynamic: true}))
    }
}

module.exports = { genEmbed }
