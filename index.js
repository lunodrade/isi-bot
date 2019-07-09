/**
 * Carregamento de bibliotecas e inicialização da variáveis globais
 */
const Express = require('express');
const BodyParser = require('body-parser');
const Discord = require('discord.js');
const Glob = require("glob");
var Async = require("async");
const { exec } = require('child_process');
const Config = require("./config.json");
const Auth = require("./auth.json");

const BotPrefix = '>';

const client = new Discord.Client();
const app = Express();
const port = 3000;
const channelLog = Config['channelID']['log'];
var discordChannelLog;

var GitlabEvents = [];
Glob("gitlab/*.js", function (er, files) {
    files.forEach(filename => {
        reqName = filename.replace("gitlab/", "").replace(".js", "");
        GitlabEvents[reqName] = require("./"+filename);
    });
});

function log(msg) {
    const timestamp = '[' + new Date().toLocaleString('pt-br') + '] ';
    console.log(timestamp + msg);

    if(discordChannelLog)
        discordChannelLog.send(timestamp + msg);
}

app.use(BodyParser.json());

////////////////////////////////////////////////// DiscordJS /////////////////////////////////////////////

client.on('ready', () => {
    discordChannelLog = client.channels.get(channelLog);

    var div = '====================================================================================';
    log(`\n\n\n${div}\n[Isi] Bot inicializado como ${client.user.tag}!\n${div}\n\n`);
});

client.on('message', message => {
    //responder só o que começa com o prefixo, e o bot não responder ele mesmo
    if (!message.content.startsWith(BotPrefix) || message.author.bot) {
        return;
    }

    let cmd = "";
    let args = message.content.match(/(?:[^\s"]+|"[^"]*")+/gm);
    if(args == null) {
        args = [];
    } else {
        cmd = args.shift().substr(1);
    }

    //controle de mensagens que o bot lê nos canais
    if (cmd === 'ping') {
        message.reply('pong');
    }
});

client.login(Auth.token);

////////////////////////////////////////////////// ExpressJS /////////////////////////////////////////////

/**
 * Gerenciamento de requisições POST (webhook)
 */

app.post('/gitlab', function (req, res) {
    var json = req.body;

    var fnEvent = json['object_kind'];
    var fnAction;
    var projectNamespace = json['project']['path_with_namespace'].split('/')[0];

    if(fnEvent == 'issue' || fnEvent == 'wiki_page') {
        fnAction = json['object_attributes']['action'];
    } else if (fnEvent == 'note') {
        fnAction = json['object_attributes']['noteable_type'].toLowerCase();
    } else if (fnEvent == 'push' || fnEvent == 'tag_push') {
        fnAction = 'send';
    } else {
        log('Sem tratamento para: ' + fnEvent);
    }
    
    //tenta pegar os dados, e caso tenha campos com erros no json, só reportar o erro e seguir em frente
    try {
        var embed = GitlabEvents[fnEvent][fnAction+"Embed"](Discord.RichEmbed, json);
        var channelID = Config['channelID'][projectNamespace];

        if(typeof channelID === 'undefined')
            log("Não existe channelID definido em config.json para |" + projectNamespace + "|\n");
        else
            client.channels.get(channelID).send( { embed: embed } );
    }
    catch (err) {
        log("ERRO: " + err + " → evento: "+fnEvent+" → action: "+fnAction+"\n");
    }

    //manda uma resposta pra quem enviou o POST
    res.json({
        message: 'ok got it!'
    });
});

const updateRepo = () => {
    Async.series([
        Async.apply(exec, 'git pull'),
        Async.apply(exec, 'git status')
    ], 
    function (err, results) {
        results.forEach(result => {
            log(result[0].toString()+"\n\n");
        });
    });
}

//sha-1 de githubwebhook
//34c472e52db92d7bc625907bc61af59d7a71bcc9
app.post('/34c472e52db92d7bc625907bc61af59d7a71bcc9', function (req, res) {
    var json = req.body;

    if(json['ref'] == 'refs/heads/master' && json['pusher']) {
        if(json['pusher']['name'] == 'lunodrade') {                     //aqui vai todos users autorizados
            log('Atualizando repo local devido a push no github');
            updateRepo();
            //restartProcess();  //feito pelo nodemon, usando 'node run nodemon' pra iniciar o processo aqui
        }
    }

    //manda uma resposta pra quem enviou o GET (eg: acessar um site, requisitar dados de uma api)
    res.json({
        message: 'Webhook recebido com sucesso!'
    });
});

//apenas teste de expressjs
app.get('/oi', function (req, res) {
    var json = req.body;

    //manda uma resposta pra quem enviou o GET (eg: acessar um site, requisitar dados de uma api)
    res.json({
        message: 'Ola! commit local pra server'
    });
});

/**
 * Inicializar escuta do server ExpressJS
 */
var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port

    log(`[Isi] Hook escutando em http://${host}:${port}`);
});
