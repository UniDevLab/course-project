import { QueueService } from "../services/queue.service";
import { Notification } from "../types/external/messages/messages.types";
import { ListOfEntities } from "../types/services/censhare.service.types";
import { AuthedExtendedRequest } from "../types/request.types";

export class QueueController {
  private service = new QueueService();

  notify = async (req: AuthedExtendedRequest<Notification>) => {
    const { identification, body } = req;
    const user_id = identification._id;
    await this.service.notify(user_id, body);
  };

  initialize = async (req: AuthedExtendedRequest<ListOfEntities>) => {
    const { identification } = req;
    const user_id = identification._id;
    await this.service.initialize(user_id);
  };
}
