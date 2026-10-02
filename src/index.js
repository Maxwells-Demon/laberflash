import { AAScheduler } from "./app.js";

export { AAScheduler };

export default {
  async fetch(request, env) {
    return env.LABERFLASH_DO.getByName("main").fetch(request);
  }
};
