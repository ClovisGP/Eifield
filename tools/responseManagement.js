import getTranslation from "./languageManagement.js";

/**
 * Function to respond to an interaction
 * @param {{}}  objectToInteract The object to interact which we want to respond
 * @param {string}  sentenceName The sentence code
 * @param {number}  replyType The type of the reply : 0 - reply | 1 - editReply | 2 - followup
 * @param {string}  sentenceEnd Add a string to the end of the reply
 * @param {boolean} ephemeral Is the message is ephemeral
 */
export default async function RSVP(
    objectToInteract,
    sentenceName,
    replyType,
    sentenceEnd = "",
    ephemeral = false
) {
    try {
        if (replyType == 2) {
            objectToInteract.followUp({
                content: getTranslation(objectToInteract, sentenceName) + sentenceEnd,
                ephemeral: ephemeral
            });
        } else if (replyType == 1) {
            objectToInteract.editReply({
                content: getTranslation(objectToInteract, sentenceName) + sentenceEnd,
                ephemeral: ephemeral
            });
        } else {
            objectToInteract.reply({
                content: getTranslation(objectToInteract, sentenceName) + sentenceEnd,
                ephemeral: ephemeral
            });
        }
    } catch (error) {
        console.error(`An error was catch in RSVP => ${error}`);
    }
}