import React, { useState } from 'react';
import axios from 'axios';

function ShortenLink() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/shorten', { url });
      setShortUrl(response.data.shortUrl);
    } catch (error) {
      setError('Error shortening the URL: ' + (error.response?.data?.error || error.message));
      console.error('Error shortening the URL', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          required
        />
        <button type="submit">Shorten</button>
      </form>
      {shortUrl && <p>Shortened URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ShortenLink;
