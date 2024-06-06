import React from 'react';

function DownloadPage() {
  const handleDownload = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    window.location.href = `/api/download?token=${token}`;
  };

  return (
    <div>
      <h1>Download Page</h1>
      <button onClick={handleDownload}>Download Now</button>
    </div>
  );
}

export default DownloadPage;
