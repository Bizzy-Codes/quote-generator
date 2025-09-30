/* public/script.js — Replace your old front-end JS with this */
document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) generateBtn.addEventListener('click', onGenerate);
});

async function onGenerate() {
  const topic = document.getElementById('topic')?.value?.trim() || '';
  // If you had a "tag" or "tone" select, adjust id accordingly (here we use 'tag' as tone)
  const tone = document.getElementById('tag')?.value || 'inspirational';
  const count = Number(document.getElementById('count')?.value) || 1;
  const statusEl = document.getElementById('status');
  const resultsEl = document.getElementById('results');

  if (statusEl) statusEl.textContent = 'Generating…';
  if (resultsEl) resultsEl.innerHTML = '';

  try {
    const resp = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, tone, count })
    });
    if (!resp.ok) throw new Error('Server error ' + resp.status);
    const body = await resp.json();
    const quotes = body.quotes || [];
    if (!quotes.length) {
      statusEl.textContent = 'No quotes returned. Try a different topic or tone.';
      return;
    }
    statusEl.textContent = `Showing ${quotes.length} quote${quotes.length>1?'s':''}.`;
    quotes.forEach(q => showQuoteCard(q, resultsEl));
  } catch (err) {
    console.error(err);
    if (statusEl) statusEl.textContent = 'Error generating quotes. Check server console.';
  }
}

function showQuoteCard(q = {}, container) {
  if (!container) return;
  const card = document.createElement('article');
  card.className = 'card';

  const text = document.createElement('div');
  text.className = 'quote-text';
  text.textContent = `"${q.quote || q.text || ''}"`;

  const author = document.createElement('div');
  author.className = 'quote-author';
  author.textContent = `— ${q.author || 'Unknown'}`;

  const actions = document.createElement('div');
  actions.className = 'actions';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'small-btn';
  copyBtn.textContent = 'Copy';
  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(`${q.quote || q.text || ''} — ${q.author || ''}`);
      copyBtn.textContent = 'Copied!';
      setTimeout(()=> copyBtn.textContent = 'Copy', 1200);
    } catch (e) { alert('Copy failed'); }
  };

  const tweetBtn = document.createElement('a');
  tweetBtn.className = 'small-btn';
  tweetBtn.textContent = 'Tweet';
  tweetBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent((q.quote||'') + ' — ' + (q.author||''))}`;
  tweetBtn.target = '_blank';
  tweetBtn.rel = 'noopener';

  actions.appendChild(copyBtn);
  actions.appendChild(tweetBtn);

  card.appendChild(text);
  card.appendChild(author);
  card.appendChild(actions);

  container.appendChild(card);
}
