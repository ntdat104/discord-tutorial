module.exports = {
  name: 'ping',
  description: 'Ví dụ về ping commands',
  execute(message, args) {
    // message.channel.send('pong! 😎');
    message.reply('pong! 😎');
  },
};
