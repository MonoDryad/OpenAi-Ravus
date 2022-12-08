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

  console.log(message.author)
  if(message.author.username === 'OpenAi-Ravus'){
    return
  } 

  // Utilizar a API do OpenAI para completar a mensagem enviada pelo usuário
  setTimeout(async() => {
    try{

      let response = await openai.createCompletion({
        prompt: message.content,
        model: 'text-davinci-003',
        temperature: .8,
        max_tokens: 650,
        top_p: .9,
        stop: ["###"]
      });

      if(response.data.choices[0].text.length < 1){
        response = await openai.createCompletion({
          prompt: message.content,
          model: 'text-davinci-003	',
          temperature: .7,
          max_tokens: 450,
          top_p: .9,
          stop: ["###"]
        });
      }
    
      // Enviar a resposta do OpenAI como uma mensagem no canal
      
        if(response.data.choices[0].text.length > 2000){
          let fhalf = response.data.choices[0].text.slice(0, 1999)
          let lhalf = response.data.choices[0].text.slice(2000, response.data.choices[1].text.length)
          message.reply(fhalf);
          message.reply(lhalf);
        }else{
          if(response.data.choices[0].text.length < 1){
            console.log('cancelado')
            return
          }
          message.reply(response.data.choices[0].text);
        }
        
      
    }catch(e){
    }
  }, 3500);
});
// Conectar o bot ao servidor do Discord usando o token de acesso
bot.login(`${process.env.TOKEN}`);
