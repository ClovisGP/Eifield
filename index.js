const Discord = require('discord.js');
const config = require('./config.json');
const diceManagement = require('./commands/diceManagement');
const rmMsg = require('./commands/removeMsg');
const helpMsg = require('./commands/helpCommand');
const musicManagement = require('./commands/musicManagement');
const errorManagement = require('./tools/errorManagement');

const bot = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.MessageContent,
		Discord.GatewayIntentBits.GuildMembers,
    ]
    }
);

bot.api.applications(bot.user.id).guilds('guild id').commands.post({data: {
    name: 'ping',
    description: 'ping pong!'
}})

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
    try {
        if (!msg.content.startsWith(config.PREFIX)) return;
        if (msg.author.bot) {
            errorManagement.writeErrorMsg(msg, 1);
            return 1;
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


        /**
         * Debut Player
         */

        // const serverQueue = musicManagement.queue.get(msg.guild.id);

        // if (command === 'play') {
        //     musicManagement.execute(msg, serverQueue);
        // return;
        // } else if (command === 'skip') {
        //     musicManagement.skip(msg, serverQueue);
        // return;
        // } else if (command === 'stop') {
        //     musicManagement.stop(msg, serverQueue);
        // return;
        // } else {
        //     msg.channel.send('You need to enter a valid command!')
        // }
        /**
         * Fin Player
         */

    }
    catch(err) {
        errorManagement.writeErrorMsg(msg, 11);
        console.log(err)
        return 11;
    }
    return 0;
})


client.on('interactionCreate', interaction => {
	console.log(interaction);
});



bot.on('error', console.error);
bot.login(config.BOT_TOKEN);

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

        try {
            if (!queue.connection) await queue.connect(interaction.member.channel);
        } catch {
            void player.deleteQueue(interaction.guildId);
            return void interaction.followUp({ content: "Could not join your voice channel!" });
        }

        await interaction.followUp({ content: `⏱ | Loading your ${searchResult.playlist ? "playlist" : "track"}...` });
        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if (!queue.playing) await queue.play();
    } else if (interaction.commandName === "skip") {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.followUp({ content: "❌ | No music is being played!" });
        const currentTrack = queue.current;
        const success = queue.skip();
        return void interaction.followUp({
            content: success ? `✅ | Skipped **${currentTrack}**!` : "❌ | Something went wrong!"
        });
    } else if (interaction.commandName === "stop") {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.followUp({ content: "❌ | No music is being played!" });
        queue.destroy();
        return void interaction.followUp({ content: "🛑 | Stopped the player!" });
    } else {
        interaction.reply({
            content: "Unknown command!",
            ephemeral: true
        });
    }
});

client.login(config.BOT_TOKEN);*/
