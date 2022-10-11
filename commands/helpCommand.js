const rmMsg = require('./removeMsg');
const diceManagement = require('./diceManagement');

function writeHelp(language) {
    if (language === "FR") {
        return "!help or !h :\r\
            Cette commande affiche l'aide\r\r";
    }
    return "!help or !h :\r\
        This command display the help\r\r";
};

module.exports = {
    writeHelp,
    displayHelp: function(msg, language) {
        try {
            if (language === "FR") {
                msg.channel.send("```Liste des commandes :\r" + writeHelp("FR") + diceManagement.writeHelp("FR") + rmMsg.writeHelp("FR") + "```");
                return 0;
            }
            msg.channel.send("```List of commands :\r" + writeHelp("ENG") + diceManagement.writeHelp("ENG") + rmMsg.writeHelp("ENG") + "```");
            return 0;
        }
        catch(err) {
            errorManagement.writeErrorMsg(msg, 11);
            return 11;
        }
    },
};