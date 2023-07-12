import { Injectable } from '@nestjs/common';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';

const { ActivityHandler, BotFrameworkAdapter } = require('botbuilder');

class MyBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      await context.sendActivity('Hello from the chatbot!');
      await next();
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
      console.log("context", context);
      await bot.run(context);
    });
    return 'This action adds a new chatbot';
  }
}
