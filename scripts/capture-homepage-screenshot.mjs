import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteDir = path.resolve(
  process.argv[2] ?? path.join(__dirname, "..", "_site"),
);
const outputPath = path.resolve(
  process.argv[3] ?? path.join(__dirname, "..", "homepage.png"),
);

const indexPath = path.join(siteDir, "index.html");
try {
  await fs.access(indexPath);
} catch (error) {
  console.error(`Could not find built homepage at ${indexPath}`);
  process.exitCode = 1;
  process.exit();
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  const fileUrl = pathToFileURL(indexPath).href;
  await page.goto(fileUrl, { waitUntil: "networkidle0" });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  await page.screenshot({ path: outputPath, fullPage: true, type: "png" });
  console.log(`Saved screenshot to ${outputPath}`);
} finally {
  await browser.close();
}
