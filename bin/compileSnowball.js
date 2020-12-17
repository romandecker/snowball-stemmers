const fs = require("fs/promises");
const tmp = require("tmp-promise");
const path = require("path");
const { promisify } = require("util");
const childProcess = require("child_process");
const glob = promisify(require("glob"));
const paths = require("./utils/paths");

const execFileAsync = promisify(childProcess.execFile);

async function main() {
  const snowballFilePaths = await glob("*.sbl", {
    cwd: paths.CORE_ALGORITHMS,
    absolute: true,
  });

  snowballFilePaths.push(
    ...(await glob("*.sbl", {
      cwd: paths.ADDITIONAL_ALGORITHMS,
      absolute: true,
    }))
  );

  await fs.mkdir(paths.DIST_STEMMERS, {
    recursive: true,
  });

  await Promise.all(
    snowballFilePaths.map((snowballFilePath) =>
      makeStemmerModule(
        snowballFilePath,
        path.resolve(
          paths.DIST_STEMMERS,
          `${path.basename(snowballFilePath, ".sbl")}.js`
        )
      )
    )
  );

  await makeBaseStemmerModule();
}

async function makeStemmerModule(snowballPath, outPath) {
  const tmpName = await tmp.tmpName();

  console.log(
    path.relative(paths.ROOT, snowballPath),
    "->",
    path.relative(paths.ROOT, outPath)
  );

  const snowballArgs = [
    path.resolve(snowballPath),
    "-js",
    "-n",
    "module.exports",
    "-o",
    tmpName,
  ];
  await execFileAsync(paths.SNOWBALL_EXECUTABLE, snowballArgs);

  const stemmerSrc = await fs.readFile(`${tmpName}.js`, "utf-8");

  await fs.writeFile(
    outPath,
    `${getImports([["BaseStemmer", "../BaseStemmer"]])}\n${stemmerSrc}`
  );
}

async function makeBaseStemmerModule() {
  const baseStemmerSrc = await fs.readFile(
    path.resolve(paths.SNOWBALL, "javascript/base-stemmer.js"),
    "utf-8"
  );

  await fs.writeFile(
    path.resolve(paths.DIST, "BaseStemmer.js"),
    baseStemmerSrc.replace(/BaseStemmer/, "module.exports")
  );
}

function getImports(imports = []) {
  return (importsBlock = imports
    .map(([name, from]) => `const ${name} = require('${from}');`)
    .join("\n"));
}

if (require.main === module) {
  main();
}
