const errorManagement = require('./../tools/errorManagement');
const { RSVP } = require('./../tools/responseManagement');

module.exports = {
    data: {
      "name": 'pause',
      "description": 'Pause current song.',
},
  async execute(interaction, player) {
    if (errorManagement.checkVoiceChannelValidity(interaction) != 0)
      return;
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void errorManagement.writeErrorMsg(interaction, 6, "", true);
    const success = queue.setPaused(true);
    if (!success)
      return void errorManagement.writeErrorMsg(interaction, 6, "", true);
    return void RSVP(interaction, "Paused", 2)
  },
};