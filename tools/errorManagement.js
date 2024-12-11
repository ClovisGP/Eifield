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

export async function writeErrorMsg(interaction, codeError, errorLog="No Log", followUp=false) { //Beware if we have a replydefer
    if (followUp) {
        interaction.followUp(ErrorDescription[codeError]);
    } else {
        await interaction.reply(ErrorDescription[codeError]);
        setTimeout(() => interaction.deleteReply(), 30000);
    }
    console.log("ERROR : " + codeError + " - " + ErrorDescription[codeError] + "\r" + errorLog)
}

export function checkVoiceChannelValidity(interaction) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
        writeErrorMsg(interaction, 4);
        return 4;
    }
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
        writeErrorMsg(interaction, 5);
        return 5;
    }
    return 0;
}