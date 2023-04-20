import type { Snapshot as SnapshotType } from "types";

import jsonata from "jsonata";

import { THEME_JSON_SCHEMA, THEMES } from "@thenftsnapshot/themes";
import { getObjectValue } from "./utils";

// NEXT: Versioning

const META_THEME_LABEL = "Theme";
const META_TYPE_LABEL = "Type";
const META_BOARD_COLS_LABEL = "Board size, columns";
const META_BOARD_ROWS_LABEL = "Board size, rows";
const META_BLOCK_WIDTH_LABEL = "Block width (px)";
const META_BLOCK_HEIGHT_LABEL = "Block height (px)";

const TYPES = ["Collage"];

const STYLES_MAPPINGS = {
  valign: {
    top: "flex-start",
    middle: "center",
    bottom: "flex-end",
  },
  align: {
    left: "left",
    center: "center",
    right: "right",
  },
};

const META_FORMAT = `{
  "id": id,
  "version": version,
  "external_url": url,
  "image": image,
  "name": name,
  "description": "",
  "attributes": [
      {
          "trait_type": "${META_THEME_LABEL}",
          "value": theme.name
      }, 
      {
          "trait_type": "${META_TYPE_LABEL}",
          "value": type
      }, 
      {
          "trait_type": "${META_BOARD_COLS_LABEL}",
          "value": board.cols
      },
      {
          "trait_type": "${META_BOARD_ROWS_LABEL}",
          "value": board.rows
      }, 
      {
          "trait_type": "${META_BLOCK_WIDTH_LABEL}",
          "value": block.width
      },
      {
          "trait_type": "${META_BLOCK_HEIGHT_LABEL}",
          "value": block.height
      }
  ],
  "theme_styles": theme.styles,
  "blocks": blocks
}`;

const SNAPSHOT_FORMAT = `{
  "name": name,
  "url": external_url,
  "image": image,
  "id": id,
  "version": version,
  "description": description,
  "theme": {
    "name": attributes[trait_type='${META_THEME_LABEL}'].value,
    "styles": theme_styles
  },
  "type": attributes[trait_type='${META_TYPE_LABEL}'].value,
  "board": {
    "cols": attributes[trait_type='${META_BOARD_COLS_LABEL}'].value,
    "rows": attributes[trait_type='${META_BOARD_ROWS_LABEL}'].value
  },
  "block": {
    "width": attributes[trait_type='${META_BLOCK_WIDTH_LABEL}'].value,
    "height": attributes[trait_type='${META_BLOCK_HEIGHT_LABEL}'].value
  },
  "blocks": blocks
}`;

export const META_SAMPLE = {
  id: "",
  external_url: "",
  image: "",
  name: "Snapshot Demo",
  version: "",
  description: "",
  theme_styles: {},
  attributes: [
    {
      trait_type: META_THEME_LABEL,
      value: "Isometric",
    },
    {
      trait_type: META_TYPE_LABEL,
      value: "Collage",
    },
    {
      trait_type: META_BOARD_COLS_LABEL,
      value: 1,
    },
    {
      trait_type: META_BOARD_ROWS_LABEL,
      value: 1,
    },
    {
      trait_type: META_BLOCK_WIDTH_LABEL,
      value: 300,
    },
    {
      trait_type: META_BLOCK_HEIGHT_LABEL,
      value: 300,
    },
  ],
  blocks: [
    {
      col: 0,
      row: 0,
      background: "#000",
      text: "Block 1:1 example",
      url: "https://thenftsnapshot.com",
    },
  ],
};

