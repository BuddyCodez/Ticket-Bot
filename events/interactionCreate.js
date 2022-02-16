const db = require("quick.db");
const {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  MessageButton,
} = require("discord.js");
const ticket = require("../functions/ticket");
const TicketServer = require("../functions/index");
module.exports = {
  run: async (client, interaction) => {
    await interaction.deferReply().catch((err) => {});

    if (interaction.customId == "open-ticket") {
      if (!interaction.isButton()) return;
      let questions = db.get(`question`);

      let msg = interaction.followUp(
        `please describe what issue you get?\n you have only 15s to describe.`
      );
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
            let chid;
            try {
              let ticketRole =
                guild.roles.cache.find(
                  (r) => r.name === "TICKET-SUPPORT-SYSTEM"
                ) ||
                guild.roles.create({
                  name: "TICKET-SUPPORT-SYSTEM",
                  color: "YELLOW",
                  reason: "this roles is ticket to get support.",
                });
              let ch = await guild.channels.create(
                `ticket-${interaction.user.id}`,
                {
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
                }
              );

              let channel = await client.channels.fetch(ch.id);

              let inv = await channel.createInvite({
                unique: true,
              });
              interaction.followUp(
                `Hello sir, Kindly Join the server Below link for support thankyou!\n\n${inv}`
              );
              member.roles.add(ticketRole || ticketRole.id).then(() => {
                console.log("ROLE ADDED!!!!!!!");
              });

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
              .setThumbnail(client.user.avatarURL())
              .setFooter("Ticket - Support ")
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

            let Collector = interaction.channel.createMessageComponentCollector(
              { componentType: "BUTTON", time: 20000 }
            );
            Collector.on("collect", async (i) => {
              if (i.user.id === interaction.user.id) {
                if (i.customId == "yes") {
                  interaction.followUp(
                    "please describe your issue\n you have only 15s to describe."
                  );
                  ticket(interaction, client, questions);
                } else if (i.customId == "no") {
                  interaction.followUp("Thank you Have a nice day!");
                  Collector.stop();
                }
              }
            });
            Collector.on("end", async (a) => {
              console.log(`yes or No Collector is Ended Now. Thank you`);
            });
          }
        }
        setTimeout(() => {
          collector.stop();
        }, 12000);
      });

      collector.on("end", async (c) => {
        console.log("Time Ended.");
      });
    } else if (
      interaction.customId == "whitelist" ||
      interaction.customId == "raffel"
    ) {
      let questions = db.get(`question`);
      TicketServer(interaction, questions, client);
    } else {
      const { commandName } = interaction;
      const command = client.slash_commands.get(commandName);
      if (!command)
        return interaction.followUp(
          "Unknown Command: Can not find this command in bot."
        );

      try {
        if (command) await command.run(client, interaction);
      } catch (err) {
        console.log(err);
        return interaction.followUp(
          `Something went wrong while executing the command.`
        );
      }
    }
  },
};
