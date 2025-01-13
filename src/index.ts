import * as dotenv from "dotenv";
import * as path from "path";
import { log } from "./util/log";
import * as Log from "./util/log";
import * as File from "./util/file";
import { googleMapClient } from "./lib/googleMap";

const ALL_PLACE_FIELDS = [
  "address_components",
  "adr_address",
  "business_status",
  "curbside_pickup",
  "current_opening_hours",
  "delivery",
  "dine_in",
  "editorial_summary",
  "formatted_address",
  "formatted_phone_number",
  "geometry",
  "icon",
  "icon_background_color",
  "icon_mask_base_uri",
  "international_phone_number",
  "name",
  "opening_hours",
  "photos",
  "place_id",
  "plus_code",
  "price_level",
  "rating",
  "reservable",
  "reviews",
  "secondary_opening_hours",
  "serves_beer",
  "serves_breakfast",
  "serves_brunch",
  "serves_dinner",
  "serves_lunch",
  "serves_vegetarian_food",
  "serves_wine",
  "takeout",
  "types",
  "url",
  "user_ratings_total",
  "utc_offset",
  "vicinity",
  "website",
  "wheelchair_accessible_entrance",
];

const BASIC_PLACE_FIELDS = ["name", "formatted_address", "reviews"];

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

    const placeDetails = await googleMapClient.getPlaceDetails(
      placeId,
      ALL_PLACE_FIELDS
    );
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
