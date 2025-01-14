import { google } from "@googlemaps/places/build/protos/protos";

type Place = google.maps.places.v1.IPlace;

/**
 * その他情報セクションを追加
 * @param output 出力配列
 * @param place 場所情報
 */
export const addOtherInfo = (output: string[], place: Place) => {
  // バリアフリー情報のチェック
  const hasAccessibilityFeatures = [
    place.accessibilityOptions?.wheelchairAccessibleParking,
    place.accessibilityOptions?.wheelchairAccessibleEntrance,
    place.accessibilityOptions?.wheelchairAccessibleSeating,
  ].some(Boolean);

  // 営業時間のチェック
  const hasOpeningHours = place.regularOpeningHours?.periods?.length;

  // メニュー情報のチェック（trueのみ）
  const menuFeatures = [
    place.menuForChildren,
    place.servesCoffee,
    place.servesBeer,
    place.servesWine,
    place.servesCocktails,
    place.servesBreakfast,
    place.servesBrunch,
    place.servesLunch,
    place.servesDinner,
    place.servesDessert,
    place.servesVegetarianFood,
  ].some(Boolean);

  // 設備・サービスのチェック（trueのみ）
  const facilityFeatures = [
    place.restroom,
    place.outdoorSeating,
    place.liveMusic,
  ].some(Boolean);

  const hasParking =
    place.parkingOptions && Object.values(place.parkingOptions).some(Boolean);
  const hasPayment =
    place.paymentOptions && Object.values(place.paymentOptions).some(Boolean);
  const hasFacilityInfo = hasParking || hasPayment || facilityFeatures;

  // 利用形態のチェック（trueのみ）
  const usageFeatures = [
    place.takeout,
    place.delivery,
    place.dineIn,
    place.reservable,
  ].some(Boolean);

  // おすすめ用途のチェック（trueのみ）
  const recommendationFeatures = [
    place.goodForChildren,
    place.goodForGroups,
    place.goodForWatchingSports,
  ].some(Boolean);

  // 価格帯・その他情報のチェック
  const hasPriceInfo = place.priceLevel || place.priceRange;
  const hasOtherInfo =
    place.editorialSummary?.text || place.pureServiceAreaBusiness;

  if (
    hasAccessibilityFeatures ||
    hasOpeningHours ||
    menuFeatures ||
    hasFacilityInfo ||
    usageFeatures ||
    recommendationFeatures ||
    hasPriceInfo ||
    hasOtherInfo
  ) {
    output.push("# その他情報\n\n");

    // バリアフリー情報
    if (hasAccessibilityFeatures) {
      output.push("## バリアフリー情報\n\n");
      if (place.accessibilityOptions?.wheelchairAccessibleParking) {
        output.push(`車椅子対応駐車場: あり\n\n`);
      }
      if (place.accessibilityOptions?.wheelchairAccessibleEntrance) {
        output.push(`車椅子対応入口: あり\n\n`);
      }
      if (place.accessibilityOptions?.wheelchairAccessibleSeating) {
        output.push(`車椅子対応座席: あり\n\n`);
      }
    }

    // 営業時間
    if (hasOpeningHours) {
      output.push("## 営業時間\n\n");
      if (place.regularOpeningHours?.periods) {
        const days = ["日", "月", "火", "水", "木", "金", "土"];
        place.regularOpeningHours.periods.forEach((period) => {
          const open = period.open;
          const close = period.close;

          if (open && typeof open.day === "number") {
            const openDay = days[open.day];
            const openHour = (open.hour ?? 0).toString().padStart(2, "0");
            const openMinute = (open.minute ?? 0).toString().padStart(2, "0");

            let closeHour = "24";
            let closeMinute = "00";
            if (close && typeof close.hour === "number") {
              closeHour = close.hour.toString().padStart(2, "0");
              closeMinute = (close.minute ?? 0).toString().padStart(2, "0");
            }

            output.push(
              `${openDay}曜日: ${openHour}:${openMinute} - ${closeHour}:${closeMinute}\n`
            );
          }
        });
        output.push("\n");
      }
    }

    // メニュー情報（trueのみ表示）
    if (menuFeatures) {
      output.push("## メニュー情報\n\n");
      if (place.menuForChildren) {
        output.push(`子供向けメニュー: あり\n\n`);
      }
      if (place.servesCoffee) {
        output.push(`コーヒー: あり\n\n`);
      }
      if (place.servesBeer) {
        output.push(`ビール: あり\n\n`);
      }
      if (place.servesWine) {
        output.push(`ワイン: あり\n\n`);
      }
      if (place.servesCocktails) {
        output.push(`カクテル: あり\n\n`);
      }
      if (place.servesBreakfast) {
        output.push(`朝食: あり\n\n`);
      }
      if (place.servesBrunch) {
        output.push(`ブランチ: あり\n\n`);
      }
      if (place.servesLunch) {
        output.push(`ランチ: あり\n\n`);
      }
      if (place.servesDinner) {
        output.push(`ディナー: あり\n\n`);
      }
      if (place.servesDessert) {
        output.push(`デザート: あり\n\n`);
      }
      if (place.servesVegetarianFood) {
        output.push(`ベジタリアンメニュー: あり\n\n`);
      }
    }

    // 設備・サービス
    if (hasFacilityInfo) {
      output.push("## 設備・サービス\n\n");

      if (hasParking) {
        const parkingTypes: { [key: string]: string } = {
          free: "無料駐車場",
          paid: "有料駐車場",
          valet: "バレーパーキング",
          selfParking: "自己駐車場",
        };
        const availableParking = Object.entries(place.parkingOptions!)
          .filter(([key, value]) => parkingTypes[key] && value)
          .map(([key]) => parkingTypes[key]);

        if (availableParking.length > 0) {
          output.push("### 駐車場\n\n");
          availableParking.forEach((type) => {
            output.push(`${type}: あり\n\n`);
          });
        }
      }

      if (hasPayment) {
        const paymentTypes: { [key: string]: string } = {
          acceptsCreditCards: "クレジットカード",
          acceptsDebitCards: "デビットカード",
          acceptsCashOnly: "現金",
          acceptsNfc: "非接触決済",
        };
        const availablePayments = Object.entries(place.paymentOptions!)
          .filter(([key, value]) => paymentTypes[key] && value)
          .map(([key]) => paymentTypes[key]);

        if (availablePayments.length > 0) {
          output.push("### 支払い方法\n\n");
          availablePayments.forEach((type) => {
            output.push(`${type}: 利用可\n\n`);
          });
        }
      }

      if (place.restroom) {
        output.push(`トイレ: あり\n\n`);
      }
      if (place.outdoorSeating) {
        output.push(`テラス席: あり\n\n`);
      }
      if (place.liveMusic) {
        output.push(`生演奏: あり\n\n`);
      }
    }

    // 利用形態（trueのみ表示）
    if (usageFeatures) {
      output.push("## 利用形態\n\n");
      if (place.takeout) {
        output.push(`テイクアウト: 可能\n\n`);
      }
      if (place.delivery) {
        output.push(`デリバリー: あり\n\n`);
      }
      if (place.dineIn) {
        output.push(`店内飲食: 可能\n\n`);
      }
      if (place.reservable) {
        output.push(`予約: 可能\n\n`);
      }
    }

    // おすすめ用途（trueのみ表示）
    if (recommendationFeatures) {
      output.push("## おすすめ用途\n\n");
      if (place.goodForChildren) {
        output.push(`お子様連れ: おすすめ\n\n`);
      }
      if (place.goodForGroups) {
        output.push(`グループ利用: おすすめ\n\n`);
      }
      if (place.goodForWatchingSports) {
        output.push(`スポーツ観戦: おすすめ\n\n`);
      }
    }

    // 価格帯
    if (hasPriceInfo) {
      output.push("## 価格帯\n\n");
      if (place.priceLevel) {
        const priceLevelMap: { [key: string]: string } = {
          PRICE_LEVEL_UNSPECIFIED: "不明",
          PRICE_LEVEL_FREE: "無料",
          PRICE_LEVEL_INEXPENSIVE: "お手頃",
          PRICE_LEVEL_MODERATE: "普通",
          PRICE_LEVEL_EXPENSIVE: "高め",
          PRICE_LEVEL_VERY_EXPENSIVE: "非常に高い",
        };
        output.push(
          `価格帯: ${priceLevelMap[place.priceLevel] || place.priceLevel}\n\n`
        );
      }
      if (place.priceRange) {
        const min = place.priceRange.startPrice?.units ?? 0;
        const max = place.priceRange.endPrice?.units;
        output.push(`価格範囲: ${min}円 - ${max ? `${max}円` : "不明"}\n\n`);
      }
    }

    // その他情報
    if (place.editorialSummary?.text) {
      output.push("## 編集者によるコメント\n\n");
      output.push(`${place.editorialSummary.text}\n\n`);
    }

    if (place.pureServiceAreaBusiness) {
      output.push("## ビジネス形態\n\n");
      output.push(`非店舗型ビジネス: はい\n\n`);
    }
  }
};
