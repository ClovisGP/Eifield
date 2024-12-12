import { REST } from '@discordjs/rest';
import { Collection, Routes, Colors } from 'discord.js';
import fs from 'fs';
import path from 'path';


const __dirname = path.resolve();
const commandsPath = path.join(__dirname, './commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

const commands = [];
export const musicCommandsList = []

/**
 * Initializes the commands on the server
 * @param {{}} bot  The bot object
 * @param {number} guildId The Guild or Server 's ID
 */
export async function initCommands(bot, guildId) {
    try {
        await rest.put(Routes.applicationGuildCommands(process.env.APP_ID, guildId), { body: [] }); // The the old command
        bot.commands = new Collection();
        for (const file of commandFiles) {
            const filePath = `file://${path.join(commandsPath, file)}`;
            const command = await import(filePath);

            bot.commands.set(command.data.name, command);
            commands.push(command.data);
            if (file.includes("Music")) musicCommandsList.push(command.data.name)
            console.log(`Command file loaded => ${file}`)
        }
        await rest.put(Routes.applicationGuildCommands(process.env.APP_ID, guildId), { body: commands });
        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(`An error was catch in initCommands => ${error}`);
        throw Error(`An error was catch in initCommands`)
    }
}

/**
 * Init all the listeners of the music player
 * @param {{}} player The player object
 */
export function initPlayer(player) {
    try {
        player.on('error', (queue, error) => {
            console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
        });

        player.on('connectionError', (queue, error) => {
            console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
        });

        player.on('trackStart', (queue, track) => {//Translation
            queue.metadata.send(`▶ | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
        });

        player.on('trackAdd', (queue, track) => {//Translation
            queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
        });

        player.on('botDisconnect', queue => {//Translation
            queue.metadata.send('❌ | I was manually disconnected from the voice channel, clearing queue!');
        });

        player.on('channelEmpty', queue => {//Translation
            queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
        });

        player.on('queueEnd', queue => {//Translation
            queue.metadata.send('✅ | Queue finished!');
        });
    } catch (error) {
        console.error(`An error was catch in initPlayer => ${error}`);
        throw Error(`An error was catch in initPlayer`)
    }
}

/**
 * Check if the controller's role exist. Unless, create it
 * @param {{}} bot The bot object
 * @param {number} guildId The guild or server 's ID
 */
export function initRoles(bot, guildId) {
    try {
        let guild = bot.guilds.cache.get(guildId);

        if (!guild.roles.cache.find(x => x.name === "EifieldController"))
            guild.roles.create({
                name: 'EifieldController',
                color: Colors.DarkNavy,
                reason: 'A role to access the dangerous commands of Eifeild',//Translation
            })
    } catch (error) {
        console.error(`An error was catch in initRoles => ${error}`);
        throw Error(`An error was catch in initRoles`)
    }
}