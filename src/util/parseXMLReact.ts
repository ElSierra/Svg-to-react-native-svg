import { parseString } from "xml2js";

export const parseXMLReact = async (svgData: string) => {
  let jsxCode = "";
  parseString(svgData, (err, result) => {
    if (err) {
      console.error("Error parsing SVG:", err);
      return;
    }

    // Convert the parsed XML to React JSX
    const convertSvgToJsx = (svgObj: any): string => {
      let jsx = `<svg`;

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
        if (key === "width"){
            jsx += ` width={24}`;
            return;
        }
        if (key === "height"){
            jsx += ` height={24}`;
            return;
        }
        jsx += ` ${key}="${rootAttrs[originalKey]}"`;
      });

      jsx += `>`;

      // Recursively convert child elements
      const convertElements = (elements: any): string => {
        let jsx = "";
        Object.keys(elements).forEach((tagName) => {
          if (tagName !== "$") {
            elements[tagName].forEach((child: any) => {
              jsx += `<${tagName}`;

              // Add attributes
              if (child.$) {
                Object.keys(child.$).forEach((key) => {
                  const originalKey = key;
                  // Convert dash-cased attributes to camelCase
                  if (key.includes("-")) {
                    key = key.replace(/-([a-z])/g, function (g) {
                      return g[1].toUpperCase();
                    });
                  }
                  jsx += ` ${key}="${child.$[originalKey]}"`;
                });
              }

              jsx += `>`;

              // Add children recursively
              if (Object.keys(child).length > 1) {
                jsx += convertElements(child);
              }

              jsx += `</${tagName}>`;
            });
          }
        });
        return jsx;
      };

      jsx += convertElements(svgObj["svg"]);

      jsx += `</svg>`;

      return jsx;
    };

    jsxCode = convertSvgToJsx(result);

    // The JSX representation of the SVG is now stored in jsxCode
    console.log(jsxCode);
  });

  return jsxCode;
};
