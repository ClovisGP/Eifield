import { checkVoiceChannelValidity } from './../tools/errorManagement.js';
import { replyErrorToInteraction } from './../tools/errorManagement.js';
import RSVP from '../tools/responseManagement.js';

export const data = {
	"name": 'stop',
	"description": 'Stop all songs in the queue!',
};

export async function execute(interaction, player) {
	try {
		await interaction.deferReply();
		if (checkVoiceChannelValidity(interaction) != 0)
			return;
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing)
			return void replyErrorToInteraction(interaction, 'nocurrentMusicPlayed', "", true);
		queue.destroy();
		return void RSVP(interaction, 'playerStopped', 2);
	} catch (error) {// We don't care if a error occurs here
		console.error(`An error was catch in execute - shuffleMusic => ${error}`)
		replyErrorToInteraction(interaction, "errorCommand", "", true);
	}
}