import * as dotenv from "dotenv";
import * as path from "path";
import { log } from "../util/log";
import * as Log from "../util/log";
import * as File from "../util/file";
import { FieldMask, googleMapNewClient } from "../lib/googleMapNew";

// .envファイルから環境変数を読み込む
dotenv.config();

const FIELD_MASKS: FieldMask[] = [
  {
    description: "ユーザー補助機能の設定",
    field: "accessibilityOptions",
  },
  {
    description: "犬の同伴可能",
    field: "allowsDogs",
  },
  {
    description: "ビジネスのステータス",
    field: "businessStatus",
    memo: "閉業になってたらアプローチしない",
  },
  {
    description: "配信",
    field: "delivery",
  },
  {
    description: "イートイン",
    field: "dineIn",
  },
  {
    description: "表示名",
    field: "displayName",
  },
  {
    description: "編集者による概要",
    field: "editorialSummary",
  },
  {
    description: "フォーマット済み住所",
    field: "formattedAddress",
  },
  {
    description: "子供におすすめ",
    field: "goodForChildren",
  },
  {
    description: "グループにおすすめ",
    field: "goodForGroups",
  },
  {
    description: "スポーツ観戦向き",
    field: "goodForWatchingSports",
  },
  {
    description: "Google マップの URI",
    field: "googleMapsUri",
    memo: "Map表示に使用する",
  },
  {
    description: "プレイス ID",
    field: "id",
  },
  {
    description: "生演奏が楽しめるお店",
    field: "liveMusic",
  },
  {
    description: "子供向けメニュー",
    field: "menuForChildren",
  },
  {
    description: "国内の電話番号",
    field: "nationalPhoneNumber",
  },
  {
    description: "テラス席があるお店",
    field: "outdoorSeating",
  },
  {
    description: "駐車場の種類",
    field: "parkingOptions",
  },
  {
    description: "支払い方法",
    field: "paymentOptions",
  },
  {
    description: "写真",
    field: "photos",
    memo: "最大10件。誰でも投稿できるものなのでWEBサイトに使うのはよろしくない",
  },
  {
    description: "価格帯",
    field: "priceLevel",
  },
  {
    description: "価格帯",
    field: "priceRange",
  },
  {
    description: "メインのタイプの表示名",
    field: "primaryTypeDisplayName",
    memo: "text ex: 企業のオフィス",
  },
  {
    description: "非店舗型ビジネス",
    field: "pureServiceAreaBusiness",
  },
  {
    description: "評価",
    field: "rating",
  },
  {
    description: "通常営業時間",
    field: "regularOpeningHours",
  },
  {
    description: "予約可能",
    field: "reservable",
  },
  {
    description: "トイレ",
    field: "restroom",
  },
  {
    description: "レビュー",
    field: "reviews",
  },
  {
    description: "ビールを出すお店",
    field: "servesBeer",
  },
  {
    description: "モーニング サービスがあるお店",
    field: "servesBreakfast",
  },
  {
    description: "ブランチ メニューあり",
    field: "servesBrunch",
  },
  {
    description: "カクテルあり",
    field: "servesCocktails",
  },
  {
    description: "コーヒーあり",
    field: "servesCoffee",
  },
  {
    description: "デザートあり",
    field: "servesDessert",
  },
  {
    description: "ディナー メニューがあるお店",
    field: "servesDinner",
  },
  {
    description: "ランチメニューがあるお店",
    field: "servesLunch",
  },
  {
    description: "ベジタリアン料理あり",
    field: "servesVegetarianFood",
  },
  {
    description: "ワインを出すお店",
    field: "servesWine",
  },
  {
    description: "短いフォーマット済み住所",
    field: "shortFormattedAddress",
  },
  {
    description: "テイクアウト",
    field: "takeout",
  },
  {
    description: "ユーザーの評価の数",
    field: "userRatingCount",
  },
  {
    description: "ウェブサイトの URI",
    field: "websiteUri",
    memo: "ここがinstagramとかなら見込み顧客",
  },
];

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

    // 基本情報の表示
    if (placeDetails.displayName) {
      output.push(`# ${placeDetails.displayName.text}\n\n`);
    }
    if (placeDetails.formattedAddress) {
      output.push(`**住所**: ${placeDetails.formattedAddress}\n\n`);
    }

    // レビューの表示
    if (placeDetails.reviews && placeDetails.reviews.length > 0) {
      output.push("## レビュー\n\n");
      placeDetails.reviews.forEach((review) => {
        output.push(`### ${review.authorAttribution?.displayName}\n`);
        if (review.rating) {
          output.push(`評価: ${review.rating}点\n\n`);
        }
        if (review.text?.text) {
          output.push(`${review.text.text}\n\n`);
        }
        if (review.publishTime?.seconds) {
          const date = new Date(Number(review.publishTime.seconds) * 1000);
          output.push(`投稿日時: ${date.toLocaleDateString("ja-JP")}\n\n`);
        }
      });
    }

    const outputPath = path.join("outputs", `${placeName}_new.md`);
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
