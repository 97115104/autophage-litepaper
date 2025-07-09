#!/usr/bin/env python3
"""
Simple HTTP server for testing the Autophage Protocol documentation locally.
Run this script from the docs directory to serve the site at http://localhost:8000
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import socket
import signal
import time
from functools import partial

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(__file__) or '.', **kwargs)
    
    def end_headers(self):
        # Add headers to prevent caching during development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    
    def guess_type(self, path):
        """Override to serve .py files as text/plain for browser display"""
        mimetype, _ = super().guess_type(path)
        if path.endswith('.py'):
            return 'text/plain'
        return mimetype
    
    def do_GET(self):
        # Handle root path
        if self.path == '/':
            self.path = '/index.html'
        
        # Log the request
        print(f"Serving: {self.path}")
        
        return super().do_GET()

def kill_existing_server(port):
    """Kill any existing process using the port"""
    try:
        # Try to connect to the port
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', port))
        sock.close()
        
        if result == 0:
            print(f"Port {port} is already in use. Attempting to free it...")
            # On macOS/Linux, use lsof to find and kill the process
            if sys.platform != 'win32':
                os.system(f"lsof -ti:{port} | xargs kill -9 2>/dev/null")
                time.sleep(1)  # Give it a moment to release the port
            else:
                print("Please manually close any process using port 8000")
    except:
        pass

def main():
    # Change to the docs directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Kill any existing server on the port
    kill_existing_server(PORT)
    
    print(f"Starting server at http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server\n")
    
    # Create server with SO_REUSEADDR to avoid "Address already in use" errors
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            # Open browser
            try:
                webbrowser.open(f'http://localhost:{PORT}')
            except:
                pass
            
            # Start serving
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\nServer stopped.")
                httpd.shutdown()
                httpd.server_close()
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"\nError: Port {PORT} is still in use.")
            print("Try running: lsof -ti:8000 | xargs kill -9")
            print("Or wait a few seconds and try again.")
        else:
            raise
    finally:
        sys.exit(0)

if __name__ == "__main__":
    main()