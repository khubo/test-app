// @flow
import { useEffect, useState, useMemo } from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";
import ky from "ky";

import api from "../api";
import { normalizeStyleURL } from "../lib/mapbox";
import config from "../../config.json";

// Status of a map style
type MapStyleStatus = "unknown" | "available" | "unavailable";
export type MapStyleType = "loading" | "custom" | "online" | "fallback";

// This map style is used if the user is online and there is no custom offline
// map installed
const onlineStyleURL = MapboxGL.StyleURL.Outdoors + "?" + Date.now();
// This map style is used if the user is offline and there is no custom offline
// map installed. It contains basic land, country, river and lake data and is
// generated by https://github.com/digidem/mapeo-offline-map
const fallbackStyleURL = "asset://offline-style.json";
let cachedStyleURL;

export default function useMapstyleURL(
  styleId: string = "default"
): {
  styleURL: string | void,
  styleType: MapStyleType,
} {
  const [customStyleStatus, setCustomStyleStatus] = useState<MapStyleStatus>(
    "unknown"
  );
  const [onlineStyleStatus, setOnlineStyleStatus] = useState<MapStyleStatus>(
    "unknown"
  );

  useEffect(() => {
    let didCancel = false;
    if (customStyleStatus !== "unknown") return;
    api
      .getMapStyle(styleId)
      .then(() => didCancel || setCustomStyleStatus("available"))
      .catch(() => didCancel || setCustomStyleStatus("unavailable"));
    return () => {
      didCancel = true;
    };
  }, [customStyleStatus, styleId]);

  // TODO: Use https://npm.im/@react-native-community/netinfo to check online
  // status and monitor it. We should put this in context so it is available
  // across the app.
  useEffect(() => {
    let didCancel = false;
    if (onlineStyleStatus !== "unknown") return;
    ky.get(normalizeStyleURL(onlineStyleURL, config.mapboxAccessToken))
      .json()
      .then(() => didCancel || setOnlineStyleStatus("available"))
      .catch(() => didCancel || setOnlineStyleStatus("unavailable"));
    return () => {
      didCancel = true;
    };
  }, [onlineStyleStatus]);

  // 1. If a custom style is available, use that
  // 2. If not, if the online style is available (e.g. user is online) use that
  // 3. If neither a custom style is available nor the online style is
  //    accessible, then fallback to the default style included in the app
  return useMemo(() => {
    let styleURL = cachedStyleURL;
    let styleType: MapStyleType = "loading";
    if (customStyleStatus === "available") {
      styleURL = cachedStyleURL = api.getMapStyleUrl(styleId);
      styleType = "custom";
    } else if (
      customStyleStatus === "unavailable" &&
      onlineStyleStatus === "available"
    ) {
      styleURL = cachedStyleURL = onlineStyleURL;
      styleType = "online";
    } else if (
      customStyleStatus === "unavailable" &&
      onlineStyleStatus === "unavailable"
    ) {
      styleURL = cachedStyleURL = fallbackStyleURL;
      styleType = "fallback";
    }
    return {
      styleURL,
      styleType,
    };
  }, [customStyleStatus, onlineStyleStatus, styleId]);
}
