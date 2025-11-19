rcAlert = recentChangesAlertFactory()
// rcAlert.testSound(); // Testuje odtwarzanie dźwięku (zadziała dopiero po kliknięciu czegoś na stronie).
// rcAlert.init(); // Inicjuje obserwację zmian na stronie.
// rcAlert.stop(); // Kończy obserwację.

$(()=>{
	let button = document.querySelector('.mw-rcfilters-ui-liveUpdateButtonWidget .oo-ui-buttonElement-button');
	if (!button) {
		return;
	}
	$('.mw-rcfilters-ui-liveUpdateButtonWidget').on('click', ()=>{
		if (button.getAttribute('aria-pressed') === 'true') {
			rcAlert.init();
		} else {
			rcAlert.stop();
		}
	});
});

function recentChangesAlertFactory() {

  class RecentChangesAlert {
    /** Ścieżka do dźwięku powiadomienia. */
    soundUrl = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

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

    /** Inicjuje obserwację zmian na stronie. */
    init() {
      const target = document.querySelector(".mw-changeslist");
      if (!target) {
        console.warn("Nie znaleziono kontenera z listą zmian.");
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
      console.log("🔔 Monitor zmian aktywny.");
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
        console.log("⏹️ Monitor zmian zatrzymany.");
      }
    }
  }

  return new RecentChangesAlert();
}