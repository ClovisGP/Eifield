const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
const diceManagement = require('./commands/diceManagement');
const rmMsg = require('./commands/removeMsg');

/* Bot's lunch */
bot.once('ready', () => {
   console.log("Bot ready");
});

bot.on("message", msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(config.PREFIX)) return;
    console.log(msg.author.discriminator + ' ' + msg.author.username + " ->" + msg.content + "<-");
    
    /* Parsing message*/
    const commandBody = msg.content.slice(config.PREFIX.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    
    
    /* Parsing command*/
    if (command === "help" || command === "h") {
        console.log("BOT write HELP");
        msg.channel.send("USAGE :\n\t!help or !h : display help.\n\t!dice or !d : d[dice value] (Optional->) x[number of dices]")
    } else if (command === "dice" || command === "d") {
        msg.channel.send(diceManagement.dice(args));
    } else if (command === "remove" || command === "rm") {
        rmMsg.removeMsg(msg, args);
        
    }
})
bot.on('error', console.error);
bot.login(config.BOT_TOKEN);