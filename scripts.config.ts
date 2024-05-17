import type { DenonConfig } from "https://deno.land/x/denon/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: `denon run -A ./src/main.ts ../config.json "progress/topics/c6906727-fbd8-419a-809e-4a24de352d0d/trainings/26408628-a743-4f28-9d36-e4f7b4bcf636/questionnaires/4ec93c9d-53ac-4769-9ec0-d1c7220ed0c7/questions" ./content/basisschulungen/dokumentation.json`,
      desc: "run the benchmark",
    },
  },
  watcher: {
    // The number of milliseconds after the last change.
    interval: 350,
    // The file extensions that it will scan for.
    exts: ["ts", "tsx", "json"],

    match: ["src/**/*.*"],
    skip: ["*/.*/*"],
    // Use the legacy file monitoring algorithm. (walking)
    legacy: false,
  },
};

export default config;
