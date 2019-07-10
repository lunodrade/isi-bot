/*******************************************************************************
 * 
 * Carregamento de bibliotecas
 * 
 *******************************************************************************/
const Express = require('express');
const BodyParser = require('body-parser');
const Discord = require('discord.js');
const Glob = require("glob");
const Async = require("async");
const { exec } = require('child_process');
const User = require("./utils/user.js");

const Config = require("./config.json");
const Channels = require("./channels.json");
const Auth = require("./auth.json");

var GitlabEvents = [];
Glob("gitlab/*.js", function (er, files) {
    files.forEach(filename => {
        reqName = filename.replace("gitlab/", "").replace(".js", "");
        GitlabEvents[reqName] = require("./"+filename);
    });
});

/*******************************************************************************
 * 
 * Inicialização de funções e variáveis globais
 * 
 *******************************************************************************/
const BotPrefix = '>';

const client = new Discord.Client();
const app = Express();
const port = 3000;
const channelLog = Channels['log'];
var discordChannelLog;

function log(msg) {
    const timestamp = '[' + new Date().toString().substr(4, 20) + '] ';
    console.log(timestamp + msg);

    if(discordChannelLog)
        discordChannelLog.send(timestamp + msg);
}

//faz com que todos {req.body} do expressjs já estejam em JSON
app.use(BodyParser.json());

/*******************************************************************************
 * 
 * Inicialização do DiscordJS e parser de comando
 * 
 *******************************************************************************/

client.on('ready', () => {
    discordChannelLog = client.channels.get(channelLog);

    var div = '='.repeat(84);
    log(`\n\n\n${div}\n[Isi] Bot inicializado como ${client.user.tag}!\n${div}\n\n`);
});

client.on('message', message => {
    //responder só o que começa com o prefixo, e o bot não responder ele mesmo
    if (!message.content.startsWith(BotPrefix) || message.author.bot) {
        return;
    }

    //a primeira palavra é comando, o resto é argumento
    //separa os argumentos ao achar espaço entre eles
    //porém ignora espaços dentro de strings
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

//inicializar o cliente do discord
client.login(Auth.token);

/*******************************************************************************
 * 
 * Serve ExpressJS
 * 
 * Ele recebe os webhooks do gitlab
 * Ele recebo o webhook do github que autoatualiza o projeto
 * 
 *******************************************************************************/

async function sendEmbedToDiscord(fnEvent, fnAction, username, json, projectNamespace) {
    let heyMessage = "";
    let sendHey = false;

    //pegar a foto do usuário de modo forçado (o cache do discord pode nem sempre ter a foto)
    //este modo é assíncrono, então com o await forçar a espera da resposta para continuar
    let avatar = await User.getAvatar(client, username);
    if (!avatar)
        log(`Não existe user linkado para |${username}| no arquivo de config.json`);

    //analisar se o event/action poderia mencionar usuários
    if (fnEvent == "issue") {
        if (fnAction == "open" || fnAction == "reopen" || fnAction == "update") {
            sendHey = true;
        }
    }

    //processar os usuários que serão mencionados logo acima do embed
    if (sendHey) {
        heyMessage = "Hey ";
        if (json['assignees']) {
            json['assignees'].forEach(assignee => {
                let userID = Config['users'][assignee['username']];
                heyMessage += "<@" + userID + "> ";
            });
            if (json['assignees'].length > 1) 
                heyMessage += "deem uma olhada no card abaixo.";
            else
                heyMessage += "da uma olhada no card abaixo.";
        }
    }

    //tenta pegar os dados, e caso tenha campos com erros no json, só reportar o erro e seguir em frente
    try {
        var embed = GitlabEvents[fnEvent][fnAction+"Embed"](Discord.RichEmbed, json, avatar);
        var channelID = Channels[projectNamespace];

        if(typeof channelID === 'undefined')
            log("Não existe channelID definido em config.json para |" + projectNamespace + "|\n");
        else {
            client.channels.get(channelID).send( heyMessage, { embed: embed } );
        }
    }
    catch (err) {
        log("ERRO: " + err + " → evento: "+fnEvent+" → action: "+fnAction+"\n");
    }
}

/************************************************************
 * Receber o POST do webhook vindo do Gitlab
 ***********************************************************/
app.post('/gitlab', function (req, res) {
    //variáveis chaves utilizadas na analize e criação do webhook
    var json = req.body;
    var fnEvent = json['object_kind'];
    var fnAction;
    var username;
    var projectNamespace = json['project']['path_with_namespace'].split('/')[0];

    //analisa qual Event/Action, para saber a estrutura de embed que será chamada
    if(fnEvent == 'issue' || fnEvent == 'wiki_page' || fnEvent == 'merge_request') {
        fnAction = json['object_attributes']['action'];
        username = json['user']['username'];
    } else if (fnEvent == 'note') {
        fnAction = json['object_attributes']['noteable_type'].toLowerCase();
        username = json['user']['username'];
    } else if (fnEvent == 'push') {
        if (json['before'] === '0000000000000000000000000000000000000000')
            fnAction = 'newBranch';
        else
            fnAction = 'push';
        username = json['user_username'];
    } else if (fnEvent == 'tag_push') {
        fnAction = 'tagpush';
        username = json['user_username'];
    } else {
        log('Sem tratamento para: ' + fnEvent);
    }
    
    //cria e envia o embed pro canal do Discord
    sendEmbedToDiscord(fnEvent, fnAction, username, json, projectNamespace);

    //manda uma resposta pra quem enviou o POST (webhook do gitlab)
    res.json({
        message: 'ok got it!'
    });
});

/************************************************************
 * Função que autoatualiza o repositório no server
 ***********************************************************/
const updateRepo = () => {
    Async.series([
        Async.apply(exec, 'git pull'),
        Async.apply(exec, 'git status')
    ], 
    function (err, results) {
        results.forEach(result => {
            log("Resultados:\n\`\`\`\n"+result[0].toString()+"\n\n\`\`\`");
        });
    });
}

/************************************************************
 * Aqui o webhook vindo do gitlab é recebido e analisado
 * sha-1 de githubwebhook → 34c472e52db92d7bc625907bc61af59d7a71bcc9
 ***********************************************************/
app.post('/34c472e52db92d7bc625907bc61af59d7a71bcc9', function (req, res) {
    var json = req.body;

    if(json['ref'] == 'refs/heads/master' && json['pusher']) {          //só quando for na branch master
        if(json['pusher']['name'] == 'lunodrade') {                     //aqui vai todos users autorizados
            log('Atualizando repo local devido a push no github');
            updateRepo();
            //restartProcess();  //feito pelo nodemon, usando 'node run nodemon' pra iniciar o processo aqui
        }
    }

    //manda uma resposta pra quem enviou o POST (webhook do github)
    res.json({
        message: 'Webhook recebido com sucesso!'
    });
});

/************************************************************
 * Apenas para teste
 ***********************************************************/
app.get('/oi', function (req, res) {
    var json = req.body;

    //manda uma resposta pra quem enviou o GET (eg: acessar um site, requisitar dados de uma api)
    res.json({
        message: 'Ola! commit local pra server'
    });
});

/************************************************************
 * Inicializar o ExpressJS
 ***********************************************************/
var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port

    log(`[Isi] Hook escutando em http://${host}:${port}`);
});
