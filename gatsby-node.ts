import { GatsbyNode } from "gatsby";
import path from "path";
import { tripCatalog } from "./src/config/catalog";
import { stationIndex } from "./src/config/index";

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const { createPage } = actions;

  // favorites pages
  const tripKeys = Object.keys(tripCatalog);
  tripKeys.forEach((tripKey) => {
    createPage({
      path: `/favorites/${tripKey}`,
      component: path.resolve("./src/templates/favorite.tsx"),
      context: { tripKey },
    });
  });

  // station and station stop pages
  const stationIds = Object.keys(stationIndex);
  stationIds.forEach((stationId) => {
    createPage({
      path: `/station/${stationId}`,
      component: path.resolve("./src/templates/station.tsx"),
      context: { stationId },
    });

    const station = stationIndex[stationId];
    const stopIds = Object.keys(station.stops);
    stopIds.forEach((stopId) => {
      createPage({
        path: `/station/${stationId}/${stopId}`,
        component: path.resolve("./src/templates/stationStop.tsx"),
        context: { stationId, stopId },
      });
    });
  });
};

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({ actions, getConfig }) => {
  const config = getConfig();

  if (config.module) {
    config.ignoreWarnings = [
      (warning: any) => {
        if (
          warning.message &&
          warning.message.includes("mini-css-extract-plugin") &&
          warning.message.includes("Conflicting order")
        ) {
          return true;
        }
        return false;
      }
    ];
  }

  actions.replaceWebpackConfig(config);
};
