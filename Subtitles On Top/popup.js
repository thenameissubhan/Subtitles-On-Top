document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-subtitles');
    const contributeButton = document.getElementById('Contribute'); // Get the Contribute button
    const statusText = document.getElementById('status');

    // Function to check the current state of subtitles
    chrome.storage.local.get(['subtitlesEnabled'], (result) => {
        const subtitlesEnabled = result.subtitlesEnabled !== undefined ? result.subtitlesEnabled : true; // Default to true
        updatePopup(subtitlesEnabled);
    });

    toggleButton.addEventListener('click', () => {
        chrome.storage.local.get(['subtitlesEnabled'], (result) => {
            const subtitlesEnabled = result.subtitlesEnabled !== undefined ? result.subtitlesEnabled : true;
            const newStatus = !subtitlesEnabled; // Toggle the state
            chrome.storage.local.set({ subtitlesEnabled: newStatus }, () => {
                updatePopup(newStatus);
                // Send message to content script to update subtitles state
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, { action: newStatus ? 'enable' : 'disable' });
                });
            });
        });
    });

    // Check if contributeButton exists before adding listener
    if (contributeButton) {
        contributeButton.addEventListener('click', openContributeLink); // Set up the event listener for the Contribute button
    }


    // Update the popup status
    function updatePopup(enabled) {
        statusText.textContent = enabled ? 'Subtitles on Top' : 'Subtitles Disabled';
        toggleButton.textContent = enabled ? 'Disable Subtitles' : 'Enable Subtitles'; // Update button text
    }

    // Function to open the contribution link
    function openContributeLink() {
        const contributeUrl = 'https://www.paypal.com/paypalme/sasubhan'; // Replace with your actual contribute link
        window.open(contributeUrl, '_blank');
    }
});