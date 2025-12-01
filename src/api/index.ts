import type Config from "@/config/types";
import { requestEvents } from "./fetch";
import { createAccessToken, refreshAccessToken } from "./tokens";
import { RefreshTokenError, type ApiManager } from "./types";

export function ApiManager(config: Config): ApiManager {
  const manager = {
    config,
    createAccessToken,
    refreshAccessToken,
    requestEvents,
  };
  try {
    manager.refreshAccessToken();
  } catch (e) {
    if (e instanceof RefreshTokenError) {
      manager.createAccessToken(config.username, config.password);
    } else {
      throw e;
    }
  }

  return manager;
}
