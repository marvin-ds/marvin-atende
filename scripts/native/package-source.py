from pathlib import Path
import zipfile
roots=['src','server','shared','_migration/native-domain/src','public','scripts/native','tests']
files=['backend/index.ts','package.json','package-lock.json','vite.config.ts','index.html','tsconfig.json','tsconfig.node.json','BLINK_ALUNOS.md','.gitignore']
with zipfile.ZipFile('dist/atendezap-native-source.zip','w',zipfile.ZIP_DEFLATED) as z:
 for base in roots:
  for p in Path(base).rglob('*'):
   if p.is_file() and not p.name.startswith('.env') and not p.name.endswith('.bundle.mjs'):z.write(p,str(p))
 for name in files:
  p=Path(name)
  if p.exists():z.write(p,str(p))
print('Fonte sem ambiente e sem credenciais empacotado')
