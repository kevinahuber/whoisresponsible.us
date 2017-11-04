const jsonfile = require("jsonfile");
const fs = require("fs");
const file = "aggregate-by-country.json";
const readinessFolder = "./src/resources/archive/readiness";
const vulnerabilitiesFolder = "./src/resources/archive/vulnerabilities";
const contributions = require("../src/resources/archive/contribution/percent-with-code-cleaned.json");
const year = "2014";
const obj = {};

function importAndManipulate(folder, inverse) {
  fs.readdirSync(folder).forEach(file => {
    const title = file.split(".")[0];
    console.log(title);
    const data = require(`.${folder}/${file}`);

    data.forEach(d => {
      if (!obj[d.ISO3]) obj[d.ISO3] = {};
      obj[d.ISO3][title] = inverse ? 1 - d[year] : d[year];
    });
  });
}

importAndManipulate(vulnerabilitiesFolder);
importAndManipulate(readinessFolder, true);
contributions.forEach(d => {
  if (!obj[d.code]) obj[d.code] = {};

  Object.keys(d).forEach(c => {
    if (c === "code") return;
    obj[d.code][c.toLowerCase()] = d[c];
  });
});

jsonfile.writeFile(file, obj, console.error);
