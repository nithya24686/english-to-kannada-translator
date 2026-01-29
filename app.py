"""
Flask web application for English to Kannada Translator
"""

from flask import Flask, render_template, request, jsonify
from google_trans_new import google_translator
import os

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size


@app.route('/')
def index():
    """Render the home page"""
    return render_template('index.html')


def translate_text(text, source_lang='en', target_lang='kn'):
    """
    Translate text using Google Translate API
    """
    try:
        translator = google_translator()
        result = translator.translate(text, lang_src=source_lang, lang_tgt=target_lang)
        return result
    
    except Exception as e:
        raise Exception(f"Translation error: {str(e)}")


@app.route('/api/translate', methods=['POST'])
def translate():
    """API endpoint for translation"""
    try:
        data = request.get_json()
        english_text = data.get('text', '').strip()
        
        if not english_text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Translate using MyMemory API
        kannada_text = translate_text(english_text, 'en', 'kn')
        
        return jsonify({
            'english': english_text,
            'kannada': kannada_text,
            'success': True
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500


@app.route('/api/translate-batch', methods=['POST'])
def translate_batch():
    """API endpoint for batch translation"""
    try:
        data = request.get_json()
        texts = data.get('texts', [])
        
        if not texts:
            return jsonify({'error': 'No texts provided'}), 400
        
        results = []
        for text in texts:
            text = text.strip()
            if text:
                kannada_text = translate_text(text, 'en', 'kn')
                results.append({
                    'english': text,
                    'kannada': kannada_text
                })
        
        return jsonify({
            'results': results,
            'success': True
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500


if __name__ == '__main__':
    # Create templates and static directories if they don't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
