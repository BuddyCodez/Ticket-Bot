const colors = require("colors");
const { textSync } = require("figlet");
module.exports = {
  run: (client) => {
    console.log(colors.cyan(textSync(client.user?.username)));
    console.log(
      colors.green(` Connected to Discord with ${client.ws?.ping} ping!`)
    );
  },
};