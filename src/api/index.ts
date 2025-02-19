import type Config from "@/config/types";
import { requestEvents } from "./fetch";
import { refreshAccessToken } from "./tokens";
import type { ApiManager } from "./types";

export function ApiManager(config: Config): ApiManager {
  return {
    config,
    refreshAccessToken,
    requestEvents,
  };
}
