// Environment variables:
const { DISCORD_TOKEN } = require('./constants/env');
const { PREFIX } = require('../config.json');

// Require the necessary discord.js classes
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const { DisTube } = require('distube');

app.get('/', (_, res) => {
  return res.status(200).json({
    status: 200,
    message: 'Wake up Heroku successfully!',
  });
});
const timer = 25 * 60 * 1000; // 25 minutes
setInterval(() => {
  https.get(`https://discord-tutorial.herokuapp.com/`);
}, timer);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

const distube = new DisTube(client, {
  searchSongs: 10,
  searchCooldown: 30,
  leaveOnEmpty: false,
  leaveOnFinish: false,
  leaveOnStop: false,
});

client.commands = new Collection();
const commandFiles = fs
  .readdirSync('src/commands')
  .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// When the client is ready, run this code (only once)
client.on('ready', () => {
  console.log(`${client.user.username} is ready! 🚀`);
  client.user.setActivity(`nhạc 😎`, { type: 'PLAYING' }); // PLAYING, STREAMING, LISTENING, WATCHING, COMPETING
  client.user.setStatus('online'); // online, idle, dnd, invisible
});

// Login to Discord with your client's token
client.login(DISCORD_TOKEN);

// When a message is sent, run this code
client.on('messageCreate', (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).split(/ +/);

  const command = args.shift().toLowerCase();

  if (command === 'help') {
    client.commands.get('help').execute(message, args);
  }

  if (command === 'hello') {
    client.commands.get('hello').execute(message, args);
  }

  if (command === 'ping') {
    client.commands.get('ping').execute(message, args);
  }

  if (command === 'clear') {
    client.commands.get('clear').execute(message, args);
  }

  if (command === 'rules') {
    client.commands.get('rules').execute(message, args);
  }

  if (command === 'zustand') {
    client.commands.get('zustand').execute(message, args);
  }

  if (command === 'play') {
    if (!message.member.voice.channel) {
      return message.channel.send(
        'Bạn phải ở trong kênh thoại để chơi nhạc 👌.'
      );
    }
    distube.play(message, args.join(' '));
  }

  if (['repeat', 'loop'].includes(command)) {
    const mode = distube.setRepeatMode(message);
    message.channel.send(
      `Đã bật chế độ phát lại \`${
        mode
          ? mode === 2
            ? 'Tất cả bài hát 😍'
            : 'Bài hát hiện tại 🎶'
          : 'Off'
      }\``
    );
  }

  if (command === 'stop') {
    distube.stop(message);
    message.channel.send('Đã dừng phát 👌.');
  }

  if (command === 'leave') {
    distube.voices.get(message)?.leave();
    message.channel.send(`Đã rời khỏi voice channel 😢.`);
  }

  if (command === 'resume') distube.resume(message);

  if (command === 'pause') distube.pause(message);

  if (command === 'skip') distube.skip(message);

  if (command === 'queue') {
    const queue = distube.getQueue(message);
    if (!queue) {
      message.channel.send('Không có bài hát nào trong hàng đợi 🤷‍♂️.');
    } else {
      message.channel.send(
        `Danh sách hàng đợi 🎶:\n${queue.songs
          .map(
            (song, id) =>
              `**${id ? id : 'Đang phát 🎧'}**. ${song.name} - \`${
                song.formattedDuration
              }\``
          )
          .slice(0, 10)
          .join('\n')}`
      );
    }
  }

  if (
    [`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(
      command
    )
  ) {
    const filter = distube.setFilter(message, command);
    message.channel.send(
      `Dánh sách bộ lọc hàng đợi 🎵: ${filter.join(', ') || 'Off'}`
    );
  }
});

const status = (queue) =>
  `Âm lượng 🔊: \`${queue.volume}%\` | Bộ lọc 🔑: \`${
    queue.filters.join(', ') || 'Tắt'
  }\` | Lặp lại 📢: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? 'Tất cả bài hát 😍'
        : 'Bài hát hiện tại 🎶'
      : 'Tắt'
  }\` | Tự động phát 🎧: \`${queue.autoplay ? 'Bật' : 'Tắt'}\``;

// DisTube event listeners, more in the documentation page
distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `Đang phát 🎶 \`${song.name}\` - \`${
        song.formattedDuration
      }\`\nĐược yêu cầu bởi 😍: ${song.user}\n${status(queue)}`
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `Đã thêm ${song.name} - \`${song.formattedDuration}\` vào hàng đợi từ ${song.user} 😍`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `Đã thêm \`${playlist.name}\` danh sách (${
        playlist.songs.length
      } bài hát) vào hàng đợi 😍\n${status(queue)}`
    )
  )
  .on('error', (textChannel, e) => {
    console.error(e);
    textChannel.send(`Đã có một lỗi xảy ra 😥: ${e.slice(0, 2000)}`);
  })
  .on('finish', (queue) =>
    queue.textChannel.send('Đã phát hết danh sách bài hát 🎶.')
  )
  .on('finishSong', (queue) =>
    queue.textChannel.send('Đã phát hết bài hát 🎶.')
  )
  .on('disconnect', (queue) => queue.textChannel.send('Ngắt kết nối 🔌.'))
  .on('empty', (queue) =>
    queue.textChannel.send('Không có bài hát nào trong danh sách đợi 😥.')
  )
  // DisTubeOptions.searchSongs > 1
  .on('searchResult', (message, result) => {
    let i = 0;
    message.channel.send(
      `**Chọn một trong các bài hát bên dưới 😍🎶**\n${result
        .map(
          (song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
        )
        .join('\n')}\n*Điền số thứ tự bài hát mà bạn chọn 💪.*`
    );
  })
  .on('searchCancel', (message) =>
    message.channel.send(`Đã hủy bỏ việc tìm kiếm 😥.`)
  )
  .on('searchInvalidAnswer', (message) =>
    message.channel.send(`Số thứ tự không hợp lệ 😥.`)
  )
  .on('searchNoResult', (message) =>
    message.channel.send(`Không tìm thấy bài hát 😥.`)
  )
  .on('searchDone', () => {});
