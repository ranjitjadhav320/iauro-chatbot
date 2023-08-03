import { Injectable } from '@nestjs/common';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';

import * as request from 'request';
import { reject } from 'bluebird';

const { ActivityHandler, BotFrameworkAdapter, MessageFactory, ActivityTypes, CardFactory } = require('botbuilder');
const message_array = ["hi", "hello", "welcome", "hey"];

class MyBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      console.log("listen context========", context)
      let case_1 = message_array.includes(context._activity.text.toLowerCase());
      switch (context._activity.text.toLowerCase()) {
        case "hi":
        case "hello":
        case "welcome":
        case "hey":
          await context.sendActivity('Hello from the IO Chatbot!, How can i help you?');
          await next();
          break;
        case "i need a leave":
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
            await context.sendActivity('Ok, Login to the Iauro Keka Portal and apply for leave!');
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
        break;  
        case "leave":
          this.ioFlow();
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
  ioFlow() {
    this.makeRequestWithHeaders("POST", "io flow url", "data", "headers");
  };

   /**
   * Call API with headers
   * @param headers
   */
  makeRequestWithHeaders(
    method: string,
    url: string,
    data: any,
    headers: any,
  ) {
    return new Promise((resolve) => {
      const options = {
        url: url,
        method: method,
        json: {},
        headers: headers,
        qs: {},
      };

      if (method == 'GET') {
        options.qs = data;
      } else if (method == 'POST') {
        options.json = data;
      } else if (method == 'PUT') {
        options.json = data;
      }
      console.log("inside-------api call", options);
      request(options, function (err, response, body) {
        if (err) {
          reject(err);
        }

        resolve(body);
      });
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
      appId: "",
      appPassword: ""
    });
    
    adapter.processActivity(req, res, async (context) => {
      console.log("context----post", context);
      await bot.run(context);
    });
    return 'This action adds a new chatbot';
  }

  chatBotReciever(req, res) {
    console.log("inside.....API")
    const adapter = new BotFrameworkAdapter({
      appId: "",
      appPassword: ""
    });
    
    adapter.processActivity(req, res, async (context) => {
      console.log("context----post", context);

      let reply;
      let activity = context._activity;
      if(activity.message_type === "hero_card") {
         reply = {
          type: ActivityTypes.Message,
          text: activity.text,
          attachments: [
          CardFactory.heroCard(
            activity.card_array[0].title,
            activity.card_array[0].subtitle,
            activity.card_array[0].image_url,
            activity.card_array[0].option_array 
          )
          ]
        };
      } else if(activity.message_type === "adaptive_card") {
          const adaptiveCard = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.2",
            "body": activity.card_array[0].body,
            "actions":  activity.card_array[0].actions
          }
      
        // Create a message activity with the Adaptive Card attachment
        reply = {
          type: ActivityTypes.Message,
          text: activity.text,
          attachments: [CardFactory.adaptiveCard(adaptiveCard)]

        };

      }
      console.log("reply", reply)
      await context.sendActivity(reply);
    });
    return 'success';
  }


}
