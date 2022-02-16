module.exports = {
    name: "deploy",
    description: "Deploy the slash commands in your guild.",
    run: async (client, message) => {
    /*    if (
         !message.author.id === "480285300484997122" || message.author.id !== message.guild.ownerId 
          
        )
          return message.channel.send(
            `⚔️ | This command can only be used by server owner.`
          ); */
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
        return message.channel.send("✅ |  Slash commands are deploied.")
    }
}