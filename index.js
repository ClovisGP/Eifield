import 'dotenv/config';// To force it execution and loadall var before everythings

import { Client, GatewayIntentBits } from 'discord.js';
import RSVP from './tools/responseManagement.js';
import { initCommands, musicCommandsList, initPlayer, initRoles } from './tools/initManagement.js';
import { Player } from 'discord-player';

/**
 * Contains the list of the already init server / guild
 */
let listAlreadyInit = [];// Not really fan of this system

// refaire les reponse des intéraction, revoir le  but pour rm et les acces
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

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
    try {
        if (msg.content === "E-initialisation" && !(listAlreadyInit.includes(msg.guildId))) {
            let guildId = msg.guildId;
            await initCommands(bot, guildId);
            initRoles(bot, guildId);
            listAlreadyInit.push(guildId);
            RSVP(msg, "botInitialised", 0);
        }
    } catch (error) {
        console.error("Error on messageCreate => ", error);
        RSVP(msg, "errorDuringExecution", 0); // We take the assuption that the msg object is ok
    }
})

bot.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    try {
        const command = bot.commands.get(interaction.commandName);
    
        if (!command) return;

        if (musicCommandsList.includes(interaction.commandName))
            command.execute(interaction, player);
        else
            command.execute(interaction);
    } catch (error) {
        console.error(error);
        RSVP(interaction, "errorDuringExecution", 0); // We take the assuption that the interaction object is ok
    }
});

bot.on('error', console.error);
bot.login(process.env.BOT_TOKEN);