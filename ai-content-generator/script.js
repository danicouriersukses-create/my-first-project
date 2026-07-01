// ⚠️ IMPORTANT: Replace with your actual Groq API key
const GROQ_API_KEY = 'YOUR_GROQ_API_KEY_HERE';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const outputContent = document.getElementById('outputContent');
const loadingSpinner = document.getElementById('loadingSpinner');
const nicheSelect = document.getElementById('niche');
const platformSelect = document.getElementById('platform');
const toneSelect = document.getElementById('tone');
const additionalDetails = document.getElementById('additionalDetails');

// Event Listeners
generatBtn.addEventListener('click', generateContent);
copyBtn.addEventListener('click', copyToClipboard);

async function generateContent() {
    const niche = nicheSelect.value;
    const platform = platformSelect.value;
    const tone = toneSelect.value;
    const additional = additionalDetails.value;

    if (!niche) {
        showError('Pilih niche/tema terlebih dahulu!');
        return;
    }

    // Check API Key
    if (GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
        showError('⚠️ API Key belum dikonfigurasi! Hubungi admin untuk setup.');
        return;
    }

    // Show loading state
    loadingSpinner.style.display = 'block';
    outputContent.innerHTML = '';
    generateBtn.disabled = true;
    copyBtn.style.display = 'none';

    try {
        // Build prompt
        let prompt = `You are a professional social media content creator. 
        
Generate a single, engaging ${platform} caption for ${niche} niche.
Tone: ${tone}
Target audience: Teens & Millennials

Requirements:
- Make it engaging and original
- Include relevant emojis
- Include 3-5 relevant hashtags at the end
- Keep it concise but impactful
- Platform: ${platform}`;

        if (additional) {
            prompt += `\n\nAdditional notes: ${additional}`;
        }

        // Call Groq API
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional social media content creator who creates viral, engaging posts for teens and millennials.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.choices[0].message.content;

        // Display result
        outputContent.innerHTML = generatedText;
        copyBtn.style.display = 'inline-block';
        showSuccess('✅ Content generated successfully!');

    } catch (error) {
        console.error('Error:', error);
        showError(`❌ Error: ${error.message}`);
        outputContent.innerHTML = 'Failed to generate content. Please try again.';
    } finally {
        loadingSpinner.style.display = 'none';
        generateBtn.disabled = false;
    }
}

function copyToClipboard() {
    const text = outputContent.innerText;
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('📋 Copied to clipboard!');
    }).catch(() => {
        showError('Failed to copy');
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    outputContent.insertBefore(errorDiv, outputContent.firstChild);
    setTimeout(() => errorDiv.remove(), 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 2000);
}