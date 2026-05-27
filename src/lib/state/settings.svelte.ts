import { browser } from "$app/environment";

export type Theme = "light" | "dark";

const STORAGE_KEY = "maple-simple-timer-settings";

type PersistedSettings = {
	theme?: Theme;
	repeat?: boolean;
	notification?: boolean;
	alwaysOnTop?: boolean;
};

class SettingsState {
	theme = $state<Theme>("dark");
	repeat = $state(false);
	notification = $state(true);
	alwaysOnTop = $state(false);

	load() {
		if (!browser) return;

		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return;

		try {
			const saved = JSON.parse(raw) as PersistedSettings;
			if (saved.theme === "light" || saved.theme === "dark") this.theme = saved.theme;
			if (typeof saved.repeat === "boolean") this.repeat = saved.repeat;
			if (typeof saved.notification === "boolean") this.notification = saved.notification;
			if (typeof saved.alwaysOnTop === "boolean") this.alwaysOnTop = saved.alwaysOnTop;
		} catch {
			localStorage.removeItem(STORAGE_KEY);
		}
	}

	persist() {
		if (!browser) return;

		const payload: PersistedSettings = {
			theme: this.theme,
			repeat: this.repeat,
			notification: this.notification,
			alwaysOnTop: this.alwaysOnTop
		};

		localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	}

	toggleTheme() {
		this.theme = this.theme === "dark" ? "light" : "dark";
	}
}

export const settings = new SettingsState();
