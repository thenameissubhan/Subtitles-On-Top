let subtitlesEnabled = true;
let qualityEnforced = false;

// Function to toggle the styles on or off
const toggleVikiStyles = (enable) => {
    subtitlesEnabled = enable;
    if (enable) {
        document.body.classList.add('subtitles-on-top');
    } else {
        document.body.classList.remove('subtitles-on-top');
    }
};

// FEATURE: Force 1080p / High Quality
// This attempts to set user preferences in local storage to prevent quality drops.
// It runs once per page load to avoid interfering with the player repeatedly.
const forceBestQuality = () => {
    if (qualityEnforced) return;
    
    try {
        // Common storage keys Viki and other players use to remember quality
        localStorage.setItem('video-quality', 'high');
        localStorage.setItem('preferred_quality', '1080p');
        
        // Attempt to access Viki specific settings if exposed in storage
        // This helps the player default to the highest available stream
        const currentSettings = localStorage.getItem('viki_player_settings');
        if (currentSettings) {
            let settings = JSON.parse(currentSettings);
            settings.quality = '1080p';
            localStorage.setItem('viki_player_settings', JSON.stringify(settings));
        }
        
        console.log('Subtitles on Top: Attempted to force High Quality.');
        qualityEnforced = true;
    } catch (e) {
        // Silently fail if storage is restricted
    }
};

// Listen for messages from the popup (when you click the button)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'enable') {
        toggleVikiStyles(true);
    } else if (request.action === 'disable') {
        toggleVikiStyles(false);
    }
});

// Check initial state from storage (when you first load a Viki page)
chrome.storage.local.get(['subtitlesEnabled'], (result) => {
    // Default to true (enabled) if no setting is saved
    const isEnabled = result.subtitlesEnabled !== undefined ? result.subtitlesEnabled : true;
    toggleVikiStyles(isEnabled);
    
    // Also try to force quality on load
    forceBestQuality();
});

// Watch for changes in the storage (e.g. toggling from another tab)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.subtitlesEnabled) {
        toggleVikiStyles(changes.subtitlesEnabled.newValue);
    }
});

// NEW: MutationObserver to fix the "Reset" issue.
// This watches the body tag. If Viki refreshes the app or navigates to a new video
// and wipes our class, this puts it right back immediately.
const observer = new MutationObserver((mutations) => {
    if (subtitlesEnabled && !document.body.classList.contains('subtitles-on-top')) {
        document.body.classList.add('subtitles-on-top');
        // Re-force quality if the player reloaded
        forceBestQuality();
    }
});

// Start observing the document body for attribute changes (like class removal)
observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
    childList: false,
    subtree: false
});