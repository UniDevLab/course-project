import axios, {
  Axios,
  AxiosError,
  AxiosResponse,
  CreateAxiosDefaults,
  RawAxiosRequestHeaders,
} from "axios";
import { CustomError } from "../constructors/error.constructor";
import { ErrorCallback, ResponseCallback } from "../types/fetch.types";

export class FetchTool {
  tool: Axios;

  private headers: RawAxiosRequestHeaders = {
    "Content-Type": "application/json",
  };

  constructor(baseURL: string = null) {
    const config = this.setConfig(baseURL);
    this.tool = axios.create(config);
  }

  private setConfig(baseURL: string | null) {
    const config: CreateAxiosDefaults = { headers: this.headers };

    if (baseURL) config.baseURL = baseURL;

    return config;
  }

  private errorCb = (error: AxiosError) => {
    throw new CustomError("Fetch", "Failed to fetch!", error.status || 500);
  };

  private responseCb = (response: AxiosResponse) => response.data;

  delay(time: number = null) {
    if (!time) time = Math.floor(Math.random() * 3000) + 1;
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  formRoute(...paths: Array<string | number>) {
    const base = "/";
    let route = base;

    for (const path of paths) {
      if (path !== "") {
        route += path + base;
      }
    }

    route = route.replace(/\/$/, "");
    return route;
  }

  handler<R, E>(
    promise: Promise<AxiosResponse>,
    resCb: ResponseCallback<R> = this.responseCb,
    errCb: ErrorCallback<E> = this.errorCb
  ) {
    return promise.then(resCb).catch(errCb);
  }
}
