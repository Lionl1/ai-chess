import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, test } from "node:test";
import { JSDOM } from "jsdom";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

// Pages keep clock and retry timers running; close them so the process exits.
const windows = [];
after(() => windows.forEach((window) => window.close()));

// Loads the page with stubbed dialogs and an LLM that answers `reply`.
function load({ reply = '{"thought": "", "move": "e5"}', confirmAnswer = true } = {}) {
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: "http://localhost/",
    beforeParse(window) {
      window.alerts = [];
      window.alert = (text) => window.alerts.push(text);
      window.confirm = () => confirmAnswer;
      window.fetch = async () => ({
        ok: true,
        json: async () => ({ choices: [{ message: { content: reply } }] }),
      });
    },
  });
  const { window } = dom;
  windows.push(window);
  const $ = (id) => window.document.getElementById(id);
  return { window, $, run: (code) => window.eval(code) };
}

function ratings(window) {
  return JSON.parse(window.localStorage.getItem("chess_ai_ratings") || "{}");
}

test("board renders all pieces without network", () => {
  const { window } = load();
  assert.equal(window.document.querySelectorAll(".piece").length, 32);
  assert.equal(window.document.querySelectorAll(".piece-w").length, 16);
});

test("player resigning against AI loses even while AI is to move", () => {
  const { window, $, run } = load();
  $("model-name").value = "test-model";
  run("game.move('e4')"); // now it is the AI's (black) turn
  run("resignGame()");
  assert.equal(run("gameEnded"), true);
  assert.match($("status").innerText, /Белые сдались/);
  assert.equal(ratings(window)["test-model"].wins, 1);
});

test("in PvP the side to move resigns", () => {
  const { $, run } = load();
  $("game-mode").value = "pvp";
  run("updateGameMode()");
  run("game.move('e4')");
  run("resignGame()");
  assert.match($("status").innerText, /Черные сдались/);
});

async function aiMove(window, run) {
  run("makeAiMove()");
  for (let i = 0; i < 50 && run("isAiThinking"); i++) {
    await new Promise((resolve) => window.setTimeout(resolve, 10));
  }
}

test("AI move from the model reply is played", async () => {
  const { window, $, run } = load();
  $("api-url").value = "http://llm.local/v1/chat/completions";
  $("model-name").value = "test-model";
  run("game.move('e4')");
  await aiMove(window, run);
  assert.equal(run("game.pgn()"), "1. e4 e5");
});

test("AI draw offer against a human needs the player's consent", async () => {
  const declined = load({ reply: '{"thought": "", "move": "DRAW"}', confirmAnswer: false });
  declined.$("api-url").value = "http://llm.local/v1/chat/completions";
  declined.$("model-name").value = "test-model";
  declined.run("game.move('e4')");
  await aiMove(declined.window, declined.run);
  assert.equal(declined.run("gameEnded"), false);
  declined.run("clearAiRetryTimer()");

  const accepted = load({ reply: '{"thought": "", "move": "DRAW"}', confirmAnswer: true });
  accepted.$("api-url").value = "http://llm.local/v1/chat/completions";
  accepted.$("model-name").value = "test-model";
  accepted.run("game.move('e4')");
  await aiMove(accepted.window, accepted.run);
  assert.equal(accepted.run("gameEnded"), true);
});
