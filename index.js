require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const cron = require('node-cron');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

//these have to be global variables to enable adding/removing greetings

let morningOptions = ['Good morning, darling! I hope you have a wonderful day :heart:',
    'Ohayo :sunflower:',
    '(＾▽＾) Morning, sleepy head ',
    'Rise and shine :sun_with_face:'
    ];

let eveningOptions = ['Welcome home darling! I hope you had a wonderful day :heart:',
    'Konbanwa :sunflower:',
    '(＾▽＾) Evening, night owl ',
    'Hello darkness, my old friend :new_moon_with_face:'
    ];

let feedMessages = ['Say aaaaah ~ :heart:',
    'I hope you like it (⊃‿⊂)',
    'Itadakimasu !',
    'Have a nice meal, ♡＾▽＾♡'
];

let foodOptions = ['http://media1.tenor.com/images/b2938f7c2739fe7292ccd8d4f2cc1ed5/tenor.gif',
        'https://media1.tenor.com/images/70d659a2ae8b37584771f6e22bda148d/tenor.gif',
        'https://media1.tenor.com/images/773d4984ba77cc10eb56b139cdd71472/tenor.gif',
        'https://media1.tenor.com/images/f42be0b36d0dbd8ff4957329c2801811/tenor.gif', 
        'https://media1.tenor.com/images/8f59fc192e3cb67875a3405a5f18ff67/tenor.gif', 
        'https://media.tenor.com/images/1c5547bb710efc1c5b0535507c97fe38/tenor.gif', 
        'https://cdn.discordapp.com/attachments/592900917486026752/592959424172392448/tumblr_mpyzh7MK9J1rs8ziuo1_500.gif',
        'https://cdn.discordapp.com/attachments/592900917486026752/592959443344556053/original.gif',
        'https://cdn.discordapp.com/attachments/592900917486026752/592959443772375040/85360870.gif',
        'https://cdn.discordapp.com/attachments/592900917486026752/592959446938943488/a9c53b5bea5642cd1b71cd7862e84a14.gif',
        'https://cdn.discordapp.com/attachments/592900917486026752/592959450013237251/tumblr_pdvdacyU461uxovwqo3_500.gif'
    ];

