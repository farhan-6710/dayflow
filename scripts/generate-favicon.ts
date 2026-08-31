import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import pngToIco from "png-to-ico";

const publicDir = resolve(import.meta.dir, "../public");

async function main() {
  const lightIcon = resolve(publicDir, "logo-light-icon.png");
  const darkIcon = resolve(publicDir, "logo-dark-icon.png");

  const lightIco = await pngToIco(lightIcon);
  const darkIco = await pngToIco(darkIcon);

  writeFileSync(resolve(publicDir, "favicon-light.ico"), lightIco);
  writeFileSync(resolve(publicDir, "favicon-dark.ico"), darkIco);
  writeFileSync(resolve(publicDir, "favicon.ico"), lightIco);

  console.log("Generated favicon-light.ico, favicon-dark.ico, and favicon.ico");
}

void main();
