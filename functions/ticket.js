const db = require("quick.db");
const {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  MessageButton,
} = require("discord.js");
function TicketServer(interaction, client, questions) {
  const filter = (m) => {
    interaction.user.id === m.author.id;
  };
  const collector = interaction.channel.createMessageCollector(filter, {
    time: 15000,
    max: 1,
  });

  collector.on("collect", async (m) => {
    let question;
    if (m.author.id === interaction.user.id) {
      question = m.content;
      const map = questions.map((x) => [...x.name].join(" *"));
      let regex = new RegExp(map.join("|"), "gi");
      let match = regex.exec(question);
      console.log(match);
      if (!match) {
        interaction.channel.send(
          `Please wait, I am Forwarding your issue with My Admin.\n`
        );
        let guildid = db.get(`id`);
        let guild = client.guilds.cache.get(guildid);
        if (!guildid) {
          interaction.followUp("Bot Not setup Yet!");
        }
        if (!guild) {
          interaction.followUp("Bot Not setup Yet!");
        }
        let member = guild.members.cache.get(interaction.user.id);

        try {
          let ticketRole =
            guild.roles.cache.find((r) => r.name === "TICKET-SUPPORT-SYSTEM") ||
            guild.roles.create({
              name: "TICKET-SUPPORT-SYSTEM",
              color: "YELLOW",
              reason: "this roles is ticket to get support.",
            });
          let chan = await guild.channel.cache.find(
            (ch) => ch.name == `ticket-${interaction.user.id}`
          );
          let ch =
            chan ||
            (await guild.channels.create(`ticket-${interaction.user.id}`, {
              type: "GUILD_TEXT",
              PermissionOwerwrites: [
                {
                  id: guild.roles.everyone,
                  deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                },
                {
                  id: ticketRole.id,
                  allow: [
                    "VIEW_CHANNEL",
                    "SEND_MESSAGES",
                    "ATTACH_FILE",
                    "EMBED_LINKS",
                  ],
                },
              ],
            }));

          let channel = await client.channels.fetch(ch.id);

          let inv = await channel.createInvite({
            unique: true,
          });
          interaction.followUp(
            `Hello sir, Kindly Join the server Below link for support thankyou!\n\n${inv}`
          );
          channel.send(
            `<@&${ticketRole.id}> please talk with our moderator/admin.`
          );
        } catch (e) {
          console.log(e);
          return interaction.followUp(
            "error while creating channel, make sure i have appropriate perms."
          );
        }
      } else if (match) {
        let ans = questions.find((x) => x.name == match[0]);
        console.log(ans);
        const embed = new MessageEmbed()
          .setColor("6d6ee8")
          .setAuthor("Ticket", client.user.avatarURL())
          .setDescription(
            `Please Follow the Instructions Below:\n\`${ans.ans || ans}\``
          );
        interaction.followUp({ embeds: [embed] });
        let EMBED = new MessageEmbed()
          .setAuthor(client.user.username, client.user.avatarURL())
          .setDescription("do you need help with anything else?")
          .setFooter("Ticket - Support ")
          .setColor("GOLD");
        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId("yes")
              .setLabel("Yes")
              .setEmoji("✅")
              .setStyle("PRIMARY")
          )
          .addComponents(
            new MessageButton()
              .setCustomId("no")
              .setLabel("No")
              .setEmoji("❎")
              .setStyle("PRIMARY")
          );
        interaction.followUp({ embeds: [EMBED], components: [row] });
      }
    }
    setTimeout(() => {
      collector.stop();
    }, 3000);
  });

  collector.on("end", async (c) => {
    console.log("Time Ended.");
  });
}
module.exports = TicketServer;
