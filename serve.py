#!/usr/bin/env python3
"""Simple HTTP server for SQLMAX — required for sql.js WebAssembly"""
import http.server
import socketserver
import webbrowser
import os

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        pass  # Silent mode

os.chdir(DIRECTORY)
print(f"\n🎮  SQLMAX Server running!")
print(f"   ➜  http://localhost:{PORT}/index.html\n")
print("   Press Ctrl+C to stop\n")

webbrowser.open(f"http://localhost:{PORT}/index.html")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
