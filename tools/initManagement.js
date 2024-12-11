import { REST } from '@discordjs/rest';
import { Collection, Routes, Colors } from 'discord.js';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve(); // Current directory
const commandsPath = path.join(__dirname, './commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

const commands = [];
export const musicCommandsList = []

export async function initCommands(bot, guildId) {
    bot.commands = new Collection();
    for (const file of commandFiles) {
        console.log(path.join(commandsPath, file))
        const filePath = `file://${path.join(commandsPath, file)}`;
        const command = await import(filePath);

        bot.commands.set(command.data.name, command);
        commands.push(command.data);
        if (file.includes("Music"))
        musicCommandsList.push(command.data.name)
    }

    rest.put(Routes.applicationGuildCommands(process.env.APP_ID, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error)
}

export function initPlayer(player) {
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
}

export function initRoles(bot, guildId) {
    let guild = bot.guilds.cache.get(guildId);

    if (!guild.roles.cache.find(x => x.name === "EifieldController"))
    guild.roles.create({
        name: 'EifieldController',
        color: Colors.DarkNavy,
        reason: 'A role to access the dangerous commands of Eifeild',
    })
}