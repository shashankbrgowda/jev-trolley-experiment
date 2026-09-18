import { animateDecision } from './animation.js';
import { getJevDecision } from './decision-client.js';
import { createTrolleyScene } from './scene.js';

const scene = createTrolleyScene(document.querySelector('#scene'));
const askButton = document.querySelector('#ask-button');
const status = document.querySelector('#status');
const decision = document.querySelector('#decision');
const probabilities = document.querySelector('#probabilities');
const jevExchange = document.querySelector('#jev-exchange');

scene.render();

askButton.addEventListener('click', async () => {
  setBusy(true);
  status.textContent = 'Jev is deciding…';
  decision.textContent = 'Waiting for a typed choice';
  probabilities.textContent = '';

  try {
    const result = await getJevDecision();
    showDecision(result);
    await animateDecision(scene, result.choice);
    status.textContent = 'Movement complete';
  } catch (error) {
    status.textContent = 'Could not ask Jev';
    decision.textContent = error.message;
  } finally {
    setBusy(false);
  }
});

document.querySelector('#preview-straight').addEventListener('click', () => preview('continue_straight'));
document.querySelector('#preview-switch').addEventListener('click', () => preview('switch_track'));

async function preview(choice) {
  setBusy(true);
  status.textContent = 'Trolley moving…';
  decision.textContent = label(choice);
  probabilities.textContent = 'No Jev request was made.';
  await animateDecision(scene, choice);
  status.textContent = 'Movement complete';
  setBusy(false);
}

function showDecision(result) {
  status.textContent = 'Jev chose';
  decision.textContent = label(result.choice);
  probabilities.textContent = Object.entries(result.probabilities)
    .map(([choice, probability]) => `${label(choice)} ${Math.round(probability * 100)}%`)
    .join(' · ');
  jevExchange.textContent = JSON.stringify({ input: result.input, output: result.output }, null, 2);
}

function label(choice) {
  return choice === 'switch_track' ? 'Switch track' : 'Continue straight';
}

function setBusy(busy) {
  document.querySelectorAll('button').forEach((button) => { button.disabled = busy; });
}
