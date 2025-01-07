import * as dotenv from "dotenv";
import * as path from "path";
import { log } from "./util/log";
import * as File from "./util/file";
import * as GoogleMap from "./lib/googleMap";

// .envファイルから環境変数を読み込む
dotenv.config();

/**
 * メイン処理
 */
const main = async () => {
  const client = GoogleMap.getClient();
  const apiKey = GoogleMap.getApiKey();

  if (!apiKey) {
    log(".envファイルにGOOGLE_MAPS_API_KEYが設定されていません", "error");
    return;
  }

  const placeName = process.argv[2];
  if (!placeName) {
    log("場所名を引数として指定してください", "error");
    log('USAGE: make "場所名"');
    return;
  }

  try {
    const placeId = await GoogleMap.getPlaceId(client, apiKey, placeName);

    if (!placeId) {
      log("No results found.");
      return;
    }

    const placeDetails = await GoogleMap.getPlaceDetails(
      client,
      apiKey,
      placeId
    );
    const output: string[] = [];
    File.displayBasicInfo(placeDetails, output);
    File.displayReviews(placeDetails.reviews || [], output);

    const outputPath = path.join("outputs", `${placeName}.md`);
    File.writeToFile(outputPath, output.join(""));
    log(`出力ファイルが作成されました: ${outputPath}`);
  } catch (e) {
    log(`エラーが発生しました: ${e}`, "error");
  }
};

// メイン処理の実行
main();
