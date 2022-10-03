module.exports = {
    dice: function(args) {
        const msgError = "Error dice usage:\n\t!dice d[dice value] (Optional->) x[number of dices]\n\tExemple: !dice d20 x2";

        if (!args[0]) {
            console.log("BOT write DICE-ERROR");
            return msgError;
        }
        if (!args[0].startsWith('d')) {
            console.log("BOT write DICE-ERROR");
            return msgError;
        }

        let diceValue = parseInt(args[0].slice(1), 10);
        let result = args[0] + " dice: " + (Math.floor(Math.random() * diceValue) + 1);

        if (args[1]) {
            if (args[1].startsWith('x')) {
                let diceNb = parseInt(args[1].slice(1), 10);
                for (let i = 2; i <= diceNb; i++) {
                    result =  result + "\t|\t" + args[0] + " dice: ";
                    result =  result + (Math.floor(Math.random() * diceValue) + 1);
                }
            } else {
                console.log("BOT write DICE-ERROR");
                return msgError;
            }
        }
        console.log("BOT ->" + result + "<-");
        return result;
    }
};