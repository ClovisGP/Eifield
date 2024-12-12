import { checkVoiceChannelValidity, replyErrorToInteraction } from './../tools/errorManagement.js';
import RSVP from './../tools/responseManagement.js';

export const data = {
	"name": 'pause',
	"description": 'Pause current song.',
};
export async function execute(interaction, player) {
	try {
		if (checkVoiceChannelValidity(interaction) != 0)
			return;
		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing)
			return void replyErrorToInteraction(interaction, "notInSameVoiceChannel", "", true);
		const success = queue.setPaused(true);
		if (!success)
			return void replyErrorToInteraction(interaction, "notInSameVoiceChannel", "", true);
		return void RSVP(interaction, "playerStopped", 2);
	} catch (error) { // We don't care if a error occurs here
        console.error(`An error was catch in execute - pauseMusic => ${err}`)
        replyErrorToInteraction(interaction, "errorCommand", "", true);
	}
}