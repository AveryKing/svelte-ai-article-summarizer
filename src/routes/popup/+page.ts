import { browser } from '$app/environment';
import { onMedium, summary } from '$lib/stores';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PUBLIC_GOOGLE_API_KEY } from '$env/static/public';

export async function load() {
	if (!browser) return;

	try {
		chrome.tabs.query({ currentWindow: true, active: true }, async (tabs) => {
			const tab = tabs[0];

			if (!tab?.url?.includes('medium.com')) {
				onMedium.set(false);
				summary.set('');
				return;
			}

			onMedium.set(true);

			try {
				const [result] = await chrome.scripting.executeScript({
					target: { tabId: tab.id! },
					func: () => document.querySelector('section')?.textContent || null
				});

				const postContent = result?.result || '';

				summary.set('Processing article...');

				const genAI = new GoogleGenerativeAI(PUBLIC_GOOGLE_API_KEY);
				const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
				const res = await model.generateContent(
					`Summarize the following Medium article:\n\n${postContent}`
				);
				summary.set(res.response.text());
			} catch (err) {
				console.error('Error during summarization:', err);
				summary.set('An error occurred during summarization.');
			}
		});
	} catch (err) {
		console.error('Error in load function:', err);
		onMedium.set(false);
		summary.set('An error occurred.');
	}
}
