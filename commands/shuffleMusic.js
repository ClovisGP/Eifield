import { checkVoiceChannelValidity } from './../tools/errorManagement.js';
import getTranslation from '../tools/languageManagement.js';
import { replyErrorToInteraction } from './../tools/errorManagement.js';

export const data = {
	"name": 'shuffle',
	"description": 'shuffle the queue!',
};

export async function execute(interaction, player) {
	try {
		await interaction.deferReply();
		if (checkVoiceChannelValidity(interaction) != 0)
			return;
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing)
			return void replyErrorToInteraction(interaction, 'nocurrentMusicPlayed', "", true);
		queue.shuffle();
		trimString = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
		return void interaction.followUp({
			embeds: [
				{
					title: getTranslation(interaction, 'nowPlaying'),
					description: trimString(
						`${getTranslation(interaction, 'currentMusicPlayed')} ${queue.current.title}.\n ${queue} `,
						4095),
				},
			],
		});
	} catch (error) {// We don't care if a error occurs here
		console.error(`An error was catch in execute - shuffleMusic => ${error}`)
		replyErrorToInteraction(interaction, "errorCommand", "", true);
	}
}