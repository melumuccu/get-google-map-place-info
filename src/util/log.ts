import { PlaceData } from "@googlemaps/google-maps-services-js";
import { styleText } from "node:util";

type Log =
  | {
      message: string;
      type?: "error" | "warn" | "log" | "success";
    }
  | {
      message: Error;
      type?: undefined;
    };

/**
 * ログを装飾して出力する
 */
export const log = ({ message, type = "log" }: Log) => {
  if (message instanceof Error) {
    console.error(styleText("bgRed", " ERROR   "));
    console.error(message);
    return;
  }

  switch (type) {
    case "error":
      console.error(
        styleText("bgRed", " ERROR   ") + styleText("red", ` ${message}`)
      );
      break;
    case "warn":
      console.warn(
        styleText("bgYellow", " WARN    ") + styleText("yellow", ` ${message}`)
      );
      break;
    case "success":
      console.log(
        styleText("bgGreen", " SUCCESS ") + styleText("green", ` ${message}`)
      );
      break;
    default:
      console.log(styleText("bgGray", " LOG     ") + ` ${message}`);
  }
};

/**
 * 場所の詳細情報を全てログに出力する
 * @param {Partial<PlaceData>} place - 場所の詳細情報
 */
export const displayAllPlaceInfo = (place: Partial<PlaceData>) => {
  console.log("//======================");
  console.log(place);
};
