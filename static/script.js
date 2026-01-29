// Get DOM elements
const englishTextArea = document.getElementById('englishText');
const kannadaTextDiv = document.getElementById('kannadaText');
const charCount = document.getElementById('charCount');
const errorMessage = document.getElementById('errorMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const translateBtn = document.getElementById('translateBtn');
const copyBtn = document.getElementById('copyBtn');

// Update character count
englishTextArea.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = `${length}/500`;
    
    // Change color if approaching limit
    if (length > 400) {
        charCount.style.color = '#ff9800';
    } else if (length > 450) {
        charCount.style.color = '#f44336';
    } else {
        charCount.style.color = '#999';
    }
});

// Translate function
async function translate() {
    const englishText = englishTextArea.value.trim();
    
    // Validate input
    if (!englishText) {
        showError('Please enter some text to translate');
        return;
    }
    
    // Clear previous error and show loading
    hideError();
    showLoading();
    
    try {
        // Send request to backend
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: englishText
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Display translation
            kannadaTextDiv.textContent = data.kannada;
            copyBtn.style.display = 'block';
        } else {
            showError(data.error || 'Translation failed. Please try again.');
        }
    } catch (error) {
        showError('Error: ' + error.message);
        console.error('Translation error:', error);
    } finally {
        hideLoading();
    }
}

// Clear English text
function clearEnglish() {
    englishTextArea.value = '';
    kannadaTextDiv.textContent = '';
    charCount.textContent = '0/500';
    charCount.style.color = '#999';
    copyBtn.style.display = 'none';
    hideError();
}

// Copy to clipboard
function copyToClipboard() {
    const text = kannadaTextDiv.textContent;
    
    if (!text) {
        showError('Nothing to copy');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary success message
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        showError('Failed to copy: ' + err.message);
    });
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(hideError, 5000);
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
}

// Show loading indicator
function showLoading() {
    loadingIndicator.style.display = 'flex';
    translateBtn.disabled = true;
}

// Hide loading indicator
function hideLoading() {
    loadingIndicator.style.display = 'none';
    translateBtn.disabled = false;
}

// Allow Enter key to translate (Ctrl+Enter or Cmd+Enter)
englishTextArea.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        translate();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('English to Kannada Translator loaded successfully!');
});
