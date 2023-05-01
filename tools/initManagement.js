const config = require('./../config.json');
const { REST } = require('@discordjs/rest');
const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const rest = new REST({ version: '10' }).setToken(config.token);

const commands = [];
const musicCommandsList = []

function initCommands(bot) {
    bot.commands = new Discord.Collection();
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        bot.commands.set(command.data.name, command);
        commands.push(command.data);
        if (file.includes("Music"))
        musicCommandsList.push(command.data.name)
    }
    
    // rest.put(Discord.Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands })
    // .then(() => console.log('Successfully registered application commands.'))
    // .catch(console.error)

    rest.put(Discord.Routes.applicationCommands(config.clientId), { body: commands },)
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
    
}

function initPlayer(player) {
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

function initRoles(bot) {
    let guild = bot.guilds.cache.get(config.guildId);

    if (!guild.roles.cache.find(x => x.name === "EifieldController"))
    guild.roles.create({
        name: 'EifieldController',
        color: Discord.Colors.DarkNavy,
        reason: 'A role for access to the remove sommands of Eifeild',
    })
}

module.exports = {
    initCommands,
    initPlayer,
    musicCommandsList,
    initRoles,
};