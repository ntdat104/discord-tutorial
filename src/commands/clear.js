module.exports = {
  name: 'clear',
  description: 'Ví dụ về clear commands',
  async execute(message, args) {
    if (!args[0])
      return message.reply('Bạn cần xác định số lượng tin nhắn cần xóa.');

    if (isNaN(args[0])) return message.reply('Bạn phải nhập số.');

    if (args[0] > 100)
      return message.reply('Bạn không thể xóa hơn 100 tin nhắn.');

    if (args[0] < 1) return message.reply('Bạn phải nhập số lớn hơn 1.');

    await message.channel.messages
      .fetch({ limit: args[0] })
      .then((messages) => {
        message.channel.bulkDelete(messages);
      });
  },
};
