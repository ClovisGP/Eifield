const ENG = {
    1: "Messages removed.",
    2: "Dice of ",
    3: "Error: you don't have access to this command.",
}

const FR = {
    1: "Les messages ont été supprimé.",
    2: "Dés de ",
    3: "Error: you don't have access to this command.",
}

module.exports = {
    /**
     * Function for respond to a interaction
     * @param {object} interaction The interaction which we want to respond
     * @param {number} sentenceCode The sentence code in the above list
     * @param {number} replyType The type of the reply : 0 - reply | 1 - editReply | 2 - followup
     * @param {string} sentenceEnd Add a string to the end of the reply
     */
    RSVP: async function(interaction, sentenceCode, replyType, sentenceEnd="") {
        if (replyType == 2) {
            interaction.followUp({ content: ENG[sentenceCode] + sentenceEnd, ephemeral: false });
        } else if (replyType == 1) {
            interaction.editReply({ content: ENG[sentenceCode] + sentenceEnd, ephemeral: false });
        } else {
            interaction.reply({ content: ENG[sentenceCode] + sentenceEnd, ephemeral: false });
        }
    },
   
};