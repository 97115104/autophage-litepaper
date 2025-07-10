// File viewer utility for opening Python and other text files in browser
function viewFile(url, filename) {
    // Create a simple HTML page with the file content
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('File not found');
            return response.text();
        })
        .then(content => {
            // Create a new window with the content
            const newWindow = window.open('', '_blank');
            
            // Write a simple HTML page with the file content
            newWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <title>${filename}</title>
    <style>
        body {
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            margin: 0;
            padding: 20px;
            background: #f8f8f8;
            color: #333;
            line-height: 1.6;
        }
        
        .header {
            background: #fff;
            padding: 20px;
            margin: -20px -20px 20px -20px;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        h1 {
            margin: 0;
            font-size: 1.5em;
            font-weight: normal;
        }
        
        .actions {
            display: flex;
            gap: 10px;
        }
        
        button {
            padding: 8px 16px;
            background: #fff;
            border: 1px solid #333;
            cursor: pointer;
            font-family: inherit;
        }
        
        button:hover {
            background: #333;
            color: #fff;
        }
        
        pre {
            background: #fff;
            padding: 20px;
            border: 1px solid #ddd;
            overflow-x: auto;
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        @media (prefers-color-scheme: dark) {
            body { background: #1e1e1e; color: #d4d4d4; }
            .header { background: #2d2d30; border-color: #3e3e42; }
            button { background: #2d2d30; color: #d4d4d4; border-color: #3e3e42; }
            button:hover { background: #094771; border-color: #094771; }
            pre { background: #2d2d30; border-color: #3e3e42; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${filename}</h1>
        <div class="actions">
            <button onclick="copyToClipboard()">Copy All</button>
            <button onclick="window.close()">Close</button>
        </div>
    </div>
    <pre id="content">${escapeHtml(content)}</pre>
    
    <script>
        function copyToClipboard() {
            const content = document.getElementById('content').textContent;
            navigator.clipboard.writeText(content).then(() => {
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            });
        }
        
        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        }
    </script>
</body>
</html>
            `);
            
            newWindow.document.close();
        })
        .catch(error => {
            alert('Error loading file: ' + error.message);
        });
}

// Helper function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}