export const META_SAMPLE_ENCODED =
  "AQGjy8XJCQAEAQDUBXsNCiAgIm5hbWUiOiAiU25hcHNob3QgRGVtbyIsDQogICJkZXNjcmlwdGlvbiI6ICIiLA0KICAidGhlbWVfc3R5bGVzIjoge30sDQogICJhdHRyaWJ1dGVzIjogWw0KICAgIHsNCiAgICAgICJ0cmFpdF90eXBlIjogIlRoZW1lIiwNCiAgICAgICJ2YWx1ZSI6ICJJc29tZXRyaWMiDQogICAgfSwNCiAgICB7DQogICAgICAidHJhaXRfdHlwZSI6ICJUeXBlIiwNCiAgICAgICJ2YWx1ZSI6ICJDb2xsYWdlIg0KICAgIH0sDQogICAgew0KICAgICAgInRyYWl0X3R5cGUiOiAiQm9hcmQgc2l6ZSwgY29sdW1ucyIsDQogICAgICAidmFsdWUiOiAxDQogICAgfSwNCiAgICB7DQogICAgICAidHJhaXRfdHlwZSI6ICJCb2FyZCBzaXplLCByb3dzIiwNCiAgICAgICJ2YWx1ZSI6IDENCiAgICB9LA0KICAgIHsNCiAgICAgICJ0cmFpdF90eXBlIjogIkJsb2NrIHdpZHRoIChweCkiLA0KICAgICAgInZhbHVlIjogMzAwDQogICAgfSwNCiAgICB7DQogICAgICAidHJhaXRfdHlwZSI6ICJCbG9jayBoZWlnaHQgKHB4KSIsDQogICAgICAidmFsdWUiOiAzMDANCiAgICB9DQogIF0sDQogICJibG9ja3MiOiBbDQogICAgew0KICAgICAgImNvbCI6IDAsDQogICAgICAicm93IjogMCwNCiAgICAgICJiYWNrZ3JvdW5kIjogIiMwMDAiLA0KICAgICAgInRleHQiOiAiQmxvY2sgMToxIGV4YW1wbGUiLA0KICAgICAgInVybCI6ICJodHRwczovL3RoZW5mdHNuYXBzaG90LmNvbSINCiAgICB9DQogIF0NCn0A";

const SNAPSHOT_BLOCK_JSON_SCHEMA = {
  type: "object",
  properties: {
    col: {
      type: "integer",
      description: "Snapshot block column number",
    },
    row: {
      type: "integer",
      description: "Snapshot block row number",
    },
    image: {
      type: "string",
      pattern: "^(https?://){1,}.+$",
      description:
        "Snapshot block image url. For example https://example.com/image.png",
    },
    background: {
      type: "string",
      pattern: "^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|[a-z]+)$",
      description: "Snapshot block background color",
    },
    text: {
      type: "string",
      description: "Snapshot block text",
    },
    url: {
      type: "string",
      pattern: "^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?$",
      description: "Snapshot block link url",
    },
    youtubeId: {
      type: "string",
      pattern: "^[a-zA-Z0-9_-]+$",
      description: "Snapshot block youtube video id",
    },
    tweetId: {
      type: "string",
      pattern: "^[0-9]+$",
      description: "Snapshot block tweet id",
    },
    address: {
      type: "string",
      pattern: "^(0x)?[0-9a-fA-F]{40}$",
      description: "Author wallet address",
    },
    styles: {
      type: "object",
      properties: {
        text: {
          type: "object",
          properties: {
            align: {
              type: "string",
              description: "Snapshot block text align",
              enum: Object.keys(STYLES_MAPPINGS.align),
            },
            valign: {
              type: "string",
              description: "Snapshot block text vertical align",
              enum: Object.keys(STYLES_MAPPINGS.valign),
            },
            color: {
              type: "string",
              pattern: "^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|[a-z]+)$",
              description: "Snapshot block text color",
            },
            backgroundColor: {
              type: "string",
              pattern: "^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|[a-z]+)$",
              description: "Snapshot block text background color",
            },
            fontSize: {
              type: "string",
              description: "Snapshot block text font size",
            },
            fontWeight: {
              type: "string",
              description: "Snapshot block text font weight",
            },
            textShadow: {
              type: "string",
              description: "Snapshot block text shadow",
            },
          },
        },
      },
    },
  },
  required: ["col", "row"],
};

