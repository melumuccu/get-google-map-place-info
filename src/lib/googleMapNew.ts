import { PlacesClient } from "@googlemaps/places";
import { log } from "../util/log";
import axios from "axios";
import * as dotenv from "dotenv";

// .envファイルから環境変数を読み込む
dotenv.config();

export type FieldMask = {
  description: string;
  field: string;
  memo?: string;
};

class GoogleMapNewClient {
  private static instance: GoogleMapNewClient;
  private client: PlacesClient;
  private apiKey: string;

  /**
   * GoogleMapNewClientのプライベートコンストラクタ
   * @private
   */
  private constructor() {
    this.apiKey = this.getApiKey() as string;
    if (!this.apiKey) {
      throw new Error("APIキーが設定されていません");
    }
    this.client = new PlacesClient({ apiKey: this.apiKey });
    log({ message: "Google Maps API(New)クライアントを初期化しました" });
  }

  /**
   * 環境変数からGoogle Maps APIキーを取得する
   * @returns {string|undefined} APIキー（設定されていない場合はundefined）
   * @private
   */
  private getApiKey(): string | undefined {
    return process.env.GOOGLE_PLACES_API_NEW;
  }

  /**
   * GoogleMapNewClientのシングルトンインスタンスを取得する
   * @returns {GoogleMapNewClient} GoogleMapNewClientのインスタンス
   * @public
   */
  public static getInstance(): GoogleMapNewClient {
    if (!GoogleMapNewClient.instance) {
      GoogleMapNewClient.instance = new GoogleMapNewClient();
    }
    return GoogleMapNewClient.instance;
  }

  /**
   * 場所の名前からPlace IDを取得する
   * @param {string} placeName - 検索する場所の名前
   * @returns {Promise<string|null>} 場所のID（見つからない場合はnull）
   * @throws {Error} APIキーが設定されていない場合
   * @public
   */
  public async getPlaceId(placeName: string): Promise<string | null> {
    const response = await this.client.searchText(
      {
        textQuery: placeName,
        languageCode: "ja",
      },
      {
        otherArgs: {
          headers: {
            "X-Goog-FieldMask": "places.id,places.displayName",
          },
        },
      }
    );

    const [searchResult] = response;
    if (
      searchResult &&
      searchResult.places &&
      searchResult.places.length > 0 &&
      searchResult.places[0].id
    ) {
      return searchResult.places[0].id;
    }
    return null;
  }

  /**
   * Place IDから場所の詳細情報を取得する
   * MEMO: `@googlemaps/places` のクライアントではPlace Details APIをサポートしていないため、URLを直接叩いている。
   * @param {string} placeId - 場所のID
   * @returns {Promise<any>} 場所の詳細情報
   * @throws {Error} APIキーが設定されていない場合
   * @public
   */
  public async getPlaceDetails(
    placeId: string,
    fieldMasks: FieldMask[]
  ): Promise<any> {
    const fields = fieldMasks.map((f) => f.field).join(",");

    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        params: {
          languageCode: "ja",
          fields,
          key: this.apiKey,
        },
      }
    );
    return response.data;
  }
}

export const googleMapNewClient = GoogleMapNewClient.getInstance();
