import french from './../languages/fr.json' assert { type: 'json' };
import english from './../languages/en.json' assert { type: 'json' };

/**
 * Function to respond to an interaction
 * @param {object}  interaction The interaction which we want to respond
 * @param {string}  sentenceName The sentence code
 * @param {number}  replyType The type of the reply : 0 - reply | 1 - editReply | 2 - followup
 * @param {string}  sentenceEnd Add a string to the end of the reply
 * @param {boolean} ephemeral Is the message is ephemeral
 */
export default async function RSVP(
    interaction,
    sentenceName,
    replyType,
    sentenceEnd = "",
    ephemeral = false
) {
    if (replyType == 2) {
        interaction.followUp({
            content: english[sentenceName] + sentenceEnd,
            ephemeral: ephemeral
        });
    } else if (replyType == 1) {
        interaction.editReply({
            content: english[sentenceName] + sentenceEnd,
            ephemeral: ephemeral
        });
    } else {
        interaction.reply({
            content: english[sentenceName] + sentenceEnd,
            ephemeral: ephemeral
        });
    }
}