const errorManagement = require('./../tools/errorManagement');

module.exports = {
    removeMsg: function(msg, args) {
        try {
            if (!msg.author.discriminator === "3833") {
                errorManagement.writeErrorMsg(msg, 4);
                return 4;
            }
            if (args[0] === "napalm") {
                if (!isNaN(args[1])) {
                    if ((Number(args[1]) + 1) > 21 || (Number(args[1]) + 1) < 1) {
                        errorManagement.writeErrorMsg(msg, 10);
                        return 10;
                    }
                    msg.channel.bulkDelete(Number(args[1]) + 1)
                    .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                    .catch(console.error, errorManagement.writeErrorMsg(msg, 9)
                    );
                } else {
                    msg.channel.bulkDelete(6)
                    .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                    .catch(console.error, errorManagement.writeErrorMsg(msg, 9));
                }
            }
            if (args[0] === "tactical-strike") {
                let listArg = [];
                for (index in args) {
                    let argParse = args[index].split('_');
                    if (argParse[0] === "end") {
                        if (!Date.parse(argParse[1])) {
                            errorManagement.writeErrorMsg(msg, 5);
                            return 5;
                        }
                        listArg["end"] = (new Date(argParse[1]).getTime())
                    } else if (argParse[0] === "begin") {
                        if (!Date.parse(argParse[1])) {
                            errorManagement.writeErrorMsg(msg, 6);
                            return 6;
                        }
                        listArg["begin"] = (new Date(argParse[1]).getTime())
                    } else if (argParse[0] === "name") {
                        listArg["name"] = argParse[1];
                    }
                }
                if (!("begin" in listArg)) {
                    errorManagement.writeErrorMsg(msg, 7);
                    return 7;
                }
                if (!("end" in listArg)) {
                    if (listArg["begin"] >= listArg["end"]) {
                        errorManagement.writeErrorMsg(msg, 8);
                        return 8;
                    }
                }
                if ("name" in listArg) {
                    msg.channel.messages.fetch({ limit: 100 }).then(messages => {
                        if ("end" in listArg) {
                            messages.forEach(function (currentMsg) {
                                if (currentMsg.createdTimestamp >= listArg["begin"] && currentMsg.createdTimestamp <= listArg["end"] && listArg["name"] === msg.author.username) {
                                    currentMsg.delete();
                                }
                            })
                        } else {
                            messages.forEach(function (currentMsg) {
                                if (currentMsg.createdTimestamp >= listArg["begin"] && listArg["name"] === msg.author.username) {
                                    currentMsg.delete();
                                }
                            })
                        }
                    });
                } else {
                    msg.channel.messages.fetch({ limit: 100 }).then(messages => {
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
            }
        }
        catch(err) {
            errorManagement.writeErrorMsg(msg, 11);
            return 11;
        }
    },
    writeHelp: function(language) {
        if (language === "FR") {
            return "!remove or !rm :\r\
            *Attention, l'accès à cette commande est reduit*\r\
            **ARGUMENTS** ->\r\
                \t**napalm** :\r\
                    \t\tSi il n'y a pas d'argument, cinq messages seront supprimés\r\
                        \t\t\tExemple : !rm napalm\r\
                    \t\t*-Optionnel-* Le nombre de messages que vous voulez supprimer\r\
                        \t\t\tExemple : !rm napalm 8\r\
                \t**tactical-strike**\r\
                    \tbegin_   : La date à partir de laquelle le bot commencera d'agir. La date doit être au format YYYY-MM-DDTHH:mm\r\
                    \tend_ : *-Optionnel-* La date jusqu'à laquelle le bot va agir. La date doit être au format YYYY-MM-DDTHH:mm et doit être plus recente que *begin*\r\
                    \tname_  : *-Optionnel-* Seuls les messages de cet utilisateur seront supprimés\r\
                    \t\tExemple : !rm surgical-strike end_2022-06-11T00:00 begin_2022-06-13T15:00 name_Arlui\r\r";
        }
        return "!remove or !rm :\r\
            *Carefull, the access to this command is limited*\r\
            **ARGUMENTS** ->\r\
                \t**napalm** :\r\
                    \t\tIf no argument, five messages will be erased\r\
                        \t\t\tExample : !rm napalm\r\
                    \t\t*-Optional-* Number of messages which want to erase\r\
                        \t\t\tExample : !rm napalm 8\r\
                \t**tactical-strike**\r\
                    \tbegin_   : The date from when the bot will begin to strike. The date must to be in the format YYYY-MM-DDTHH:mm\r\
                    \tend_ : *-Optional-* The date until the bot will strike. The date must to be in the format YYYY-MM-DDTHH:mm and early than *begin*\r\
                    \tname_  : *-Optional-* The messages of only this user will be erased\r\
                    \t\tExample : !rm surgical-strike end_2022-06-11T00:00 begin_2022-06-13T15:00 name_Arlui\r\r";
    }
};