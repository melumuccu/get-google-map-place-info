import { FieldMask } from "./googleMapNew";

export const FIELD_MASKS: FieldMask[] = [
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
