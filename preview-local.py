#!/usr/bin/env python3
"""Run this static DESIGN mock locally, including Cloudflare-style _redirects.
Usage: python3 preview-local.py [port]   (default 8080)
No wallet, real API or payments: the included browser mocks are synthetic.
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import sys
import os
root=Path(__file__).resolve().parent
rules=[]
for line in (root/'_redirects').read_text().splitlines():
    line=line.strip()
    if not line or line.startswith('#'): continue
    p=line.split()
    if len(p)>=3 and p[2] in ('200','301','302','404'): rules.append((p[0],p[1],int(p[2])))

class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(root),**kwargs)
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        self.send_header('Content-Security-Policy',"connect-src 'self'; form-action 'none'; base-uri 'self'")
        super().end_headers()
    def resolve(self,url):
        if url=='/': return root/'index.html'
        base=url.lstrip('/')
        for candidate in (root/base, root/(base+'.html'), root/base/'index.html'):
            if candidate.is_file() and candidate.resolve().is_relative_to(root): return candidate
        return None
    def translate_path(self,path):
        route=urlsplit(path).path
        for patt,target,code in rules:
            if patt==route or (patt.endswith('*') and route.startswith(patt[:-1])):
                if code==200:
                    p=self.resolve(target)
                    if p: return str(p)
                if code==404: return str(root/'404.html')
        p=self.resolve(route)
        return str(p) if p else str(root/'404.html')
    def do_GET(self):
        route=urlsplit(self.path).path
        for patt,target,code in rules:
            if patt==route and code in (301,302):
                self.send_response(code)
                self.send_header('Location',target+(('?' + urlsplit(self.path).query) if urlsplit(self.path).query else ''))
                self.end_headers();return
        super().do_GET()
    def do_HEAD(self): super().do_HEAD()
    def do_POST(self): self.send_error(403,'Synthetic preview does not accept writes')

if __name__=='__main__':
    port=int(sys.argv[1]) if len(sys.argv)>1 else 8080
    print(f'Design-only static preview: http://127.0.0.1:{port}/design-preview/')
    ThreadingHTTPServer(('127.0.0.1',port),Handler).serve_forever()
