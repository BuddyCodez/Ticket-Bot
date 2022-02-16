const db = require("quick.db");
const { MessageEmbed } = require("discord.js")
module.exports = {
  name: "setguild",
  description: "add guild_id for tickets",
  category: "information",
  ownerOnly: true,
  run: (client, message, args) => {
    let id= args[0]
    if (!id) return message.reply("please provide a guild id!");
    const QuestionEmbed = new MessageEmbed()
      .setAuthor(client.user.username)
      .setDescription(`2nd Guild id is set to ${id}`)
      .setThumbnail(message.author.displayAvatarURL())
      .setColor("GREEN")
      .setFooter("Ticket - SUpport System");
    let msg = message.channel.send({
      embeds: [QuestionEmbed],
    });
db.set(`id`, id)
  },
};
