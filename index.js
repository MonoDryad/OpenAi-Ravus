// Importar a biblioteca Discord.js
const { GatewayIntentBits, Client } = require('discord.js');

// Importar a biblioteca OpenAI
const { Configuration, OpenAIApi } = require('openai');

// Configurar o DotEnv
const dotenv = require('dotenv');
dotenv.config();

// Configurar o acesso à API do OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Criar um novo bot do Discord
const bot = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Quando o bot estiver pronto, imprimir uma mensagem no console
bot.on('ready', () => {
  console.log('O bot está pronto!');
});

// Quando o bot receber uma mensagem no canal, responder com a ajuda da API do OpenAI
bot.on('messageCreate', async (message) => {

  // Verificar se a mensagem foi enviada pelo bot
  if (message.author.bot) return;

  // Utilizar a API do OpenAI para completar a mensagem enviada pelo usuário
  try{

    const response = await openai.createCompletion({
      prompt: message.content,
      model: 'text-davinci-003',
      temperature: .9,
      max_tokens: 650,
      top_p: .9,
      stop: ["###"]
    });
  
    // Enviar a resposta do OpenAI como uma mensagem no canal
    console.log(response.data.choices)
    message.reply(response.data.choices[0].text);
  }catch(e){
    message.reply('Eu não consegui compreender a sua pergunta, por favor, repita de uma forma mais coerente.');
  }
});
// Conectar o bot ao servidor do Discord usando o token de acesso
bot.login(`${process.env.TOKEN}`);