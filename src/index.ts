import * as dotenv from "dotenv";
import * as path from "path";
import { log } from "./util/log";
import * as Log from "./util/log";
import * as File from "./util/file";
import { googleMapClient } from "./lib/googleMap";

// .envファイルから環境変数を読み込む
dotenv.config();

/**
 * メイン処理
 */
const main = async () => {
  const placeName = process.argv[2];
  if (!placeName) {
    log({ message: "場所名を引数として指定してください", type: "error" });
    log({ message: 'USAGE: make "場所名"' });
    return;
  }

  try {
    const placeId = await googleMapClient.getPlaceId(placeName);

    if (!placeId) {
      log({ message: "No results found." });
      return;
    }

    const placeDetails = await googleMapClient.getPlaceDetails(placeId);
    const output: string[] = [];
    File.displayBasicInfo(placeDetails, output);
    File.displayReviews(placeDetails.reviews || [], output);

    const outputPath = path.join("outputs", `${placeName}.md`);
    File.writeToFile(outputPath, output.join(""));
    log({
      message: `ファイルが作成・更新されました: ${outputPath}`,
      type: "success",
    });

    Log.displayAllPlaceInfo(placeDetails);
  } catch (e) {
    log({ message: e as Error });
  }
};

// メイン処理の実行
main();
