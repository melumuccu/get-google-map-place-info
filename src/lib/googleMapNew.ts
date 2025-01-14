import { PlacesClient } from "@googlemaps/places";
import { log } from "../util/log";
import axios from "axios";
import * as dotenv from "dotenv";

// .envファイルから環境変数を読み込む
dotenv.config();

class GoogleMapNewClient {
  private static instance: GoogleMapNewClient;
  private client: PlacesClient;

  /**
   * GoogleMapNewClientのプライベートコンストラクタ
   * @private
   */
  private constructor() {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("APIキーが設定されていません");
    }
    this.client = new PlacesClient({ apiKey });
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
    console.log(
      "🚀 => file: googleMapNew.ts:55 => GoogleMapNewClient => getPlaceId => placeName:",
      placeName
    );

    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("APIキーが設定されていません");
    }

    const request = {
      textQuery: placeName,
      languageCode: "ja",
    };

    const options = {
      otherArgs: {
        headers: {
          "X-Goog-FieldMask": "places.id,places.displayName",
        },
      },
    };

    const response = await this.client.searchText(request, options);

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
   * @param {string} placeId - 場所のID
   * @returns {Promise<any>} 場所の詳細情報
   * @throws {Error} APIキーが設定されていない場合
   * @public
   */
  public async getPlaceDetails(placeId: string): Promise<any> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("APIキーが設定されていません");
    }

    // 新しいPlaces APIでは全てのフィールドを明示的に指定
    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        params: {
          languageCode: "ja",
        },
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "id,displayName,formattedAddress,addressComponents,plusCode,location,viewport,rating,googleMapsUri,websiteUri,regularOpeningHours,currentOpeningHours,secondaryOpeningHours,businessStatus,userRatingCount,reviews,photos,priceLevel,editorialSummary,primaryType,types,nationalPhoneNumber,internationalPhoneNumber,formattedPhoneNumber,takeout,delivery,dineIn,curbsidePickup,reservable,servesBreakfast,servesBrunch,servesLunch,servesDinner,servesBeer,servesWine,servesVegetarianFood,wheelchairAccessibleEntrance,iconMaskBaseUri,iconBackgroundColor",
        },
      }
    );

    return response.data;
  }
}

export const googleMapNewClient = GoogleMapNewClient.getInstance();
