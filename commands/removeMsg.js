module.exports = {
    removeMsg: function(msg, args) {
        if (!msg.author.discriminator === "3833") return;
        if (args[0] === "all") {
            if (!isNaN(args[1])) {
                msg.channel.bulkDelete(Number(args[1]) + 1)
                .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                .catch(console.error);
            } else {
                msg.channel.bulkDelete(6)
                .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                .catch(console.error);
            }
        }
        if (args[0] === "surgical-strike") {
            let listArg = [];
            for (index in args) {
                let argParse = args[index].split('_');
                if (argParse[0] === "end") {
                    if (!Date.parse(argParse[1])) {
                        console.error("Error");
                        return;
                    }
                    listArg["end"] = (Date(argParse[1]))
                } else if (argParse[0] === "begin") {
                    if (!Date.parse(argParse[1])) {
                        console.error("Error");
                        return;
                    }
                    listArg["begin"] = (Date(argParse[1]))
                } else if (argParse[0] === "name") {
                    listArg["name"] = argParse[1];
                }
            }
            if (!("end" in listArg)) return;
            if (!("begin" in listArg)) {
                if (listArg["end"].getTime() >= listArg["begin"].getTime()) {
                    console.error("Begin is older than End")
                    return;
                }
            }
        }
    }
};