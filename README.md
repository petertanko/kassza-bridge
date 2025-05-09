# Kassza WebSocket Bridge

Ez az Electron alkalmazás lehetővé teszi, hogy egy böngészős alkalmazás (pl. Nuxt.js) WebSocket kapcsolaton keresztül kommunikáljon egy TCP alapú kasszarendszerrel.

## Funkciók

- WebSocket szerver `ws://localhost:12345`
- TCP kapcsolat `127.0.0.1:6811` címre
- XML parancs- és válaszküldés
- Loggolás `bridge.log` fájlba

## Buildelés GitHub Actions segítségével

Ez a projekt tartalmaz egy GitHub Actions workflow-t, amely Windows-os `.exe` fájlt generál `portable` módban. Az artefakt letölthető a workflow végén.

### Használat

1. Push-old fel a repót GitHubra
2. Nyisd meg a `Actions` fület
3. Indítsd el a `Build Windows EXE` workflow-t
4. A kimeneti `.exe` fájl letölthető az artefaktok közül

### Fejlesztéshez

```bash
npm install
npm run start
```
