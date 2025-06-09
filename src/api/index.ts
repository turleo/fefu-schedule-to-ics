import type Config from "@/config/types";
import { requestEvents } from "./fetch";
import { createAccessToken, refreshAccessToken } from "./tokens";
import type { ApiManager } from "./types";

export function ApiManager(config: Config): ApiManager {
  return {
    config,
    createAccessToken,
    refreshAccessToken,
    requestEvents,
  };
}
