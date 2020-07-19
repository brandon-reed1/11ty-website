const CacheAsset = require("@11ty/eleventy-cache-assets");
const fastglob = require("fast-glob");

module.exports = async function() {
	let url = "https://www.speedlify.dev/api/urls.json";
	let urlsJson = await CacheAsset(url, {
		duration: "1d",
		type: "json",
	});

	let returnData = {
		urls: urlsJson,
		data: {}
	};

	let starters = await fastglob("./_data/starters/*.json", {
		caseSensitiveMatch: false
	});

	for(let site of starters) {
		// TODO clear require cache
		let siteData = require(`.${site}`);
		let urlLookup = urlsJson[siteData.demo] || urlsJson[siteData.url];
		if(urlLookup && urlLookup.hash) {
			returnData.data[siteData.demo || siteData.url] = await CacheAsset(`https://www.speedlify.dev/api/${urlLookup.hash}.json`, {
				duration: "1d",
				type: "json",
			});
		}
	}

	// await Promise.all(Object.values(returnData.data));

	return returnData;
};