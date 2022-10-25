const errorManagement = require('./../tools/errorManagement');

module.exports = {
    data: {
  "name": 'skip',
  "description": 'Skip a song!',
    },
  async execute(interaction, player) {
    if (errorManagement.checkVoiceChannelValidity(interaction) != 0)
        return;

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return void interaction.followUp({content: '❌ | No music is being played!'});
    const currentTrack = queue.current;
    const success = queue.skip();
    return void interaction.followUp({
      content: success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Something went wrong!',
    });
  },
};