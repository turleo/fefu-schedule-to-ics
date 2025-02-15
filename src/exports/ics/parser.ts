import { dateRegex, uidRegex } from "./consts";

export function getUIDAndDate(ical: string) {
  const uid = uidRegex.exec(ical)?.[1]
  if (!uid) {
    throw new TypeError("UID not found")
  }

  const dateResults = dateRegex.exec(ical);
  if (!dateResults) {
    throw new TypeError("begin date not found")
  }
  for (let i = 1; i <= 6; ++i) {
    if (typeof dateResults[i] !== "string") {
      throw new TypeError("date is not valid")
    }
  }

  const date = new Date(`${dateResults[1]}-${dateResults[2]}-${dateResults[3]}T${dateResults[4]}:${dateResults[5]}:${dateResults[6]}Z`)

  return {
    uid: parseInt(uid),
    date
  }
}