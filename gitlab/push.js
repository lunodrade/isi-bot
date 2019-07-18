const Config = require('../config.json');
const Color = Config['color'];
const Emoji = Config['emoji'];

module.exports = {
  /////////////////////////////////////////////////// ISSUE //////////////////////////////////////////////////////
  pushEmbed: function(embedClass, json, avatar) {
    var embed = new embedClass();

    var proj = json['project'];

    embed.setColor(Color['push']);
    embed.setAuthor(json['user_name'], avatar);

    var branch = json['ref']
      .split('/')
      .slice(2)
      .join('/');
    embed.setTitle('Executou push na branch `' + branch + '`');
    var urlBaseCommit = proj['web_url'] + '/commit/';
    embed.setURL(urlBaseCommit + json['checkout_sha']);

    var commitsStr = '';
    json['commits'].forEach(commit => {
      var commitId = commit['id'].substring(0, 8);
      var urlCommit = urlBaseCommit + commit['id'];

      //TODO: Colocar as 7 linhas, disso e o tag-push numa lib util
      var aCount = commit['added'].length;
      var mCount = commit['modified'].length;
      var rCount = commit['removed'].length;

      var changes =
        aCount +
        Emoji['added'] +
        ' ' +
        mCount +
        Emoji['modified'] +
        ' ' +
        rCount +
        Emoji['removed'];

      commitsStr +=
        '[`' +
        commitId +
        '`](' +
        urlCommit +
        '): ' +
        commit['message'] +
        ' → ' +
        changes;
      commitsStr += '\n';
    });
    embed.setDescription(commitsStr.substring(0, 2000));

    embed.addField(
      proj['namespace'],
      '[' + proj['path_with_namespace'] + '](' + proj['homepage'] + ')',
      true
    );

    let urlBranch = proj['web_url'] + '/tree/' + branch;
    embed.addField('Branch', `[${branch}](${urlBranch})`, true);

    embed.setFooter('Push').setTimestamp();

    return embed;
  },

  /////////////////////////////////////////////////// ISSUE //////////////////////////////////////////////////////
  newBranchEmbed: function(embedClass, json, avatar) {
    var embed = new embedClass();

    var proj = json['project'];

    embed.setColor(Color['update']);
    embed.setAuthor(json['user_name'], avatar);

    var branch = json['ref']
      .split('/')
      .slice(2)
      .join('/');
    embed.setTitle('Nova branch criada: `' + branch + '`');
    let urlBranch = proj['web_url'] + '/tree/' + branch;
    embed.setURL(urlBranch);

    embed.addField(
      proj['namespace'],
      '[' + proj['path_with_namespace'] + '](' + proj['homepage'] + ')',
      true
    );

    embed.addField('Branch default', proj['default_branch'], true);

    embed.setFooter('New branch').setTimestamp();

    return embed;
  }
};
