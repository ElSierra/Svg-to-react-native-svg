"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import { parseXML } from "@/util/parserXML";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { parseXMLReact } from "@/util/parseXMLReact";

export function EnhancedStringEcho() {
  const [inputText, setInputText] = useState("");
  const [functionName, setFunctionName] = useState("");
  const [outputText, setOutputText] = useState("");
  const [xmlReact, setXmlReact] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleGenerateOutput = async () => {
    if (!inputText) {
      return;
    }
    if (!functionName) {
      return;
    }
    setOutputText(await parseXML(inputText, functionName));
    setXmlReact(await parseXMLReact(inputText));
    setInputText("");
    setFunctionName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            SVG to React Native JSX Converter
          </CardTitle>
          <p className="text-center text-sm text-gray-500">
            Copy SVG from Figma and paste it here to convert it to React Native
            JSX.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="input-text"
              className="text-lg font-medium text-gray-700"
            >
              SVG Text
            </Label>
            <Textarea
              id="input-text"
              placeholder="Type your text here..."
              value={inputText}
              onChange={handleInputChange}
              className="min-h-[100px] transition-all duration-200 focus:shadow-md"
            />
          </div>
          <div className="flex flex-col">
            <Label
              htmlFor="function-name"
              className="text-lg font-medium text-gray-700"
            >
              Icon Name
            </Label>
            <input
              id="function-name"
              placeholder="Type your function name here..."
              value={functionName}
              onChange={(e) => {
                setFunctionName(e.target.value);
              }}
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateOutput}
              className="group transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Generate Output
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="flex justify-center">
            <div dangerouslySetInnerHTML={{ __html: xmlReact }} />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="icon-props"
              className="text-lg font-medium text-gray-700"
            >
              Copy this
            </Label>
            <SyntaxHighlighter
              language="typescript"
              style={duotoneLight}
              className="rounded-md"
            >
              {`import Svg, { Path } from "react-native-svg";\ntype IconProps = {
  color: string;
  size: number;
};`}
            </SyntaxHighlighter>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="output-text"
              className="text-lg font-medium text-gray-700"
            >
              Output
            </Label>
            <SyntaxHighlighter
              language="jsx"
              style={duotoneLight}
              className="rounded-md"
            >
              {outputText}
            </SyntaxHighlighter>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          Click the button to convert your SVG to React Native JSX.
        </CardFooter>
      </Card>
    </div>
  );
}
