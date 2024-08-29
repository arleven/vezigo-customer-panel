window.addEventListener(
	'touchmove',
	function (event) {
		if (event.scale !== 1) {
			event.preventDefault();
			event.stopImmediatePropagation();
		}
	},
	{ passive: false }
);
