import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";

import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";

// 註冊語言
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);

const CodeBlock = ({ code, language = "java" }) => {
  return (
    <SyntaxHighlighter language={language} style={github} showLineNumbers>
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
