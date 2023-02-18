import type { Event } from "types/events";

export const event: Event = {
  name: "ready",
  once: true,
  run: async () => {
    console.log("Omuletzu' is online!");
  }
};
