import { QueueService } from "../services/queue.service";
import { AuthedExtendedRequest } from "../types/request.types";
import { ListOfEntities, Notification } from "../types/censhare.types";

export class QueueController {
  private service = new QueueService();

  async notify(req: AuthedExtendedRequest<Notification>) {
    const { identification, body } = req;
    const user_id = identification._id;
    await this.service.notify(user_id, body);
  }

  async initialize(req: AuthedExtendedRequest<ListOfEntities>) {
    const { identification } = req;
    const user_id = identification._id;
    await this.service.initialize(user_id);
  }
}
