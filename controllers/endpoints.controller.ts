import { EndpointsService } from "../services/endpoints.service";
import { UpdateEndpointsData } from "../types/uri.types";
import { AuthedExtendedRequest, AuthedRequest } from "../types/request.types";

export class EndpointsController {
  private service = new EndpointsService();

  async getByUserId(req: AuthedRequest) {
    const { identification } = req;
    const result = await this.service.getByUserId(identification._id);
    return result;
  }

  async update(req: AuthedExtendedRequest<UpdateEndpointsData>) {
    const { identification, body } = req;
    const { _id } = identification;
    const result = await this.service.update(_id, body);
    return result;
  }
}
