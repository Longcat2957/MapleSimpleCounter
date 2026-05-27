const ASPECT_RATIO = 15 / 4;
const MIN_WIDTH = 520;
const MIN_HEIGHT = Math.round(MIN_WIDTH / ASPECT_RATIO);

export function canUseTauri() {
	return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export async function applyAlwaysOnTop(enabled: boolean) {
	if (!canUseTauri()) return;

	try {
		const { getCurrentWindow } = await import("@tauri-apps/api/window");
		await getCurrentWindow().setAlwaysOnTop(enabled);
	} catch (error) {
		console.warn("Failed to update always-on-top", error);
	}
}

export async function configureWindowResize() {
	if (!canUseTauri()) return;

	try {
		const { LogicalSize } = await import("@tauri-apps/api/dpi");
		const { getCurrentWindow } = await import("@tauri-apps/api/window");
		const appWindow = getCurrentWindow();
		let isAdjusting = false;

		await appWindow.setMinSize(new LogicalSize(MIN_WIDTH, MIN_HEIGHT));
		await appWindow.setResizable(false);

		return appWindow.onResized(async ({ payload }) => {
			if (isAdjusting) return;

			const scaleFactor = await appWindow.scaleFactor();
			const width = Math.max(MIN_WIDTH, Math.round(payload.width / scaleFactor));
			const currentHeight = Math.max(MIN_HEIGHT, Math.round(payload.height / scaleFactor));
			const heightFromWidth = Math.round(width / ASPECT_RATIO);

			if (currentHeight === heightFromWidth) return;

			isAdjusting = true;
			await appWindow.setSize(new LogicalSize(width, heightFromWidth));
			window.setTimeout(() => {
				isAdjusting = false;
			}, 80);
		});
	} catch (error) {
		console.warn("Failed to configure window resizing", error);
	}
}

export async function startCornerResize(event: PointerEvent) {
	if (!canUseTauri()) return;

	try {
		const target = event.currentTarget;
		if (target instanceof HTMLElement) {
			target.setPointerCapture(event.pointerId);
		}

		event.preventDefault();

		const { getCurrentWindow } = await import("@tauri-apps/api/window");
		const { LogicalSize } = await import("@tauri-apps/api/dpi");
		const appWindow = getCurrentWindow();
		const scaleFactor = await appWindow.scaleFactor();
		const startSize = await appWindow.outerSize();
		const startWidth = Math.round(startSize.width / scaleFactor);
		const startX = event.screenX;
		const startY = event.screenY;
		let frame = 0;
		let nextSize = { width: startWidth, height: Math.round(startWidth / ASPECT_RATIO) };

		const applySize = () => {
			frame = 0;
			appWindow.setSize(new LogicalSize(nextSize.width, nextSize.height));
		};

		const move = (moveEvent: PointerEvent) => {
			const deltaX = moveEvent.screenX - startX;
			const deltaY = (moveEvent.screenY - startY) * ASPECT_RATIO;
			const width = Math.max(MIN_WIDTH, Math.round(startWidth + Math.max(deltaX, deltaY)));

			nextSize = {
				width,
				height: Math.max(MIN_HEIGHT, Math.round(width / ASPECT_RATIO))
			};

			if (!frame) frame = window.requestAnimationFrame(applySize);
		};

		const stop = () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", stop);
			window.removeEventListener("blur", stop);

			if (frame) {
				window.cancelAnimationFrame(frame);
				applySize();
			}
		};

		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", stop, { once: true });
		window.addEventListener("blur", stop, { once: true });
	} catch (error) {
		console.warn("Failed to start corner resize", error);
	}
}
