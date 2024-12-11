import { checkVoiceChannelValidity, replyErrorToInteraction } from './../tools/errorManagement.js';
import RSVP from './../tools/responseManagement.js';

export const data = {
	"name": 'pause',
	"description": 'Pause current song.',
};
export async function execute(interaction, player) {
	if (checkVoiceChannelValidity(interaction) != 0)
		return;
	await interaction.deferReply();
	const queue = player.getQueue(interaction.guildId);
	if (!queue || !queue.playing)
		return void replyErrorToInteraction(interaction, 6, "", true);
	const success = queue.setPaused(true);
	if (!success)
		return void replyErrorToInteraction(interaction, 6, "", true);
	return void RSVP(interaction, "Paused", 2);
}