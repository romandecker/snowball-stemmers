const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const DIST = path.resolve(ROOT, "dist/commonjs");
const DIST_STEMMERS = path.resolve(DIST, "stemmers");
const SNOWBALL = path.resolve(ROOT, "snowball");
const SNOWBALL_EXECUTABLE = path.resolve(SNOWBALL, "snowball");
const CORE_ALGORITHMS = path.resolve(SNOWBALL, "algorithms");
const ADDITIONAL_ALGORITHMS = path.resolve(ROOT, "additional-algorithms");

module.exports = {
  ROOT,
  SNOWBALL,
  SNOWBALL_EXECUTABLE,
  CORE_ALGORITHMS,
  ADDITIONAL_ALGORITHMS,
  DIST,
  DIST_STEMMERS,
};
