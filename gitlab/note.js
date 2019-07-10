const Config = require("../config.json");
const Color = Config['color'];
const Emoji = Config['emoji'];

module.exports = {

    /////////////////////////////////////////////////// ISSUE //////////////////////////////////////////////////////
    issueEmbed: function (embedClass, json, avatar) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var issue = json['issue'];

        embed.setColor(Color['note']);
        embed.setAuthor(user['name'], avatar);

        embed.setTitle('Comentou na Issue #' + issue['iid'] + ': ' + issue['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description'].substring(0, 2000));

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")", true);
        embed.addField('due date', issue['due_date'], true);

        embed.setFooter('Note issue').setTimestamp();
       
        return embed;
    },

    /////////////////////////////////////////////////// CLOSE //////////////////////////////////////////////////////
    commitEmbed: function (embedClass, json, avatar) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var commit = json['commit'];

        embed.setColor(Color['note']);
        embed.setAuthor(user['name'], avatar);

        var commitId = commit['id'].substring(0, 8);
        embed.setTitle('Comentou no Commit \`' + commitId + '\`: \`' + commit['message']+ '\`');
        embed.setURL(attr['url']);
        embed.setDescription('\`\`\`' + attr['description'] + '\`\`\`');

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")", true);

        embed.setFooter('Note commmit').setTimestamp();
       
        return embed;
    },

    /////////////////////////////////////////////////// CLOSE //////////////////////////////////////////////////////
    snippetEmbed: function (embedClass, json, avatar) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var snippet = json['snippet'];

        embed.setColor(Color['note']);
        embed.setAuthor(user['name'], avatar);

        var snippetId = snippet['id'];
        embed.setTitle('Comentou no Snippet \`' + snippetId + '\`: \`' + snippet['title']+ '\`');
        embed.setURL(attr['url']);
        let description = '**Descrição:**\n'+snippet['description']+'\n\n**Conteúdo:**\n\`\`\`\n' + snippet['content'] + '\`\`\`';
        embed.setDescription(description.substr(0, 2000));

        embed.addField('Comentário', attr['description']);

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")", true);

        embed.setFooter('Note commmit').setTimestamp();
       
        return embed;
    },

    /////////////////////////////////////////////////// CLOSE //////////////////////////////////////////////////////
    mergerequestEmbed: function (embedClass, json, avatar) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var mReq = json['merge_request'];

        embed.setColor(Color['note']);
        embed.setAuthor(user['name'], avatar);

        var mReqID = mReq['iid'];
        embed.setTitle('Comentou no MergeRequest \`!' + mReqID + '\`');
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")", true);

        let type = attr['type'] == 'DiscussionNote' ? 'Thread' : 'Normal';
        embed.addField('Tipo', type, true);
        
        embed.addField('Pipeline test', mReq['merge_when_pipeline_succeeds'], true);

        embed.setFooter('Note merge Request').setTimestamp();
       
        return embed;
    }

};