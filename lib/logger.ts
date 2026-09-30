type LogLevel = "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

function writeLog(level: LogLevel, component: string, event: string, payload: LogPayload = {}) {
  const entry = {
    level,
    component,
    event,
    ts: new Date().toISOString(),
    ...payload,
  };

  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export function logInfo(component: string, event: string, payload?: LogPayload) {
  writeLog("info", component, event, payload);
}

export function logWarn(component: string, event: string, payload?: LogPayload) {
  writeLog("warn", component, event, payload);
}

export function logError(component: string, event: string, payload?: LogPayload) {
  writeLog("error", component, event, payload);
}
