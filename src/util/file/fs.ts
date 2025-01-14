import * as fs from "fs";
import { log } from "../log";
import { google } from "@googlemaps/places/build/protos/protos";

type Place = google.maps.places.v1.IPlace;

/**
 * ファイルに内容を書き込む
 * @param {string} filePath - 出力ファイルパス
 * @param {string} content - 書き込む内容
 */
export const writeToFile = (filePath: string, content: string) => {
  if (fs.existsSync(filePath)) {
    log({
      message: `既存ファイルが存在するため上書きされます。 path: ${filePath}`,
      type: "warn",
    });
    fs.truncateSync(filePath, 0);
  }
  fs.writeFileSync(filePath, content, { encoding: "utf-8" });
};
