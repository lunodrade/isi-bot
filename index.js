/**
 * Carregamento de bibliotecas e inicialização da variáveis globais
 */
const Express = require('express');
const BodyParser = require('body-parser');
const Discord = require('discord.js');
const Glob = require("glob");

const client = new Discord.Client();
const app = Express();
const port = 3000;
const Config = require("./config.json");

var GitlabEvents = [];
Glob("gitlab/*.js", function (er, files) {
    files.forEach(filename => {
        reqName = filename.replace("gitlab/", "").replace(".js", "");
        GitlabEvents[reqName] = require("./"+filename);
    });
});

app.use(BodyParser.json());

////////////////////////////////////////////////// DiscordJS /////////////////////////////////////////////

client.on('ready', () => {
    console.log(`[Isi] Bot inicializado como ${client.user.tag}!`);
});

client.on('message', msg => {
    //o bot não pode responder ele mesmo;
    if(msg.author.bot)
        return;

    //controle de mensagens que o bot lê nos canais
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
});

client.login(Config.token);

////////////////////////////////////////////////// ExpressJS /////////////////////////////////////////////

/**
 * Gerenciamento de requisições POST (webhook)
 */
app.post('/gitlab', function (req, res) {
    var json = req.body;

    var fnEvent = json['object_kind'];
    var fnAction;
    var projectNamespace = json['project']['namespace'];

    if(fnEvent == 'issue' || fnEvent == 'wiki_page') {
        fnAction = json['object_attributes']['action'];
    } else if (fnEvent == 'note') {
        fnAction = json['object_attributes']['noteable_type'].toLowerCase();
    } else if (fnEvent == 'push' || fnEvent == 'tag_push') {
        fnAction = 'send';
    } else {
        console.log('Sem tratamento para: ' + fnEvent);
    }
    
    //tenta pegar os dados, e caso tenha campos com erros no json, só reportar o erro e seguir em frente
    try {
        var embed = GitlabEvents[fnEvent][fnAction+"Embed"](Discord.RichEmbed, json);
        var channelID = Config['channelID'][projectNamespace];

        if(typeof channelID === 'undefined')
            console.log("\nNão existe channelID definido em config.json para |" + projectNamespace + "|\n");
        else
            client.channels.get(channelID).send( { embed: embed } );
    }
    catch (err) {
        console.log("\nERRO: " + err + " → evento: "+fnEvent+" → action: "+fnAction+"\n");
    }

    //manda uma resposta pra quem enviou o POST
    res.json({
        message: 'ok got it!'
    });
});

/**
 * Inicializar escuta do server ExpressJS
 */
var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('[Isi] Hook escutando em http://%s:%s', host, port);
});