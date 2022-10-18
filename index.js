const Discord = require('discord.js');
const config = require('./config.json');
const {initCommands, musicCommandsList} = require('./tools/initManagement')


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

initCommands(bot);

const {Player} = require('discord-player');

const player = new Player(bot);

player.on('error', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

player.on('connectionError', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on('trackStart', (queue, track) => {
  queue.metadata.send(`▶ | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on('trackAdd', (queue, track) => {
  queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on('botDisconnect', queue => {
  queue.metadata.send('❌ | I was manually disconnected from the voice channel, clearing queue!');
});

player.on('channelEmpty', queue => {
  queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
});

player.on('queueEnd', queue => {
  queue.metadata.send('✅ | Queue finished!');
});



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