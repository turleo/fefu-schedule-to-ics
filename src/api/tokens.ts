import type { ApiManager } from "./types";

function isJwtExpired(jwt: string) {
  const payloadB64 = jwt.split(".")[1];
  const payload = JSON.parse(atob(payloadB64));
  const expireTimestamp = parseFloat(payload.exp) * 1000;
  const expire = new Date(expireTimestamp);
  const now = new Date();
  return expire < now;
}

export async function refreshAccessToken(this: ApiManager) {
  if (!isJwtExpired(this.config.accessToken)) {
    return;
  }
  const r = await fetch("https://esa.dvfu.ru/oauth/token/refresh/", {
    method: "POST",
    headers: {
      "User-Agent": "Dart/3.4 (dart:io)",
      "content-type": "application/json",
      "Accept-Language": "ru-RU",
      Accept: "*/*",
      Authorization: this.config.appAccess,
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: this.config.refreshToken,
    }),
  });

  if (r.status !== 200) {
    throw new Error(await r.text());
  }
  const json = await r.json();
  this.config.accessToken = json.access_token;
  this.config.refreshToken = json.refresh_token;
}
