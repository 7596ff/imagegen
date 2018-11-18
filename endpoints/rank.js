const config = require("../config.json");
const fs = require("fs");   
const Jimp = require("jimp")

const files = {
    icon: [
        fs.readFileSync(`${__dirname}/../static/badges/icon/rank_icon_0.png`),
        fs.readFileSync(`${__dirname}/../static/badges/icon/rank_icon_1.png`),
        fs.readFileSync(`${__dirname}/../static/badges/icon/rank_icon_2.png`),
        fs.readFileSync(`${__dirname}/../static/badges/icon/rank_icon_3.png`),
        fs.readFileSync(`${__dirname}/../static/badges/icon/rank_icon_4.png`),
        fs.readFileSync(`${__dirname}/../static/badges/icon/rank_icon_5.png`),
        fs.readFileSync(`${__dirname}/../static/badges/icon/rank_icon_6.png`),
        fs.readFileSync(`${__dirname}/../static/badges/icon/rank_icon_7.png`),
        fs.readFileSync(`${__dirname}/../static/badges/icon/rank_icon_7a.png`),
        fs.readFileSync(`${__dirname}/../static/badges/icon/rank_icon_7b.png`),
        fs.readFileSync(`${__dirname}/../static/badges/icon/rank_icon_7c.png`)
    ],
    stars: [
        fs.readFileSync(`${__dirname}/../static/badges/stars/rank_star_1.png`),
        fs.readFileSync(`${__dirname}/../static/badges/stars/rank_star_2.png`),
        fs.readFileSync(`${__dirname}/../static/badges/stars/rank_star_3.png`),
        fs.readFileSync(`${__dirname}/../static/badges/stars/rank_star_4.png`),
        fs.readFileSync(`${__dirname}/../static/badges/stars/rank_star_5.png`)
    ]
};

async function draw(icon, star) {
    let image = new Jimp(256, 256);

    let iconImage = await Jimp.read(files.icon[icon]);
    await image.composite(iconImage, 0, 0);

    if (star !== 0) {
        let starImage = await Jimp.read(files.stars[star - 1]);
        await image.composite(starImage, 0, 0);
    }

    return image;
}

function handle(req, res) {
    if (!config.keys.includes(req.query.key)) return res.status(401).send("Unauthorized");

    if (!req.query.badge) return res.status(400).send("Bad Request");

    let icon = parseInt(req.query.badge.toString()[0]);
    let star = parseInt(req.query.badge.toString()[1]);
    if (isNaN(star)) star = 0;

    if (req.query.badge == 76) {
        icon = 8;
        star = 0;
    }
    
    if (req.query.rank <= 100) icon = 9;
    if (req.query.rank <= 10) icon = 10;
    
    draw(icon, star).then((image) => {
        let mime = image.getMIME();
        res.set("Content-Type", mime);
        image.getBuffer(mime, (err, buffer) => {
            res.write(buffer, "binary");
            res.end(undefined, "binary");
        });
    }).catch((err) => {
        console.error(err);
        return res.send(err);
    })
}

module.exports = {
    method: "get",
    route: "/rank",
    handle
};
