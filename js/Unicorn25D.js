// =========================================================================
// SanctuaryUnicorn25D：守護神獸 2.5D 立牌、雙層魔法陣、智慧保眼去背與 IndexedDB 記憶
// =========================================================================

// 【永久內嵌區】
const EMBEDDED_UNICORN_DATA = /*__EMBED_START__*/ null /*__EMBED_END__*/;

export class SanctuaryUnicorn25D {
    constructor(scene, camera, glowDotTex, interactables = []) {
        this.scene = scene;
        this.camera = camera;
        this.glowDotTex = glowDotTex;
        this.interactables = interactables;

        this.root = new THREE.Group();
        this.root.position.set(0, 0.46, -1.8);
        this.scene.add(this.root);

        this.sourceCanvas = null;
        this.currentRawDataUrl = null;
        this.currentAspect = 1.0;
        this.blessingTimer = 0;

        this.auraLight = new THREE.PointLight(0xffe6a3, 1.4, 8);
        this.auraLight.position.set(0, 1.5, 0.5);
        this.root.add(this.auraLight);

        this._initMagicCircle();
        this._initBillboard();
        this._initParticles();
    }

    _initMagicCircle() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const cx = 256, cy = 256;

        const radGrad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 250);
        radGrad.addColorStop(0.0, 'rgba(255, 230, 130, 0.35)');
        radGrad.addColorStop(0.6, 'rgba(140, 220, 255, 0.22)');
        radGrad.addColorStop(0.88, 'rgba(255, 215, 90, 0.55)');
        radGrad.addColorStop(1.0, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, 512, 512);

        ctx.strokeStyle = '#ffe680';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 12;
        [230, 212, 165, 95].forEach((r, idx) => {
            ctx.lineWidth = idx === 0 ? 4 : 2.5;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
        });

        for (let s = 0; s < 2; s++) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate((s * Math.PI) / 4);
            ctx.lineWidth = 2.5;
            ctx.strokeRect(-150, -150, 300, 300);
            ctx.restore();
        }

        const magicMat = new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(canvas),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.magicRingOuter = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), magicMat);
        this.magicRingOuter.rotation.x = -Math.PI / 2;
        this.magicRingOuter.position.y = 0.02;
        this.magicRingOuter.scale.setScalar(1.25);
        this.root.add(this.magicRingOuter);

        this.magicRingInner = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.7), magicMat);
        this.magicRingInner.rotation.x = -Math.PI / 2;
        this.magicRingInner.position.y = 0.025;
        this.magicRingInner.scale.setScalar(1.25);
        this.root.add(this.magicRingInner);
    }

    _initBillboard() {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 512;
        pCanvas.height = 512;
        const pCtx = pCanvas.getContext('2d');
        pCtx.fillStyle = '#ffd700';
        pCtx.font = 'bold 24px sans-serif';
        pCtx.textAlign = 'center';
        pCtx.fillText('🦄 聖壇守護獨角獸', 256, 256);

        const cardGeo = new THREE.PlaneGeometry(1, 1);
        cardGeo.translate(0, 0.5, 0);

        // 遵守防呆鐵律：維持使用 MeshBasicMaterial，禁止注入自訂 GLSL
        this.cardMat = new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(pCanvas),
            transparent: true,
            alphaTest: 0.02,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const s = parseFloat(document.getElementById('cardScale')?.value || 3.6);
        this.billboardMesh = new THREE.Mesh(cardGeo, this.cardMat);
        this.billboardMesh.scale.set(s, s, 1);
        this.billboardMesh.position.y = parseFloat(document.getElementById('cardOffsetY')?.value ?? 0.0);
        this.root.add(this.billboardMesh);

        // 使用精準貼合獨角獸身形的隱形圓柱作為點擊感應區，避免 3.6m 正方形透明邊角造成誤按
        const hitGeo = new THREE.CylinderGeometry(0.9, 1.05, 2.5, 12);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        this.hitMesh = new THREE.Mesh(hitGeo, hitMat);
        this.hitMesh.position.y = 1.25;
        this.hitMesh.userData = { station: 'altar' };
        this.root.add(this.hitMesh);

        if (this.interactables) {
            this.interactables.push(this.hitMesh);
        }
    }

    _initParticles() {
        this.particleCount = 85;
        this.pGeo = new THREE.BufferGeometry();
        const pPositions = new Float32Array(this.particleCount * 3);
        const pColors = new Float32Array(this.particleCount * 3);
        this.pPhases = [];

        const palette = [
            new THREE.Color(0xffe680),
            new THREE.Color(0x99e6ff),
            new THREE.Color(0xffb8f0),
            new THREE.Color(0xffffff)
        ];

        for (let i = 0; i < this.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.5 + Math.random() * 1.4;
            pPositions[i * 3] = Math.cos(angle) * radius;
            pPositions[i * 3 + 1] = Math.random() * 3.4;
            pPositions[i * 3 + 2] = Math.sin(angle) * radius;

            const c = palette[i % palette.length];
            pColors[i * 3] = c.r;
            pColors[i * 3 + 1] = c.g;
            pColors[i * 3 + 2] = c.b;
            this.pPhases.push({
                angle,
                radius,
                speed: 0.4 + Math.random() * 0.8,
                ySpeed: 0.35 + Math.random() * 0.5
            });
        }
        this.pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
        this.pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

        this.particleSystem = new THREE.Points(
            this.pGeo,
            new THREE.PointsMaterial({
                size: 0.24,
                map: this.glowDotTex,
                vertexColors: true,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );
        this.root.add(this.particleSystem);
    }

    triggerBlessingPulse() {
        this.blessingTimer = 2.2;
    }

    // 智慧保眼去背：四邊向內 Flood-Fill 去背演算法 + 腿間暗影清除 + 邊緣去黑底色偏（確保獨角獸深紫眼眸完整保留，同時徹底消除身邊與腳底的黑灰陰影光暈）
    renderProcessed() {
        if (!this.sourceCanvas) return;
        const w = this.sourceCanvas.width, h = this.sourceCanvas.height;
        const outCanvas = document.createElement('canvas');
        outCanvas.width = w;
        outCanvas.height = h;
        const ctx = outCanvas.getContext('2d');
        ctx.drawImage(this.sourceCanvas, 0, 0);

        const rawThresh = parseInt(document.getElementById('bgThreshold')?.value || '28', 10);
        if (rawThresh > 0) {
            try {
                // 將滑桿閾值擴展為可吃掉獨角獸周圍柔和黑灰漸層陰影的有效閾值（保留白色毛髮、粉彩鬃毛與金角）
                const effThresh = Math.min(115, rawThresh + 54);
                const imgData = ctx.getImageData(0, 0, w, h);
                const d = imgData.data;
                const visited = new Uint8Array(w * h);
                const queue = new Int32Array(w * h);
                let head = 0, tail = 0;

                const isBgOrShadowPixel = (p) => {
                    const r = d[p], g = d[p + 1], b = d[p + 2];
                    const maxC = Math.max(r, g, b);
                    if (maxC <= effThresh) return true;
                    // 若為接近無彩度的暗灰陰影（常見於白色獨角獸身體周圍與腳底暗影），一併視為背景陰影剔除
                    const minC = Math.min(r, g, b);
                    const sat = maxC - minC;
                    if (maxC <= effThresh + 24 && sat < 28) return true;
                    return false;
                };

                const pushIfBg = (x, y) => {
                    const idx = y * w + x;
                    if (visited[idx]) return;
                    const p = idx * 4;
                    if (isBgOrShadowPixel(p)) {
                        visited[idx] = 1;
                        queue[tail++] = idx;
                    }
                };

                // 1. 從畫面四條外邊界向內 Flood-Fill（嚴格保護畫面安全的頭部內部深紫色眼眸與睫毛）
                for (let x = 0; x < w; x++) {
                    pushIfBg(x, 0);
                    pushIfBg(x, h - 1);
                }
                for (let y = 0; y < h; y++) {
                    pushIfBg(0, y);
                    pushIfBg(w - 1, y);
                }

                // 2. 針對下半部四肢與馬蹄之間的封閉暗影空隙 (y > 58% 高度，遠離頭部眼睛) 進行種子注入，清除腿間黑影
                const legZoneStartY = Math.floor(h * 0.58);
                for (let y = legZoneStartY; y < h - 1; y += 2) {
                    for (let x = 1; x < w - 1; x += 2) {
                        const idx = y * w + x;
                        if (visited[idx]) continue;
                        const p = idx * 4;
                        if (Math.max(d[p], d[p + 1], d[p + 2]) <= rawThresh + 22) {
                            pushIfBg(x, y);
                        }
                    }
                }

                while (head < tail) {
                    const curr = queue[head++];
                    d[curr * 4 + 3] = 0;
                    const cx = curr % w, cy = (curr / w) | 0;
                    if (cx > 0) pushIfBg(cx - 1, cy);
                    if (cx < w - 1) pushIfBg(cx + 1, cy);
                    if (cy > 0) pushIfBg(cx, cy - 1);
                    if (cy < h - 1) pushIfBg(cx, cy + 1);
                }

                // 3. 多層邊緣柔化與「去黑底混色色偏 (Decontamination)」，徹底消除白色獨角獸輪廓外圍的灰黑陰影邊線
                const distMap = new Uint8Array(w * h);
                let currentRing = [];
                for (let y = 1; y < h - 1; y++) {
                    for (let x = 1; x < w - 1; x++) {
                        const idx = y * w + x;
                        if (visited[idx]) continue;
                        if (visited[idx - 1] || visited[idx + 1] || visited[idx - w] || visited[idx + w]) {
                            distMap[idx] = 1;
                            currentRing.push(idx);
                        }
                    }
                }

                for (let step = 2; step <= 4; step++) {
                    const nextRing = [];
                    for (let i = 0; i < currentRing.length; i++) {
                        const idx = currentRing[i];
                        const cx = idx % w, cy = (idx / w) | 0;
                        const neighbors = [
                            cx > 0 ? idx - 1 : -1,
                            cx < w - 1 ? idx + 1 : -1,
                            cy > 0 ? idx - w : -1,
                            cy < h - 1 ? idx + w : -1
                        ];
                        for (let n = 0; n < 4; n++) {
                            const nIdx = neighbors[n];
                            if (nIdx >= 0 && !visited[nIdx] && distMap[nIdx] === 0) {
                                distMap[nIdx] = step;
                                nextRing.push(nIdx);
                            }
                        }
                    }
                    currentRing = nextRing;
                }

                const featherSpan = 72;
                const featherMax = effThresh + featherSpan;
                for (let i = 0; i < w * h; i++) {
                    const dist = distMap[i];
                    if (dist === 0) continue;
                    const p = i * 4;
                    const r = d[p], g = d[p + 1], b = d[p + 2];
                    const maxC = Math.max(r, g, b);
                    if (maxC < featherMax) {
                        let ratio = Math.max(0, (maxC - effThresh) / featherSpan);
                        // 越靠近外緣 (dist=1) 透明度衰減越快，徹底隱去殘餘暗邊
                        ratio = Math.pow(ratio, dist === 1 ? 1.85 : 1.35);
                        d[p + 3] = Math.floor(ratio * 255);

                        // 去黑底混色補償：將原本因黑底抗鋸齒而變黑灰的邊緣像素還原為乾淨明亮的毛色
                        if (d[p + 3] > 8 && maxC > 10) {
                            const lift = Math.min(2.4, 215 / Math.max(65, maxC));
                            d[p] = Math.min(255, Math.round(r * lift));
                            d[p + 1] = Math.min(255, Math.round(g * lift));
                            d[p + 2] = Math.min(255, Math.round(b * lift));
                        }
                    }
                }

                // 4. 自動偵測馬蹄最低處並向下貼齊畫布底邊，讓獨角獸四蹄穩穩踩在祭壇石台平面上（消除底部透明留白造成的懸空感）
                let maxOpaqueY = -1;
                for (let y = h - 1; y >= 0; y--) {
                    let rowHasHoof = false;
                    for (let x = 0; x < w; x++) {
                        if (d[(y * w + x) * 4 + 3] > 60) {
                            rowHasHoof = true;
                            break;
                        }
                    }
                    if (rowHasHoof) {
                        maxOpaqueY = y;
                        break;
                    }
                }

                ctx.putImageData(imgData, 0, 0);

                if (maxOpaqueY > 0 && maxOpaqueY < h - 2) {
                    const shiftDown = h - 2 - maxOpaqueY;
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = w;
                    tempCanvas.height = h;
                    tempCanvas.getContext('2d').drawImage(outCanvas, 0, 0);
                    ctx.clearRect(0, 0, w, h);
                    ctx.drawImage(tempCanvas, 0, shiftDown);
                }
            } catch (e) { }
        }

        const tex = new THREE.CanvasTexture(outCanvas);
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;

        this.cardMat.map = tex;
        this.cardMat.needsUpdate = true;

        const s = parseFloat(document.getElementById('cardScale')?.value || 3.6);
        this.billboardMesh.scale.set(s * this.currentAspect, s, 1);
    }

    update(delta, elapsed) {
        const s = parseFloat(document.getElementById('cardScale')?.value || 3.6);
        const baseOffsetY = parseFloat(document.getElementById('cardOffsetY')?.value ?? 0.0);

        let boost = 1.0;
        if (this.blessingTimer > 0) {
            this.blessingTimer = Math.max(0, this.blessingTimer - delta);
            boost = 1.0 + Math.sin(this.blessingTimer * Math.PI) * 1.8;
        }

        this.magicRingOuter.rotation.z += delta * 0.35 * boost;
        this.magicRingInner.rotation.z -= delta * 0.6 * boost;
        this.magicRingOuter.scale.setScalar(1.25 + (boost - 1.0) * 0.25);
        this.auraLight.intensity = 1.4 + (boost - 1.0) * 1.5;

        const camPos = this.camera.position;
        const uPos = this.root.position;
        this.billboardMesh.rotation.y = Math.atan2(camPos.x - uPos.x, camPos.z - uPos.z);

        this.billboardMesh.scale.set(s * this.currentAspect, s, 1);
        // 讓白色獨角獸四蹄穩穩踏在祭壇石台頂面 (this.root.position.y = 0.46)，不再懸空上下漂浮
        this.billboardMesh.position.y = baseOffsetY;

        const posAttr = this.pGeo.attributes.position;
        for (let i = 0; i < this.particleCount; i++) {
            const ph = this.pPhases[i];
            ph.angle += delta * ph.speed * 0.5 * boost;
            let y = posAttr.getY(i) + delta * ph.ySpeed * boost;
            if (y > 3.6) y = 0.05;
            posAttr.setXYZ(i, Math.cos(ph.angle) * ph.radius, y, Math.sin(ph.angle) * ph.radius);
        }
        posAttr.needsUpdate = true;
    }

    // =====================================================================
    // IndexedDB 永久記憶與圖片載入管理
    // =====================================================================
    openUnicornDB() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open('Unicorn25D_DB', 1);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('store')) db.createObjectStore('store');
            };
            req.onsuccess = (e) => resolve(e.target.result);
            req.onerror = (e) => reject(e);
        });
    }

    async saveToIndexedDB(dataUrl) {
        try {
            const db = await this.openUnicornDB();
            db.transaction('store', 'readwrite').objectStore('store').put(dataUrl, 'unicorn_image');
        } catch (e) { }
        try {
            localStorage.setItem('saved_unicorn_v3', dataUrl);
        } catch (e) { }
    }

    async loadFromIndexedDB() {
        try {
            const db = await this.openUnicornDB();
            return await new Promise((resolve) => {
                const req = db.transaction('store', 'readonly').objectStore('store').get('unicorn_image');
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => resolve(null);
            });
        } catch (e) {
            return localStorage.getItem('saved_unicorn_v3') || null;
        }
    }

    async saveAudioToIndexedDB(dataUrl) {
        try {
            const db = await this.openUnicornDB();
            await new Promise((resolve, reject) => {
                const tx = db.transaction('store', 'readwrite');
                tx.objectStore('store').put(dataUrl, 'custom_bgm_mp3');
                tx.oncomplete = () => resolve();
                tx.onerror = (e) => reject(e);
            });
        } catch (e) { }
    }

    async loadAudioFromIndexedDB() {
        try {
            const db = await this.openUnicornDB();
            return await new Promise((resolve) => {
                const req = db.transaction('store', 'readonly').objectStore('store').get('custom_bgm_mp3');
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => resolve(null);
            });
        } catch (e) {
            return null;
        }
    }

    applyLoadedImage(img, msg, saveDB) {
        const maxDim = 800;
        let w = img.naturalWidth || img.width || 512;
        let h = img.naturalHeight || img.height || 512;
        this.currentAspect = w / h;

        if (w > maxDim || h > maxDim) {
            if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
            } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
            }
        }

        this.sourceCanvas = document.createElement('canvas');
        this.sourceCanvas.width = w;
        this.sourceCanvas.height = h;
        this.sourceCanvas.getContext('2d').drawImage(img, 0, 0, w, h);

        try {
            this.currentRawDataUrl = this.sourceCanvas.toDataURL('image/jpeg', 0.86);
            const bakeBtn = document.getElementById('bakeBtn');
            if (bakeBtn) bakeBtn.style.display = 'inline-block';
            if (saveDB) this.saveToIndexedDB(this.currentRawDataUrl);
        } catch (e) { }

        this.renderProcessed();
        const statusEl = document.getElementById('status');
        if (statusEl && msg) statusEl.innerText = msg;
    }

    async initLoad() {
        if (EMBEDDED_UNICORN_DATA) {
            const img = new Image();
            img.onload = () => this.applyLoadedImage(img, '✨ 點擊草地或按 WASD 可控制東方主角在聖域中自由走動參拜', false);
            img.src = EMBEDDED_UNICORN_DATA;
            return;
        }
        const dbData = await this.loadFromIndexedDB();
        if (dbData) {
            const img = new Image();
            img.onload = () => this.applyLoadedImage(img, '✨ 點擊草地或按 WASD 可控制東方主角在聖域中自由走動參拜', false);
            img.src = dbData;
            return;
        }
        const candidates = ['assets/unicorn.jpg', 'unicorn.jpg', 'unicorn.jpg.jpg', 'unicorn.png'];
        let idx = 0;
        const next = () => {
            if (idx >= candidates.length) return;
            const img = new Image();
            img.onload = () => this.applyLoadedImage(img, '✨ 點擊草地或按 WASD 控制主角自由移動', false);
            img.onerror = () => {
                idx++;
                next();
            };
            img.src = candidates[idx];
        };
        next();
    }

    handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => this.applyLoadedImage(img, '✨ 已更新聖壇守護獨角獸法相並永久記憶！', true);
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    }

    bindFileEvents(showToast, onAudioFileDrop) {
        const imgInput = document.getElementById('imgInput');
        if (imgInput) {
            imgInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) this.handleFile(e.target.files[0]);
            });
        }

        const bakeBtn = document.getElementById('bakeBtn');
        if (bakeBtn) {
            bakeBtn.addEventListener('click', () => {
                if (!this.currentRawDataUrl) return;
                let htmlContent = document.documentElement.outerHTML;
                const blob = new Blob(['<!DOCTYPE html>\n' + htmlContent], { type: 'text/html;charset=utf-8' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'index.html';
                a.click();
                if (showToast) showToast('✅ 已下載包含東方主角與獨角獸聖域的 index.html！');
            });
        }

        const dropOverlay = document.getElementById('dropOverlay');
        if (dropOverlay) {
            window.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropOverlay.style.display = 'flex';
            });
            window.addEventListener('dragleave', (e) => {
                e.preventDefault();
                if (e.relatedTarget === null) dropOverlay.style.display = 'none';
            });
            window.addEventListener('drop', (e) => {
                e.preventDefault();
                dropOverlay.style.display = 'none';
                if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const file = e.dataTransfer.files[0];
                    if (file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a)$/i.test(file.name || '')) {
                        if (onAudioFileDrop) onAudioFileDrop(file);
                    } else if (file.type.startsWith('image/')) {
                        this.handleFile(file);
                    }
                }
            });
        }
    }
}
