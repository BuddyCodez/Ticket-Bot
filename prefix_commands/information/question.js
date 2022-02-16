const {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  MessageButton,
} = require("discord.js");
const db = require("quick.db")
module.exports = {
  name: "question",
  description: "add question and answer for tickets",
  category: "information",
  aliases: ["q", "que", "addq", "add"],
  ownerOnly: true,
  run: (client, message, args) => {
    let question = args.join(" ");
      if (!question) return message.reply("please provide a question!");
      const QuestionEmbed = new MessageEmbed()
          .setAuthor(client.user.username)
          .setFields({ name: "Your Entered Question:", value: question })
          .setThumbnail(message.author.displayAvatarURL())
          .setColor("GREEN")
      .setFooter("Ticket - SUpport System")
      let msg = message.channel.send({
        embeds: [QuestionEmbed],
        content: `\n\nPlease eneter Your Answer Now :\n`,
      });
   
      const filter = (m) =>
          message.author.id === m.author.id 
        const collector = message.channel.createMessageCollector({filter,
         max: 1,
          time: 120000,
          
        });
      collector.on("collect", async (m) => {
          try {
              let answer = m.content;
              const AnswerEmbed = new MessageEmbed()
                .setAuthor(client.user.username)
                .setFields(
                  {
                    name: "Your Entered Question:",
                    value: question,
                    inline: true,
                  },
                  { name: "Your Enterd Answer", value: answer, inline: true }
                )
                .setThumbnail(message.author.displayAvatarURL())
                .setColor("RED")
                .setFooter("Ticket - SUpport System");
              message.channel.send({ embeds: [AnswerEmbed] });
            let Que = { name: question.toLowerCase(), ans: answer }
            console.log(Que)
              db.push(`question`, Que)
              collector.stop();
           } catch (err) {
              console.log(new Error(`Error: ${err}`))
              message.channel.send("an error occured try again.")
         } 
           
      });
      collector.on("end", async (c) => {
              const TimeUpEmbed = new MessageEmbed()
                .setAuthor(client.user.username)
             .setDescription(`sorry But Now time is Up! Thankyou!`)
                .setThumbnail(message.author.displayAvatarURL())
                .setColor("GREEN")
                .setFooter("Ticket - SUpport System");
          message.channel.send({ embeds: [TimeUpEmbed] });
         
      })
      
  },
};