export const SNAPSHOT_JSON_SCHEMA = {
  title: "Snapshot",
  type: "object",
  required: ["id", "name", "theme", "board", "block", "blocks"],
  properties: {
    id: {
      type: "string",
      description: "Alphanumeric unique id",
    },
    name: {
      type: "string",
      description: "Snapshot name",
    },
    theme: {
      type: "object",
      description: "Theme object",
      properties: {
        name: {
          type: "string",
          description: "Theme name",
        },
        styles: {
          type: "object",
        },
      },
      required: ["name"],
    },
    board: {
      type: "object",
      description: "Snapshot board",
      properties: {
        cols: {
          type: "integer",
          description: "Snapshot board columns number",
        },
        rows: {
          type: "integer",
          description: "Snapshot board rows number",
        },
      },
      required: ["cols", "rows"],
    },
    block: {
      type: "object",
      description: "Snapshot block",
      properties: {
        width: {
          type: "integer",
          description: "Snapshot block width",
        },
        height: {
          type: "integer",
          description: "Snapshot block height",
        },
      },
      required: ["width", "height"],
    },
    blocks: {
      type: "array",
      description: "Snapshot blocks",
      items: SNAPSHOT_BLOCK_JSON_SCHEMA,
    },
  },
};

export const META_JSON_SCHEMA = {
  title: "Snapshot Metadata",
  type: "object",
  required: ["name", "attributes", "blocks"],
  properties: {
    id: {
      type: "string",
      description: "Alphanumeric unique id",
    },
    name: {
      type: "string",
      description: "Snapshot name",
    },
    version: {
      type: "string",
      description: "Snapshot engine version, default is 0.0.1",
    },
    external_url: {
      type: "string",
      description: "Snapshot url",
    },
    image: {
      type: "string",
      description: "Snapshot image url",
    },
    description: {
      type: "string",
      description: "Snapshot description",
    },
    theme_styles: THEME_JSON_SCHEMA,
    attributes: {
      type: "array",
      minItems: 6,
      items: {
        type: "object",
        properties: {
          trait_type: {
            type: "string",
            enum: [
              META_THEME_LABEL,
              META_TYPE_LABEL,
              META_BOARD_COLS_LABEL,
              META_BOARD_ROWS_LABEL,
              META_BLOCK_WIDTH_LABEL,
              META_BLOCK_HEIGHT_LABEL,
            ],
          },
          value: {
            type: ["string", "number"],
          },
        },
        allOf: [
          {
            if: {
              properties: {
                trait_type: {
                  const: META_THEME_LABEL,
                },
              },
            },
            then: {
              properties: {
                value: {
                  enum: THEMES,
                },
              },
            },
          },
          {
            if: {
              properties: {
                trait_type: {
                  const: META_TYPE_LABEL,
                },
              },
            },
            then: {
              properties: {
                value: {
                  enum: TYPES,
                },
              },
            },
          },
          {
            if: {
              properties: {
                trait_type: {
                  enum: [
                    META_BOARD_COLS_LABEL,
                    META_BOARD_ROWS_LABEL,
                    META_BLOCK_WIDTH_LABEL,
                    META_BLOCK_HEIGHT_LABEL,
                  ],
                },
              },
            },
            then: {
              properties: {
                value: {
                  type: ["integer"],
                },
              },
            },
          },
        ],
      },
    },
    blocks: {
      type: "array",
      description: "Snapshot blocks",
      items: SNAPSHOT_BLOCK_JSON_SCHEMA,
    },
  },
};

export async function toMetaFromSnapshot(
  snapshot: SnapshotType
): Promise<string | null> {
  try {
    const expression = jsonata(META_FORMAT);
    let meta = await expression.evaluate(snapshot);
    return JSON.stringify(meta, null, 2);
  } catch (error) {
    return null;
  }
}

export async function fromMetaToSnapshot(
  meta: JSON | Object
): Promise<SnapshotType> {
  try {
    const expression = jsonata(SNAPSHOT_FORMAT);
    return await expression.evaluate(meta);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function getSnapshotIdFromUrl(): string {
  return window.location.pathname.replace("/", "");
}

export const getStyle = function (...args: string[]): string | undefined {
  let value = Array.from(args).join(".");
  return getObjectValue(STYLES_MAPPINGS, value);
};
