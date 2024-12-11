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
        if (!checkRole(interaction, "EifieldController")) return 3;
        //await interaction.deferReply(); // if we enable it we can't reply, but it refuse to editReply because "don't have reply"
        if (interaction.options.get("number")) {
            interaction.channel.bulkDelete(interaction.options.get("number").value)
                .then(async (messages) => {
                    console.log(`Bulk deleted ${messages.size} messages`);
                    RSVP(interaction, "messageRemoved", 0);
                })
                .catch(error => { replyErrorToInteraction(interaction, 2, error); });
        } else {
            interaction.channel.bulkDelete(5)
                .then(async (messages) => {
                    console.log(`Bulk deleted ${messages.size} messages`);
                    RSVP(interaction, "messageRemoved", 0);
                })
                .catch(error => { replyErrorToInteraction(interaction, 2, error); });
        }
    }
    catch (err) {
        replyErrorToInteraction(interaction, 1, err);
        return 1;
    }
}