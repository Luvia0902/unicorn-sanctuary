// =========================================================================
// SanctuaryAudio.js：雙軌真實 HTML5 Audio 播放器 ＋ IndexedDB 自訂 MP3 永久記憶系統
// 1. 徹底移除 OscillatorNode 電子合成器背景樂
// 2. 主配樂 (bgmAudio)：優先載入 IndexedDB ('custom_bgm_mp3') -> 同資料夾 bgm.mp3 ->
//    自動 fallback 至 Wikimedia 無版權真實鋼琴曲 (Erik Satie - Gymnopédie No. 1)
// 3. 森林環境音 (forestNatureAudio)：真實溪流與森林環境音 (維持主音量的 0.35 倍)
// =========================================================================

const FALLBACK_PIANO_URL =
    'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c8/Erik_Satie_-_Gymnop%C3%A9die_No._1.ogg/Erik_Satie_-_Gymnop%C3%A9die_No._1.ogg.mp3';
const FOREST_STREAM_URL = 'https://actions.google.com/sounds/v1/water/small_stream_flowing.ogg';

export class SanctuaryAudio {
    constructor(unicornInstance = null, showToast = null) {
        this.unicorn = unicornInstance;
        this.showToast = showToast;
        this.isPlaying = false;
        this.usingCustomMp3 = false;

        // 1. 主配樂 (bgmAudio) — 直接載入專案內建真實鋼琴曲 bgm.mp3（同網域零延遲、不被外部防盜連阻擋）
        this.bgmAudio = new Audio('bgm.mp3');
        this.bgmAudio.loop = true;
        this.bgmAudio.preload = 'auto';
        this.bgmAudio.volume = 0.65;

        // 監聽真實播放與暫停事件，確保按鈕狀態 100% 同步
        this.bgmAudio.addEventListener('playing', () => {
            this.isPlaying = true;
            this._updateButtonUI();
        });
        this.bgmAudio.addEventListener('pause', () => {
            this._updateButtonUI();
        });

        // 若本地 bgm.mp3 載入失敗，自動 fallback 到 Wikimedia 無版權真實鋼琴曲
        this.bgmAudio.addEventListener('error', () => {
            if (!this.usingCustomMp3 && this.bgmAudio.src && !this.bgmAudio.src.includes('wikimedia.org')) {
                this.bgmAudio.src = FALLBACK_PIANO_URL;
                this.bgmAudio.load();
                if (this.isPlaying) {
                    this.bgmAudio.play().catch(() => {
                        this.isPlaying = false;
                        this._updateButtonUI();
                    });
                }
            }
        });

        // 2. 森林環境音 (forestNatureAudio) — 優先載入專案內建溪流環境音 assets/audio/wish_pool.mp3
        this.forestNatureAudio = new Audio('assets/audio/wish_pool.mp3');
        this.forestNatureAudio.loop = true;
        this.forestNatureAudio.preload = 'auto';
        this.forestNatureAudio.volume = 0.22;
        this.forestNatureAudio.addEventListener('error', () => {
            if (this.forestNatureAudio.src && !this.forestNatureAudio.src.includes('actions.google.com')) {
                this.forestNatureAudio.src = FOREST_STREAM_URL;
            }
        });
    }

    async init() {
        this._bindUIEvents();
        this._bindAutoPlayUnlock();
        this._updateButtonUI();

        // 優先檢查 Unicorn25D_DB 的 store 是否有 'custom_bgm_mp3'
        let customDataUrl = null;
        if (this.unicorn && typeof this.unicorn.loadAudioFromIndexedDB === 'function') {
            customDataUrl = await this.unicorn.loadAudioFromIndexedDB();
        }

        if (customDataUrl) {
            this.usingCustomMp3 = true;
            this.bgmAudio.src = customDataUrl;
            if (this.isPlaying) {
                this.bgmAudio.play().catch(() => {});
            }
        }
    }

    toggleSanctuaryMusic() {
        if (this.bgmAudio.paused) {
            this.playAll();
        } else {
            this.pauseAll();
        }
    }

