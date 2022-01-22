module.exports = {
  name: 'help',
  description: 'Ví dụ về help commands',
  execute(message, args) {
    message.reply(`\n!hello - Hiển thị lời chào. \n!play - Chơi nhạc`);
  },
};
