const {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  MessageButton,
} = require("discord.js");

module.exports = {
  name: "help",
    description: "get command list and information about commands.",
   category: "information",
  run: async (client, message, args) => {
    if (message) {
      const embed = new MessageEmbed()
        .setColor("6d6ee8")
        .setAuthor("Ticket", client.user.avatarURL())
        .setDescription("Do you need any help?")
        .setFooter("Ticket Bot - Support System");
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId("open-ticket")
            .setLabel("Help")
            .setEmoji("✉️")
            .setStyle("PRIMARY")
        )
        .addComponents(
          new MessageButton()
            .setCustomId("whitelist")
            .setLabel("WhiteList")
            .setEmoji("💬")
            .setStyle("PRIMARY")
        )
        .addComponents(
          new MessageButton()
            .setCustomId("raffel")
            .setLabel("Raffel")
            .setEmoji("➡️")
            .setStyle("PRIMARY")
        );
message.channel.send({ embeds: [embed], components: [row] }); 
    }
  
  },
};
