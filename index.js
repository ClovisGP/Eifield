const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
const diceManagement = require('./commands/diceManagement');
const rmMsg = require('./commands/removeMsg');
const helpMsg = require('./commands/helpCommand');
const errorManagement = require('./tools/errorManagement');

/* Bot's lunch */
bot.once('ready', () => {
   console.log("Bot ready");
});

bot.on("message", msg => {
    if (!msg.content.startsWith(config.PREFIX)) return;
    if (msg.author.bot) {
        errorManagement.writeErrorMsg(msg, 1);
        return;
    }
    console.log(msg.author.discriminator + ' ' + msg.author.username + " ->" + msg.content + "<-");
    
    /* Parsing message*/
    const commandBody = msg.content.slice(config.PREFIX.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    
    
    /* Parsing command*/
    if (command === "help" || command === "h") {
        helpMsg.displayHelp(msg, "FR");
    } else if (command === "dice" || command === "d") {
        diceManagement.dice(msg, args);
    } else if (command === "remove" || command === "rm") {
        rmMsg.removeMsg(msg, args);
        
    }
})
bot.on('error', console.error);
bot.login(config.BOT_TOKEN);