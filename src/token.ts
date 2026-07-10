import { LineType } from "./linetypes";

export interface Token {
    type: LineType;
    text: string;
}