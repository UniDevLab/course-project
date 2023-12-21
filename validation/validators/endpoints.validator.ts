import { FetchTool } from "../../tools/fetch.tool";
import { CustomError } from "../../constructors/error.constructor";
import { AxiosError, AxiosResponse } from "axios";

export class UriValidator extends FetchTool {
  private readonly codes = {
    success: [401],
  };

  constructor() {
    super();
  }

  private statusCb = (response: AxiosResponse) => response.status;

  private errorStatusCb = (error: AxiosError) => {
    if (!error.response || !error.response.status) return 500;
    return error.response.status;
  };

  async ping(url: string) {
    const request = this.tool.post(url, {});
    const code = await this.handler(request, this.statusCb, this.errorStatusCb);

    if (this.codes.success.includes(code)) return;

    throw new CustomError("Fetch", `Failed to ping ${url}`, 500);
  }
}
