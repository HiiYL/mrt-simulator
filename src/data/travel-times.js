// Inter-station travel times in minutes (from LTA first train timings)
// Each array represents travel time FROM station[i] TO station[i+1]
// Generated: 2025-12-23T08:21:30.407Z

export const INTER_STATION_TIMES = {
  "EW": [
    2,
    2,
    3,
    3,
    3,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    2,
    2,
    2,
    2,
    2,
    4,
    3,
    2,
    2,
    2
  ],
  "CG": [
    2,
    2
  ],
  "NS": [
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    4,
    1,
    2,
    2,
    5,
    3,
    2,
    2,
    2,
    3,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2
  ],
  "NE": [
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    2,
    2,
    2,
    3,
    2,
    2,
    2,
    2
  ],
  "CC": [
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    2,
    2,
    3,
    2,
    2,
    2,
    3,
    2,
    2,
    2,
    2
  ],
  "DT": [
    2,
    2,
    3,
    2,
    3,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2
  ],
  "TE": [
    2,
    2,
    2,
    3,
    3,
    1,
    3,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    1,
    2,
    2,
    3,
    3,
    2,
    2,
    2,
    2,
    2
  ]
};

// Station timing data for UI display
export const STATION_TIMINGS = {
  "CG2": {
    "stationCode": "CG2",
    "stationName": "Changi Airport",
    "directions": [
      {
        "towards": "Tanah Merah",
        "firstTrain": {
          "weekday": "0531",
          "saturday": "0531",
          "sunday": "0559"
        }
      }
    ]
  },
  "EW1": {
    "stationCode": "EW1",
    "stationName": "Pasir Ris",
    "directions": [
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0528",
          "saturday": "0528",
          "sunday": "0554"
        }
      }
    ]
  },
  "EW3": {
    "stationCode": "EW3",
    "stationName": "Simei",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0519",
          "saturday": "0519",
          "sunday": "0545"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0533",
          "saturday": "0533",
          "sunday": "0559"
        }
      }
    ]
  },
  "EW4": {
    "stationCode": "EW4",
    "stationName": "Tanah Merah",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0516",
          "saturday": "0516",
          "sunday": "0542"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0536",
          "saturday": "0536",
          "sunday": "0602"
        }
      },
      {
        "towards": "Changi Airport",
        "firstTrain": {
          "weekday": "0520",
          "saturday": "0520",
          "sunday": "0547"
        }
      }
    ]
  },
  "EW5": {
    "stationCode": "EW5",
    "stationName": "Bedok",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0618",
          "saturday": "0618",
          "sunday": "0646"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0539",
          "saturday": "0539",
          "sunday": "0605"
        }
      }
    ]
  },
  "EW6": {
    "stationCode": "EW6",
    "stationName": "Kembangan",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0615",
          "saturday": "0615",
          "sunday": "0643"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0542",
          "saturday": "0542",
          "sunday": "0608"
        }
      }
    ]
  },
  "EW7": {
    "stationCode": "EW7",
    "stationName": "Eunos",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0613",
          "saturday": "0613",
          "sunday": "0641"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0544",
          "saturday": "0544",
          "sunday": "0610"
        }
      }
    ]
  },
  "EW9": {
    "stationCode": "EW9",
    "stationName": "Aljunied",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0609",
          "saturday": "0609",
          "sunday": "0637"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0548",
          "saturday": "0548",
          "sunday": "0614"
        }
      }
    ]
  },
  "EW10": {
    "stationCode": "EW10",
    "stationName": "Kallang",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0607",
          "saturday": "0607",
          "sunday": "0635"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0550",
          "saturday": "0550",
          "sunday": "0616"
        }
      }
    ]
  },
  "EW11": {
    "stationCode": "EW11",
    "stationName": "Lavender",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0605",
          "saturday": "0605",
          "sunday": "0633"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0552",
          "saturday": "0552",
          "sunday": "0618"
        }
      }
    ]
  },
  "EW15": {
    "stationCode": "EW15",
    "stationName": "Tanjong Pagar",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0556",
          "saturday": "0556",
          "sunday": "0624"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0602",
          "saturday": "0602",
          "sunday": "0628"
        }
      }
    ]
  },
  "EW17": {
    "stationCode": "EW17",
    "stationName": "Tiong Bahru",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0551",
          "saturday": "0551",
          "sunday": "0619"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0607",
          "saturday": "0607",
          "sunday": "0633"
        }
      }
    ]
  },
  "EW18": {
    "stationCode": "EW18",
    "stationName": "Redhill",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0549",
          "saturday": "0549",
          "sunday": "0617"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0609",
          "saturday": "0609",
          "sunday": "0635"
        }
      }
    ]
  },
  "EW19": {
    "stationCode": "EW19",
    "stationName": "Queenstown",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0546",
          "saturday": "0546",
          "sunday": "0614"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0611",
          "saturday": "0611",
          "sunday": "0637"
        }
      }
    ]
  },
  "EW20": {
    "stationCode": "EW20",
    "stationName": "Commonwealth",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0545",
          "saturday": "0545",
          "sunday": "0613"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0613",
          "saturday": "0613",
          "sunday": "0639"
        }
      }
    ]
  },
  "EW22": {
    "stationCode": "EW22",
    "stationName": "Dover",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0540",
          "saturday": "0540",
          "sunday": "0608"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0618",
          "saturday": "0618",
          "sunday": "0644"
        }
      }
    ]
  },
  "EW23": {
    "stationCode": "EW23",
    "stationName": "Clementi",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0538",
          "saturday": "0538",
          "sunday": "0606"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0621",
          "saturday": "0621",
          "sunday": "0647"
        }
      }
    ]
  },
  "EW25": {
    "stationCode": "EW25",
    "stationName": "Chinese Garden",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0540",
          "saturday": "0540",
          "sunday": "0610"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0517",
          "saturday": "0517",
          "sunday": "0547"
        }
      }
    ]
  },
  "EW26": {
    "stationCode": "EW26",
    "stationName": "Lakeside",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0538",
          "saturday": "0538",
          "sunday": "0608"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0519",
          "saturday": "0519",
          "sunday": "0549"
        }
      }
    ]
  },
  "EW27": {
    "stationCode": "EW27",
    "stationName": "Boon Lay",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0536",
          "saturday": "0536",
          "sunday": "0606"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0521",
          "saturday": "0521",
          "sunday": "0551"
        }
      }
    ]
  },
  "EW28": {
    "stationCode": "EW28",
    "stationName": "Pioneer",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0534",
          "saturday": "0534",
          "sunday": "0604"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0523",
          "saturday": "0523",
          "sunday": "0553"
        }
      }
    ]
  },
  "EW29": {
    "stationCode": "EW29",
    "stationName": "Joo Koon",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0531",
          "saturday": "0531",
          "sunday": "0601"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0527",
          "saturday": "0527",
          "sunday": "0557"
        }
      }
    ]
  },
  "EW30": {
    "stationCode": "EW30",
    "stationName": "Gul Circle",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0526",
          "saturday": "0526",
          "sunday": "0556"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0530",
          "saturday": "0530",
          "sunday": "0600"
        }
      }
    ]
  },
  "EW31": {
    "stationCode": "EW31",
    "stationName": "Tuas Crescent",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0523",
          "saturday": "0523",
          "sunday": "0553"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0532",
          "saturday": "0532",
          "sunday": "0602"
        }
      }
    ]
  },
  "EW32": {
    "stationCode": "EW32",
    "stationName": "Tuas West Road",
    "directions": [
      {
        "towards": "Pasir Ris",
        "firstTrain": {
          "weekday": "0521",
          "saturday": "0531",
          "sunday": "0551"
        }
      },
      {
        "towards": "Tuas Link",
        "firstTrain": {
          "weekday": "0534",
          "saturday": "0534",
          "sunday": "0604"
        }
      }
    ]
  },
  "NS2": {
    "stationCode": "NS2",
    "stationName": "Bukit Batok",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0545",
          "saturday": "0545",
          "sunday": "0608"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0519",
          "saturday": "0519",
          "sunday": "0538"
        }
      }
    ]
  },
  "NS3": {
    "stationCode": "NS3",
    "stationName": "Bukit Gombak",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0543",
          "saturday": "0543",
          "sunday": "0606"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0521",
          "saturday": "0521",
          "sunday": "0540"
        }
      }
    ]
  },
  "NS5": {
    "stationCode": "NS5",
    "stationName": "Yew Tee",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0537",
          "saturday": "0537",
          "sunday": "0600"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0527",
          "saturday": "0527",
          "sunday": "0546"
        }
      }
    ]
  },
  "NS7": {
    "stationCode": "NS7",
    "stationName": "Kranji",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0543",
          "saturday": "0543",
          "sunday": "0607"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0522",
          "saturday": "0522",
          "sunday": "0538"
        }
      }
    ]
  },
  "NS8": {
    "stationCode": "NS8",
    "stationName": "Marsiling",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0541",
          "saturday": "0540",
          "sunday": "0604"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0524",
          "saturday": "0524",
          "sunday": "0541"
        }
      }
    ]
  },
  "NS10": {
    "stationCode": "NS10",
    "stationName": "Admiralty",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0535",
          "saturday": "0534",
          "sunday": "0558"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0530",
          "saturday": "0530",
          "sunday": "0548"
        }
      }
    ]
  },
  "NS11": {
    "stationCode": "NS11",
    "stationName": "Sembawang",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0531",
          "saturday": "0530",
          "sunday": "0554"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0534",
          "saturday": "0534",
          "sunday": "0552"
        }
      }
    ]
  },
  "NS12": {
    "stationCode": "NS12",
    "stationName": "Canberra",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0529",
          "saturday": "0529",
          "sunday": "0552"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0535",
          "saturday": "0535",
          "sunday": "0551"
        }
      }
    ]
  },
  "NS13": {
    "stationCode": "NS13",
    "stationName": "Yishun",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0527",
          "saturday": "0526",
          "sunday": "0550"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0524",
          "saturday": "0524",
          "sunday": "0557"
        }
      }
    ]
  },
  "NS14": {
    "stationCode": "NS14",
    "stationName": "Khatib",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0525",
          "saturday": "0524",
          "sunday": "0548"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0526",
          "saturday": "0526",
          "sunday": "0559"
        }
      }
    ]
  },
  "NS15": {
    "stationCode": "NS15",
    "stationName": "Yio Chu Kang",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0520",
          "saturday": "0519",
          "sunday": "0543"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0531",
          "saturday": "0531",
          "sunday": "0604"
        }
      }
    ]
  },
  "NS16": {
    "stationCode": "NS16",
    "stationName": "Ang Mo Kio",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0517",
          "saturday": "0516",
          "sunday": "0540"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0534",
          "saturday": "0534",
          "sunday": "0607"
        }
      }
    ]
  },
  "NS18": {
    "stationCode": "NS18",
    "stationName": "Braddell",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0606",
          "saturday": "0620",
          "sunday": "0627"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0539",
          "saturday": "0539",
          "sunday": "0605"
        }
      }
    ]
  },
  "NS19": {
    "stationCode": "NS19",
    "stationName": "Toa Payoh",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0604",
          "saturday": "0618",
          "sunday": "0625"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0541",
          "saturday": "0541",
          "sunday": "0606"
        }
      }
    ]
  },
  "NS20": {
    "stationCode": "NS20",
    "stationName": "Novena",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0601",
          "saturday": "0615",
          "sunday": "0622"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0544",
          "saturday": "0544",
          "sunday": "0609"
        }
      }
    ]
  },
  "NS22": {
    "stationCode": "NS22",
    "stationName": "Orchard",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0611",
          "saturday": "0611",
          "sunday": "0636"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0549",
          "saturday": "0549",
          "sunday": "0614"
        }
      }
    ]
  },
  "NS23": {
    "stationCode": "NS23",
    "stationName": "Somerset",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0609",
          "saturday": "0609",
          "sunday": "0634"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0551",
          "saturday": "0551",
          "sunday": "0616"
        }
      }
    ]
  },
  "NS28": {
    "stationCode": "NS28",
    "stationName": "Marina South Pier",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0610",
          "saturday": "0610",
          "sunday": "0638"
        }
      }
    ]
  },
  "NE5": {
    "stationCode": "NE5",
    "stationName": "Clarke Quay",
    "directions": [
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0608",
          "saturday": "0608",
          "sunday": "0628"
        }
      },
      {
        "towards": "Punggol Coast",
        "firstTrain": {
          "weekday": "0551",
          "saturday": "0551",
          "sunday": "0611"
        }
      }
    ]
  },
  "NE8": {
    "stationCode": "NE8",
    "stationName": "Farrer Park",
    "directions": [
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0602",
          "saturday": "0602",
          "sunday": "0622"
        }
      },
      {
        "towards": "Punggol Coast",
        "firstTrain": {
          "weekday": "0557",
          "saturday": "0557",
          "sunday": "0617"
        }
      }
    ]
  },
  "NE9": {
    "stationCode": "NE9",
    "stationName": "Boon Keng",
    "directions": [
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0600",
          "saturday": "0600",
          "sunday": "0620"
        }
      },
      {
        "towards": "Punggol Coast",
        "firstTrain": {
          "weekday": "0559",
          "saturday": "0559",
          "sunday": "0619"
        }
      }
    ]
  },
  "NE10": {
    "stationCode": "NE10",
    "stationName": "Potong Pasir",
    "directions": [
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0558",
          "saturday": "0558",
          "sunday": "0618"
        }
      },
      {
        "towards": "Punggol Coast",
        "firstTrain": {
          "weekday": "0602",
          "saturday": "0602",
          "sunday": "0622"
        }
      }
    ]
  },
  "NE11": {
    "stationCode": "NE11",
    "stationName": "Woodleigh",
    "directions": [
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0556",
          "saturday": "0556",
          "sunday": "0616"
        }
      },
      {
        "towards": "Punggol Coast",
        "firstTrain": {
          "weekday": "0604",
          "saturday": "0604",
          "sunday": "0624"
        }
      }
    ]
  },
  "NE13": {
    "stationCode": "NE13",
    "stationName": "Kovan",
    "directions": [
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0551",
          "saturday": "0551",
          "sunday": "0611"
        }
      },
      {
        "towards": "Punggol Coast",
        "firstTrain": {
          "weekday": "0608",
          "saturday": "0608",
          "sunday": "0628"
        }
      }
    ]
  },
  "NE14": {
    "stationCode": "NE14",
    "stationName": "Hougang",
    "directions": [
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0549",
          "saturday": "0549",
          "sunday": "0609"
        }
      },
      {
        "towards": "Punggol Coast",
        "firstTrain": {
          "weekday": "0611",
          "saturday": "0611",
          "sunday": "0631"
        }
      }
    ]
  },
  "NE15": {
    "stationCode": "NE15",
    "stationName": "Buangkok",
    "directions": [
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0546",
          "saturday": "0546",
          "sunday": "0606"
        }
      },
      {
        "towards": "Punggol Coast",
        "firstTrain": {
          "weekday": "0613",
          "saturday": "0613",
          "sunday": "0633"
        }
      }
    ]
  },
  "NE18": {
    "stationCode": "NE18",
    "stationName": "Punggol Coast",
    "directions": [
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0539",
          "saturday": "0539",
          "sunday": "0559"
        }
      }
    ]
  },
  "CC2": {
    "stationCode": "CC2",
    "stationName": "Bras Basah",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0554",
          "saturday": "0554",
          "sunday": "0621"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0539",
          "saturday": "0539",
          "sunday": "0606"
        }
      }
    ]
  },
  "CC3": {
    "stationCode": "CC3",
    "stationName": "Esplanade",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0552",
          "saturday": "0552",
          "sunday": "0619"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0541",
          "saturday": "0541",
          "sunday": "0608"
        }
      }
    ]
  },
  "CC5": {
    "stationCode": "CC5",
    "stationName": "Nicoll Highway",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0548",
          "saturday": "0548",
          "sunday": "0615"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0545",
          "saturday": "0545",
          "sunday": "0612"
        }
      }
    ]
  },
  "CC6": {
    "stationCode": "CC6",
    "stationName": "Stadium",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0545",
          "saturday": "0545",
          "sunday": "0613"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0547",
          "saturday": "0547",
          "sunday": "0615"
        }
      }
    ]
  },
  "CC7": {
    "stationCode": "CC7",
    "stationName": "Mountbatten",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0544",
          "saturday": "0544",
          "sunday": "0611"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0535",
          "saturday": "0535",
          "sunday": "0603"
        }
      }
    ]
  },
  "CC8": {
    "stationCode": "CC8",
    "stationName": "Dakota",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0542",
          "saturday": "0542",
          "sunday": "0609"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0537",
          "saturday": "0537",
          "sunday": "0604"
        }
      }
    ]
  },
  "CC11": {
    "stationCode": "CC11",
    "stationName": "Tai Seng",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0535",
          "saturday": "0535",
          "sunday": "0602"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0544",
          "saturday": "0544",
          "sunday": "0611"
        }
      }
    ]
  },
  "CC12": {
    "stationCode": "CC12",
    "stationName": "Bartley",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0547",
          "saturday": "0547",
          "sunday": "0614"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0516",
          "saturday": "0516",
          "sunday": "0540"
        }
      }
    ]
  },
  "CC14": {
    "stationCode": "CC14",
    "stationName": "Lorong Chuan",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0542",
          "saturday": "0542",
          "sunday": "0609"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0520",
          "saturday": "0520",
          "sunday": "0544"
        }
      }
    ]
  },
  "CC16": {
    "stationCode": "CC16",
    "stationName": "Marymount",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0537",
          "saturday": "0537",
          "sunday": "0604"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0525",
          "saturday": "0525",
          "sunday": "0550"
        }
      }
    ]
  },
  "CC17": {
    "stationCode": "CC17",
    "stationName": "Caldecott",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0534",
          "saturday": "0534",
          "sunday": "0602"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0528",
          "saturday": "0528",
          "sunday": "0552"
        }
      }
    ]
  },
  "CC20": {
    "stationCode": "CC20",
    "stationName": "Farrer Road",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0543",
          "saturday": "0543",
          "sunday": "0604"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0534",
          "saturday": "0534",
          "sunday": "0559"
        }
      }
    ]
  },
  "CC21": {
    "stationCode": "CC21",
    "stationName": "Holland Village",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0540",
          "saturday": "0540",
          "sunday": "0601"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0537",
          "saturday": "0537",
          "sunday": "0601"
        }
      }
    ]
  },
  "CC23": {
    "stationCode": "CC23",
    "stationName": "one-north",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0536",
          "saturday": "0536",
          "sunday": "0557"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0541",
          "saturday": "0541",
          "sunday": "0605"
        }
      }
    ]
  },
  "CC24": {
    "stationCode": "CC24",
    "stationName": "Kent Ridge",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0535",
          "saturday": "0535",
          "sunday": "0556"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0535",
          "saturday": "0535",
          "sunday": "0600"
        }
      }
    ]
  },
  "CC25": {
    "stationCode": "CC25",
    "stationName": "Haw Par Villa",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0532",
          "saturday": "0532",
          "sunday": "0553"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0538",
          "saturday": "0538",
          "sunday": "0602"
        }
      }
    ]
  },
  "CC26": {
    "stationCode": "CC26",
    "stationName": "Pasir Panjang",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0530",
          "saturday": "0530",
          "sunday": "0551"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0540",
          "saturday": "0540",
          "sunday": "0604"
        }
      }
    ]
  },
  "CC27": {
    "stationCode": "CC27",
    "stationName": "Labrador Park",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0534",
          "saturday": "0534",
          "sunday": "0556"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0542",
          "saturday": "0542",
          "sunday": "0607"
        }
      }
    ]
  },
  "CC28": {
    "stationCode": "CC28",
    "stationName": "Telok Blangah",
    "directions": [
      {
        "towards": "Dhoby Ghaut",
        "firstTrain": {
          "weekday": "0532",
          "saturday": "0532",
          "sunday": "0554"
        }
      },
      {
        "towards": "HarbourFront",
        "firstTrain": {
          "weekday": "0544",
          "saturday": "0544",
          "sunday": "0608"
        }
      }
    ]
  },
  "DT2": {
    "stationCode": "DT2",
    "stationName": "Cashew",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0614",
          "saturday": "0614",
          "sunday": "0635"
        }
      },
      {
        "towards": "Expo",
        "firstTrain": {
          "weekday": "0532",
          "saturday": "0532",
          "sunday": "0552"
        }
      }
    ]
  },
  "DT3": {
    "stationCode": "DT3",
    "stationName": "Hillview",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0613",
          "saturday": "0613",
          "sunday": "0633"
        }
      },
      {
        "towards": "Expo",
        "firstTrain": {
          "weekday": "0534",
          "saturday": "0534",
          "sunday": "0554"
        }
      }
    ]
  },
  "DT5": {
    "stationCode": "DT5",
    "stationName": "Beauty World",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0608",
          "saturday": "0608",
          "sunday": "0629"
        }
      },
      {
        "towards": "Expo",
        "firstTrain": {
          "weekday": "0537",
          "saturday": "0537",
          "sunday": "0557"
        }
      }
    ]
  },
  "DT6": {
    "stationCode": "DT6",
    "stationName": "King Albert Park",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0606",
          "saturday": "0606",
          "sunday": "0627"
        }
      },
      {
        "towards": "Expo",
        "firstTrain": {
          "weekday": "0539",
          "saturday": "0539",
          "sunday": "0559"
        }
      }
    ]
  },
  "DT7": {
    "stationCode": "DT7",
    "stationName": "Sixth Avenue",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0604",
          "saturday": "0604",
          "sunday": "0624"
        }
      },
      {
        "towards": "Expo",
        "firstTrain": {
          "weekday": "0542",
          "saturday": "0542",
          "sunday": "0602"
        }
      }
    ]
  },
  "DT8": {
    "stationCode": "DT8",
    "stationName": "Tan Kah Kee",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0602",
          "saturday": "0602",
          "sunday": "0623"
        }
      },
      {
        "towards": "Expo",
        "firstTrain": {
          "weekday": "0544",
          "saturday": "0544",
          "sunday": "0604"
        }
      }
    ]
  },
  "DT10": {
    "stationCode": "DT10",
    "stationName": "Stevens",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0558",
          "saturday": "0558",
          "sunday": "0618"
        }
      },
      {
        "towards": "Expo",
        "firstTrain": {
          "weekday": "0548",
          "saturday": "0548",
          "sunday": "0608"
        }
      }
    ]
  },
  "DT13": {
    "stationCode": "DT13",
    "stationName": "Rochor",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0605",
          "saturday": "0605",
          "sunday": "0634"
        }
      },
      {
        "towards": "Expo",
        "firstTrain": {
          "weekday": "0555",
          "saturday": "0555",
          "sunday": "0615"
        }
      }
    ]
  },
  "DT17": {
    "stationCode": "DT17",
    "stationName": "Downtown",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0613",
          "saturday": "0613",
          "sunday": "0630"
        }
      },
      {
        "towards": "Expo",
        "firstTrain": {
          "weekday": "0604",
          "saturday": "0604",
          "sunday": "0624"
        }
      }
    ]
  },
  "DT18": {
    "stationCode": "DT18",
    "stationName": "Telok Ayer",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0611",
          "saturday": "0611",
          "sunday": "0629"
        }
      },
      {
        "towards": "Expo",
        "firstTrain": {
          "weekday": "0606",
          "saturday": "0606",
          "sunday": "0626"
        }
      }
    ]
  },
  "DT20": {
    "stationCode": "DT20",
    "stationName": "Fort Canning",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0608",
          "saturday": "0608",
          "sunday": "0626"
        }
      }
    ]
  },
  "DT21": {
    "stationCode": "DT21",
    "stationName": "Bencoolen",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0606",
          "saturday": "0606",
          "sunday": "0624"
        }
      }
    ]
  },
  "DT22": {
    "stationCode": "DT22",
    "stationName": "Jalan Besar",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0604",
          "saturday": "0604",
          "sunday": "0622"
        }
      }
    ]
  },
  "DT23": {
    "stationCode": "DT23",
    "stationName": "Bendemeer",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0602",
          "saturday": "0602",
          "sunday": "0620"
        }
      }
    ]
  },
  "DT24": {
    "stationCode": "DT24",
    "stationName": "Geylang Bahru",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0600",
          "saturday": "0600",
          "sunday": "0618"
        }
      }
    ]
  },
  "DT25": {
    "stationCode": "DT25",
    "stationName": "Mattar",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0558",
          "saturday": "0558",
          "sunday": "0616"
        }
      }
    ]
  },
  "DT27": {
    "stationCode": "DT27",
    "stationName": "Ubi",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0554",
          "saturday": "0554",
          "sunday": "0612"
        }
      }
    ]
  },
  "DT28": {
    "stationCode": "DT28",
    "stationName": "Kaki Bukit",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0552",
          "saturday": "0552",
          "sunday": "0610"
        }
      }
    ]
  },
  "DT29": {
    "stationCode": "DT29",
    "stationName": "Bedok North",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0550",
          "saturday": "0550",
          "sunday": "0608"
        }
      }
    ]
  },
  "DT30": {
    "stationCode": "DT30",
    "stationName": "Bedok Reservoir",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0548",
          "saturday": "0548",
          "sunday": "0606"
        }
      }
    ]
  },
  "DT31": {
    "stationCode": "DT31",
    "stationName": "Tampines West",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0545",
          "saturday": "0545",
          "sunday": "0603"
        }
      }
    ]
  },
  "DT33": {
    "stationCode": "DT33",
    "stationName": "Tampines East",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0541",
          "saturday": "0541",
          "sunday": "0559"
        }
      }
    ]
  },
  "DT34": {
    "stationCode": "DT34",
    "stationName": "Upper Changi",
    "directions": [
      {
        "towards": "Bukit Panjang",
        "firstTrain": {
          "weekday": "0538",
          "saturday": "0538",
          "sunday": "0556"
        }
      }
    ]
  },
  "TE1": {
    "stationCode": "TE1",
    "stationName": "Woodlands North",
    "directions": [
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0536",
          "saturday": "0536",
          "sunday": "0556"
        }
      }
    ]
  },
  "TE2": {
    "stationCode": "TE2",
    "stationName": "Toa Payoh",
    "directions": [
      {
        "towards": "Jurong East",
        "firstTrain": {
          "weekday": "0604",
          "saturday": "0618",
          "sunday": "0625"
        }
      },
      {
        "towards": "Marina South Pier",
        "firstTrain": {
          "weekday": "0541",
          "saturday": "0541",
          "sunday": "0606"
        }
      }
    ]
  },
  "TE3": {
    "stationCode": "TE3",
    "stationName": "Woodlands South",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0536",
          "saturday": "0536",
          "sunday": "0556"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0540",
          "saturday": "0540",
          "sunday": "0600"
        }
      }
    ]
  },
  "TE4": {
    "stationCode": "TE4",
    "stationName": "Springleaf",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0604",
          "saturday": "0604",
          "sunday": "0624"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0538",
          "saturday": "0538",
          "sunday": "0558"
        }
      }
    ]
  },
  "TE5": {
    "stationCode": "TE5",
    "stationName": "Lentor",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0601",
          "saturday": "0601",
          "sunday": "0621"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0541",
          "saturday": "0541",
          "sunday": "0601"
        }
      }
    ]
  },
  "TE6": {
    "stationCode": "TE6",
    "stationName": "Mayflower",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0559",
          "saturday": "0559",
          "sunday": "0619"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0544",
          "saturday": "0544",
          "sunday": "0604"
        }
      }
    ]
  },
  "TE7": {
    "stationCode": "TE7",
    "stationName": "Bright Hill",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0557",
          "saturday": "0557",
          "sunday": "0617"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0545",
          "saturday": "0545",
          "sunday": "0605"
        }
      }
    ]
  },
  "TE8": {
    "stationCode": "TE8",
    "stationName": "Upper Thomson",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0554",
          "saturday": "0554",
          "sunday": "0614"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0548",
          "saturday": "0548",
          "sunday": "0608"
        }
      }
    ]
  },
  "TE12": {
    "stationCode": "TE12",
    "stationName": "Napier",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0556",
          "saturday": "0556",
          "sunday": "0616"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0554",
          "saturday": "0554",
          "sunday": "0614"
        }
      }
    ]
  },
  "TE13": {
    "stationCode": "TE13",
    "stationName": "Orchard Boulevard",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0554",
          "saturday": "0554",
          "sunday": "0614"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0556",
          "saturday": "0556",
          "sunday": "0616"
        }
      }
    ]
  },
  "TE15": {
    "stationCode": "TE15",
    "stationName": "Great World",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0610",
          "saturday": "0610",
          "sunday": "0630"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0557",
          "saturday": "0557",
          "sunday": "0617"
        }
      }
    ]
  },
  "TE16": {
    "stationCode": "TE16",
    "stationName": "Havelock",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0609",
          "saturday": "0609",
          "sunday": "0629"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0559",
          "saturday": "0559",
          "sunday": "0619"
        }
      }
    ]
  },
  "TE18": {
    "stationCode": "TE18",
    "stationName": "Maxwell",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0606",
          "saturday": "0606",
          "sunday": "0626"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0558",
          "saturday": "0558",
          "sunday": "0618"
        }
      }
    ]
  },
  "TE19": {
    "stationCode": "TE19",
    "stationName": "Shenton Way",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0604",
          "saturday": "0604",
          "sunday": "0624"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0559",
          "saturday": "0559",
          "sunday": "0619"
        }
      }
    ]
  },
  "TE22": {
    "stationCode": "TE22",
    "stationName": "Gardens By the Bay",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0600",
          "saturday": "0600",
          "sunday": "0620"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0557",
          "saturday": "0557",
          "sunday": "0617"
        }
      }
    ]
  },
  "TE23": {
    "stationCode": "TE23",
    "stationName": "Tanjong Rhu",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0604",
          "saturday": "0604",
          "sunday": "0624"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0600",
          "saturday": "0600",
          "sunday": "0620"
        }
      }
    ]
  },
  "TE24": {
    "stationCode": "TE24",
    "stationName": "Katong Park",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0602",
          "saturday": "0602",
          "sunday": "0622"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0603",
          "saturday": "0603",
          "sunday": "0623"
        }
      }
    ]
  },
  "TE25": {
    "stationCode": "TE25",
    "stationName": "Tanjong Katong",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0600",
          "saturday": "0600",
          "sunday": "0620"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0605",
          "saturday": "0605",
          "sunday": "0625"
        }
      }
    ]
  },
  "TE26": {
    "stationCode": "TE26",
    "stationName": "Marine Parade",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0558",
          "saturday": "0558",
          "sunday": "0618"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0607",
          "saturday": "0607",
          "sunday": "0627"
        }
      }
    ]
  },
  "TE27": {
    "stationCode": "TE27",
    "stationName": "Marine Terrace",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0556",
          "saturday": "0556",
          "sunday": "0616"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0603",
          "saturday": "0603",
          "sunday": "0623"
        }
      }
    ]
  },
  "TE28": {
    "stationCode": "TE28",
    "stationName": "Siglap",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0558",
          "saturday": "0558",
          "sunday": "0618"
        }
      },
      {
        "towards": "Bayshore",
        "firstTrain": {
          "weekday": "0605",
          "saturday": "0605",
          "sunday": "0625"
        }
      }
    ]
  },
  "TE29": {
    "stationCode": "TE29",
    "stationName": "Bayshore",
    "directions": [
      {
        "towards": "Woodlands North",
        "firstTrain": {
          "weekday": "0556",
          "saturday": "0556",
          "sunday": "0616"
        }
      }
    ]
  }
};
