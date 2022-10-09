const errorManagement = require('./../tools/errorManagement');

module.exports = {
    dice: function(msg, args) {

        if (!args[0]) {
            errorManagement.writeErrorMsg(msg, 2);
            return 2;
        }
        if (!args[0].startsWith('d')) {
            errorManagement.writeErrorMsg(msg, 2);
            return 2;
        }

        let diceValue = parseInt(args[0].slice(1), 10);
        let result = args[0] + " dice: " + (Math.floor(Math.random() * diceValue) + 1);

        if (args[1]) {
            if (args[1].startsWith('x')) {
                let diceNb = parseInt(args[1].slice(1), 10);
                if (diceNb < 1 || diceNb > 40) {
                    errorManagement.writeErrorMsg(msg, 3);
                    return 3;
                }
                for (let i = 2; i <= diceNb; i++) {
                    result =  result + "\t|\t" + args[0] + " dice: ";
                    result =  result + (Math.floor(Math.random() * diceValue) + 1);
                }
            } else {
                errorManagement.writeErrorMsg(msg, 2);
                return 2;
            }
        }
        msg.channel.send(result);
        return 0;
    },
    writeHelp: function(langage) {
        if (langage === "FR") {
            return "!dice or !d :\r\
            **ARGUMENTS** ->\r\
                \t**d** : La valeur des dés\r\
                        \t\tExemple : !dice d20\r\
                \t**x** : *-Optionnel-* Le nombre de dés lancés\r\
                        \t\t!dice d20 x2\r\r";
        }
        return "!dice or !d :\r\
            **ARGUMENTS** ->\r\
                \t**d** : The dice value\r\
                        \t\tExample : !dice d20\r\
                \t**x** : *-Optional-* The number of dice\r\
                        \t\tExample : !dice d20 x2\r\r";
    }
};