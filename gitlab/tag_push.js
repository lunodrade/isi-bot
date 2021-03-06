const Config = require("../config.json");
const Color = Config['color'];
const Emoji = Config['emoji'];

module.exports = {

    /////////////////////////////////////////////////// ISSUE //////////////////////////////////////////////////////
    tagpushEmbed: function (embedClass, json, avatar) {
        var embed = new embedClass();

        var proj = json['project'];

        embed.setColor(Color['push']);
        embed.setAuthor(json['user_name'], avatar);

        var tag = json['ref'].split('/').slice(2).join('/');
        embed.setTitle('Criou nova tag \`' + tag + '\`');
        var urlBaseCommit = proj['web_url']+'/-/tags/';
        embed.setURL(urlBaseCommit+tag);

        var commitsStr = "Commits que fazem parte dessa tag:\n";
        json['commits'].forEach(commit => {
            var commitId = commit['id'].substring(0, 8);
            var urlCommit = urlBaseCommit + commit['id'];
            var aCount = commit['added'].length;
            var mCount = commit['modified'].length;
            var rCount = commit['removed'].length;
            
            var changes = aCount + Emoji['added'] + " " +
                        mCount + Emoji['modified'] + " " +
                        rCount + Emoji['removed'];
            
            commitsStr += '[\`' + commitId + '\`]('+urlCommit+'): ' + commit['message'] + ' → ' + changes;
            commitsStr += "\n";
        });
        embed.setDescription(commitsStr.substring(0, 2000));

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")", true);

        embed.addField(tag, json['message'], true);

        embed.setFooter('Tag').setTimestamp();
       
        return embed;
    },
    
};