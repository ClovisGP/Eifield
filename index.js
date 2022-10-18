const Discord = require('discord.js');
const config = require('./config.json');
const { REST } = require('@discordjs/rest');


//clear le code, refaire les reponse des intéraction, revoir le  but pour rm et les acces, voir pour mettre un mode fr
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

bot.commands = new Discord.Collection();

const fs = require('node:fs');
const path = require('node:path');
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const {Player} = require('discord-player');
const rest = new REST({ version: '10' }).setToken(config.token);

const commands = [];
const musicCommandsList = []

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
    bot.commands.set(command.data.name, command);
	commands.push(command.data);
    if (file.includes("Music"))
        musicCommandsList.push(command.data.name)
}



rest.put(Discord.Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error)


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
bot.once('reconnecting', () => {
    console.log('Reconnecting!');
});
bot.once('disconnect', () => {
    console.log('Disconnect!');
});

bot.on("messageCreate", async msg => {
})


bot.on('interactionCreate', async interaction => {
    console.log("passage");
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

/*
const { Client, GuildMember, GatewayIntentBits  } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const config = require("./config.json");

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
] });

client.on("ready", () => {
    console.log("Bot is online!");
    client.user.setActivity({
        name: "🎶 | Music Time",
        type: "LISTENING"
    });
});
client.on("error", console.error);
client.on("warn", console.warn);

const player = new Player(client);

player.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on("trackStart", (queue, track) => {
    queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on("trackAdd", (queue, track) => {
    queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on("botDisconnect", (queue) => {
    queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
});

player.on("channelEmpty", (queue) => {
    queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
});

player.on("queueEnd", (queue) => {
    queue.metadata.send("✅ | Queue finished!");
});

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();

    if (message.content === "!deploy" && message.author.id === client.application?.owner?.id) {
        await message.guild.commands.set([
            {
                name: "play",
                description: "Plays a song from youtube",
            },
            {
                name: "skip",
                description: "Skip to the current song"
            },
            {
                name: "stop",
                description: "Stop the player"
            },
        ]);

        await message.reply("Deployed!");
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand() || !interaction.guildId) return;

    console.log("Before")
    if (!(interaction.member instanceof GuildMember) || !voiceChannel) {
        return void interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
    }
    console.log("After")

    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
        return void interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
    }

    if (interaction.commandName === "play") {
        await interaction.deferReply();

        const query = interaction.options.get("query").value;
        const searchResult = await player
            .search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            .catch(() => {});
        if (!searchResult || !searchResult.tracks.length) return void interaction.followUp({ content: "No results were found!" });

        const queue = await player.createQueue(interaction.guild, {
            metadata: interaction.channel
        });


client.login(config.BOT_TOKEN);*/
