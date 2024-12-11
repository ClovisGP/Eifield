import { replyErrorToInteraction } from './../tools/errorManagement.js';
import RSVP from './../tools/responseManagement.js';

export const data = {
    "name": "dice",
    "description": "!dice or !d :\r",
    "type": 1,
    "options": [
        {
            "name": "value",
            "type": 4,
            "description": "It is the dice value",
            "required": true,
            "min_value": 2,
        },
        {
            "name": "number",
            "type": 4,
            "description": "It is the dice number",
            "required": false,
            "min_value": 1,
            "max_value": 50,
        },
    ],
};
export async function execute(interaction) {
    try {
        await interaction.deferReply();
        let result = "" + interaction.options.get("value").value + " : " + (Math.floor(Math.random() * interaction.options.get("value").value) + 1);

        if (interaction.options.get("number")) {
            for (let i = 2; i <= interaction.options.get("number").value; i++) {
                result = result + " \t|\t " + interaction.options.get("value").value + " : ";
                result = result + (Math.floor(Math.random() * interaction.options.get("value").value) + 1);
            }
        }
        RSVP(interaction, "DiceOf", 1, result);
        return 0;
    }
    catch (err) {
        replyErrorToInteraction(interaction, "errorDuringExecution", err);
        return 1;
    }
}