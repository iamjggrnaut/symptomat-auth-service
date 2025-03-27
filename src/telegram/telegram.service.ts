import { Injectable, Logger } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot: TelegramBot;

  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
  }

  async sendNotification(chatId: number, message: string, menu: object): Promise<boolean> {
    try {
      await this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
      return true;
    } catch (error) {
      this.logger.error(`Failed to send Telegram message to ${chatId}: ${error.message}`);
      return false;
    }
  }
}