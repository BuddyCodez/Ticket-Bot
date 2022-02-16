module.exports = {
    name: "ping",
    description: "Get the websocket ping of the message.",
    category: "information",
    run: (client, message) => {
        return message.channel.send(`🏓 | Ping is \`${client.ws.ping}\` ms.`)
    }
}