    playAll() {
        this.isPlaying = true;
        const p1 = this.bgmAudio.play();
        if (p1 && typeof p1.then === 'function') {
            p1.then(() => {
                this.isPlaying = true;
                this._updateButtonUI();
            }).catch(() => {
                this.isPlaying = false;
                this._updateButtonUI();
            });
        }
        this.forestNatureAudio.play().catch(() => {});
        this._updateButtonUI();
    }

    pauseAll() {
        this.isPlaying = false;
        this.bgmAudio.pause();
        this.forestNatureAudio.pause();
        this._updateButtonUI();
    }

    setVolume(val) {
        const v = Math.max(0, Math.min(1, parseFloat(val) || 0));
        this.bgmAudio.volume = v;
        // 森林環境音維持主音量的 0.35 倍
        this.forestNatureAudio.volume = Math.max(0, Math.min(1, +(v * 0.35).toFixed(3)));
    }

    handleAudioFile(file) {
        if (!file) return;
        const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a)$/i.test(file.name || '');
        if (!isAudio) return;

        const reader = new FileReader();
        reader.onload = async (ev) => {
            const dataUrl = ev.target.result;
            if (!dataUrl) return;

            this.usingCustomMp3 = true;
            this.bgmAudio.src = dataUrl;
            this.playAll();

            if (this.unicorn && typeof this.unicorn.saveAudioToIndexedDB === 'function') {
                await this.unicorn.saveAudioToIndexedDB(dataUrl);
            }
            if (this.showToast) {
                this.showToast(`🎧 已換上您的專屬配樂「${file.name}」並永久記憶於瀏覽器！`);
            }
        };
        reader.readAsDataURL(file);
    }

    _updateButtonUI() {
        const btn = document.getElementById('bgmToggleBtn');
        if (!btn) return;
        const active = !this.bgmAudio.paused && this.isPlaying;
        if (active) {
            btn.innerHTML = '🎵 聖域療癒音樂：播放中';
            btn.classList.add('playing');
        } else {
            btn.innerHTML = '🔇 聖域療癒音樂：已暫停';
            btn.classList.remove('playing');
        }
    }

    _bindUIEvents() {
        window.toggleSanctuaryMusic = () => {
            this.toggleSanctuaryMusic();
            if (this.showToast) {
                this.showToast(
                    !this.bgmAudio.paused
                        ? '🎵 已開啟「真實鋼琴配樂 × 森林溪流環境音」'
                        : '🔇 聖域音樂已暫停'
                );
            }
        };

        const volSlider = document.getElementById('bgmVolume');
        if (volSlider) {
            volSlider.addEventListener('input', (e) => {
                const v = parseFloat(e.target.value);
                this.setVolume(v);
                if (v > 0 && this.bgmAudio.paused && !this.isPlaying) {
                    this.playAll();
                }
            });
        }

        const fileInput = document.getElementById('bgmFileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    this.handleAudioFile(e.target.files[0]);
                }
            });
        }
    }

    _bindAutoPlayUnlock() {
        const removeUnlockListeners = () => {
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchend', unlock);
            window.removeEventListener('keydown', unlock);
        };

        const unlock = (e) => {
            // 若直接點擊音樂開關按鈕，交給按鈕自身的 onclick 處理並解除自動解鎖監聽
            if (e.target && e.target.closest && e.target.closest('#bgmToggleBtn')) {
                removeUnlockListeners();
                return;
            }
            if (this.bgmAudio.paused && !this.isPlaying) {
                this.isPlaying = true;
                this.forestNatureAudio.play().catch(() => {});
                const playPromise = this.bgmAudio.play();
                if (playPromise && typeof playPromise.then === 'function') {
                    playPromise
                        .then(() => {
                            this.isPlaying = true;
                            this._updateButtonUI();
                            removeUnlockListeners();
                        })
                        .catch(() => {
                            this.isPlaying = false;
                            this._updateButtonUI();
                        });
                } else {
                    removeUnlockListeners();
                }
            } else {
                removeUnlockListeners();
            }
        };

        window.addEventListener('click', unlock, { passive: true });
        window.addEventListener('touchend', unlock, { passive: true });
        window.addEventListener('keydown', unlock, { passive: true });
    }
}

export { SanctuaryAudio as AudioManager };
