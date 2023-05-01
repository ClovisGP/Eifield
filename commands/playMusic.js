const {GuildMember, ApplicationCommandOptionType } = require('discord.js');
const {QueryType} = require('discord-player');
const errorManagement = require('./../tools/errorManagement');
const RSVPManagement = require('./../tools/responseManagement');
const { RSVP } = require('./../tools/responseManagement');

module.exports = {
  data: {
  "name": "play",
  "description": 'Play a song in your current voice channel',
  "options": [
    {
      "name": 'url',
      "type": ApplicationCommandOptionType.String,
      "description": 'The url of the song you want to play',
      "required": true,
    },
  ],
  },
  async execute(interaction, player) {
    try {
      if (errorManagement.checkVoiceChannelValidity(interaction) != 0)
        return;

      await interaction.deferReply();
      const url = interaction.options.getString('url');
      const searchResult = await player
        .search(url, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch(() => {});
      if (!searchResult || !searchResult.tracks.length)
        return void RSVP(interaction, noResultFound, 2);

      const queue = await player.createQueue(interaction.guild, {
        ytdlOptions: {
				quality: "highest",
				filter: "audioonly",
				highWaterMark: 1 << 30,
				dlChunkSize: 0,
			},
        metadata: interaction.channel,
      });

      try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
      } catch {
        void player.deleteQueue(interaction.guildId);
        return void RSVP(interaction, cantJoinVoiceChannel, 2);
      }

      await RSVP(interaction, cantJoinVoiceChannel, 2);
      searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play();
    } catch (error) {
      RSVP(interaction, SomethingWentWrong, 2);
    }
  },
};