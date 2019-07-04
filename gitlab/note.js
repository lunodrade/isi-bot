module.exports = {
    /////////////////////////////////////////////////// ISSUE //////////////////////////////////////////////////////
    issueEmbed: function (embedClass, json) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var issue = json['issue'];

        embed.setColor("#00AE86");
        //embed.setAuthor(user['name']+" → "+proj['namespace'], user['avatar_url']);
        embed.setAuthor(user['name'], "https://i.imgur.com/lm8s41J.png");

        embed.setTitle('Comentou na Issue #' + issue['iid'] + ': ' + issue['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")", true);
        embed.addField('due date', issue['due_date'], true);
       
        return embed;
    },

    /*
    /////////////////////////////////////////////////// CLOSE //////////////////////////////////////////////////////
    closeEmbed: function (embedClass, json) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];

        embed.setColor("#00AE86");
        //embed.setAuthor(user['name']+" → "+proj['namespace'], user['avatar_url']);
        embed.setAuthor(user['name']+" - Issue encerrado", "https://i.imgur.com/lm8s41J.png");

        embed.setTitle('Issue #'+attr['iid']+": "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        var assignee = json['assignees'] ? json['assignees'][0]['name'] : "ninguém";
        embed.addField('Responsável', assignee, true);
        embed.addField('due date', attr['due_date'], true);
        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")");

        return embed;
    },

    /////////////////////////////////////////////////// REOPEN //////////////////////////////////////////////////////
    reopenEmbed: function (embedClass, json) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];

        embed.setColor("#00AE86");
        //embed.setAuthor(user['name']+" → "+proj['namespace'], user['avatar_url']);
        embed.setAuthor(user['name']+" - Issue reaberto", "https://i.imgur.com/lm8s41J.png");

        embed.setTitle('Issue #'+attr['iid']+": "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        var assignee = json['assignees'] ? json['assignees'][0]['name'] : "ninguém";
        embed.addField('Responsável', assignee, true);
        embed.addField('due date', attr['due_date'], true);
        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")");

        return embed;
    },

    /////////////////////////////////////////////////// UPDATE //////////////////////////////////////////////////////
    updateEmbed: function (embedClass, json) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];

        embed.setColor("#00AE86");
        //embed.setAuthor(user['name']+" → "+proj['namespace'], user['avatar_url']);
        embed.setAuthor(user['name']+" - Issue atualizado", "https://i.imgur.com/lm8s41J.png");

        embed.setTitle('Issue #'+attr['iid']+": "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        var assignee = json['assignees'] ? json['assignees'][0]['name'] : "ninguém";
        embed.addField('Responsável', assignee, true);
        embed.addField('due date', attr['due_date'], true);
        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")");

        return embed;
    }
    */
};