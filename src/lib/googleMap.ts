import {
  Client,
  PlaceInputType,
  Language,
} from "@googlemaps/google-maps-services-js";
import { log } from "../util/log";

class GoogleMapClient {
  private static instance: GoogleMapClient;
  private client: Client;

  private constructor() {
    this.client = new Client({});
    log("Google Maps APIクライアントを初期化しました");
  }

  private getApiKey(): string | undefined {
    return process.env.GOOGLE_MAPS_API_KEY;
  }

  public static getInstance(): GoogleMapClient {
    if (!GoogleMapClient.instance) {
      GoogleMapClient.instance = new GoogleMapClient();
    }
    return GoogleMapClient.instance;
  }

  public async getPlaceId(placeName: string): Promise<string | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("APIキーが設定されていません");
    }

    const response = await this.client.findPlaceFromText({
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
  }

  public async getPlaceDetails(placeId: string): Promise<any> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("APIキーが設定されていません");
    }

    const response = await this.client.placeDetails({
      params: {
        place_id: placeId,
        key: apiKey,
        fields: ["name", "formatted_address", "reviews"],
        language: Language.ja,
      },
      timeout: 1000,
    });
    return response.data.result;
  }
}

export const googleMapClient = GoogleMapClient.getInstance();
