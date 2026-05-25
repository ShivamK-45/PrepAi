const textToSpeech = require('@google-cloud/text-to-speech');

// Initialize client
const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.GOOGLE_CLOUD_TTS_API_KEY
});

/**
 * Generate speech audio from text
 */
async function generateSpeech(text) {
    try {
        const request = {
            input: { text },
            voice: {
                languageCode: 'en-US',
                name: 'en-US-Neural2-J',
                ssmlGender: 'MALE'
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 1.0,
                pitch: 0.0
            }
        };

        const [response] = await client.synthesizeSpeech(request);
        return response.audioContent.toString('base64');
        
    } catch (error) {
        console.error('Error generating speech:', error);
        throw error;
    }
}

module.exports = {
    generateSpeech
};