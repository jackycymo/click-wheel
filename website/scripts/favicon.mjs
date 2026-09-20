// Renders src/app/icon.svg to favicon.ico (16, 32, 48) and apple-icon.png (180).
// Run: bun scripts/favicon.mjs   (or: node scripts/favicon.mjs)
import fs from "node:fs/promises";
import { ImageResponse } from "next/og";

const svg = await fs.readFile("src/app/icon.svg", "utf8");
// The rasterizer has no color scheme; render the light variant.
const flat = svg.replace(/<style>[\s\S]*?<\/style>/, "");
const src = `data:image/svg+xml;base64,${Buffer.from(flat).toString("base64")}`;

async function png(size) {
  const response = new ImageResponse(
    {
      type: "div",
      props: {
        style: { display: "flex", width: size, height: size },
        children: { type: "img", props: { src, width: size, height: size } },
      },
    },
    { width: size, height: size },
  );
  return Buffer.from(await response.arrayBuffer());
}

/** ICO container with PNG entries, which every current browser reads. */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + dir.length;
  entries.forEach(({ size, data }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2); // palette
    dir.writeUInt8(0, o + 3); // reserved
    dir.writeUInt16LE(1, o + 4); // planes
    dir.writeUInt16LE(32, o + 6); // bits per pixel
    dir.writeUInt32LE(data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
}

const sizes = [16, 32, 48];
const entries = await Promise.all(sizes.map(async (size) => ({ size, data: await png(size) })));
await fs.writeFile("src/app/favicon.ico", ico(entries));
await fs.writeFile("src/app/apple-icon.png", await png(180));
console.log(`favicon.ico: ${sizes.join(", ")} px · apple-icon.png: 180 px`);
