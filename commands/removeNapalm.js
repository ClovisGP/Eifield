import { replyErrorToInteraction } from './../tools/errorManagement.js';
import RSVP from './../tools/responseManagement.js';
import { checkRole } from './../tools/permissionManagement.js';

export const data = {
    "name": "remove_by_napalm",
    "description": "Remove a group of 5 messages",
    "type": 1,
    "options": [
        {
            "name": "number",
            "type": 4,
            "description": "It is the number of messages",
            "required": false,
            "min_value": 1,
            "max_value": 20,
        },
    ]
};
export async function execute(interaction) {
    try {
        if (!checkRole(interaction, "EifieldController")) {
            console.error(`Forbidden access to execute - removeNapalm`);
            replyErrorToInteraction(interaction, "forbiddenCommand"); 
            return;
        }
        //await interaction.deferReply(); // if we enable it we can't reply, but it refuse to editReply because "don't have reply"
        if (interaction.options.get("number")) {
            interaction.channel.bulkDelete(interaction.options.get("number").value)
                .then(async (messages) => {
                    console.log(`Bulk deleted ${messages.size} messages`);
                    RSVP(interaction, "messageRemoved", 0);
                })
                .catch(error => { console.error(`Error for bulkDelete in execute - removeNapalm => ${error}`); replyErrorToInteraction(interaction, "errorDeleteMsg"); });
        } else {
            interaction.channel.bulkDelete(5)
                .then(async (messages) => {
                    console.log(`Bulk deleted ${messages.size} messages`);
                    RSVP(interaction, "messageRemoved", 0);
                })
                .catch(error => { console.error(`Error for bulkDelete in execute - removeNapalm => ${error}`); replyErrorToInteraction(interaction, "errorDeleteMsg"); });
        }
    }
    catch (err) {// We don't care if a error occurs here
        console.error(`An error was catch in execute - removeNapalm => ${err}`)
        replyErrorToInteraction(interaction, "errorDuringExecution");
    }
}