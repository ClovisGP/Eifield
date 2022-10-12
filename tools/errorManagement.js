const ErrorDescription = {
    1: "Error: An error occurs during the execution of the command.",
}

module.exports = {
    writeErrorMsg: async function(interaction, codeError, errorLog = "No Log") {

        await interaction.reply(ErrorDescription[codeError]);
        setTimeout(() => interaction.deleteReply(), 30000);
        console.log("ERROR : " + codeError + " - " + ErrorDescription[codeError] + "\r" + errorLog)
    },
};