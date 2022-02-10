const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'meeting',
  description: 'Ví dụ về meeting commands',
  async execute(message, args) {
    if (!args[0])
      return message.reply('Bạn cần xác định số phút tối đa cho cuộc họp.');

    if (isNaN(args[0])) return message.reply('Bạn phải nhập số.');

    if (args[0] < 1) return message.reply('Bạn phải nhập số lớn hơn 1.');

    const today = new Date();

    const exampleEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(
        `(${today.toLocaleDateString(`en-GB`)}, ${today.toLocaleTimeString()})\nSimplize vừa tạo cuộc họp trong vòng ${
          args[0]
        } phút.`
      )
      .setURL('https://simplize.vn/')
      .setAuthor({
        name: 'Simplize',
        iconURL:
          'https://scontent.fhan2-2.fna.fbcdn.net/v/t39.30808-6/260492218_217277990555282_5841902606144127931_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=JIeXezwDzT0AX9rad-i&_nc_ht=scontent.fhan2-2.fna&oh=00_AT9wxaHMa0r4ov4GO9j1W1FeMx7Lb8Se8UmsPf8fuAitRA&oe=62090991',
        url: 'https://simplize.vn/',
      })
      .setDescription(
        `Cuộc họp được tạo bởi Simplize kéo dài trong ${args[0]} phút, và sẽ có thông báo khi hết giờ.`
      )
      .setThumbnail(
        'https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/264713997_217280843888330_8213270265970594203_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=e3f864&_nc_ohc=YTB2kEBmyksAX9Wb4bK&tn=GNv8M5kczN7IjRif&_nc_ht=scontent.fhan2-4.fna&oh=00_AT_48k82YF8Do-xCH4YL7EcDlQFA4TnBQTn1DB7WwY6nAA&oe=6209F4C4'
      )
      .setImage(
        'https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/264713997_217280843888330_8213270265970594203_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=e3f864&_nc_ohc=YTB2kEBmyksAX9Wb4bK&tn=GNv8M5kczN7IjRif&_nc_ht=scontent.fhan2-4.fna&oh=00_AT_48k82YF8Do-xCH4YL7EcDlQFA4TnBQTn1DB7WwY6nAA&oe=6209F4C4'
      )
      .setTimestamp()
      .setFooter({
        text: 'Simplize',
        iconURL: 'https://simplize.vn/',
      });

    message.channel.send({ embeds: [exampleEmbed] });

    setTimeout(() => {
      message.channel.send(
        `Hết giờ cuộc họp, các bạn hãy quay trở lại làm việc.`
      );
    }, args[0] * 60 * 1000);
  },
};
