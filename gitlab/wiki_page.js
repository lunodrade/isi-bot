const Config = require('../config.json');
const Color = Config['color'];
const Emoji = Config['emoji'];

module.exports = {
  /////////////////////////////////////////////////// ISSUE //////////////////////////////////////////////////////
  createEmbed: function(embedClass, json, avatar) {
    var embed = new embedClass();

    var user = json['user'];
    var attr = json['object_attributes'];
    var proj = json['project'];

    embed.setColor(Color['create']);
    embed.setAuthor(user['name'], avatar);

    embed.setTitle('Criou uma nova página na wiki: `' + attr['title'] + '`');
    embed.setURL(attr['url']);

    var format = '';
    //if(attr['format'] == 'markdown')
    //    format = 'md'; //**\n**
    embed.setDescription(format + '\n' + attr['content'].substring(0, 2000));

    embed.addField(
      proj['namespace'],
      '[' + proj['path_with_namespace'] + '](' + proj['homepage'] + ')',
      true
    );
    embed.addField('Commit', attr['message'], true);

    embed.setFooter('Wiki create').setTimestamp();

    return embed;
  },
  /////////////////////////////////////////////////// ISSUE //////////////////////////////////////////////////////
  updateEmbed: function(embedClass, json, avatar) {
    var embed = new embedClass();

    var user = json['user'];
    var attr = json['object_attributes'];
    var proj = json['project'];

    embed.setColor(Color['update']);
    embed.setAuthor(user['name'], avatar);

    embed.setTitle('Atualizou uma página na wiki: `' + attr['title'] + '`');
    embed.setURL(attr['url']);

    var format = '';
    //if(attr['format'] == 'markdown')
    //    format = 'md';
    //TODO limitar conteudo do content pra x caracteres
    let content = attr['content'];
    embed.setDescription(format + '\n' + content.substring(0, 2000));

    embed.addField(
      proj['namespace'],
      '[' + proj['path_with_namespace'] + '](' + proj['homepage'] + ')',
      true
    );
    embed.addField('Commit', attr['message'], true);

    embed.setFooter('Wiki update').setTimestamp();

    return embed;
  },
  /////////////////////////////////////////////////// ISSUE //////////////////////////////////////////////////////
  deleteEmbed: function(embedClass, json, avatar) {
    var embed = new embedClass();

    var user = json['user'];
    var attr = json['object_attributes'];
    var proj = json['project'];

    embed.setColor(Color['delete']);
    embed.setAuthor(user['name'], avatar);

    embed.setTitle('Deletou uma página na wiki: `' + attr['title'] + '`');

    embed.addField(
      proj['namespace'],
      '[' + proj['path_with_namespace'] + '](' + proj['homepage'] + ')',
      true
    );

    embed.setFooter('Wiki delete').setTimestamp();

    return embed;
  }
};
