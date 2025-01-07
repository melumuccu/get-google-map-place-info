import {
  Client,
  PlaceInputType,
  Language,
} from "@googlemaps/google-maps-services-js";
import { log } from "../util/log";

let clientInstance: Client | null = null;

/**
 * Google Maps APIクライアントを取得する（シングルトン）
 * @returns {Client} APIクライアント
 */
export const getClient = (): Client => {
  if (!clientInstance) {
    clientInstance = new Client({});
    log("Google Maps APIクライアントを初期化しました");
  }
  return clientInstance;
};

/**
 * 環境変数からAPIキーを取得する
 * @returns {string | undefined} APIキー
 */
export const getApiKey = () => process.env.GOOGLE_MAPS_API_KEY;

/**
 * 場所のIDを取得する
 * @param {Client} client - Google Maps APIクライアント
 * @param {string} apiKey - APIキー
 * @param {string} placeName - 検索する場所の名前
 * @returns {Promise<string | null>} 場所IDまたはnull
 */
export const getPlaceId = async (
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
export const getPlaceDetails = async (
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
