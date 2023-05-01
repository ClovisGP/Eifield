const french = require('./../languages/fr.json');
const english = require('./../languages/en.json');

module.exports = {
    /**
     * Function for respond to a interaction
     * @param {object} interaction The interaction which we want to respond
     * @param {string} sentenceName The sentence code in the above list
     * @param {number} replyType The type of the reply : 0 - reply | 1 - editReply | 2 - followup
     * @param {string} sentenceEnd Add a string to the end of the reply
     */
    RSVP: async function(interaction, sentenceName, replyType, sentenceEnd = "", ephemeral = false) {
        if (replyType == 2) {
            interaction.followUp({ content: english[sentenceName] + sentenceEnd, ephemeral: ephemeral });
        } else if (replyType == 1) {
            interaction.editReply({ content: english[sentenceName] + sentenceEnd, ephemeral: ephemeral });
        } else {
            interaction.reply({ content: english[sentenceName] + sentenceEnd, ephemeral: ephemeral });
        }
    },
   
};