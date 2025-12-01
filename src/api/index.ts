import type Config from "@/config/types";
import { requestEvents } from "./fetch";
import { createAccessToken, refreshAccessToken } from "./tokens";
import type { ApiManager } from "./types";

export function ApiManager(config: Config): ApiManager {
  const manager = {
    config,
    createAccessToken,
    refreshAccessToken,
    requestEvents,
  };
  try {
    manager.refreshAccessToken();
  } catch (RefreshTokenError) {
    manager.createAccessToken(config.username, config.password);
  }

  return manager;
}
