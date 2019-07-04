const Config = require("../config.json");
const Color = Config['color'];
const Emoji = Config['emoji'];

module.exports = {

    /////////////////////////////////////////////////// OPEN //////////////////////////////////////////////////////
    openEmbed: function (embedClass, json) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var labels = json['labels'];

        embed.setColor(Color['open']);
        //embed.setAuthor(user['name']+" → "+proj['namespace'], user['avatar_url']);
        embed.setAuthor(user['name'], "https://i.imgur.com/lm8s41J.png");

        embed.setTitle('Issue #'+attr['iid']+" aberto: "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        var assignee = json['assignees'] ? json['assignees'][0]['name'] : "ninguém";
        embed.addField('Responsável', assignee, true);
        embed.addField('due date', attr['due_date'], true);

        var labelsStr = "";
        labels.forEach(label => {
            labelsStr += "\`" + label['title'] + "\`, ";
        });
        if(labels.length > 0)
            labelsStr = labelsStr.slice(0, labelsStr.length-2);
        else
            labelsStr = "--";

        embed.addField('Labels', labelsStr, true);

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")");

        return embed;
    },

    /////////////////////////////////////////////////// CLOSE //////////////////////////////////////////////////////
    closeEmbed: function (embedClass, json) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var labels = json['labels'];

        embed.setColor(Color['close']);
        //embed.setAuthor(user['name']+" → "+proj['namespace'], user['avatar_url']);
        embed.setAuthor(user['name'], "https://i.imgur.com/lm8s41J.png");

        embed.setTitle('Issue #'+attr['iid']+" encerrado: "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")", true);

        var labelsStr = "";
        labels.forEach(label => {
            labelsStr += "\`" + label['title'] + "\` ";
        });
        if(labels.length > 0)
            labelsStr = labelsStr.slice(0, labelsStr.length-2);
        else
            labelsStr = "--";
        embed.addField('Labels', labelsStr, true);

        return embed;
    },

    /////////////////////////////////////////////////// REOPEN //////////////////////////////////////////////////////
    reopenEmbed: function (embedClass, json) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var labels = json['labels'];

        embed.setColor(Color['reopen']);
        //embed.setAuthor(user['name']+" → "+proj['namespace'], user['avatar_url']);
        embed.setAuthor(user['name'], "https://i.imgur.com/lm8s41J.png");

        embed.setTitle('Issue #'+attr['iid']+" reaberto: "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        var assignee = json['assignees'] ? json['assignees'][0]['name'] : "ninguém";
        embed.addField('Responsável', assignee, true);
        embed.addField('due date', attr['due_date'], true);

        var labelsStr = "";
        labels.forEach(label => {
            labelsStr += "\`" + label['title'] + "\` ";
        });
        if(labels.length > 0)
            labelsStr = labelsStr.slice(0, labelsStr.length-2);
        else
            labelsStr = "--";
        embed.addField('Labels', labelsStr, true);

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")");

        return embed;
    },

    /////////////////////////////////////////////////// UPDATE //////////////////////////////////////////////////////
    updateEmbed: function (embedClass, json) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var labels = json['labels'];

        embed.setColor(Color['update']);
        //embed.setAuthor(user['name']+" → "+proj['namespace'], user['avatar_url']);
        embed.setAuthor(user['name'], "https://i.imgur.com/lm8s41J.png");

        embed.setTitle('Issue #'+attr['iid']+" atualizado: "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        var assignee = json['assignees'] ? json['assignees'][0]['name'] : "ninguém";
        embed.addField('Responsável', assignee, true);
        embed.addField('due date', attr['due_date'], true);

        var labelsStr = "";
        labels.forEach(label => {
            labelsStr += "\`" + label['title'] + "\` ";
        });
        if(labels.length > 0)
            labelsStr = labelsStr.slice(0, labelsStr.length-2);
        else
            labelsStr = "--";
        embed.addField('Labels', labelsStr, true);

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")");

        embed.addField('TODO', 'adicionar changes', true);

        return embed;
    }
};