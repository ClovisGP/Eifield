import { checkVoiceChannelValidity } from './../tools/errorManagement.js';
import { replyErrorToInteraction } from './../tools/errorManagement.js';
import RSVP from '../tools/responseManagement.js';

export const data = {
	"name": 'skip',
	"description": 'Skip a song!',
};
export async function execute(interaction, player) {
	try {
		await interaction.deferReply();
		if (checkVoiceChannelValidity(interaction) != 0)
			return;
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing)
			return void replyErrorToInteraction(interaction, 'nocurrentMusicPlayed', "", true);
		const currentTrack = queue.current;
		const success = queue.skip();
		return void RSVP(interaction, success ? 'skipped' : 'errorUnknow', 2, success ? ` **${currentTrack}**!` : '');
	} catch (error) {// We don't care if a error occurs here
		console.error(`An error was catch in execute - shuffleMusic => ${error}`)
		replyErrorToInteraction(interaction, "errorCommand", "", true);
	}
}