import { CredentialsService } from "../services/credentials.service";
import { UpdateCredentialsData } from "../types/credential.types";
import { AuthedExtendedRequest, AuthedRequest } from "../types/request.types";

export class CredentialsController {
  private service = new CredentialsService();

  async getByUserId(req: AuthedRequest) {
    const { identification } = req;
    const result = await this.service.getByUserId(identification._id);
    return result;
  }

  async update(req: AuthedExtendedRequest<UpdateCredentialsData>) {
    const { identification, body } = req;
    const { _id } = identification;
    const result = await this.service.update(_id, body);
    return result;
  }
}
