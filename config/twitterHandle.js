const { TwitterApi } = require('twitter-api-v2');

// Twitter API client configuration
const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret:process.env.TWITTER_APP_SECRET,
    accessToken:process.env.TWITTER_ACEESS_TOKEN,
    accessSecret: process.env.TWITTER_ACESS_SECRET,
});

// Function to fetch video URL from a tweet
exports.getVidoFromTwitter=async(tweetId)=> {
    try {
        // Fetch the tweet details
        const tweet = await twitterClient.v2.singleTweet(tweetId, {
            expansions: 'attachments.media_keys',
            'media.fields': 'url,variants',
        });

        // Extract the video URL
        const media = tweet.includes.media || [];
        const videoMedia = media.find(item => item.type === 'video' || item.type === 'animated_gif');

        if (videoMedia && videoMedia.variants) {
            const highestQuality = videoMedia.variants.reduce((prev, curr) =>
                prev.bitrate > curr.bitrate ? prev : curr
            );
            return { videoUrl: highestQuality.url };
        }
        return { videoUrl: null}
        //res.status(404).json({ error: 'No video found in the tweet.' });
    } catch (error) {
        console.error('Error fetching tweet video:', error);
        return { videoUrl: null}
    }
}







