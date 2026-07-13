const { nanoid } = require("nanoid");
const url = require("../models/url");

async function handlegenerateshorturl(req, res) {
  const body = req.body;
  if (!body || !body.url)
    return res.status(400).json({ error: "URL IS REQUIRED" });

  const shortID = nanoid(8);
  await url.create({
    shortid: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy:req.user._id,
  });
   return res.render("home",{
    id:shortID,
   })
  // return res.json({ id: shortID });
}

async function handlegetanalytics(req, res) {
  const shortid = req.params.shortid;
  const result = await url.findOne({ shortid });
  return res.json({
    totalclicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handlegenerateshorturl,
  handlegetanalytics,
};
