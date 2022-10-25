const ErrorDescription = {
    1: "Error: An error occurs during the execution of the command.",
    2: "Error: An error occurs during the erasings of some messages.",
    3: "Error: you don't have access to this command.",
}

module.exports = {
    writeErrorMsg: async function(interaction, codeError, errorLog = "No Log") { //Beware if we have a replydefer
        await interaction.reply(ErrorDescription[codeError]);
        setTimeout(() => interaction.deleteReply(), 30000);
        console.log("ERROR : " + codeError + " - " + ErrorDescription[codeError] + "\r" + errorLog)
    },
};