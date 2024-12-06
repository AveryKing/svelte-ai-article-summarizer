<script>
	import { onMedium, summary } from '$lib/stores';

	let isOnMedium = $state(false);
	let articleSummary = $state('');

	onMedium.subscribe((v) => (isOnMedium = v));
	summary.subscribe((v) => (articleSummary = v));
</script>

{#snippet notOnMedium()}
	<section>
		<p>You are not currently viewing a Medium article.</p>
		<p>Once you are viewing a Medium article, its summary will appear here.</p>
	</section>
{/snippet}

{#snippet aiSummary()}
	<section>
		<p>Summary of the article:</p>
		<p>{articleSummary}</p>
	</section>
{/snippet}

{#if isOnMedium}
	{@render aiSummary()}
{:else}
	{@render notOnMedium()}
{/if}

<style>
	section {
		width: 400px;
		height: 250px;
		white-space: pre-line;
	}
</style>
