module.exports = {
    /*
    testaa: function(embedClass, json) {
        var embed = new embedClass();

        embed.setColor("#00AE86");
        embed.setTitle('NOVIDADE!');
        embed.setAuthor("Autor Fulano", "https://i.imgur.com/lm8s41J.png");
        embed.setDescription('Some description that relates to the title.');
        embed.setFooter("This is the footer text, it can hold 2048 characters").setTimestamp();
        embed.setImage("http://i.imgur.com/yVpymuV.png")
        embed.setThumbnail("http://i.imgur.com/p2qNFag.png")
        
        embed.addField('Title of the field', 'Value of the field', true);
        embed.addField('Title of the field2', 'Value of the field2', true);
        embed.addBlankField(true).addBlankField(true);
        embed.addField('Second field', 'Second field value');

        return embed;
    },
    */

    /////////////////////////////////////////////////// OPEN //////////////////////////////////////////////////////
    openEmbed: function (embedClass, json) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];

        embed.setColor("#00AE86");
        //embed.setAuthor(user['name']+" → "+proj['namespace'], user['avatar_url']);
        embed.setAuthor(user['name'], "https://i.imgur.com/lm8s41J.png");

        embed.setTitle('Issue #'+attr['iid']+" aberto: "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        var assignee = json['assignees'] ? json['assignees'][0]['name'] : "ninguém";
        embed.addField('Responsável', assignee, true);
        embed.addField('due date', attr['due_date'], true);
        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")");

        return embed;
    },

    /////////////////////////////////////////////////// CLOSE //////////////////////////////////////////////////////
    closeEmbed: function (embedClass, json) {
        var embed = new embedClass();

        var user = json['user'];
        var attr = json['object_attributes'];
        var proj = json['project'];

        embed.setColor("#00AE86");
        //embed.setAuthor(user['name']+" → "+proj['namespace'], user['avatar_url']);
        embed.setAuthor(user['name'], "https://i.imgur.com/lm8s41J.png");

        embed.setTitle('Issue #'+attr['iid']+" encerrado: "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

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
        embed.setAuthor(user['name'], "https://i.imgur.com/lm8s41J.png");

        embed.setTitle('Issue #'+attr['iid']+" reaberto: "+attr['title']);
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
        embed.setAuthor(user['name'], "https://i.imgur.com/lm8s41J.png");

        embed.setTitle('Issue #'+attr['iid']+" atualizado: "+attr['title']);
        embed.setURL(attr['url']);
        embed.setDescription(attr['description']);

        var assignee = json['assignees'] ? json['assignees'][0]['name'] : "ninguém";
        embed.addField('Responsável', assignee, true);
        embed.addField('due date', attr['due_date'], true);
        embed.addField(proj['namespace'], "["+proj['path_with_namespace']+"]("+proj['homepage']+")");

        return embed;
    }
};