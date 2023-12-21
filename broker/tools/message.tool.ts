import { FetchTool } from "../../tools/fetch.tool";
import { CustomError } from "../../constructors/error.constructor";
import { AxiosError, AxiosResponse } from "axios";

export class MessageTool extends FetchTool {
  private readonly codes = {
    resent: [502, 503, 429, 504, 420, 418],
    success: [200, 201, 202, 204, 205],
  };

  constructor() {
    super();
  }

  private statusCb = (response: AxiosResponse) => response.status;

  private errorStatusCb = (error: AxiosError) => {
    if (!error.response || !error.response.status) return 500;
    return error.response.status;
  };

  async send(url: string, body: any, token: string) {
    const headers = { auth: token };
    const promise = this.tool.post(url, body, { headers });
    await this.delay();
    const code = await this.handler(promise, this.statusCb, this.errorStatusCb);

    console.log("STATUS CODE", code);

    if (this.codes.success.includes(code)) return false;

    if (this.codes.resent.includes(code)) return true;

    throw new CustomError("Fetch", `Failed to send message: ${body}`, code);
  }
}
