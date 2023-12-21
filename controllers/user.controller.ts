import {
  AuthedExtendedRequest,
  AuthedRequest,
  ExtendedRequest,
} from "../types/request.types";
import { UserService } from "../services/user.service";
import { FinalStep, InitialStep, Login, Refresh } from "../types/auth.types";
import { ChangePassword, ResetPassword } from "../types/user.types";

export class UserController {
  private service = new UserService();

  async initRegistration(req: ExtendedRequest<InitialStep>) {
    const { body } = req;
    const result = await this.service.createAccount(body);
    return result;
  }

  async finishRegistration(req: AuthedExtendedRequest<FinalStep>) {
    const { body, identification } = req;
    const data = { ...body, ...identification };
    const result = this.service.fillInAccount(data);
    return result;
  }

  async login(req: ExtendedRequest<Login>) {
    const { body } = req;
    const result = await this.service.login(body);
    return result;
  }

  async refresh(req: ExtendedRequest<Refresh>) {
    const { body } = req;
    const result = await this.service.refresh(body);
    return result;
  }

  async getById(req: AuthedRequest) {
    const { identification } = req;
    const result = await this.service.getById(identification._id);
    return result;
  }

  async getByEmail(req: ExtendedRequest<InitialStep>) {
    const { body } = req;
    const result = await this.service.getByEmail(body.email);
    return result;
  }

  async changePassword(req: AuthedExtendedRequest<ChangePassword>) {
    const { body, identification } = req;
    await this.service.changePassword(identification._id, body);
    return {};
  }

  async resetPassword(req: ExtendedRequest<ResetPassword>) {
    const { body } = req;
    await this.service.resetPassword(body);
    return {};
  }

  async delete(req: AuthedRequest) {
    const { identification } = req;
    await this.service.delete(identification._id);
    return {};
  }
}
