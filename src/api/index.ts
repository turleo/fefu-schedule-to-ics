import type Config from "@/config/types";
import { requestEvents } from "./fetch";
import { createAccessToken, refreshAccessToken } from "./tokens";
import { RefreshTokenError, type ApiManager } from "./types";

export async function ApiManager(config: Config): Promise<ApiManager> {
  const manager = {
    config,
    createAccessToken,
    refreshAccessToken,
    requestEvents,
  };
  try {
    await manager.refreshAccessToken();
  } catch (e) {
    if (e instanceof RefreshTokenError) {
      await manager.createAccessToken(config.username, config.password);
    } else {
      throw e;
    }
  }

  return manager;
}
