import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";

const DYNAMODB_CLIENT = new DynamoDBClient();
const TRANSLATE_CLIENT = new TranslateClient();

const now = new Date(
  Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
);

/**
 * 現在日時を取得
 * @returns
 */
const getDate = () => {
  const Year = String(now.getFullYear());
  const Month = String(now.getMonth() + 1).padStart(2, "0");
  const Date = String(now.getDate()).padStart(2, "0");
  const Hour = String(now.getHours()).padStart(2, "0");
  const Min = String(now.getMinutes()).padStart(2, "0");

  return `${Year}-${Month}-${Date} ${Hour}:${Min}`;
};

export const handler = async (event) => {
  const inputText = event.queryStringParameters.input_text;

  // 翻訳処理
  const translateInput = {
    Text: inputText,
    SourceLanguageCode: "ja",
    TargetLanguageCode: "en",
  };

  const translateTextCom = new TranslateTextCommand(translateInput);
  const outputText = await TRANSLATE_CLIENT.send(translateTextCom);

  // DB登録処理
  const putItemInput = {
    TableName: "TranslateHistoryTbl",
    Item: {
      TimeStamp: { S: getDate() },
      Input: { S: inputText },
      Output: { S: outputText.TranslatedText },
    },
  };

  const putItemCom = new PutItemCommand(putItemInput);
  await DYNAMODB_CLIENT.send(putItemCom);

  const response = {
    statusCode: 200,
    body: outputText.TranslatedText,
    isBase64Encoded: false,
    headers: {},
  };
  return response;
};
