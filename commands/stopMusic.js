const errorManagement = require('./../tools/errorManagement');

module.exports = {
    data: {
  "name": 'stop',
  "description": 'Stop all songs in the queue!',
    },
  async execute(interaction, player) {
    if (errorManagement.checkVoiceChannelValidity(interaction) != 0)
        return;

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    queue.destroy();
    return void interaction.followUp({content: '🛑 | Stopped the player!'});
  },
};