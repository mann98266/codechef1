const fs = require('fs');
const path = require('path');

const createPNG = (width, height, filename) => {
    // minimalist 1x1 fully transparent pixel or similar simple header
    // Actually, let's just make a valid minimal PNG header so it's not "broken"
    // minimal 1x1 pixel PNG
    const buffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // Signature
        0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // Dimensions 1x1
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, // 8-bit, RGBA, etc.
        0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, // IDAT
        0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, // data
        0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82 // IEND
    ]);

    fs.writeFileSync(path.join('images', filename), buffer);
    console.log(`Created ${filename}`);
};

// Create images dir if not exists (handling the failed mkdir case just safely)
if (!fs.existsSync('images')) fs.mkdirSync('images');

// Client placeholders
for (let i = 1; i <= 6; i++) {
    createPNG(100, 50, `client${i}.png`);
}

// Team placeholders
for (let i = 1; i <= 4; i++) {
    createPNG(300, 300, `team${i}.png`);
}

// Hero/Misc placeholders
createPNG(1920, 1080, 'hero-bg.png');
createPNG(800, 600, 'service-ai.png');
