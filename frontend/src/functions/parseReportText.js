export const parseReportText = (raw) => {
  const extractSection = (text, beginMarker, endMarker) => {
    const beginIndex = text.indexOf(beginMarker);
    const endIndex = text.indexOf(endMarker);
    if (beginIndex === -1 || endIndex === -1 || endIndex < beginIndex) {
      return "";
    }
    return text.substring(beginIndex + beginMarker.length, endIndex).trim();
  };

  return {
    sourceTime: extractSection(
      raw,
      "// SOURCE_CODE_TIME_BEGIN",
      "// SOURCE_CODE_TIME_END"
    ),
    convertedTime: extractSection(
      raw,
      "// CONVERTED_CODE_TIME_BEGIN",
      "// CONVERTED_CODE_TIME_END"
    ),
    timeCaption: extractSection(
      raw,
      "// TIME_CAPTION_BEGIN",
      "// TIME_CAPTION_END"
    ),
    sourceSpace: extractSection(
      raw,
      "// SOURCE_CODE_SPACE_BEGIN",
      "// SOURCE_CODE_SPACE_END"
    ),
    convertedSpace: extractSection(
      raw,
      "// CONVERTED_CODE_SPACE_BEGIN",
      "// CONVERTED_CODE_SPACE_END"
    ),
    spaceCaption: extractSection(
      raw,
      "// SPACE_CAPTION_BEGIN",
      "// SPACE_CAPTION_END"
    ),
  };
};
