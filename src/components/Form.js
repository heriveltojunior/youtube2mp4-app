import React, { useState } from 'react';

const DownloadForm = () => {
    const [url, setUrl] = useState('');
    const [downloadLink, setDownloadLink] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoThumb, setVideoThumb] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setDownloadLink('');
        setVideoTitle('');
        setVideoThumb('');
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/download/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (response.ok) {
                const data = await response.json();
                setDownloadLink(data.download_url);
                setVideoTitle(data.title);
                setVideoThumb(data.thumb_video)
            } else {
                const errorData = await response.json();
                setError(errorData.error);
            }
        } catch (error) {
            setError('An unexpected error occurred: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Coloque aqui o link para o video..."
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <br/><br/>
                <button type="submit" disabled={loading}>
                    {loading ? 'Downloading...' : 'Download'}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
            {loading && <p className="loading">Aguarde enquanto o link de download é criado.</p>}
            {downloadLink && (
                <div id="result">
                    <h2>Link de Download: <a href={downloadLink} target="_blank" rel="noopener noreferrer">{videoTitle}</a></h2>
                    <a href={downloadLink} target="_blank" rel="noopener noreferrer"><img class="img-responsive" alt="Download" src={videoThumb}/></a>
                </div>
            )}
        </div>
    );
};

export default DownloadForm;
