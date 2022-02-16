const { Client, Intents, Collection,  Discord } = require("discord.js"),
{ token, prefix, color, ownerId } = require("./config.json"),
client = new Client( { intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, "DIRECT_MESSAGES" ], partials: ["CHANNEL", "MESSAGE","REACTION","USER"] })


client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.aliases = new Collection();
client.settings = { prefix, color, ownerId };
client.discord = Discord;

for(let handler of  ["slash_command", "prefix_command", "event"]) require(`./handlers/${handler}`)(client);

client.login(token)
