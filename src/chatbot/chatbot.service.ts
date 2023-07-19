import { Injectable } from '@nestjs/common';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';

const { ActivityHandler, BotFrameworkAdapter, MessageFactory, ActivityTypes, CardFactory } = require('botbuilder');
const message_array = ["hi", "hello", "welcome", "hey"];

class MyBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      console.log("listen context========", context)


      switch (context._activity.text) {
        case "hi":
          await context.sendActivity('Hello from the IO Chatbot!, How can i help you?');
          await next();
          break;
        case "i want a leave":
          const reply = {
            type: ActivityTypes.Message,
            text: "Which types of leave do you want?",
            attachments: [
            CardFactory.heroCard(
                "Types of leave",
                "select leave from below",
                 null,
                ["sick leave", "holiday leave"], // Two options
                ["sick leave", "holiday leave"] // Descriptions for the options
            )
            ]
          };

          // Send the reply
          await context.sendActivity(reply);
          await next();
          break;
        case "sick leave":
            await context.sendActivity('Ok, Contact with HR Department, Thanks!');
            await next();
            break;
        case "iauro website":

          const adaptiveCard = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.2",
            "body": [
              {
                  "type": "TextBlock",
                  "text": "Iauro Website",
                  "size": "large"
              },
              {
                  "type": "Image",
                  "url": "https://source.unsplash.com/user/c_v_r/1900x800",
                  "size": "medium"
              }
          ],
          "actions": [
              {
                  "type": "Action.OpenUrl",
                  "title": "Open url",
                  "url": "https://iauro.com"
              }
          ]
          }
        
        // Create a message activity with the Adaptive Card attachment
        const message = {
            type: ActivityTypes.Message,
            text: 'Here is an iauro website',
            attachments: [CardFactory.adaptiveCard(adaptiveCard)]

        };




        
        // Send the message activity
        await context.sendActivity(message);
        await next();

          // const adaptiveCard = CardFactory.adaptiveCard({
          //   type: 'AdaptiveCard',
          //   body: [
          //       {
          //           type: 'Iauro Website',
          //           text: 'Iauro Website',
          //           size: 'large'
          //       },
          //       {
          //           type: 'Image',
          //           url: 'https://source.unsplash.com/user/c_v_r/1900x800',
          //           size: 'medium'
          //       }
          //   ],
          //   actions: [
          //       {
          //           type: 'Action.OpenUrl',
          //           title: 'Open url',
          //           url: 'https://iauro.com'
          //       }
          //   ]
          // });
          // const reply_adaptive = {
          //   type: 'message',
          //   text: 'Here is an iauro website',
          //   attachments: [adaptiveCard]
          //   };
          //   await context.sendActivity(reply_adaptive);
          //   await next();
            break;        
        default:
          await context.sendActivity(`Sorry i didn't get your question😊`);
          await next();
          break;
      }
      // if (context._activity.text && message_array.includes(context._activity.text.toLowerCase())) {
        
      //   // send attachment
      //   // const attachment = {
      //   //   contentType: 'image/png', // Replace with the appropriate content type
      //   //   contentUrl: 'https://source.unsplash.com/user/c_v_r/1900x800',
      //   //   name: 'Image.png' // Replace with the desired name for the file
      //   // };
    
      //   // // Create a message with the attachment
      //   // const message = MessageFactory.attachment(attachment);
    
      //   // Send the message
      //   // await context.sendActivity(message);


      //   await context.sendActivity('Hello from the IO Chatbot!, How can i help you?');
      //   await next();
      // } 
 
    });
  }
}

const bot = new MyBot();

@Injectable()
export class ChatbotService {
  create(createChatbotDto: CreateChatbotDto) {
    return 'This action adds a new chatbot';
  }

  findAll() {
    return `This action returns all chatbot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatbot`;
  }

  update(id: number, updateChatbotDto: UpdateChatbotDto) {
    return `This action updates a #${id} chatbot`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatbot`;
  }

  chatBot(req, res) {
    console.log("inside.....API")
    const adapter = new BotFrameworkAdapter({
      appId: "f0cc92a4-2765-4501-94e4-26360eea4fe5",
      appPassword: "fyA8Q~dLrRujNPA3oKduLjiqGqN84kiQDb06oc1N"
    });
    
    adapter.processActivity(req, res, async (context) => {
      console.log("context----post", context);
      await bot.run(context);
    });
    return 'This action adds a new chatbot';
  }


}
