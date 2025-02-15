export const extractCode = (raw) => {
  // 1. 移除最外層的 markdown code block 標記 (例如 ```java 或 ```python 與結尾的 ```)
  const withoutMarkdown = raw
    .replace(/^```[a-zA-Z]+\n/, "")
    .replace(/\n```$/, "");

  // 2. 根據內容判斷使用哪種標記，先嘗試 Java 的標記
  let beginMarker, endMarker;
  if (
    withoutMarkdown.indexOf("// BEGIN CODE") !== -1 &&
    withoutMarkdown.indexOf("// END CODE") !== -1
  ) {
    beginMarker = "// BEGIN CODE";
    endMarker = "// END CODE";
  }
  // 若找不到 Java 標記，則嘗試 Python 的標記
  else if (
    withoutMarkdown.indexOf("# BEGIN CODE") !== -1 &&
    withoutMarkdown.indexOf("# END CODE") !== -1
  ) {
    beginMarker = "# BEGIN CODE";
    endMarker = "# END CODE";
  } else {
    // 若都找不到，回傳空字串
    return "";
  }

  // 3. 找出標記在字串中的位置
  const beginIndex = withoutMarkdown.indexOf(beginMarker);
  const endIndex = withoutMarkdown.indexOf(endMarker);
  if (beginIndex === -1 || endIndex === -1 || endIndex <= beginIndex) {
    return ""; // 若找不到或順序不正確，回傳空字串
  }

  // 4. 從 BEGIN CODE 後面開始，至 END CODE 之前取出內容
  const codeContent = withoutMarkdown
    .substring(beginIndex + beginMarker.length, endIndex)
    .trim();

  // 5. 將字串中的 literal "\n" 轉換為真正的換行符號
  const formattedCode = codeContent.replace(/\\n/g, "\n");

  // 6. 將轉義的雙引號 \" 轉回正常的雙引號 "
  const unescapedCode = formattedCode.replace(/\\"/g, '"');

  // 7. 回傳處理後的程式碼（內含正確換行與正常雙引號）
  return unescapedCode;
};
