import "styled-components";
import type { Theme } from "@thenftsnapshot/themes"

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
