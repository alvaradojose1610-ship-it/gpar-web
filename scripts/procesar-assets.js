const sharp = require("sharp");
const path = require("path");

const incoming = "public/assets/_incoming";
const outId = "public/assets/identidad";
const outHero = "public/assets/hero";
const outCat = "public/assets/categorias";

function lum(r, g, b) {
  return (r + g + b) / 3;
}

function sat(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function isBgGray(r, g, b) {
  const l = lum(r, g, b);
  const s = sat(r, g, b);
  // checkerboard / paper whites and mid grays
  return s < 18 && l > 115;
}

function isNearBlack(r, g, b) {
  return lum(r, g, b) < 22;
}

async function load(file) {
  const { data, info } = await sharp(path.join(incoming, file))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data: Buffer.from(data), width: info.width, height: info.height };
}

async function writeTrimmedPng(data, width, height, dest, pad = 40) {
  await sharp(data, { raw: { width, height, channels: 4 } })
    .png()
    .trim({ threshold: 5 })
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize({
      width: 1600,
      height: 900,
      fit: "inside",
      withoutEnlargement: false,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(dest);
}

async function removeCheckerboard(src, dest, { keepWhites = false } = {}) {
  const { data, width, height } = await load(src);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const l = lum(r, g, b);
    const s = sat(r, g, b);

    let transparent = false;
    if (keepWhites) {
      // Remove mid-gray checker; keep bright white logo ink
      if (s < 25 && l >= 100 && l < 230) transparent = true;
      else if (l >= 230) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        transparent = false;
      } else {
        transparent = true;
      }
    } else if (isBgGray(r, g, b)) {
      transparent = true;
    }

    data[i + 3] = transparent ? 0 : 255;
  }
  await writeTrimmedPng(data, width, height, dest);
  console.log("checkerboard cleaned ->", dest);
}

async function removeBlackBg(src, dest) {
  const { data, width, height } = await load(src);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (isNearBlack(r, g, b)) {
      data[i + 3] = 0;
    } else {
      // soft edge for near-black fringe
      const l = lum(r, g, b);
      if (l < 40) data[i + 3] = Math.round(((l - 22) / 18) * 255);
      else data[i + 3] = 255;
    }
  }
  await writeTrimmedPng(data, width, height, dest);
  console.log("black bg cleaned ->", dest);
}

async function makeWhiteVersion(colorSrc, dest) {
  const { data, info } = await sharp(colorSrc)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buf = Buffer.from(data);
  for (let i = 0; i < buf.length; i += 4) {
    const a = buf[i + 3];
    if (a > 10) {
      buf[i] = 255;
      buf[i + 1] = 255;
      buf[i + 2] = 255;
      // preserve soft alpha
    }
  }
  await sharp(buf, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(dest);
  console.log("white version ->", dest);
}

async function photoWebp(src, dest, opts) {
  const input = path.join(incoming, src);
  let pipeline = sharp(input);
  if (opts.crop) {
    const m = await sharp(input).metadata();
    pipeline = sharp(input).extract({
      left: Math.round(m.width * opts.crop.left),
      top: Math.round(m.height * opts.crop.top),
      width: Math.round(m.width * opts.crop.width),
      height: Math.round(m.height * opts.crop.height),
    });
  }
  await pipeline
    .resize(opts.width, opts.height, { fit: "cover", position: "centre" })
    .webp({ quality: 84 })
    .toFile(dest);
  console.log("photo ->", dest);
}

(async () => {
  await removeCheckerboard("img-01.png", path.join(outId, "logo-principal.png"));
  await makeWhiteVersion(
    path.join(outId, "logo-principal.png"),
    path.join(outId, "logo-blanco.png"),
  );

  // White logo from white-on-checkerboard source
  await removeCheckerboard("img-03.png", path.join(outId, "logo-blanco.png"), {
    keepWhites: true,
  });

  await removeBlackBg("img-04.png", path.join(outId, "isotipo.png"));
  await sharp(path.join(outId, "isotipo.png"))
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(outId, "favicon.png"));
  await sharp(path.join(outId, "favicon.png")).toFile("src/app/icon.png");

  await photoWebp("img-09.png", path.join(outHero, "hero-principal.webp"), {
    width: 1920,
    height: 900,
  });
  await photoWebp("img-10.png", path.join(outHero, "banner-principal.webp"), {
    width: 1920,
    height: 700,
  });
  await photoWebp(
    "img-11.png",
    path.join(outCat, "categoria-rodamientos.webp"),
    {
      width: 1200,
      height: 1200,
      crop: { left: 0, top: 0, width: 0.5, height: 1 },
    },
  );

  console.log("DONE");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
