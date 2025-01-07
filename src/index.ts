import * as dotenv from "dotenv";
import * as path from "path";
import { log } from "./util/log";
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
    log("場所名を引数として指定してください", "error");
    log('USAGE: make "場所名"');
    return;
  }

  try {
    const placeId = await googleMapClient.getPlaceId(placeName);

    if (!placeId) {
      log("No results found.");
      return;
    }

    const placeDetails = await googleMapClient.getPlaceDetails(placeId);
    const output: string[] = [];
    File.displayBasicInfo(placeDetails, output);
    File.displayReviews(placeDetails.reviews || [], output);

    const outputPath = path.join("outputs", `${placeName}.md`);
    File.writeToFile(outputPath, output.join(""));
    log(`ファイルが作成・更新されました: ${outputPath}`, "success");
  } catch (e) {
    log(`エラーが発生しました: ${e}`, "error");
  }
};

// メイン処理の実行
main();
