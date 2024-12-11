import { GuildMember } from 'discord.js';
import getTranslation from '../tools/languageManagement.js';

export const data = {
	"name": 'resume',
	"description": 'Resume the current song',
};
export async function execute(interaction, player) {
	if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
		return void interaction.reply({
			content: getTranslation(interaction, 'notInVoiceChannel'),
			ephemeral: true,
		});
	}

	if (interaction.guild.members.me.voice.channelId &&
		interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
		return void interaction.reply({
			content: getTranslation(interaction, 'notInVoiceChannel'),
			ephemeral: true,
		});
	}

	await interaction.deferReply();
	const queue = player.getQueue(interaction.guildId);
	if (!queue || !queue.playing)
		return void interaction.followUp({
			content: getTranslation(interaction, 'nocurrentMusicPlayed'),
		});
	const success = queue.setPaused(false);
	return void interaction.followUp({
		content: success ? getTranslation(interaction, 'resume') : getTranslation(interaction, 'errorUnknow'),
	});
}