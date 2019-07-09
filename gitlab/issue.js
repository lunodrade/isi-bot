const Config = require("../config.json");
const Color = Config['color'];
const Emoji = Config['emoji'];

module.exports = {

    /////////////////////////////////////////////////// OPEN //////////////////////////////////////////////////////
    openEmbed: function (embedClass, json, avatar) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var labels = json['labels'];

        embed.setColor(Color['open']);
        embed.setAuthor(user['name'], avatar);

        embed.setTitle('Issue #'+attr['iid']+" aberto: "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description'].substring(0, 2000));

        var assignee = json['assignees'] ? json['assignees'][0]['name'] : "ninguém";
        embed.addField('Responsável', assignee, true);
        embed.addField('due date', attr['due_date'], true);

        var labelsStr = "";
        labels.forEach(label => {
            labelsStr += "\`" + label['title'] + "\`, ";
        });
        if(labels.length == 0)
            labelsStr = "--";

        embed.addField('Labels', labelsStr, true);

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")");

        embed.setFooter('Issue open').setTimestamp();

        return embed;
    },

    /////////////////////////////////////////////////// CLOSE //////////////////////////////////////////////////////
    closeEmbed: function (embedClass, json, avatar) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var labels = json['labels'];

        embed.setColor(Color['close']);
        embed.setAuthor(user['name'], avatar);

        embed.setTitle('Issue #'+attr['iid']+" encerrado: "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description'].substring(0, 2000));

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")", true);

        var labelsStr = "";
        labels.forEach(label => {
            labelsStr += "\`" + label['title'] + "\` ";
        });
        if(labels.length == 0)
            labelsStr = "--";
        embed.addField('Labels', labelsStr, true);

        embed.setFooter('Issue close').setTimestamp();

        return embed;
    },

    /////////////////////////////////////////////////// REOPEN //////////////////////////////////////////////////////
    reopenEmbed: function (embedClass, json, avatar) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var labels = json['labels'];

        embed.setColor(Color['reopen']);
        embed.setAuthor(user['name'], avatar);

        embed.setTitle('Issue #'+attr['iid']+" reaberto: "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description'].substring(0, 2000));

        var assignee = json['assignees'] ? json['assignees'][0]['name'] : "ninguém";
        embed.addField('Responsável', assignee, true);
        embed.addField('due date', attr['due_date'], true);

        var labelsStr = "";
        labels.forEach(label => {
            labelsStr += "\`" + label['title'] + "\` ";
        });
        if(labels.length == 0)
            labelsStr = "--";
        embed.addField('Labels', labelsStr, true);

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")");

        embed.setFooter('Issue reopen').setTimestamp();

        return embed;
    },

    /////////////////////////////////////////////////// UPDATE //////////////////////////////////////////////////////
    updateEmbed: function (embedClass, json, avatar) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var labels = json['labels'];

        embed.setColor(Color['update']);
        embed.setAuthor(user['name'], avatar);

        embed.setTitle('Issue #'+attr['iid']+" atualizado: "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description'].substring(0, 2000));

        var assignee = json['assignees'] ? json['assignees'][0]['name'] : "ninguém";
        embed.addField('Responsável', assignee, true);
        embed.addField('due date', attr['due_date'], true);

        var labelsStr = "";
        labels.forEach(label => {
            labelsStr += "\`" + label['title'] + "\` ";
        });
        if(labels.length == 0)
            labelsStr = "--";
        embed.addField('Labels', labelsStr, true);

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")");

        embed.addField('TODO', 'adicionar changes', true);

        embed.setFooter('Issue update').setTimestamp();

        return embed;
    }
};