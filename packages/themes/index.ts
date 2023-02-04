export type Theme = {
  breakpoints?: {
    mobile?: string;
  };
  snapshot?: {
    backgroundColor?: string;
    backgroundImage?: string;
    // NEXT: remove support of this, next/image specific
    backgroundLayout?:
      | "fixed"
      | "fill"
      | "intrinsic"
      | "responsive"
      | undefined;
    backgroundFit?: "cover" | "contain" | "fill" | "none" | undefined;
    scale?: number;
  };
  title?: {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    padding?: string;
    fontWeight?: string;
    fontFamily?: string;
  };
  board?: {
    backgroundColor?: string;
  };
  block?: {
    color?: string;
    fontSize?: string;
    border?: string;
    fontWeight?: string;
    fontFamily?: string;
    padding?: string;
    textShadow?: string;
    backgroundColor?: string;
  };
  meta?: {
    fontFamily?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
  };
};

export const THEMES = [
  // "Cinematic",  //TODO: Fix this theme
  "Isometric",
  "Dashed",
  "Horror",
  "Mosaic",
  "Painting",
  "Synthetic",
];

// NEXT: Use https://github.com/vega/ts-json-schema-generator
export const THEME_JSON_SCHEMA = {
  properties: {
    snapshot: {
      properties: {
        backgroundColor: {
          type: "string",
        },
        backgroundFit: {
          enum: ["cover", "contain", "fill", "none"],
          type: "string",
        },
        backgroundImage: {
          type: "string",
        },
        backgroundLayout: {
          enum: ["fixed", "fill", "intrinsic", "responsive"],
          type: "string",
        },
        scale: {
          type: "number",
        },
      },
      type: "object",
    },
    board: {
      properties: {
        backgroundColor: {
          type: "string",
        },
      },
      type: "object",
    },
    block: {
      properties: {
        backgroundColor: {
          type: "string",
        },
        border: {
          type: "string",
        },
        color: {
          type: "string",
        },
        fontFamily: {
          type: "string",
        },
        fontSize: {
          type: "string",
        },
        fontWeight: {
          type: "string",
        },
        padding: {
          type: "string",
        },
        textShadow: {
          type: "string",
        },
      },
      type: "object",
    },
    meta: {
      properties: {
        color: {
          type: "string",
        },
        fontFamily: {
          type: "string",
        },
        fontSize: {
          type: "string",
        },
        fontWeight: {
          type: "string",
        },
      },
      type: "object",
    },
    title: {
      properties: {
        backgroundColor: {
          type: "string",
        },
        color: {
          type: "string",
        },
        fontFamily: {
          type: "string",
        },
        fontSize: {
          type: "string",
        },
        fontWeight: {
          type: "string",
        },
        padding: {
          type: "string",
        },
      },
      type: "object",
    },
  },
  type: "object",
};
