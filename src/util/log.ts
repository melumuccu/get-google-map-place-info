import { styleText } from "node:util";

/**
 * ログを装飾して出力する
 * @param {string} message - 出力するメッセージ
 * @param {"error" | "warn" | "log" | "success"} [type="log"] - ログの種類
 */
export const log = (
  message: string,
  type: "error" | "warn" | "log" | "success" = "log"
) => {
  switch (type) {
    case "error":
      console.error(
        styleText("bgRed", " ERROR   ") + styleText("red", ` ${message}`)
      );
      break;
    case "warn":
      console.warn(
        styleText("bgYellow", " WARN    ") + styleText("yellow", ` ${message}`)
      );
      break;
    case "success":
      console.log(
        styleText("bgGreen", " SUCCESS ") + styleText("green", ` ${message}`)
      );
      break;
    default:
      console.log(styleText("bgGray", " LOG     ") + ` ${message}`);
  }
};
