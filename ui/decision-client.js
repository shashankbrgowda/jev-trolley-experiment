export async function getJevDecision() {
  const response = await fetch('/api/decision', { method: 'POST' });
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error || 'Decision request failed.');
  }

  return body;
}
