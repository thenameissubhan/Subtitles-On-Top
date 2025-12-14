let subtitlesEnabled = true; // Default state

// Function to adjust subtitle positions and make background transparent
const adjustSubtitlePosition = () => {
    const subtitleElements = document.querySelectorAll('.player-timedtext-text-container span');

    subtitleElements.forEach(subtitle => {
        subtitle.style.position = 'fixed'; // Fixed positioning
        subtitle.style.top = '40px'; // Position at the top
        subtitle.style.left = '50%'; // Center horizontally
        subtitle.style.transform = 'translateX(-50%)'; // Center alignment adjustment
        subtitle.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Set background to transparent
        subtitle.style.color = 'white'; // Ensure text color is white for visibility
        subtitle.style.fontSize = '30px'; // Increase font size for better visibility
        subtitle.style.padding = '5px'; // Add some padding for aesthetics
        subtitle.style.whiteSpace = 'nowrap'; // Prevent text wrapping (optional)
        subtitle.style.zIndex = '9999'; // Ensure it is on top of other elements
    });
};

// Enable or disable subtitles
const toggleSubtitles = (enable) => {
    subtitlesEnabled = enable;
    if (subtitlesEnabled) {
        adjustSubtitlePosition(); // Adjust position when enabled
    } else {
        const subtitleElements = document.querySelectorAll('.player-timedtext-text-container span');
        subtitleElements.forEach(subtitle => {
            subtitle.style.display = 'none'; // Hide subtitles
            subtitle.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Set background back to transparent
        });
    }
};

// Use MutationObserver to detect changes in subtitle elements
const observer = new MutationObserver(() => {
    if (subtitlesEnabled) {
        adjustSubtitlePosition(); // Only adjust when subtitles are enabled
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'enable') {
        toggleSubtitles(true);
    } else if (request.action === 'disable') {
        toggleSubtitles(false);
    }
});

// Initial call to adjust subtitles
if (subtitlesEnabled) {
    adjustSubtitlePosition();
}