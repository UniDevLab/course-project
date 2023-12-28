import { readFile } from "./reader.tool";
import { UserService } from "../../src/services/user.service";
import { InitialStep } from "../../src/types/services/user.service.types";

const pathToFile = "tests/mocks/userService.json";
const mock = readFile(pathToFile);

export const createUser = async (account: InitialStep) => {
  process.env = mock.env;
  const service = new UserService();
  await service.createAccount(account);
  const user = await service.getByEmail(account.email);
  const _id = user._id.toString();
  await service.fillInAccount({ ...mock.details, _id });
  return _id;
};

export const deleteUser = async (id: string) => {
  process.env = mock.env;
  const service = new UserService();
  await service.delete(id);
};
