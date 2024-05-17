import { PromiseTimings, ident } from "./api/QuizApi.ts";
import { Config } from "./config.ts";

export type TimeMeasurement = {
  ident: ident;
  description: string;
  timings: PromiseTimings;
};

export type ApiUserLog = TimeMeasurement[];

export type TimingLog = { [ApiUserUUID: string]: ApiUserLog | undefined };

export type BenchmarkReport = {
  uuid: string;
  reportStartTime: number;
  config: Omit<Config, "users">;

  results: TimingLog;
};

export class Reporter {
  private benchmarkReport: BenchmarkReport;

  constructor(config: Omit<Config, "users"> & { users?: undefined }) {
    this.benchmarkReport = {
      uuid: crypto.randomUUID(),
      reportStartTime: Date.now(),
      config,
      results: {},
    };
  }

  outputReport(): BenchmarkReport {
    return this.benchmarkReport;
  }

  addMeasurement(apiUserUUid: string, timeMeasurement: TimeMeasurement) {
    const log = this.benchmarkReport.results[apiUserUUid];
    if (log == undefined) {
      this.benchmarkReport.results[apiUserUUid] = [timeMeasurement];
    } else {
      log.push(timeMeasurement);
    }
  }
}
export interface Reporter {
  outputReport(): BenchmarkReport;
  addMeasurement(apiUserUUid: string, timeMeasurement: TimeMeasurement): void;
}
