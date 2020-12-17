const fs = require("fs/promises");
const path = require("path");
const { promisify } = require("util");
const glob = promisify(require("glob"));
const camelcase = require("camelcase");

const paths = require("./utils/paths");

async function main() {
  const stemmerFilenames = await glob("*.js", {
    cwd: paths.DIST_STEMMERS,
  });

  const imports = [];
  const exports = [];

  for (const stemmerFilename of stemmerFilenames) {
    const stemmerName = path.basename(stemmerFilename, ".js");
    const stemmerClassName = `${camelcase(stemmerName, {
      pascalCase: true,
    })}Stemmer`;

    imports.push([
      stemmerClassName,
      `./${path.relative(
        paths.DIST,
        path.join(paths.DIST_STEMMERS, stemmerName)
      )}`,
    ]);
    exports.push(stemmerClassName);
  }

  const indexFileSource = `
${imports
  .map(([name, from]) => `const ${name} = require('${from}');`)
  .join("\n")}

module.exports = {
  ${exports.join(",\n  ")}
};
`;

  const indexFilePath = path.resolve(paths.DIST, "index.js");
  await fs.writeFile(indexFilePath, indexFileSource);
  console.log("Created", path.relative(paths.ROOT, indexFilePath));

  const typesFileSource = `
class Stemmer {
  stemWord(word: string): string;
}

declare module 'snowball-stemmers' {
  ${exports.map((e) => `class ${e} extends Stemmer {}`).join("\n  ")}

  exports = {
    ${exports.join(",\n    ")}
  };
};
`;
  const typesFilePath = path.resolve(paths.DIST, "index.d.ts");
  await fs.writeFile(typesFilePath, typesFileSource);
  console.log("Created", path.relative(paths.ROOT, typesFilePath));
}

if (require.main === module) {
  main();
}
