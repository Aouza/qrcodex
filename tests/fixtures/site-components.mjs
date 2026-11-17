import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../../", import.meta.url));

// Render real site modules in Node without Next's image pipeline or CSS loader.
export async function loadSiteComponent(path) {
  async function compile(file) {
    const source = await readFile(file, "utf8");
    let { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
    });
    outputText = outputText
      .replace(/from "react\/jsx-runtime"/g, `from "${import.meta.resolve("react/jsx-runtime")}"`)
      .replace(/import Image from "next\/image";/, 'const Image = ({src,alt}) => _jsx("img", {src,alt});')
      .replace(/import Link from "next\/link";/, 'const Link = props => _jsx("a", {...props});')
      .replace(/import (\w+) from "[^\"]+\.module\.css";/g, "const $1 = {};");
    for (const [, dependency] of [...outputText.matchAll(/from "((?:@\/|\.\.?\/)[^\"]+)"/g)]) {
      const base = dependency.startsWith("@/") ? resolve(root, "src", dependency.slice(2)) : resolve(dirname(file), dependency);
      let moduleUrl;
      try { moduleUrl = await compile(`${base}.tsx`); }
      catch (error) { if (error.code !== "ENOENT") throw error; moduleUrl = await compile(`${base}.ts`); }
      outputText = outputText.replaceAll(`from "${dependency}"`, `from "${moduleUrl}"`);
    }
    return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  }
  return import(await compile(resolve(root, path)));
}
