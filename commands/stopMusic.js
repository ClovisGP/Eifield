import { checkVoiceChannelValidity } from './../tools/errorManagement.js';

export const data = {
  "name": 'stop',
  "description": 'Stop all songs in the queue!',
};

export async function execute(interaction, player) {
  if (checkVoiceChannelValidity(interaction) != 0)
    return;

  await interaction.deferReply();
  const queue = player.getQueue(interaction.guildId);
  if (!queue || !queue.playing)
    return void interaction.followUp({
      content: '❌ | No music is being played!',
    });
  queue.destroy();
  return void interaction.followUp({ content: '🛑 | Stopped the player!' });
}