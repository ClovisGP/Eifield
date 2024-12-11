import { GuildMember } from 'discord.js';
import getTranslation from './languageManagement.js';

/**
 * Reply an error to an interaction
 * @param {{}} interaction The interaction object
 * @param {string} codeError The error code
 * @param {string} errorLog Optional, the text following the message
 * @param {boolean} followUp Optional, is the message a followup or not
 */
export async function replyErrorToInteraction(
    interaction,
    codeError,
    errorLog = "",
    followUp = false
) {
    try {
        console.error(`Error - replyErrorToInteraction: ${codeError} - ${getTranslation(interaction, codeError)}${errorLog.length > 0 ? " ".concat(errorLog) : ""}`);
        if (followUp) {
            interaction.followUp(getTranslation(interaction, codeError));
        } else {
            await interaction.reply(getTranslation(interaction, codeError));
            setTimeout(() => interaction.deleteReply(), 30000);
        }
    } catch (error) {
        console.error(`An error was catch in replyErrorToInteraction => ${error}`);
    }
}

/**
 * Checks the validity of the voice channel
 * @param {{}} interaction The interaction object
 * @returns 0 If it is ok or the codeError corresponding to the message sent
 */
export function checkVoiceChannelValidity(
    interaction
) {
    try {
        if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
            replyErrorToInteraction(interaction, "notInVoiceChannel");
            return 4;
        }
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            replyErrorToInteraction(interaction, "notInSameVoiceChannel");
            return 5;
        }
        return 0;
    } catch (error) {
        console.error(`An error was catch in checkVoiceChannelValidity => ${error}`);
        replyErrorToInteraction(interaction, "errorCommand");
        return 1;
    }
}