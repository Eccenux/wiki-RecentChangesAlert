//var rcAlert = recentChangesAlertFactory()
// rcAlert.testSound(); // Testuje odtwarzanie dźwięku (zadziała dopiero po kliknięciu czegoś na stronie).
// rcAlert.init(); // Inicjuje obserwację zmian na stronie.
// rcAlert.stop(); // Kończy obserwację.

/*
	RCA: RC alerts.

	E.g. url:
	https://pl.wikipedia.org/w/index.php?damaging=likelybad%3Bverylikelybad&hidebots=1&hidecategorization=1&hideWikibase=1&hidelog=1&hidenewuserlog=1&tagfilter=mw-reverted&inverttags=1&limit=100&days=0.25&title=Specjalna%3AOstatnie_zmiany&urlversion=2

	Author: Maciej Nux.
*/
if (mw.config.get('wgCanonicalSpecialPageName') === 'Recentchanges') {
	let rcAlert = recentChangesAlertFactory();

	mw.hook('userjs.RecentChangesAlert.loaded').fire(rcAlert);

	// spróbuj od razu
	if (!rcAlert.initButtonHandler()) {
		console.log(rcAlert.logTag, 'not yet');
		// jeśli jeszcze nie ma, obserwuj DOM
		const observer = new MutationObserver(() => {
			if (rcAlert.initButtonHandler()) {
				observer.disconnect();
			} else {
				console.log(rcAlert.logTag, 'not yet');
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}
}

function recentChangesAlertFactory() {

	/**
	 * Main class of the gadget.
	 */
	class RecentChangesAlert {
		/**
		 * Pre-init.
		 */
		constructor() {
			/** Dźwięk powiadomienia (ustaw via setSounds). */
			this.shortSoundUrl = "https://upload.wikimedia.org/wikipedia/commons/6/61/Beep_400ms.ogg";
			// OR: https://commons.wikimedia.org/wiki/File:Emergency_Alert_System_Attention_Signal_20s.ogg
			// OR: https://commons.wikimedia.org/wiki/Category:Emergency_Alert_System

			/** Dźwięku powiadomienia po dłuższej przerwie między powiadomieniami (ustaw via setSounds). */
			this.longSoundUrl = "https://upload.wikimedia.org/wikipedia/commons/1/14/Same.ogg";

			/** Po ilu minutach nieaktywności odtworzyć długi dźwięk (teoretycznie może być ułamkiem). */
			this.longSoundMinutes = 10;

			this.logTag = '[rcAlert]';

			/** Ostatni znany timestamp zmian. */
			this.lastTimestamp = -1;

			/** Obiekt MutationObserver. */
			this.observer = null;

			/** Odtwarzacze audio. */
			this.sounds = {
				short: null,
				long: null,
			};

			this.prepSounds();
		}

		/** Ustaw własne dźwięki powiadomień. */
		setSounds(options) {
			if (typeof options === 'object') {
				if (options.shortSoundUrl) this.shortSoundUrl = options.shortSoundUrl;
				if (options.longSoundUrl) this.longSoundUrl = options.longSoundUrl;
				this.prepSounds(true);
			}
		}

		/** Przygotowuje odtwarzacze dźwięków powiadomień. */
		prepSounds(force = false) {
			if (force || !this.sounds.short) {
				this.sounds.short = new Audio(this.shortSoundUrl);
			}
			if (force || !this.sounds.longSoundUrl) {
				this.sounds.long = new Audio(this.longSoundUrl);
			}
		}

		/** Inicjuje obsługę start/stop na przycisku Live Update ("Odświeżaj na bieżąco"). */
		initButtonHandler() {
			const wrapper = document.querySelector('.mw-rcfilters-ui-liveUpdateButtonWidget');
			if (!wrapper) return false;
			const button = wrapper.querySelector('.oo-ui-buttonElement-button');
			if (!button) return false;

			wrapper.addEventListener('click', () => {
				if (button.getAttribute('aria-pressed') === 'true') {
					this.init();
				} else {
					this.stop();
				}
			});
			console.log(this.logTag, 'Obsługa przycisku Live Update gotowa.');
			return true;
		}

		/** Inicjuje obserwację zmian na stronie. */
		init() {
			const target = document.querySelector(".mw-rcfilters-ui-changesListWrapperWidget");
			if (!target) {
				console.warn(this.logTag, "Nie znaleziono kontenera z listą zmian.");
				return;
			}

			this.lastTimestamp = this.getLatestTimestamp();
			this.lastDateTime = new Date();

			this.observer = new MutationObserver(() => {
				const current = this.getLatestTimestamp();
				if (current > this.lastTimestamp) {
					const now = new Date();
					const diffMinutes = (now - this.lastDateTime) / 60000;
					this.playSound(diffMinutes >= this.longSoundMinutes ? this.sounds.long : this.sounds.short);
					this.lastDateTime = now;
				}
				this.lastTimestamp = current;
			});

			this.observer.observe(target, {
				childList: true,
				subtree: true
			});
			console.log(this.logTag, "🔔 Monitor zmian aktywny.");
		}

		/** Pobiera timestamp najnowszej zmiany. */
		getLatestTimestamp() {
			const el = document.querySelector(".mw-changeslist ul li");
			return parseInt(el?.getAttribute("data-mw-ts") ?? -1);
		}

		/** Odtwarza dźwięk powiadomienia. */
		playSound(sound) {
			sound.play().catch(() => {});
		}

		/** Testuje odtwarzanie dźwięku. */
		testSound(long = false) {
			this.prepSounds();
			this.playSound(long ? this.sounds.long : this.sounds.short);
		}

		/** Zatrzymuje obserwację zmian. */
		stop() {
			if (this.observer) {
				this.observer.disconnect();
				console.log(this.logTag, "⏹️ Monitor zmian zatrzymany.");
			}
		}
	}

	return new RecentChangesAlert();
}