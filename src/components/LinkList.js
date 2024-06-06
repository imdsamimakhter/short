import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LinkList() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get('/api/links');
        setLinks(response.data);
      } catch (error) {
        console.error('Error fetching links', error);
      }
    };
    fetchLinks();
  }, []);

  return (
    <div>
      <h1>All Links</h1>
      <ul>
        {links.map(link => (
          <li key={link.id}>
            <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">{link.shortUrl}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LinkList;
