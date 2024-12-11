import { checkVoiceChannelValidity } from './../tools/errorManagement.js';
import getTranslation from '../tools/languageManagement.js';

export const data = {
	"name": 'shuffle',
	"description": 'shuffle the queue!',
};

export async function execute(interaction, player) {
	if (checkVoiceChannelValidity(interaction) != 0)
		return;

	await interaction.deferReply();
	const queue = player.getQueue(interaction.guildId);
	if (!queue || !queue.playing) return void interaction.followUp({ content: getTranslation(interaction, 'nocurrentMusicPlayed') });
	try {
		queue.shuffle();
		trimString = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
		return void interaction.followUp({
			embeds: [
				{
					title: getTranslation(interaction, 'nowPlaying'),
					description: trimString(
						`${getTranslation(interaction, 'currentMusicPlayed')} **${queue.current.title}**! \n 🎶 | ${queue}! `,
						4095),
				},
			],
		});
	} catch (error) {
		console.log(error);
		return void interaction.followUp({
			content: getTranslation(interaction, 'errorUnknow'),
		});
	}
}