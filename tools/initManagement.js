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
    
    rest.put(Discord.Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error)
}


module.exports = {
    initCommands,
    musicCommandsList,
};