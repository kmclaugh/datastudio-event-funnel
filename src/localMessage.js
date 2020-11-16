export const message = {
  tables: {
    DEFAULT: [
      {
        eventNameDimension: ["Position"],
        eventOrderDimension: ["Step 2"],
        eventMetric: [5756],
      },
      {
        eventNameDimension: ["Method"],
        eventOrderDimension: ["Step 3"],
        eventMetric: [5587],
      },
      {
        eventNameDimension: ["Add Your Logo"],
        eventOrderDimension: ["Step 1"],
        eventMetric: [5577],
      },
      {
        eventNameDimension: ["Artwork"],
        eventOrderDimension: ["Step 4"],
        eventMetric: [4496],
      },
      {
        eventNameDimension: ["Type"],
        eventOrderDimension: ["Step 5"],
        eventMetric: [4443],
      },
      {
        eventNameDimension: ["Finish - Configure"],
        eventOrderDimension: ["Step 6"],
        eventMetric: [4409],
      },
    ],
  },
  fields: {
    eventNameDimension: [
      {
        id: "qt_1mzknl98dc",
        name: "Event Label",
        type: "TEXT",
        concept: "DIMENSION",
      },
    ],
    eventOrderDimension: [
      {
        id: "qt_kio7hl98dc",
        name: "Event Action",
        type: "TEXT",
        concept: "DIMENSION",
      },
    ],
    eventMetric: [
      {
        id: "qt_jj70uk98dc",
        name: "Unique Events",
        type: "NUMBER",
        concept: "METRIC",
      },
    ],
  },
  style: {
    eventOrder: {
      value: "step1, step2, step3...",
      defaultValue: "step1, step2, step3...",
    },
    barColor: {
      value: {
        color: "#E64A19",
      },
      defaultValue: {
        color: "#1E555C",
      },
    },
  },
  theme: {
    themeFillColor: {
      color: "#ffffff",
      themeRef: {
        index: 0,
      },
    },
    themeFontColor: {
      color: "#000000",
      themeRef: {
        index: 1,
      },
    },
    themeFontFamily: "Roboto",
    themeAccentFillColor: {
      color: "#e0e0e0",
      themeRef: {
        index: 2,
      },
    },
    themeAccentFontColor: {
      color: "#000000",
      themeRef: {
        index: 3,
      },
    },
    themeAccentFontFamily: "Roboto",
    themeSeriesColor: [
      {
        color: "#0072f0",
        seriesRef: {
          index: 0,
        },
        themeRef: {
          index: 4,
        },
      },
      {
        color: "#00b6cb",
        seriesRef: {
          index: 1,
        },
        themeRef: {
          index: 5,
        },
      },
      {
        color: "#f10096",
        seriesRef: {
          index: 2,
        },
        themeRef: {
          index: 6,
        },
      },
      {
        color: "#f66d00",
        seriesRef: {
          index: 3,
        },
        themeRef: {
          index: 7,
        },
      },
      {
        color: "#ffa800",
        seriesRef: {
          index: 4,
        },
        themeRef: {
          index: 8,
        },
      },
      {
        color: "#7cb342",
        seriesRef: {
          index: 5,
        },
        themeRef: {
          index: 9,
        },
      },
      {
        color: "#5e35b1",
        seriesRef: {
          index: 6,
        },
      },
      {
        color: "#03a9f4",
        seriesRef: {
          index: 7,
        },
      },
      {
        color: "#ec407a",
        seriesRef: {
          index: 8,
        },
      },
      {
        color: "#ff7043",
        seriesRef: {
          index: 9,
        },
      },
      {
        color: "#737373",
        seriesRef: {
          index: 10,
        },
      },
      {
        color: "#f15a60",
        seriesRef: {
          index: 11,
        },
      },
      {
        color: "#7ac36a",
        seriesRef: {
          index: 12,
        },
      },
      {
        color: "#5a9bd4",
        seriesRef: {
          index: 13,
        },
      },
      {
        color: "#faa75a",
        seriesRef: {
          index: 14,
        },
      },
      {
        color: "#9e67ab",
        seriesRef: {
          index: 15,
        },
      },
      {
        color: "#ce7058",
        seriesRef: {
          index: 16,
        },
      },
      {
        color: "#d77fb3",
        seriesRef: {
          index: 17,
        },
      },
      {
        color: "#81d4fa",
        seriesRef: {
          index: 18,
        },
      },
      {
        color: "#f48fb1",
        seriesRef: {
          index: 19,
        },
      },
    ],
    themeIncreaseColor: {
      color: "#388e3c",
    },
    themeDecreaseColor: {
      color: "#f44336",
    },
    themeGridColor: {
      color: "#d1d1d1",
    },
  },
  interactions: {},
};
