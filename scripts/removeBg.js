const sharp = require('../new-react-app/node_modules/sharp');
const fs = require('fs');
const path = require('path');

// Flood-fill based transparent background extractor
async function makeTransparentFloodFill(inputPath, outputPath, options = {}) {
  const {
    threshold = 240,       // Brightness threshold for white background
    diffThreshold = 20,    // Color difference threshold (R, G, B close to each other)
    trim = true,
    sharpen = true,
    includeInternalHoles = false
  } = options;

  console.log(`\nProcessing: ${inputPath}...`);
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // Extract raw RGBA buffer
  const rawBuffer = await image.ensureAlpha().raw().toBuffer();
  const totalPixels = width * height;
  const isBg = new Uint8Array(totalPixels); // 1 = background, 0 = foreground

  // Helper to check if a pixel is "white/near-white"
  function isWhitePixel(idx) {
    const r = rawBuffer[idx * 4];
    const g = rawBuffer[idx * 4 + 1];
    const b = rawBuffer[idx * 4 + 2];
    
    // Check if bright enough
    if (r < threshold || g < threshold || b < threshold) return false;
    
    // Check if neutral/grayscale (not colorful)
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    return (maxVal - minVal) <= diffThreshold;
  }

  // Queue for BFS flood-fill
  const queue = new Int32Array(totalPixels);
  let qHead = 0;
  let qTail = 0;

  function pushQueue(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (isBg[idx]) return;
    if (isWhitePixel(idx)) {
      isBg[idx] = 1;
      queue[qTail++] = idx;
    }
  }

  // 1. Seed from all 4 borders
  for (let x = 0; x < width; x++) {
    pushQueue(x, 0);
    pushQueue(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushQueue(0, y);
    pushQueue(width - 1, y);
  }

  // 2. BFS flood-fill
  while (qHead < qTail) {
    const idx = queue[qHead++];
    const x = idx % width;
    const y = Math.floor(idx / width);

    pushQueue(x + 1, y);
    pushQueue(x - 1, y);
    pushQueue(x, y + 1);
    pushQueue(x, y - 1);
  }

  // 3. If includeInternalHoles is true (e.g. for AWESOMEZ SHOP text where holes in A, O, P should also be transparent)
  if (includeInternalHoles) {
    for (let i = 0; i < totalPixels; i++) {
      if (isWhitePixel(i)) {
        isBg[i] = 1;
      }
    }
  }

  // 4. Apply alpha and edge smoothing (antialiasing)
  for (let i = 0; i < totalPixels; i++) {
    if (isBg[i] === 1) {
      // Check if it touches foreground for soft antialiased edge
      const x = i % width;
      const y = Math.floor(i / width);
      let touchesFg = false;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = ny * width + nx;
            if (isBg[nIdx] === 0) {
              touchesFg = true;
              break;
            }
          }
        }
        if (touchesFg) break;
      }

      if (touchesFg) {
        // Semi-transparent edge pixel
        rawBuffer[i * 4 + 3] = 40;
      } else {
        // Completely transparent
        rawBuffer[i * 4 + 3] = 0;
      }
    } else {
      rawBuffer[i * 4 + 3] = 255;
    }
  }

  // Build sharp pipeline from processed raw buffer
  let pipeline = sharp(rawBuffer, {
    raw: {
      width,
      height,
      channels: 4
    }
  });

  if (trim) {
    pipeline = pipeline.trim();
  }

  if (sharpen) {
    pipeline = pipeline.sharpen({
      sigma: 1.2,
      m1: 1.5,
      m2: 0.5
    });
  }

  await pipeline.png({ compressionLevel: 9, quality: 100 }).toFile(outputPath);
  const outMeta = await sharp(outputPath).metadata();
  console.log(`✓ Saved transparent PNG: ${outputPath} (${outMeta.width}x${outMeta.height}, size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
}

async function run() {
  const imagesDir = path.resolve(__dirname, '../new-react-app/public/images');

  // 1. SunsnappZ Avatar
  await makeTransparentFloodFill(
    path.join(imagesDir, 'sunsnappz-logo.jpg'),
    path.join(imagesDir, 'sunsnappz-logo.png'),
    {
      threshold: 242,
      diffThreshold: 22,
      trim: true,
      sharpen: true,
      includeInternalHoles: false // Keep shirt stripes and eyes solid!
    }
  );

  // 2. AWESOMEZ SHOP Text Banner
  await makeTransparentFloodFill(
    path.join(imagesDir, 'awesomez-shop-logo.jpg'),
    path.join(imagesDir, 'awesomez-shop-logo.png'),
    {
      threshold: 238,
      diffThreshold: 25,
      trim: true,
      sharpen: true,
      includeInternalHoles: true // Make holes inside A, O, P transparent too!
    }
  );

  console.log('\nAll logos successfully converted to high-definition transparent PNGs!');
}

run().catch(console.error);
