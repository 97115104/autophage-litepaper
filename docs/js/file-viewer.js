// File viewer utility for opening Python and other text files in browser
function viewFile(url, filename) {
    // Use the code viewer page instead of creating a new window
    // This avoids popup blockers
    window.open(`code-viewer?file=${encodeURIComponent(url)}`, '_blank');
}