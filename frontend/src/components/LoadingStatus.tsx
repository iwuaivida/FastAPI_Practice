interface LoadingStatusProp {
    theme: string;
}

function LoadingStatus({theme}: LoadingStatusProp) {
    return <div className="loading-container">
        <h2>Generating Your {theme} Story</h2>

        <div className="loading-animation">
            <div className="spinner"></div>
        </div>

        <p className="loading-info">
            Please wait while we generate your story.
        </p>
    </div>
}

export default LoadingStatus;