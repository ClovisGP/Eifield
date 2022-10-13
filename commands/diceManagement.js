const errorManagement = require('./../tools/errorManagement');

module.exports = {
    data: {
        "name": "dice",
		"description" : "!dice or !d :\r",
        "type": 1,
        "options": [
            {
                "name": "value",
                "type": 4,
		        "description" : "It is the dice value",
                "required": true,
                "min_value": 2,
            },
            {
                "name": "number",
                "type": 4,
		        "description" : "It is the dice number",
                "required": false,
                "min_value": 1,
                "max_value": 50,
            },
        ],
    },
    execute: async function(interaction) {
       try {
            let result = " dice of " + interaction.options.get("value").value + " : " + (Math.floor(Math.random() * interaction.options.get("value").value) + 1);
            
            if (interaction.options.get("number")) {
                for (let i = 2; i <= interaction.options.get("number").value; i++) {
                    result =  result + "\t|\t" + " dice: " + interaction.options.get("value").value + " : ";
                    result =  result + (Math.floor(Math.random() * interaction.options.get("value").value) + 1);
                }
            }
            interaction.reply(result);
            return 0;
        }
        catch(err) {
            errorManagement.writeErrorMsg(interaction, 1, err);
            return 1;
        }
    },
};