const ENG = {
    1: "Messages removed.",
    2: "Error: An error occurs during the erasings of some messages.",
    3: "Error: you don't have access to this command.",
}

const FR = {
    1: "Les messages ont été supprimé.",
    2: "Error: An error occurs during the erasings of some messages.",
    3: "Error: you don't have access to this command.",
}

module.exports = {
    /**
     * Function for respond to a interaction
     * @param {object} interaction The interaction which we want to respond
     * @param {number} sentenceCode The sentence code in the above list
     * @param {number} replyType The type of the reply : 0 - reply | 1 - editReply | 2 - followup
     */
    RSVP: async function(interaction, sentenceCode, replyType) {
        if (replyType == 2) {
            interaction.followUp(ENG[sentenceCode]);
        } else if (replyType == 1) {
            interaction.editReply(ENG[sentenceCode]);
        } else {
            interaction.reply(ENG[sentenceCode]);
        }
    },
    /**
     * Function for respond to a interaction with a custom sentence. Beware of the translation
     * @param {object} interaction The interaction which we want to respond
     * @param {number} sentenceCode The sentence
     * @param {number} replyType The type of the reply : 0 - reply | 1 - editReply | 2 - followup
     */
    RSVPCustom: async function(interaction, sentence, replyType) {
        if (replyType == 2) {
            interaction.followUp(sentence);
        } else if (replyType == 1) {
            interaction.editReply(sentence);
        } else {
            interaction.reply(sentence);
        }
    },
};