import { GuildMember } from 'discord.js';
import { replyErrorToInteraction } from './../tools/errorManagement.js';
import RSVP from './../tools/responseManagement.js';

export const data = {
	"name": 'resume',
	"description": 'Resume the current song',
};

export async function execute(interaction, player) {
	try {
		await interaction.deferReply();
		if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
			return void replyErrorToInteraction(interaction, "notInVoiceChannel", "", true);
		}

		if (interaction.guild.members.me.voice.channelId &&
			interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return void replyErrorToInteraction(interaction, "notInVoiceChannel", "", true);
		}

		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing)
			return void replyErrorToInteraction(interaction, "nocurrentMusicPlayed", "", true);
		const success = queue.setPaused(false);
		return void RSVP(interaction, success ? 'resume' : 'errorUnknow', 2);
	} catch (error) {// We don't care if a error occurs here
		console.error(`An error was catch in execute - resumeMusic => ${error}`)
		replyErrorToInteraction(interaction, "errorCommand", "", true);
	}
}