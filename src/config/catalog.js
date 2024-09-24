export const tripIndex = {
  outbound: [
    "ashland-adams-northbound",
    "ashland-to-loop",
    "clinton-to-loop",
  ],
  inbound: [
    "ashland-lake-southbound",
    "clark-lake-to-home",
  ],
};

export const tripCatalog = {
  // OUTBOUND

  "ashland-to-loop": {
    name: "Ashland to Loop",
    options: [
      {
        transitType: "train",
        stopId: "30032",
        routes: ["Pink", "Green"]
      }
    ],
    destinations: [
      { name: "Clark/Lake", stopId: "30074" },
      { name: "State/Lake", stopId: "30050" },
      { name: "Roosevelt", stopId: "30081" },
    ]
  },

  "clinton-to-loop": {
    name: "Clinton to Loop",
    options: [
      {
        transitType: "train",
        stopId: "30221",
        routes: ["Pink", "Green"]
      }
    ],
    destinations: [
      { name: "Clark/Lake", stopId: "30074" }
    ]
  },

  "ashland-adams-northbound": {
    name: "Ashland & Adams Northbound",
    options: [
      {
        transitType: "bus",
        stopId: "17177",
        routes: ["9"]
      },
      {
        transitType: "bus",
        stopId: "17076",
        routes: ["X9"]
      }
    ],
    destinations: [
      { name: "Ashland & Lake", stopId: "14783" },
      { name: "Ashland & Milwaukee", stopId: "6252" }
    ]
  },

  // INBOUND

  "clark-lake-to-home": {
    name: "Clark/Lake To Home",
    options: [
      {
        transitType: "train",
        stopId: "30075",
        routes: ["Green"]
      },
      {
        transitType: "train",
        stopId: "30074",
        routes: ["Pink"]
      }
    ],
    destinations: [
      { name: "Ashland", stopId: "30033" },
    ]
  },

  "ashland-lake-southbound": {
    name: "Ashland & Lake Southbound",
    options: [
      {
        transitType: "bus",
        stopId: "6035",
        routes: ["9", "X9"]
      },
    ],
    destinations: [
      { name: "Ashland & Adams", stopId: "6040" },
    ]
  },

};
