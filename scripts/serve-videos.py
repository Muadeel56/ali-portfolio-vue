"""Serves video-out/ locally (with HTTP Range + CORS) so encoded videos can be
previewed before they are uploaded to S3.

Usage: npm run dev:local-videos   (starts this server and Vite pointed at it)
   or: python3 scripts/serve-videos.py [port]
"""
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'video-out')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8089


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def send_head(self):
        # Browsers need 206 Partial Content to seek in MP4s.
        match = re.match(r'bytes=(\d*)-(\d*)', self.headers.get('Range', ''))
        path = self.translate_path(self.path)
        if not match or not os.path.isfile(path):
            self._remaining = None
            return super().send_head()
        size = os.path.getsize(path)
        first, last = match.groups()
        start = int(first) if first else size - int(last)
        end = min(int(last) if first and last else size - 1, size - 1)
        f = open(path, 'rb')
        f.seek(start)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(end - start + 1))
        self.end_headers()
        self._remaining = end - start + 1
        return f

    def copyfile(self, src, dst):
        remaining = getattr(self, '_remaining', None)
        if remaining is None:
            return super().copyfile(src, dst)
        while remaining > 0:
            chunk = src.read(min(65536, remaining))
            if not chunk:
                break
            try:
                dst.write(chunk)
            except (BrokenPipeError, ConnectionResetError):
                break
            remaining -= len(chunk)

    def log_message(self, *args):
        pass


if __name__ == '__main__':
    print(f'Serving {os.path.normpath(ROOT)} at http://localhost:{PORT}')
    ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
