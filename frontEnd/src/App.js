import { useState } from 'react';
import axios from 'axios';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleClean = () => {
    setLongUrl(''); // Clear the input field
    setShortUrl(''); // Optionally clear short URL too
    setError(''); // Clear error messages
  };

  const handleSubmit = async () => {
    setError('');
    setShortUrl('');

    if (!longUrl) {
      setError('Please enter a URL');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/shorten', { url: longUrl });
      setShortUrl(response.data.short_url);
    } catch (err) {
      setError('Failed to shorten URL. Is your backend running?');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: 'auto',  borderRadius: 8 }}>
      <h2>URL Shortener</h2>

      <input
        type="text"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        placeholder="Enter long URL"
        style={{
          width: '100%',
          padding: '12px 16px',
          marginBottom: '16px',
          fontSize: '16px',
          borderRadius: '8px',
          border: '2px solid #ccc',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          outline: 'none',
          backgroundColor:'#caf0f8',
        }}
      />

      <button onClick={handleSubmit} style={{ padding: '8px 16px',
    marginRight: '10px',
    borderRadius: '12px',      
    border: '1px solid #ccc',  
    backgroundColor: '#0d1b2a',  
    cursor: 'pointer',
 color:'white'
       }}>
        Shorten
      </button>
      <button onClick={handleClean} style={{ padding: '8px 16px',borderRadius: '12px',      
    border: '1px solid #ccc',  
    backgroundColor: '#0d1b2a',  
    cursor: 'pointer',color:'white' }}>
        Clean
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {shortUrl && (
        <p>
          Short URL: <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
        </p>
      )}
    </div>
  );
}

export default App;
