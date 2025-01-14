import { google } from "@googlemaps/places/build/protos/protos";

type Place = google.maps.places.v1.IPlace;

/**
 * レビューセクションを追加
 * @param output 出力配列
 * @param place 場所情報
 */
export const addReviews = (output: string[], place: Place) => {
  // 評価とレビュー数の存在チェック
  const rating = place.rating ?? 0;
  const reviewCount = place.userRatingCount ?? 0;
  const hasRating = rating > 0;
  const hasReviewCount = reviewCount > 0;
  const hasReviews = Boolean(place.reviews?.length);

  // レビュー情報があれば出力
  if (hasRating || hasReviewCount || hasReviews) {
    output.push("# レビュー情報\n\n");

    // 評価点数の出力（0より大きい場合のみ）
    if (hasRating) {
      output.push(`評価: ${rating}点\n\n`);
    }

    // レビュー数の出力（0より大きい場合のみ）
    if (hasReviewCount) {
      output.push(`レビュー数: ${reviewCount}件\n\n`);
    }

    // レビュー一覧の出力
    if (hasReviews && place.reviews) {
      output.push("## レビュー一覧\n\n");

      place.reviews.forEach((review, index) => {
        const isLastReview = index === place.reviews!.length - 1;
        let hasContent = false;

        // レビュワー名
        if (review.authorAttribution?.displayName) {
          output.push(`### ${review.authorAttribution.displayName}\n\n`);
          hasContent = true;
        }

        // 評価点数（0より大きい場合のみ）
        const reviewRating = review.rating ?? 0;
        if (reviewRating > 0) {
          output.push(`評価: ${reviewRating}点\n\n`);
          hasContent = true;
        }

        // レビュー本文
        if (review.text?.text) {
          output.push(`${review.text.text}\n\n`);
          hasContent = true;
        }

        // 投稿日時
        if (review.publishTime?.seconds) {
          const date = new Date(Number(review.publishTime.seconds) * 1000);
          output.push(`投稿日時: ${date.toLocaleDateString("ja-JP")}\n\n`);
          hasContent = true;
        }

        // 有効なコンテンツがあり、最後のレビューでない場合に区切り線を追加
        if (hasContent && !isLastReview) {
          output.push("---\n\n");
        }
      });
    }
  }
};
