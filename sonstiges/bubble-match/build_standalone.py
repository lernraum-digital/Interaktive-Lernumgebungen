"""Pack the maintained sources into one HTML file that also runs via file://."""
from pathlib import Path
import json
import re

folder = Path(__file__).resolve().parent
page = (folder / 'index.html').read_text()
engine = (folder / 'engine.mjs').read_text().replace('export ', '')
app_source = (folder / 'app.mjs').read_text().replace("import {Game,validate,fitText} from './engine.mjs';\n", '')
scenario = json.dumps(json.loads((folder / 'scenarios/knotberg.json').read_text()), ensure_ascii=False).replace('</', '<\\/')
app = app_source.replace("await(await fetch('./scenarios/knotberg.json')).json()", scenario)
runtime = '<script id="bubble-runtime">\n(() => {\n' + engine + '\n' + app + '\n})();\n</script>'
page = re.sub(r'<script(?: id="bubble-runtime"| type="module" src="app.mjs")[^>]*>.*?</script>', lambda m: runtime, page, flags=re.S)
styles = '<style id="bubble-style">\n' + (folder / 'style.css').read_text() + '\n</style>'
page = re.sub(r'<link rel="stylesheet" href="style.css">|<style id="bubble-style">.*?</style>', lambda m: styles, page, flags=re.S)
(folder / 'index.html').write_text(page)
workshop = page.replace('<body>', '<body data-workshop="true">')
(folder / 'werkstatt.html').write_text(workshop)
test_scenario = json.loads((folder / 'scenarios/knotberg.json').read_text())
test_scenario.update(transparent=True, layout='bottom', startMode='overlay', hudTransparent=True, hudText='#302a21')
test_json = json.dumps(test_scenario, ensure_ascii=False).replace('</', '<\\/')
test_app = app_source.replace("await(await fetch('./scenarios/knotberg.json')).json()", test_json)
test_runtime = '<script id="bubble-runtime">\n(() => {\n' + engine + '\n' + test_app + '\n})();\n</script>'
test_page = re.sub(r'<script id="bubble-runtime">.*?</script>', lambda m: test_runtime, page, flags=re.S)
(folder / 'test.html').write_text(test_page)
print('Standalone index.html updated: no server or neighbouring files required.')
