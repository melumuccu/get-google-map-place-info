import { google } from "@googlemaps/places/build/protos/protos";

type Place = google.maps.places.v1.IPlace;

/**
 * 基本情報セクションを追加
 * @param output 出力配列
 * @param place 場所情報
 */
export const addBasicInfo = (output: string[], place: Place) => {
  const hasBasicInfo =
    place.displayName?.text ||
    place.primaryTypeDisplayName?.text ||
    place.businessStatus;
  const hasLocationInfo =
    place.formattedAddress ||
    place.shortFormattedAddress ||
    place.googleMapsUri;
  const hasContactInfo = place.nationalPhoneNumber || place.websiteUri;

  if (hasBasicInfo || hasLocationInfo || hasContactInfo || place.id) {
    output.push("# 基本情報\n\n");

    // 店舗の基本情報
    if (hasBasicInfo) {
      if (place.displayName?.text) {
        output.push(`店舗名: ${place.displayName.text}\n\n`);
      }
      if (place.primaryTypeDisplayName?.text) {
        output.push(`業種: ${place.primaryTypeDisplayName.text}\n\n`);
      }
      if (place.businessStatus) {
        const statusMap: { [key: string]: string } = {
          OPERATIONAL: "営業中",
          CLOSED_TEMPORARILY: "一時休業中",
          CLOSED_PERMANENTLY: "閉店",
        };
        output.push(
          `営業状態: ${
            statusMap[place.businessStatus] || place.businessStatus
          }\n\n`
        );
      }
    }

    // 所在地情報
    if (hasLocationInfo) {
      output.push("## 所在地情報\n\n");
      if (place.formattedAddress) {
        output.push(`詳細住所: ${place.formattedAddress}\n\n`);
      }
      if (place.shortFormattedAddress) {
        output.push(`簡易住所: ${place.shortFormattedAddress}\n\n`);
      }
      if (place.googleMapsUri) {
        output.push(`地図を見る: ${place.googleMapsUri}\n\n`);
      }
    }

    // 連絡先情報
    if (hasContactInfo) {
      output.push("## 連絡先\n\n");
      if (place.nationalPhoneNumber) {
        output.push(`電話番号: ${place.nationalPhoneNumber}\n\n`);
      }
      if (place.websiteUri) {
        output.push(`ウェブサイト: ${place.websiteUri}\n\n`);
      }
    }

    // 識別情報
    if (place.id) {
      output.push("## システム情報\n\n");
      output.push(`プレイスID: ${place.id}\n\n`);
    }
  }
};
