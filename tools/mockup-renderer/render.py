import sys,json,base64,subprocess,time,io
from playwright.sync_api import sync_playwright
from PIL import Image
import re; jobs=json.loads(re.sub(r'(?<=[\[,:\s-])\.(\d)',r'0.\1',open(sys.argv[1]).read())); out=sys.argv[2]
srv=subprocess.Popen(['python3','-m','http.server','8765'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg=b.new_page(); pg.on('console',lambda m:print('console:',m.text) if m.type=='error' else None); pg.on('pageerror',lambda e:print('pageerror',e))
    pg.goto('http://localhost:8765/scene.html'); pg.wait_for_function('window.ready===true',timeout=20000)
    for name,spec in jobs.items():
        u=pg.evaluate('(s)=>window.job(s)',spec)
        im=Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA' if spec.get('flat') else 'RGB'); im.save(f'{out}/{name}.webp','WEBP',quality=86); print(name,im.size)
    b.close()
srv.terminate()
