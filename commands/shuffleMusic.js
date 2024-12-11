import { checkVoiceChannelValidity } from './../tools/errorManagement.js';

export const data = {
  "name": 'shuffle',
  "description": 'shuffle the queue!',
};
export async function execute(interaction, player) {
  if (checkVoiceChannelValidity(interaction) != 0)
    return;

  await interaction.deferReply();
  const queue = player.getQueue(interaction.guildId);
  if (!queue || !queue.playing) return void interaction.followUp({ content: '❌ | No music is being played!' });
  try {
    queue.shuffle();
    trimString = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
    return void interaction.followUp({
      embeds: [
        {
          title: 'Now Playing',
          description: trimString(
            `The Current song playing is 🎶 | **${queue.current.title}**! \n 🎶 | ${queue}! `,
            4095),
        },
      ],
    });
  } catch (error) {
    console.log(error);
    return void interaction.followUp({
      content: '❌ | Something went wrong!',
    });
  }
}