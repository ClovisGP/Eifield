const errorManagement = require('./../tools/errorManagement');

module.exports = {
    data: {
        "name": "remove_by_napalm",
		"description" : "Remove a group of 5 messages",
        "type": 1,
        "options": [
            {
            "name": "number",
            "type": 4,
            "description" : "It is the number of messages",
            "required": false,
            "min_value": 1,
            "max_value": 20,
            },
        ]
    },
    execute: async function(interaction) {//////////refaire les droits
        try {
            if (interaction.author.discriminator !== "3833") {
                errorManagement.writeErrorMsg(msg, 3);
                return 3;
            }
            if (interaction.options.get("number")) {
                interaction.channel.bulkDelete(interaction.options.get("number").value)
                .then(async messages => {
                    console.log(`Bulk deleted ${messages.size} messages`);
                    await interaction.reply("Messages removed");
                    setTimeout(() => interaction.deleteReply(), 10000);
                })
                .catch(error => { errorManagement.writeErrorMsg(interaction, 2, error)});
            } else {
                interaction.channel.bulkDelete(5)
                .then(async messages => {
                    console.log(`Bulk deleted ${messages.size} messages`);
                    await interaction.reply("Messages removed");
                    setTimeout(() => interaction.deleteReply(), 10000);
                })
                .catch(error => { errorManagement.writeErrorMsg(interaction, 2, error)});
            }
        }
        catch(err) {
            errorManagement.writeErrorMsg(interaction, 1, err);
            return 1;
        }
    },
};