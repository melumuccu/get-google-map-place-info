import * as fs from "fs";
import * as path from "path";
import { log } from "./log";

/**
 * ファイルに内容を書き込む
 * @param {string} filePath - 出力ファイルパス
 * @param {string} content - 書き込む内容
 */
export const writeToFile = (filePath: string, content: string) => {
  if (fs.existsSync(filePath)) {
    log(`既存ファイルが存在するため上書きされます。 path: ${filePath}`, "warn");
    fs.truncateSync(filePath, 0);
  }
  fs.writeFileSync(filePath, content, { encoding: "utf-8" });
};

/**
 * 場所の基本情報を表示する
 * @param {any} place - 場所の詳細情報
 */
export const displayBasicInfo = (place: any, output: string[]) => {
  output.push("# Name\n\n");
  output.push(place.name + "\n\n");
  output.push("# Address\n\n");
  output.push(place.formatted_address + "\n\n");
};

/**
 * レビュー情報を表示する
 * @param {any[]} reviews - レビュー配列
 */
export const displayReviews = (reviews: any[], output: string[]) => {
  // 4,5星レビューを全て表示し、3星以下は最大5件表示
  const filteredReviews = reviews
    .filter((review) => review.text?.trim()) // 空のレビューを除外
    .sort((a, b) => b.rating - a.rating); // 評価の高い順にソート

  if (filteredReviews.length > 0) {
    output.push("# Reviews\n\n");

    // 4,5星レビューを全て表示
    const highRated = filteredReviews.filter((review) => review.rating >= 4);
    highRated.forEach((review, index) => {
      output.push(`## Review ${index + 1}\n\n`);
      output.push(`**Author**: ${review.author_name}\n`);
      output.push(`**Rating**: ${"⭐".repeat(review.rating)}\n`);
      output.push(`${review.text}\n`);
      output.push("\n---\n\n");
    });
  } else {
    output.push("\nNo reviews available.\n");
  }
};
