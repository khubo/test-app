import React from "react";
import api from "../api";
import bugsnag from "../lib/logger";

let cachedDeviceId;

export default function useDeviceId() {
  const [deviceId, setDeviceId] = React.useState(cachedDeviceId);

  React.useEffect(() => {
    // Device ID never changes, so we only need to fetch it once.
    if (cachedDeviceId) return;
    api
      .getDeviceId()
      .then(deviceId => {
        setDeviceId(deviceId);
        cachedDeviceId = deviceId;
      })
      .catch(bugsnag.notify);
  }, []);

  return deviceId;
}
