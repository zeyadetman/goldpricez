#!/usr/bin/env node

const main = require("./main");
const argv = require("yargs").argv;

const { unit, currency, size, u, c, s } = argv;
const cli = require("meow")(
  `
  Usage: goldpricez [options]

  You have to set at least one of the following options 

  Options:
  
    -u, --unit         Unit 'K' of the gold [ 24, 23, 22, ..., 9 ], default = 21 
    -c, --currency     Currency of the price, default = EGP
    -s, --size         Size of the calculated [gram, kg, ounce, grain]
`,
  {
    boolean: ["help", "version"],
    alias: { h: "help", v: "version", u: "unit", c: "currency", s: "size" },
  }
);

if (Object.keys(argv).length <= 2) {
  cli.showHelp();
}

main({ unit: unit || u, currency: currency || c, size: size || s });
