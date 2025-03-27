import { Controller, Post, Body } from "@nestjs/common";
import { TelegramService } from "../telegram/telegram.service";

@Controller("api/notifications")
export class NotificationsController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  async handleNotification(@Body() event: any) {
    if (!event.tgChatId) {
      console.warn("No tgChatId in notification event");
      return { success: false, reason: "tgChatId is required" };
    }

    try {
      let message: string;

      let menu: object;

      switch (event.type) {
        case "newsurvey":
          message = `
Уважаемый ${event.payload.firstName} ${event.payload.lastName},
У Вас новый активный опрос.
          `;
          menu = {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Связаться с доктором",
                    callback_data: "contact_doctor",
                  },
                ],
                [
                  {
                    text: "Новые уведомления",
                    callback_data: "notifications_patient",
                  },
                ],
                [
                  {
                    text: "Активные опросы",
                    callback_data: "my_active_surveys",
                  },
                ],
              ],
            },
          }
          break;
        case "contactmerequest":
          message = `
Уважаемый доктор,
Пациент ${event.payload.firstName} ${event.payload.firstName} просит Вас связаться с ним.
Номер медицинской карты: ${event.payload.medicalCardNumber}
Email: ${event.payload.email}
          `;
          menu = {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Список пациентов",
                    callback_data: "list_of_patients",
                  },
                ],
                [
                  {
                    text: "Найти пациента по email",
                    callback_data: "find_patient",
                  },
                ],
                [
                  {
                    text: "Новые уведомления",
                    callback_data: "my_notifications",
                  },
                  {
                    text: "Все уведомления",
                    callback_data: "old_notifications",
                  },
                ],
              ],
            },
          };
          break;
        case "criticalindicators":
          message = `
Уважаемый доктор,
У пациента ${event.payload.firstName} ${event.payload.firstName} имеются критические показатели.
Номер медицинской карты: ${event.payload.medicalCardNumber}
Email: ${event.payload.email}
          `;
          menu = {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Список пациентов",
                    callback_data: "list_of_patients",
                  },
                ],
                [
                  {
                    text: "Найти пациента по email",
                    callback_data: "find_patient",
                  },
                ],
                [
                  {
                    text: "Новые уведомления",
                    callback_data: "my_notifications",
                  },
                  {
                    text: "Все уведомления",
                    callback_data: "old_notifications",
                  },
                ],
              ],
            },
          };
          break;
        // Добавьте другие типы событий...
        default:
          console.warn(`Unknown notification type: ${event.type}`);
          return { success: false, reason: "unknown event type" };
      }

      await this.telegramService.sendNotification(event.tgChatId, message, menu);
      return { success: true };
    } catch (error) {
      console.error("Notification error:", error);
      return { success: false, reason: "internal error" };
    }
  }
}
