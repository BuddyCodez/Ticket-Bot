const colors = require("colors");
module.exports = {
  run: async (client, message) => {
    if (
      message.author.bot ||
      !message.content.startsWith(client.settings.prefix)
    )
      return;
    
    const args = message.content
      .slice(client.settings.prefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();

    let command = client.prefix_commands.get(cmd);
    if (!command) command = client.prefix_commands.get(client.aliases.get(cmd));
    if (!command) return;

    if (command.botPermissions) {
      const Permissions = command.botPermissions
        .filter((x) => !message.guild.me.permissions.has(x))
        .map((x) => "`" + x + "`");
      if (Permissions.length)
        return message.channel.send(
          `I need ${Permissions.join(
            ", "
          )} permission(s) to execute the command!`
        );
    }

    if (command.memberPermissions) {
      const Permissions = command.memberPermissions
        .filter((x) => !message.member.permissions.has(x))
        .map((x) => "`" + x + "`");
      if (Permissions.length)
        return message.channel.send(
          `You need ${Permissions.join(
            ", "
          )} permission(s) to execute this command!`
        );
    }

    if (command.ownerOnly) {
      if (message.author.id !== client.settings.ownerId)
        return message.channel.send("This command can only be use by owner :C");
    }

    command.run(client, message, args);
    // setting up slash cmd
    if (message.guild) {
      try {
        await message.guild.commands.set(
          [...client.slash_commands].map((x) => x[1].data)
        );

        console.log(
          colors.green(`Slash Command auto deployed for ${message.guild.name}`)
        );
      } catch (error) {
        console.log(error);
      }
   }
   
  },
};
