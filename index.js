const Discord = require('discord.js');
const config = require('./config.json');
const {initCommands, musicCommandsList, initPlayer, initRoles} = require('./tools/initManagement')
const {Player} = require('discord-player');

let listAlreadyInit = [];
//clear le code, refaire les reponse des intéraction, revoir le  but pour rm et les acces, voir pour mettre un mode fr, check les dependance
const bot = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildVoiceStates,
    ]
    }
);

const player = new Player(bot);

initPlayer(player);

/* Bot's lunch */
bot.once('ready', async () => {
    console.log("Bot ready");
});
bot.once('reconnecting', async () => {
    console.log('Reconnecting!');
});
bot.once('disconnect', async () => {
    console.log('Disconnect!');
});

bot.on("messageCreate", async msg => {
    if (msg.content == "E-initialisation" && !(listAlreadyInit.includes(msg.guildId))) {
        let guildId = msg.guildId;
        initCommands(bot, guildId);
        initRoles(bot, guildId);
        listAlreadyInit.push(guildId);
        msg.reply({ content: 'Eifield initialised.', ephemeral: true })
    }
})


bot.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = bot.commands.get(interaction.commandName);

	if (!command) return;

	try {
        if (musicCommandsList.includes(interaction.commandName))
            command.execute(interaction, player);
        else
		    command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

bot.on('error', console.error);
bot.login(config.token);