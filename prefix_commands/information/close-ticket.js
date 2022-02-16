const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "close-ticket",
  description: "add guild_id for tickets",
  aliases: ["ct", "close", "delete"],
  category: "information",
  ownerOnly: true,
  run: (client, message, args) => {
    let id = message.mentions.channels.first() || message.channel;
    if (!id) return message.reply("please provide a channel!");
    const QuestionEmbed = new MessageEmbed()
      .setAuthor(client.user.username)
      .setDescription(`Ticket Closed!`)
      .setThumbnail(message.author.displayAvatarURL())
      .setColor("GREEN")
      .setFooter("Ticket - SUpport System");
    let msg = message.author.send({
      embeds: [QuestionEmbed],
    }).then(m => { setTimeout(()=> {m.delete()}, 8000)})
      try {
      /* setInterval(() => {
          message.guild.channels.cache.forEach((c) => { if (c.name === `ticket-${message.author.id}`) return c.delete() });
        }, 2000); */
          id.delete()
          
       } catch (e) {
          message.channel.send(`make sure i have permssions to perform that.`)
          console.log(e)
      }
   
  },
};
