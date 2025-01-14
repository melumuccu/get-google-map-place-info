import * as dotenv from "dotenv";
import * as path from "path";
import { log } from "./util/log";
import * as Log from "./util/log";
import * as File from "./util/file/index";
import { googleMapNewClient } from "./lib/googleMapNew";
import { FIELD_MASKS } from "./lib/fieldMasks";

// .envファイルから環境変数を読み込む
dotenv.config();

/**
 * メイン処理
 */
const main = async () => {
  // コマンドライン引数から場所名を取得
  const placeName = process.argv[2]
    ? decodeURIComponent(process.argv[2])
    : null;
  if (!placeName || placeName === " ") {
    log({ message: "場所名を引数として指定してください", type: "error" });
    log({ message: 'USAGE: make "場所名"' });
    return;
  }

  try {
    const placeId = await googleMapNewClient.getPlaceId(placeName);

    if (!placeId) {
      log({ message: "No results found." });
      return;
    }

    const placeDetails = await googleMapNewClient.getPlaceDetails(
      placeId,
      FIELD_MASKS
    );
    const output: string[] = [];

    // 各セクションの追加
    File.addBasicInfo(output, placeDetails);
    File.addOtherInfo(output, placeDetails);
    File.addReviews(output, placeDetails);

    const outputPath = path.join("outputs", `${placeName}.md`);
    File.writeToFile(outputPath, output.join(""));
    log({
      message: `ファイルが作成・更新されました: ${outputPath}`,
      type: "success",
    });

    // 全ての場所情報をコンソールに表示
    Log.displayAllPlaceInfo(placeDetails);
  } catch (e) {
    log({ message: e as Error });
  }
};

// メイン処理の実行
main();
