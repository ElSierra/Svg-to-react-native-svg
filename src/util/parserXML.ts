import xml2js from "xml2js";

const parser = new xml2js.Parser();

export const parseXML = async (svgData: string, functionName: string) => {
  let jsxCode = "";
  parser.parseString(svgData, (err, result) => {
    if (err) {
      console.error("Error parsing SVG:", err);
      return;
    }

    // Convert the parsed XML to React Native JSX
    const convertSvgToJsx = (svgObj: any): string => {
      let jsx = `<Svg`;

      // Add root SVG attributes (e.g., width, height, viewBox)
      const rootAttrs = svgObj["svg"].$;
      Object.keys(rootAttrs).forEach((key) => {
        const originalKey = key;
        // Convert dash-cased attributes to camelCase
        if (key.includes("-")) {
          key = key.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
          });
        }
        if (key === "width") {
          jsx += ` width={size}`;
          return;
        }
        if (key === "height") {
          jsx += ` height={size}`;
          return;
        }
        if (key === "xmlns") {
          return;
        }
        jsx += ` ${key}="${rootAttrs[originalKey]}"`;
      });

      jsx += `>\n`;

      // Convert path elements to <Path /> components
      svgObj["svg"].path.forEach((path: any) => {
        jsx += `  <Path`;
        Object.keys(path.$).forEach((attrKey) => {
          const originalAttrKey = attrKey;
          if (attrKey === "fill") {
            jsx += ` fill={color}`;
            return;
          }
          // Convert dash-cased attributes to camelCase
          if (attrKey.includes("-")) {
            attrKey = attrKey.replace(/-([a-z])/g, function (g) {
              return g[1].toUpperCase();
            });
          }
          jsx += ` ${attrKey}="${path.$[originalAttrKey]}"`;
        });
        jsx += ` />\n`;
      });

      jsx += `</Svg>`;

      return jsx;
    };

    // Generate the JSX code
    jsxCode = `export const ${functionName}: React.FC<IconProps> = ({color,size}) => (${convertSvgToJsx(
      result
    )})`;
  });

  return jsxCode;
};