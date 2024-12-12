import { ApplicationCommandOptionType } from 'discord.js';
import { QueryType, useMainPlayer } from 'discord-player';
import { checkVoiceChannelValidity } from './../tools/errorManagement.js';
import RSVP from './../tools/responseManagement.js';
import { replyErrorToInteraction } from './../tools/errorManagement.js';
import ytdl from 'ytdl-core';

export const data = {
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
};
export async function execute(interaction) {
	try {
		await interaction.deferReply();

		if (checkVoiceChannelValidity(interaction) != 0)
			return;
		const url = interaction.options.getString('url', true);
		let isYtUrl = false;
		const player = useMainPlayer();
		let searchResult = null;
		if (ytdl.validateURL(url)) { // YT
			isYtUrl = true;
			try {
				const info = await ytdl.getInfo(url);
				const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
				if (!audioFormat)
					return void replyErrorToInteraction(interaction, "noResultFound", "", true);
			} catch (error) { // Yes it is a lie
				return void replyErrorToInteraction(interaction, "noResultFound", "", true);
			}
		} else {
			isYtUrl = false;
			searchResult = await player
				.search(url, {
					requestedBy: interaction.user,
				})
			if (!searchResult || !searchResult.hasTracks())
				return void replyErrorToInteraction(interaction, "noResultFound", "", true);
		}

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
		} catch (err) {
			console.error(`An error was catch for the queue.connect in execute - playMusic => ${err}`)
			void player.deleteQueue(interaction.guildId);
			return void replyErrorToInteraction(interaction, "cantJoinVoiceChannel", "", true);
		}

		await RSVP(interaction, "cantJoinVoiceChannel", 2);
		if (isYtUrl){
			queue.addTracks(ytdl(url, { filter: 'audioonly' }));
		} else {
			searchResult.hasPlaylist() ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
		}
		if (!queue.playing) await queue.play();
	} catch (error) {// We don't care if a error occurs here
		console.error(`An error was catch in execute - playMusic => ${error}`)
		replyErrorToInteraction(interaction, "errorCommand", "", true);
	}
}