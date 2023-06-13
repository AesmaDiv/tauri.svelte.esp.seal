<script lang='ts'>
	export let showModal; // boolean
	export let onClick = () => {}

	let dialog; // HTMLDialogElement
	function onButtonClick(event: MouseEvent) {
		let sender: HTMLDivElement = <HTMLDivElement>event.target;
		sender.classList.toggle('unpressed');
		if (event.type == 'mouseup') {
			dialog.close()
			sender.id.includes("save") && onClick()
		}
	}

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- on:close={() => (showModal = false)}
on:click|self={() => dialog.close()} -->
<dialog
	bind:this={dialog}
	style={$$props.style}
>
	<div on:click|stopPropagation>
		<slot name="header"/>
		<hr />
		<slot />
		<hr />
		<!-- svelte-ignore a11y-autofocus -->
		<div class="buttons">
			<div id="menu_reset" class="button unpressed" on:mouseup={onButtonClick} on:mousedown={onButtonClick}>отмена</div>
			<div id="menu_save"  class="button unpressed" on:mouseup={onButtonClick} on:mousedown={onButtonClick}>сохранить</div>
		</div>
	</div>
</dialog>

<style>
	dialog {
		border-radius: 5px;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.buttons {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.button {
    all: unset;
		width: 10em;
    height: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
    user-select: none;
    border-radius: 0.5em;
    box-shadow: 0px 1px 2px gray;
    background-color: rgb(0, 200, 255);
    color: white;
    padding-top: 2px;
    grid-row: 12;
  }
  .unpressed {
    box-shadow: 1px 3px 3px gray;
  }
</style>