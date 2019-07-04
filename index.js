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
    console.log(`Logged in as ${client.user.tag}!`);
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

    var fnEvent = json['event_type'];
    var fnAction;

    if(fnEvent == 'issue') {
        fnAction = json['object_attributes']['action'];
    } else if (fnEvent == 'note') {
        fnAction = json['object_attributes']['noteable_type'].toLowerCase();
    } else {
        console.log('Sem tratamento para: ' + fnEvent);
    }
    
    //tenta pegar os dados, e caso tenha campos com erros no json, só reportar o erro e seguir em frente
    try {
        var embed = GitlabEvents[fnEvent][fnAction+"Embed"](Discord.RichEmbed, json);
        //todo: separar os canais baseado em namespace?
        client.channels.get('193421996883836928').send( { embed: embed } );
    }
    catch (err) {
        console.log("ERRO: " + err + " → evento: "+fnEvent+" → action: "+fnAction);
    }
        


    //manda uma resposta pra quem enviou o POST
    res.json({
        message: 'ok got it!'
    });
});

/**
 * Inicializar escuta do server ExpressJS
 */
var server = app.listen(port, "127.0.0.1", function () {
    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port);
});