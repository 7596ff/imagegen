const fs = require("fs");   
const Jimp = require("jimp")
const dc = require("dotaconstants");
const Downloader = require("../util/Downloader");
const dl = new Downloader("http://cdn.dota2.com/apps/dota2", `${__dirname}/..`);

const unpicked = fs.readFileSync(`${__dirname}/../static/unpicked.png`);
const unbanned = fs.readFileSync(`${__dirname}/../static/unbanned.png`);
const template = fs.readFileSync(`${__dirname}/../static/draft_template.png`);

const locations = require("../static/locations.json").draft;

async function draw(data) {
    let base = await Jimp.read(template);

    for (let index in data.radiant_bans) {
        let heroID = data.radiant_bans[index];
        let buffer;
        if (heroID > 0) {
            let heroName = dc.heroes[heroID].name.replace("npc_dota_hero_", "");
            buffer = await dl.getBuffer(`/images/heroes/${heroName}_full.png`);

            let loc = locations.radiant_bans[index];
            let image = await Jimp.read(buffer);
            await image.resize(loc[2], loc[3]);
            await base.composite(image, loc[0], loc[1]);
            let strike = await Jimp.read(unbanned);
            await strike.resize(loc[2], loc[3]);
            await base.composite(strike, loc[0], loc[1]);
        }
    }

    for (let index in data.radiant_picks) {
        let heroID = data.radiant_picks[index];
        let buffer;
        if (heroID > 0) {
            let heroName = dc.heroes[heroID].name.replace("npc_dota_hero_", "");
            buffer = await dl.getBuffer(`/images/heroes/${heroName}_vert.jpg`);
        } else {
            buffer = unpicked;
        }

        let loc = locations.radiant_picks[index];
        let image = await Jimp.read(buffer);
        await image.resize(loc[2], loc[3]);
        await base.composite(image, loc[0], loc[1]);
    }

    for (let index in data.dire_bans) {
        let heroID = data.dire_bans[index];
        let buffer;
        if (heroID > 0) {
            let heroName = dc.heroes[heroID].name.replace("npc_dota_hero_", "");
            buffer = await dl.getBuffer(`/images/heroes/${heroName}_full.png`);

            let loc = locations.dire_bans[index];
            let image = await Jimp.read(buffer);
            await image.resize(loc[2], loc[3]);
            await base.composite(image, loc[0], loc[1]);
            let strike = await Jimp.read(unbanned);
            await strike.resize(loc[2], loc[3]);
            await base.composite(strike, loc[0], loc[1]);
        }
    }

    for (let index in data.dire_picks) {
        let heroID = data.dire_picks[index];
        let buffer;
        if (heroID > 0) {
            let heroName = dc.heroes[heroID].name.replace("npc_dota_hero_", "");
            buffer = await dl.getBuffer(`/images/heroes/${heroName}_vert.jpg`);
        } else {
            buffer = unpicked;
        }

        let loc = locations.dire_picks[index];
        let image = await Jimp.read(buffer);
        await image.resize(loc[2], loc[3]);
        await base.composite(image, loc[0], loc[1]);
    }

    return base;
}

function handle(req, res) {
    let data = {
        radiant_bans: Array(5).fill("0"),
        dire_bans: Array(5).fill("0"),
        radiant_picks: Array(5).fill("0"),
        dire_picks: Array(5).fill("0")
    };

    for (key of Object.keys(data)) {
        data[key] = Object.assign(data[key], req.query[key] && req.query[key].split(","));
    }

    draw(data).then((image) => {
        let mime = image.getMIME();
        res.set("Content-Type", mime);
        image.getBuffer(mime, (err, buffer) => {
            res.write(buffer, "binary");
            res.end(undefined, "binary");
        });
    }).catch((err) => {
        console.error(err);
        return res.send(err);
    });
}

module.exports = {
    method: "get",
    route: "/draft",
    handle
};
