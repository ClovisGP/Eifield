import { GuildMember } from 'discord.js';

const ErrorDescription = {
    1: "Error: An error occurs during the execution of the command.",
    2: "Error: An error occurs during the erasings of some messages.",
    3: "Error: you don't have access to this command.",
    4: "Error: You are not in a voice channel.",
    5: "Error: You are not in the same voice channel than the Eifield.",
    6: "❌ | No music is being played.",
    7: "❌ | Something went wrong.",
    8: "Error: You are not in the same voice channel than the Eifield.",
    9: "Error: You are not in the same voice channel than the Eifield.",
    10: "Error: You are not in the same voice channel than the Eifield.",
}

/**
 * Reply an error to an interaction
 * @param {{}} interaction The interaction object
 * @param {number} codeError The error code
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
        console.error(`Error - replyErrorToInteraction: ${codeError} - ${ErrorDescription[codeError]}${errorLog.length > 0 ? " ".concat(errorLog) : ""}`);
        if (followUp) {
            interaction.followUp(ErrorDescription[codeError]);
        } else {
            await interaction.reply(ErrorDescription[codeError]);
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
            replyErrorToInteraction(interaction, 4);
            return 4;
        }
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            replyErrorToInteraction(interaction, 5);
            return 5;
        }
        return 0;
    } catch (error) {
        console.error(`An error was catch in checkVoiceChannelValidity => ${error}`);
        replyErrorToInteraction(interaction, 1);
        return 1;
    }
}