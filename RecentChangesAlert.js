//var rcAlert = recentChangesAlertFactory()
// rcAlert.testSound(); // Testuje odtwarzanie dźwięku (zadziała dopiero po kliknięciu czegoś na stronie).
// rcAlert.init(); // Inicjuje obserwację zmian na stronie.
// rcAlert.stop(); // Kończy obserwację.

// Oczekiwanie pod TMonkey.
// TODO: spr. czy bieżąca strona to Specjalna%3AOstatnie_zmiany wg mw.config
// TODO: mw.hook? 
if (location.search.includes('Specjalna%3AOstatnie_zmiany')) {
  var rcAlert = recentChangesAlertFactory();
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

  class RecentChangesAlert {
    /** Ścieżka do dźwięku powiadomienia. */
    soundUrl = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

    logTag = 'rcAlert';

    /** Odtwarzacz audio. */
    sound = null;

    /** Ostatni znany timestamp zmian. */
    lastTimestamp = -1;

    /** Obiekt MutationObserver. */
    observer = null;

    constructor(soundUrl) {
      if (soundUrl) this.soundUrl = soundUrl;
      this.sound = new Audio(this.soundUrl);
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

      this.observer = new MutationObserver(() => {
        const current = this.getLatestTimestamp();
        if (current > this.lastTimestamp) {
          this.playSound();
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
    playSound() {
      this.sound.play().catch(() => {});
    }

    /** Testuje odtwarzanie dźwięku. */
    testSound() {
      const test = new Audio(this.soundUrl);
      test.play().catch(() => {});
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