import { LogBox } from "react-native";

export const configureLogs = () => {
  // Ignore all logs
  LogBox.ignoreAllLogs(true);
  // Or ignore specific logs
  LogBox.ignoreLogs(["Removed"]);
  // Or you can overwrite console.warn
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0].includes("Removed")) {
      return;
    }
    originalWarn(...args);
  };
};
