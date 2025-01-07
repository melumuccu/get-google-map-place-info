// Google Maps APIクライアントと環境変数読み込み用モジュールをインポート
import {
  Client,
  PlaceInputType,
  Language,
} from "@googlemaps/google-maps-services-js";
import * as dotenv from "dotenv";

// .envファイルから環境変数を読み込む
dotenv.config();

/**
 * Google Maps APIクライアントを初期化する
 * @returns {Client} 初期化されたAPIクライアント
 */
const initializeClient = () => new Client({});

/**
 * 環境変数からAPIキーを取得する
 * @returns {string | undefined} APIキー
 */
const getApiKey = () => process.env.GOOGLE_MAPS_API_KEY;

/**
 * 場所のIDを取得する
 * @param {Client} client - Google Maps APIクライアント
 * @param {string} apiKey - APIキー
 * @param {string} placeName - 検索する場所の名前
 * @returns {Promise<string | null>} 場所IDまたはnull
 */
const getPlaceId = async (
  client: Client,
  apiKey: string,
  placeName: string
) => {
  const response = await client.findPlaceFromText({
    params: {
      input: placeName,
      inputtype: PlaceInputType.textQuery,
      key: apiKey,
      fields: ["place_id"],
    },
    timeout: 1000,
  });

  if (
    response.data.candidates &&
    response.data.candidates.length > 0 &&
    response.data.candidates[0].place_id
  ) {
    return response.data.candidates[0].place_id;
  }
  return null;
};

/**
 * 場所の詳細情報を取得する
 * @param {Client} client - Google Maps APIクライアント
 * @param {string} apiKey - APIキー
 * @param {string} placeId - 場所ID
 * @returns {Promise<any>} 場所の詳細情報
 */
const getPlaceDetails = async (
  client: Client,
  apiKey: string,
  placeId: string
) => {
  const response = await client.placeDetails({
    params: {
      place_id: placeId,
      key: apiKey,
      fields: ["name", "formatted_address", "reviews"],
      language: Language.ja,
    },
    timeout: 1000,
  });
  return response.data.result;
};

/**
 * 場所の基本情報を表示する
 * @param {any} place - 場所の詳細情報
 */
const displayBasicInfo = (place: any) => {
  console.log("# Name\n");
  console.log(place.name + "\n");
  console.log("# Address\n");
  console.log(place.formatted_address + "\n");
};

/**
 * レビュー情報を表示する
 * @param {any[]} reviews - レビュー配列
 */
const displayReviews = (reviews: any[]) => {
  // 4,5星レビューを全て表示し、3星以下は最大5件表示
  const filteredReviews = reviews
    .filter((review) => review.text?.trim()) // 空のレビューを除外
    .sort((a, b) => b.rating - a.rating); // 評価の高い順にソート

  if (filteredReviews.length > 0) {
    console.log("# Reviews\n");

    // 4,5星レビューを全て表示
    const highRated = filteredReviews.filter((review) => review.rating >= 4);
    highRated.forEach((review, index) => {
      console.log(`## Review ${index + 1}\n`);
      console.log(`**Author**: ${review.author_name}\n`);
      console.log(`**Rating**: ${"⭐".repeat(review.rating)}\n`);
      console.log(`${review.text}\n`);
      console.log("---\n");
    });

    // 3星以下のレビューを最大5件表示
    const otherReviews = filteredReviews
      .filter((review) => review.rating < 4)
      .slice(0, 5);

    if (otherReviews.length > 0) {
      console.log("\n# Other Reviews\n");
      otherReviews.forEach((review, index) => {
        console.log(`## Review ${index + 1}\n`);
        console.log(`**Author**: ${review.author_name}\n`);
        console.log(`**Rating**: ${"⭐".repeat(review.rating)}\n`);
        console.log(`${review.text}\n`);
        console.log("---\n");
      });
    }
  } else {
    console.log("\nNo reviews available.\n");
  }
};

/**
 * メイン処理
 */
const main = async () => {
  const client = initializeClient();
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("Error: GOOGLE_MAPS_API_KEY is not set in .env file.");
    return;
  }

  const placeName = process.argv[2];
  if (!placeName) {
    console.error("Error: Please provide a place name as an argument");
    console.log('Usage: make run INPUT="place name"');
    return;
  }

  try {
    const placeId = await getPlaceId(client, apiKey, placeName);

    if (!placeId) {
      console.log("No results found.");
      return;
    }

    const placeDetails = await getPlaceDetails(client, apiKey, placeId);
    displayBasicInfo(placeDetails);
    displayReviews(placeDetails.reviews || []);
  } catch (e) {
    console.error("Error:", e);
  }
};

// メイン処理の実行
main();
