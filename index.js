import { Client, GatewayIntentBits } from 'discord.js';
import RSVP from './tools/responseManagement.js';
import {initCommands, musicCommandsList, initPlayer, initRoles} from './tools/initManagement.js';
import {Player} from 'discord-player';
import dotenv from 'dotenv';

dotenv.config();

let listAlreadyInit = [];
//clear le code, refaire les reponse des intéraction, revoir le  but pour rm et les acces, voir pour mettre un mode fr, check les dependance
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ]
    }
);

const player = new Player(bot);

initPlayer(player);

/* Bot's launch AREA*/
bot.once('ready', async () => {
    console.log("Bot ready");
});
bot.once('reconnecting', async () => {
    console.log('Reconnecting');
});
bot.once('disconnect', async () => {
    console.log('Disconnect');
});

/* Reception AREA */
bot.on("messageCreate", async msg => {
    console.log(msg.content)
    if (msg.content === "E-initialisation" && !(listAlreadyInit.includes(msg.guildId))) {
        let guildId = msg.guildId;
        await initCommands(bot, guildId);
        initRoles(bot, guildId);
        listAlreadyInit.push(guildId);
        RSVP(msg, "botInitialised", 0); //It's a msg but it is ok
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
        RSVP(interaction, "errorDuringExecution", 0);
	}
});

bot.on('error', console.error);
bot.login(process.env.BOT_TOKEN);