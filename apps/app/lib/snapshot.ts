import type { Snapshot as SnapshotType } from "types";

import * as Y from "yjs";
import jsonata from "jsonata";

import { THEME_JSON_SCHEMA, THEMES } from "@thenftsnapshot/themes"
import { bufferToBase64 } from "./utils";

// NEXT: Versioning

const META_THEME_LABEL = "Theme";
const META_TYPE_LABEL = "Type";
const META_BOARD_COLS_LABEL = "Board size, columns";
const META_BOARD_ROWS_LABEL = "Board size, rows";
const META_BLOCK_WIDTH_LABEL = "Block width (px)";
const META_BLOCK_HEIGHT_LABEL = "Block height (px)";

const TYPES = [
  "Collage"
];

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
  "id": "",
  "external_url": "",
  "image": "",
  "name": "Snapshot Demo",
  "version": "",
  "description": "",
  "theme_styles": {},
  "attributes": [
    {
      "trait_type": META_THEME_LABEL,
      "value": "Isometric"
    },
    {
      "trait_type": META_TYPE_LABEL,
      "value": "Collage"
    },
    {
      "trait_type": META_BOARD_COLS_LABEL,
      "value": 1
    },
    {
      "trait_type": META_BOARD_ROWS_LABEL,
      "value": 1
    },
    {
      "trait_type": META_BLOCK_WIDTH_LABEL,
      "value": 300
    },
    {
      "trait_type": META_BLOCK_HEIGHT_LABEL,
      "value": 300
    }
  ],
  "blocks": [
    {
      "col": 0,
      "row": 0,
      "image": "https://thenftsnapshot.s3.us-east-1.amazonaws.com/demo/images/demo.gif",
      "background": "#fff",
      "text": "Block 1:1 example",
      "info": "Tooltip",
      "url": "https://thenftsnapshot.com"
    }
  ]
};

export const META_SAMPLE_ENCODED =
  "AQGWoNPUDwAEAQCfBnsKICAibmFtZSI6ICJTbmFwc2hvdCBEZW1vIiwKICAiZGVzY3JpcHRpb24iOiAiIiwKICAidGhlbWVfc3R5bGVzIjoge30sCiAgImF0dHJpYnV0ZXMiOiBbCiAgICB7CiAgICAgICJ0cmFpdF90eXBlIjogIlRoZW1lIiwKICAgICAgInZhbHVlIjogIklzb21ldHJpYyIKICAgIH0sCiAgICB7CiAgICAgICJ0cmFpdF90eXBlIjogIlR5cGUiLAogICAgICAidmFsdWUiOiAiQ29sbGFnZSIKICAgIH0sCiAgICB7CiAgICAgICJ0cmFpdF90eXBlIjogIkJvYXJkIHNpemUsIGNvbHVtbnMiLAogICAgICAidmFsdWUiOiAxCiAgICB9LAogICAgewogICAgICAidHJhaXRfdHlwZSI6ICJCb2FyZCBzaXplLCByb3dzIiwKICAgICAgInZhbHVlIjogMQogICAgfSwKICAgIHsKICAgICAgInRyYWl0X3R5cGUiOiAiQmxvY2sgd2lkdGggKHB4KSIsCiAgICAgICJ2YWx1ZSI6IDMwMAogICAgfSwKICAgIHsKICAgICAgInRyYWl0X3R5cGUiOiAiQmxvY2sgaGVpZ2h0IChweCkiLAogICAgICAidmFsdWUiOiAzMDAKICAgIH0KICBdLAogICJibG9ja3MiOiBbCiAgICB7CiAgICAgICJjb2wiOiAwLAogICAgICAicm93IjogMCwKICAgICAgImltYWdlIjogImh0dHBzOi8vdGhlbmZ0c25hcHNob3QuczMudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20vZGVtby9pbWFnZXMvZGVtby5naWYiLAogICAgICAiYmFja2dyb3VuZCI6ICIjZmZmIiwKICAgICAgInRleHQiOiAiQmxvY2sgMToxIGV4YW1wbGUiLAogICAgICAiaW5mbyI6ICJUb29sdGlwIiwKICAgICAgInVybCI6ICJodHRwczovL3RoZW5mdHNuYXBzaG90LmNvbSIKICAgIH0KICBdCn0A";

// NEXT: move to bin
export function createSnapshotTemplate(meta) {
  const ydoc = new Y.Doc();
  ydoc.getText().insert(0, meta);
  const template = Y.encodeStateAsUpdate(ydoc);
  return bufferToBase64(template);
}

export const SNAPSHOT_JSON_SCHEMA = {
  title: "Snapshot",
  type: "object",
  required: [
    "id",
    "name",
    "theme",
    "board",
    "block",
    "blocks"
  ],
  properties: {
    id: {
      type: "string",
      description: "Alphanumeric unique id"
    },
    name: {
      type: "string",
      description: "Snapshot name"
    },
    theme: {
      type: "object",
      description: "Theme object",
      properties: {
        name: {
          type: "string",
          description: "Theme name"
        },
        styles: {
          type: "object"
        }
      },
      required: ["name"]
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
        }
      },
      required: ["cols", "rows"]
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
        }
      },
      required: ["width", "height"]
    },
    blocks: {
      type: "array",
      description: "Snapshot blocks",
      items: {
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
            pattern:
              "^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?$",
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
          }
        },
        required: ["col", "row"],
      }
    }
  }
};

export const META_JSON_SCHEMA = {
  title: "Snapshot Metadata",
  type: "object",
  required: [
    "name",
    "attributes",
    "blocks"
  ],
  properties: {
    id: {
      type: "string",
      description: "Alphanumeric unique id"
    },
    name: {
      type: "string",
      description: "Snapshot name"
    },
    version: {
      type: "string",
      description: "Snapshot engine version, default is 0.0.1"
    },
    external_url: {
      type: "string",
      description: "Snapshot url"
    },
    image: {
      type: "string",
      description: "Snapshot image url"
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
              META_BLOCK_HEIGHT_LABEL
            ]
          },
          value: {
            type: [
              "string",
              "number"
            ]
          }
        },
        allOf: [
          { 
            if: {
              properties: {
                trait_type: {
                  const: META_THEME_LABEL
                }
              }
            },
            then: {
              properties: {
                value: {
                  enum: THEMES
                }
              }
            }
          },
          {
            if: {
              properties: {
                trait_type: {
                  const: META_TYPE_LABEL
                }
              }
            },
            then: {
              properties: {
                value: {
                  enum: TYPES
                }
              }
            }
          },
          {
            if: {
              properties: {
                trait_type: {
                  enum: [
                    META_BOARD_COLS_LABEL,
                    META_BOARD_ROWS_LABEL,
                    META_BLOCK_WIDTH_LABEL,
                    META_BLOCK_HEIGHT_LABEL
                  ]
                }
              }
            },
            then: {
              properties: {
                value: {
                  type: [
                    "integer"
                  ]
                }
              }
            }
          }
        ]
      }
    },
    blocks: {
      type: "array",
      description: "Snapshot blocks",
      items: {
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
            pattern:
              "^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?$",
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
        },
        required: ["col", "row"],
      },
    }
  }
};

export async function toMetaFromSnapshot(snapshot: SnapshotType): Promise<string|null> {
  try {
    const expression = jsonata(META_FORMAT);
    let meta = await expression.evaluate(snapshot);
    return JSON.stringify(meta, null, 2);
  } catch (error) {
    return null;
  }
}

export async function fromMetaToSnapshot(meta: JSON | Object): Promise<SnapshotType> {
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