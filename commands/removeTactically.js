const errorManagement = require('./../tools/errorManagement');
const RSVPManagement = require('./../tools/responseManagement');
const permManagement = require('./../tools/permissionManagement');

module.exports = {
    data: {
        "name": "remove_tactically",
		"description" : "Remove a group of messages tactically",
        "type": 1,
        "options": [
            {
                "name": "begin",
                "type": 3,
                "description" : "It is the date where the strike begins. It must be in the format YYYY-MM-DDTHH:mm",
                "required": true,
                "min_length": 16,
                "max_length": 16,
            },
            {
                "name": "end",
                "type": 3,
                "description" : "It is the date where the strike ends. It must be in the format YYYY-MM-DDTHH:mm",
                "required": false,
                "min_length": 16,
                "max_length": 16,
            },
            {
                "name": "name",
                "type": 6,
                "description" : "It is the name of the user to target in the strike",
                "required": false,
            },
        ]
    },
    execute: async function(interaction) {
        try {
            if (!permManagement.checkRole(interaction, "EifieldController")) return 3;
            await interaction.deferReply();
            let listArg = [];
            if (interaction.options.get("begin")) {
                if (!Date.parse(interaction.options.get("begin").value)) {
                    errorManagement.writeErrorMsg(interaction, 1);
                    return 5;
                }
                listArg["begin"] = (new Date(interaction.options.get("begin").value).getTime())
            } else {
                errorManagement.writeErrorMsg(interaction, 1);
                return 5;
            }
                if (interaction.options.get("end")) {
                if (!Date.parse(interaction.options.get("end").value)) {
                    errorManagement.writeErrorMsg(interaction, 1);;
                    return 6;
                }
                listArg["end"] = (new Date(interaction.options.get("end").value).getTime())
            }
            if (!("end" in listArg)) {
                if (listArg["begin"] >= listArg["end"]) {
                    errorManagement.writeErrorMsg(interaction, 1);
                    return 8;
                }
            }
            if (interaction.options.get("name")) {
                interaction.channel.messages.fetch({ limit: 100 }).then(messages => {
                    if ("end" in listArg) {
                        messages.forEach(function (currentMsg) {
                            if (currentMsg.createdTimestamp >= listArg["begin"] && currentMsg.createdTimestamp <= listArg["end"] && interaction.options.get("name").value === currentMsg.author.username) {
                                currentMsg.delete();
                            }
                        })
                    } else {
                        messages.forEach(function (currentMsg) {
                            if (currentMsg.createdTimestamp >= listArg["begin"] && interaction.options.get("name").value === currentMsg.author.username) {
                                currentMsg.delete();
                            }
                        })
                    }
                });
            } else {
                interaction.channel.messages.fetch({ limit: 100 }).then(messages => {
                    if ("end" in listArg) {
                        messages.forEach(function (currentMsg) {
                            if (currentMsg.createdTimestamp >= listArg["begin"] && currentMsg.createdTimestamp <= listArg["end"]) {
                                currentMsg.delete();
                            }
                        })
                    } else {
                        messages.forEach(function (currentMsg) {
                            if (currentMsg.createdTimestamp >= listArg["begin"]) {
                                currentMsg.delete();
                            }
                        })
                    }
                });
            }
            RSVPManagement.RSVP(interaction, 1, 1);
        }
        catch(err) {
            errorManagement.writeErrorMsg(interaction, 1, err);
            return 1;
        }
    },
};