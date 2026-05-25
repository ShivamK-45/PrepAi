require('dotenv').config();
const { generateSpeech } = require('./tts.service');
const fs = require('fs');

async function testTTS() {
    try {
        console.log('Testing Google Cloud TTS...');
        
        const audioBase64 = await generateSpeech('Hello! This is a test of the text to speech system. Can you explain the lifecycle of a React component?');
        
        const audioBuffer = Buffer.from(audioBase64, 'base64');
        fs.writeFileSync('test-output.mp3', audioBuffer);
        
        console.log('✅ TTS working! Audio saved to test-output.mp3');
        console.log('Play the file to verify the voice quality.');
        
    } catch (error) {
        console.error('❌ TTS test failed:', error.message);
        console.error('Full error:', error);
    }
}

testTTS();