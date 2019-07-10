const Config = require("../config.json");
const Color = Config['color'];
const Emoji = Config['emoji'];
const Users = Config['users'];

module.exports = {
    /////////////////////////////////////////////////// ISSUE //////////////////////////////////////////////////////
    openEmbed: function (embedClass, json, avatar) {
        var embed = new embedClass();
        
        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var labels = json['labels'];

        embed.setColor(Color['update']);
        embed.setAuthor(user['name'], avatar);
        
        embed.setTitle('Requisição de Merge !'+attr['iid']+' aberto: \`' + attr['title'] + '\`');
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        var assignee = 'ninguém';
        if (json['assignees']) {
            assignee = '';
            json['assignees'].forEach(assig => {
                let usernick = Users[assig['username']];
                if (usernick)
                    assignee += '<@'+usernick + '>, ';
                else
                    assignee += '\`'+assig['name'] + '\`, ';
            });
            assignee = assignee.substr(0, assignee.length-2);
        }
        let assigneeTitle = json['assignees'].length > 1 ? 'Responsáveis' : 'Responsável';
        embed.addField(assigneeTitle, assignee, true);

        embed.addField('Branch', attr['source_branch']+' → '+attr['target_branch'], true);

        embed.addField('Status', attr['state'], true);

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")", true);

        var labelsStr = "";
        labels.forEach(label => {
            labelsStr += "\`" + label['title'] + "\` ";
        });
        if(labels.length == 0)
            labelsStr = "--";
        embed.addField('Labels', labelsStr, true);

        embed.addField('Pipeline test', attr['merge_when_pipeline_succeeds'], true);

        embed.setFooter('Merge request open').setTimestamp();
        
        return embed;
    },

    /////////////////////////////////////////////////// ISSUE //////////////////////////////////////////////////////
    updateEmbed: function (embedClass, json, avatar) {
        var embed = new embedClass();
        
        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var labels = json['labels'];

        embed.setColor(Color['update']);
        embed.setAuthor(user['name'], avatar);
        
        embed.setTitle('O Merge !'+attr['iid']+' foi atualizado: \`' + attr['title'] + '\`');
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        var assignee = 'ninguém';
        if (json['assignees']) {
            assignee = '';
            json['assignees'].forEach(assig => {
                let usernick = Users[assig['username']];
                if (usernick)
                    assignee += '<@'+usernick + '>, ';
                else
                    assignee += '\`'+assig['name'] + '\`, ';
            });
            assignee = assignee.substr(0, assignee.length-2);
        }
        let assigneeTitle = json['assignees'].length > 1 ? 'Responsáveis' : 'Responsável';
        embed.addField(assigneeTitle, assignee, true);

        embed.addField('Branch', attr['source_branch']+' → '+attr['target_branch'], true);

        embed.addField('Status', attr['state'], true);

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")", true);

        var labelsStr = "";
        labels.forEach(label => {
            labelsStr += "\`" + label['title'] + "\` ";
        });
        if(labels.length == 0)
            labelsStr = "--";
        embed.addField('Labels', labelsStr, true);

        embed.addField('Pipeline test', attr['merge_when_pipeline_succeeds'], true);

        embed.addField('TODO', 'adicionar changes');

        embed.setFooter('Merge request update').setTimestamp();
        
        return embed;
    },

    /////////////////////////////////////////////////// ISSUE //////////////////////////////////////////////////////
    mergeEmbed: function (embedClass, json, avatar) {
        var embed = new embedClass();
        
        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];
        var labels = json['labels'];

        embed.setColor(Color['open']);
        embed.setAuthor(user['name'], avatar);
        
        embed.setTitle('O Merge !'+attr['iid']+' foi concluído: \`' + attr['title'] + '\`');
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        var assignee = 'ninguém';
        if (json['assignees']) {
            assignee = '';
            json['assignees'].forEach(assig => {
                let usernick = Users[assig['username']];
                if (usernick)
                    assignee += '<@'+usernick + '>, ';
                else
                    assignee += '\`'+assig['name'] + '\`, ';
            });
            assignee = assignee.substr(0, assignee.length-2);
        }
        let assigneeTitle = json['assignees'].length > 1 ? 'Responsáveis' : 'Responsável';
        embed.addField(assigneeTitle, assignee, true);

        embed.addField('Branch', attr['source_branch']+' → '+attr['target_branch'], true);

        embed.addField('Status', attr['state'], true);

        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")", true);

        var labelsStr = "";
        labels.forEach(label => {
            labelsStr += "\`" + label['title'] + "\` ";
        });
        if(labels.length == 0)
            labelsStr = "--";
        embed.addField('Labels', labelsStr, true);

        embed.addField('Pipeline test', attr['merge_when_pipeline_succeeds'], true);

        embed.addField('TODO', 'adicionar changes');

        embed.setFooter('Merge request execute').setTimestamp();
        
        return embed;
    }
}