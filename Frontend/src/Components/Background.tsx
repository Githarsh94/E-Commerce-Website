type BackgroundProps = {
    url: string;
};

function Background({ url }: BackgroundProps) {
    const isVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');

    return (
        <div id="blurBackground">
            {isVideo ? (
                <video autoPlay loop muted src={url}></video>
            ) : (
                <img src={url} alt="Background" />
            )}
        </div>
    );
}

export default Background;
