import { checkVoiceChannelValidity } from './../tools/errorManagement.js';
import getTranslation from '../tools/languageManagement.js';

export const data = {
  "name": 'skip',
  "description": 'Skip a song!',
};
export async function execute(interaction, player) {
  if (checkVoiceChannelValidity(interaction) != 0)
    return;

  await interaction.deferReply();
  const queue = player.getQueue(interaction.guildId);
  if (!queue || !queue.playing) return void interaction.followUp({ content: getTranslation(interaction, 'nocurrentMusicPlayed') });
  const currentTrack = queue.current;
  const success = queue.skip();
  return void interaction.followUp({
    content: success ? `${getTranslation(interaction, 'skipped')} **${currentTrack}**!` : getTranslation(interaction, 'errorUnknow'),
  });
}