client.on('message', message => {

    if (message.author == client.user) { return }

    ////COMMANDS ANYONE CAN USE////

    //when people need help with using the bot
    if (message.content === '.w'){
      message.channel.send('Hello! Type `.w help` to see a list of available commands.');
    }

    //embed for help command

    const helpEmbed = new Discord.RichEmbed()
      .setColor('#ffb0f1')
      .setAuthor('Waifu Help', 'https://cdn.discordapp.com/attachments/592900917486026752/594085786337411092/Untitled-1.png')
      .setDescription('Command list. For a detailed guide on the usage of Waifu, please check the [GitHub repo](https://github.com/kathyn262/waifubot).')
      .addField('Instant Interaction Commands:', '`.w morning` , `.w evening` , `.w feed`')
      .addField('Scheduled Interaction Commands:', '`.w morning set` , `.w evening set`')
      .addField('View Messages Commands:', '`.w morning all` , `.w evening all` , `.w feed all`')
      .addField('Message Customization Commands:', '`.w morning add` , `.w morning remove` , `.w evening add` , `.w evening remove` , `.w feed add` , `.w feed remove`')
      .addField('Avatar Commands:', '`.w rem` , `.w asuna` , `.w nezuko` , `.w zero two`');
      
      
    if (message.content === '.w help'){
      message.channel.send(helpEmbed);
    }

    
    //instant morning and evening messages
    if (message.content === '.w morning') {
        let morningResponse = morningOptions[Math.floor(Math.random() * morningOptions.length)];
        message.channel.send(morningResponse + ' ' + message.author).then().catch(console.error);
    } else if (message.content === '.w evening') {
        let eveningResponse = eveningOptions[Math.floor(Math.random() * eveningOptions.length)];
        message.channel.send(eveningResponse + ' ' + message.author).then().catch(console.error);
    }

    //scheduled morning message
    if (message.content.startsWith('.w morning set')){
      let morningTime = message.content.split(' ')[3].split(':');
      let timeBase = 'minute hour * * *';
      let minRep = timeBase.replace('minute', morningTime[1]);
      let finalRep = minRep.replace('hour', morningTime[0]);
      let task = cron.schedule(finalRep, () => {
        let morningResponse = morningOptions[Math.floor(Math.random() * morningOptions.length)];
        message.channel.send(morningResponse).then().catch(console.error);
      });
    }

    //scheduled evening message
    if (message.content.startsWith('.w evening set')){
      let eveningTime = message.content.split(' ')[3].split(':');
      let timeBase = 'minute hour * * *';
      let minRep = timeBase.replace('minute', eveningTime[1]);
      let finalRep = minRep.replace('hour', eveningTime[0]);
      let task = cron.schedule(finalRep, () => {
        let eveningResponse = eveningOptions[Math.floor(Math.random() * eveningOptions.length)];
        message.channel.send(eveningResponse).then().catch(console.error);
      });
    }

    //to see all current morning greetings
    if (message.content === '.w morning all'){
      message.channel.send(morningOptions);
    }
    
    //to see all current evening greetings
    if (message.content === '.w evening all'){
      message.channel.send(eveningOptions);
    }

    //to see all current feeding messages
    if (message.content === '.w feed all'){
      message.channel.send(feedMessages);
    }

    //having the bot feed you 
    if (message.content === '.w feed'){
      let feedResponse = feedMessages[Math.floor(Math.random() * eveningOptions.length)];
      message.channel.send(feedResponse + ' ' + message.author, {file: foodOptions[Math.floor(Math.random() * foodOptions.length)]})
    }

    
    
    ////ADMINISTRATOR PERMISSION ONLY COMMANDS////

    //adding a morning greeting
    if (message.content.startsWith('.w morning add')){
      if (message.member.permissions.has('ADMINISTRATOR')){
        let addCommand = message.content.split(' ').slice(3);
        let addMessage = addCommand.join(' ');
        morningOptions.push(addMessage);
        message.channel.send(addMessage + ' has been added to morning greeting options!');
      } else {
        message.channel.send('Only an admin or a mod can add greetings!');
      }
    }

    //removing a morning greeting 
    if (message.content.startsWith('.w morning remove')){
      if (message.member.permissions.has('ADMINISTRATOR')){
        let addCommand = message.content.split(' ').slice(3);
        let addMessage = addCommand.join(' ');
        let toDelete = morningOptions.indexOf(addMessage);
        if (toDelete > 0){
          morningOptions.splice(toDelete, 1);
          message.channel.send(addMessage + ' has been removed from morning greeting options!');
        }
      } else {
        message.channel.send('Only an admin or a mod can remove greetings!');
      }
    }

    //adding an evening greeting
    if (message.content.startsWith('.w evening add')){
      if (message.member.permissions.has('ADMINISTRATOR')){
        let addCommand = message.content.split(' ').slice(3);
        let addMessage = addCommand.join(' ');
        eveningOptions.push(addMessage);
        message.channel.send(addMessage + ' has been added to evening greeting options!');
      } else {
        message.channel.send('Only an admin or a mod can add greetings!');
      }
    }

    //removing an evening greeting 
    if (message.content.startsWith('.w evening remove')){
      if (message.member.permissions.has('ADMINISTRATOR')){
        let addCommand = message.content.split(' ').slice(3);
        let addMessage = addCommand.join(' ');
        let toDelete = eveningOptions.indexOf(addMessage);
        if (toDelete > 0){
          eveningOptions.splice(toDelete, 1);
          message.channel.send(addMessage + ' has been removed from evening greeting options!');
        }
      } else {
        message.channel.send('Only an admin or a mod can remove greetings!');
      }
    }

    //adding a feeding message
    if (message.content.startsWith('.w feed add')){
      if (message.member.permissions.has('ADMINISTRATOR')){
        let addCommand = message.content.split(' ').slice(3);
        let addMessage = addCommand.join(' ');
        feedMessages.push(addMessage);
        message.channel.send(addMessage + ' has been added to feeding messages!');
      } else {
        message.channel.send('Only an admin or a mod can add greetings!');
      }
    }

    //removing a feeding message
    if (message.content.startsWith('.w feed remove')){
      if (message.member.permissions.has('ADMINISTRATOR')){
        let addCommand = message.content.split(' ').slice(3);
        let addMessage = addCommand.join(' ');
        let toDelete = feedMessages.indexOf(addMessage);
        if (toDelete > 0){
          feedMessages.splice(toDelete, 1);
          message.channel.send(addMessage + ' has been removed from feeding messages!');
        }
      } else {
        message.channel.send('Only an admin or a mod can remove greetings!');
      }
    }


    //changing avatar
    if (message.content === '.w nezuko'){
      if ((message.member.permissions.has('ADMINISTRATOR'))){
        client.user.setAvatar('https://cdn.discordapp.com/attachments/592900917486026752/592911426587328522/nezuko.png')
        .catch(console.error);
        message.channel.send('Give me a few moments to change into Nezuko!');
      } else {
        message.channel.send('Only an admin or a mod can change my avatar!');
      }
    } else if (message.content === '.w asuna'){
      if (message.member.permissions.has('ADMINISTRATOR')){
        client.user.setAvatar('https://cdn.discordapp.com/attachments/592900917486026752/592903842819997696/98db717785ca9fd01e7867de9a815693fdfdde14_hq.png')
        .catch(console.error);
        message.channel.send('Give me a few moments to change into Asuna!');
      } else {
        message.channel.send('Only an admin or a mod can change my avatar!');
      }
    } else if (message.content === '.w rem'){
      if (message.member.permissions.has('ADMINISTRATOR')){
        client.user.setAvatar('https://cdn.discordapp.com/attachments/592900917486026752/592901870637416469/unknown.png')
        .catch(console.error);
        message.channel.send('Give me a few moments to change into Rem!');
      } else {
        message.channel.send('Only an admin or a mod can change my avatar!');
      }
    } else if (message.content === '.w zero two'){
      if (message.member.permissions.has('ADMINISTRATOR')){
        client.user.setAvatar('https://cdn.discordapp.com/attachments/592900917486026752/593291931065385016/latest.png')
        .catch(console.error);
        message.channel.send('Give me a few moments to change into Zero Two!');
      } else {
        message.channel.send('Only an admin or a mod can change my avatar!');
      }
    }


});


client.login(process.env.BOT_TOKEN);