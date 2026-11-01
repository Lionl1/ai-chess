# AI Chess

Шахматы против языковых моделей в одном файле `index.html`, плюс Android-приложение на WebView.

- режимы: игрок против игрока, игрок против AI, AI против AI (одна модель или две разные);
- любой OpenAI-совместимый API: OpenAI, vLLM, LM Studio, Ollama;
- модель получает позицию (FEN), партию (PGN), остаток времени и список легальных ходов, отвечает JSON `{"thought", "move"}`; нелегальный ход — до трёх повторов с объяснением ошибки;
- часы (bullet / blitz / rapid / classic), «мысли» AI, экспорт PGN;
- локальный Elo-рейтинг моделей и история партий (в `localStorage` браузера).

Игра работает без интернета: логика (chess.js) встроена в страницу, фигуры — Unicode-символы. Сеть нужна только для запросов к модели.

## Запуск в браузере

Откройте `index.html` в браузере или поднимите локальный сервер:

```bash
python3 -m http.server 8000
```

и зайдите на <http://localhost:8000/>.

В панели «Настройки AI» укажите:

| Поле | Пример |
|---|---|
| URL API | `http://localhost:1234/v1/chat/completions` (LM Studio), `https://api.openai.com/v1/chat/completions` |
| Модель | `gpt-4o-mini`, `llama3` |
| API Key | только если провайдер требует |

Страница ходит в API прямо из браузера, поэтому у локального сервера модели должен быть включён CORS (в LM Studio — *Enable CORS*, в Ollama — `OLLAMA_ORIGINS=*`). Ключ API хранится только в поле формы и не сохраняется.

## Android

Обёртка WebView в [`android-app/`](android-app/): при каждой сборке Gradle копирует корневой `index.html` в assets приложения.

Нужны JDK 17+ и Android SDK (`ANDROID_HOME`):

```bash
cd android-app
./gradlew assembleDebug
```

APK: `android-app/app/build/outputs/apk/debug/app-debug.apk`. Подпись релиза и публикация в Google Play — в [`android-app/README.md`](android-app/README.md).

## Разработка

```bash
npm ci
npm run check   # синтаксис встроенного JavaScript
npm test        # игровая логика в jsdom
```

CI (GitHub Actions) запускает проверки и тесты и собирает debug-APK.

## Сторонний код

- [chess.js](https://github.com/jhlywa/chess.js) 0.10.3 — BSD-2-Clause, встроен в `index.html`.
