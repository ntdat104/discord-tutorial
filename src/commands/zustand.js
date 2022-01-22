const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'zustand',
  description: 'Ví dụ về zustand commands',
  async execute(message, args) {
    const file = new MessageAttachment('src/assets/zustand.jpg');
    const exampleEmbed = new MessageEmbed()
      .setTitle('Some title')
      .setImage('attachment://zustand.jpg');

    message.channel.send({ embeds: [exampleEmbed], files: [file] });
    message.channel.send({ files: [file] });
  },
};
