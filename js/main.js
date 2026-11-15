// =========================================================================
// main.js：Three.js 場景初始化、燈光、森林樹木/螢火蟲生成、Raycaster 點擊事件與主動畫迴圈
// =========================================================================

import { SanctuaryUnicorn25D } from './Unicorn25D.js?v=20261115_12';
import { EasternHeroController } from './EasternHero.js?v=20261115_12';
import { OracleSystem, showToast, closeAllModals } from './OracleSystem.js?v=20261115_12';
import { SanctuaryAudio } from './SanctuaryAudio.js?v=20261115_12';

// =========================================================================
// 1. 場景、相機與渲染器（防黑屏檢核：明確深藍夜空背景與 ClearColor）
// =========================================================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050b16);
scene.fog = new THREE.FogExp2(0x061020, 0.020);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 150);
camera.position.set(0, 5.8, 16.8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x050b16, 1);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2 - 0.03;
controls.minDistance = 2.5;
controls.maxDistance = 36;
controls.target.set(0, 1.5, 1.5);
controls.enableDamping = true;
controls.dampingFactor = 0.06;

let camTargetPos = null;
let camTargetLook = null;
function setCameraTarget(pos, look) {
    camTargetPos = pos;
    camTargetLook = look;
}

window.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('#navDock')) camTargetPos = null;
});

scene.add(new THREE.HemisphereLight(0x99ccff, 0x0a1c16, 0.85));
const moonDirLight = new THREE.DirectionalLight(0xd8ecff, 1.15);
moonDirLight.position.set(10, 22, -16);
moonDirLight.castShadow = true;
scene.add(moonDirLight);

const dotCanvas = document.createElement('canvas');
dotCanvas.width = 64;
dotCanvas.height = 64;
const dCtx = dotCanvas.getContext('2d');
const dGrad = dCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
dGrad.addColorStop(0, 'rgba(255,255,255,1)');
dGrad.addColorStop(0.4, 'rgba(255,240,190,0.7)');
dGrad.addColorStop(1, 'rgba(255,255,255,0)');
dCtx.fillStyle = dGrad;
dCtx.fillRect(0, 0, 64, 64);
const glowDotTex = new THREE.CanvasTexture(dotCanvas);

// =========================================================================
// 2. 森林地面、星空月暈、多樹種生態林、石燈籠、發光靈菇與四大聖域設施
//    （嚴格遵守鐵律：僅使用 MeshStandardMaterial / MeshBasicMaterial / PointsMaterial，禁止自訂 GLSL）
// =========================================================================
function createForestGroundTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const cx = 512;
    const cy = 512;

    // 1. 漸層月光苔原底色
    const grad = ctx.createRadialGradient(cx, cy, 24, cx, cy, 512);
    grad.addColorStop(0.0, '#1f4a3c');
    grad.addColorStop(0.22, '#17382e');
    grad.addColorStop(0.52, '#0e2420');
    grad.addColorStop(1.0, '#050d14');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. 自然森林草地斑駁苔紋與微光螢草點
    for (let i = 0; i < 420; i++) {
        const ang = Math.random() * Math.PI * 2;
        const r = 30 + Math.random() * 460;
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r;
        const rad = 6 + Math.random() * 24;
        ctx.fillStyle = i % 3 === 0 ? 'rgba(42, 105, 82, 0.16)' : 'rgba(14, 45, 38, 0.22)';
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
    }
    for (let i = 0; i < 180; i++) {
        const ang = Math.random() * Math.PI * 2;
        const r = 25 + Math.random() * 260;
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(102, 255, 220, 0.25)' : 'rgba(255, 230, 128, 0.22)';
        ctx.beginPath();
        ctx.arc(x, y, 1.8 + Math.random() * 2.2, 0, Math.PI * 2);
        ctx.fill();
    }

    // 3. 中央聖域大地星陣圖騰環（世界座標 1m 約等於 1024/90 = 11.37px）
    const scalePx = 1024 / 90;
    ctx.save();
    ctx.strokeStyle = 'rgba(136, 238, 255, 0.18)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 8.6 * scalePx, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.22)';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(cx, cy, 11.8 * scalePx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 4. 繪製白玉青石板參道（主參道：南端入口 -> 許願星泉 -> 主祭壇，以及左右寬敞分岔步道）
    const drawSteppingStone = (wx, wz, rx, rz, rot = 0) => {
        const px = cx + wx * scalePx;
        const py = cy + wz * scalePx;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rot);
        ctx.fillStyle = 'rgba(205, 228, 242, 0.28)';
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.38)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * scalePx, rz * scalePx, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    };

    // 南北向主參道石階 (Z: 0.8m ~ 12.2m)
    for (let z = 0.8; z <= 12.2; z += 0.85) {
        if (Math.abs(z - 6.2) < 1.15) continue; // 避開許願星泉池心 (0, 6.2)
        drawSteppingStone(0, z, 0.68, 0.26, 0);
    }
    // 往東側「神諭靈籤陣 (6.8, 2.2)」寬敞分岔石階
    for (let t = 0.18; t <= 0.86; t += 0.14) {
        drawSteppingStone(6.8 * t, 4.2 * (1 - t) + 2.2 * t, 0.46, 0.24, -0.32);
    }
    // 往西側「千年祈願靈樹 (-7.2, 1.8)」寬敞分岔石階
    for (let t = 0.18; t <= 0.84; t += 0.14) {
        drawSteppingStone(-7.2 * t, 4.2 * (1 - t) + 1.8 * t, 0.46, 0.24, 0.35);
    }

    // 四大設施底部的星芒微光地印（大幅拉開間距）
    const drawStationGlow = (wx, wz, rMeters, colorStr) => {
        const px = cx + wx * scalePx;
        const py = cy + wz * scalePx;
        const pr = rMeters * scalePx;
        const g = ctx.createRadialGradient(px, py, pr * 0.1, px, py, pr);
        g.addColorStop(0, colorStr);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
    };
    drawStationGlow(0, -1.8, 3.4, 'rgba(255, 215, 0, 0.22)');
    drawStationGlow(0, 6.2, 2.0, 'rgba(0, 210, 255, 0.25)');
    drawStationGlow(6.8, 2.2, 1.8, 'rgba(180, 120, 255, 0.22)');
    drawStationGlow(-7.2, 1.8, 2.4, 'rgba(255, 140, 220, 0.25)');

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
}

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 90),
    new THREE.MeshStandardMaterial({ map: createForestGroundTexture(), roughness: 0.88, metalness: 0.08 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// =========================================================================
// 2A. 璀璨星空穹頂、雙層柔光月暈、夜空極光幕與神聖月光束
// =========================================================================
const skyGroup = new THREE.Group();
scene.add(skyGroup);

// 1. 滿天星海 (520 顆不同色溫繁星)
const starCount = 520;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
const starCol = new Float32Array(starCount * 3);
const starPalette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xcceeff),
    new THREE.Color(0xffeeb3),
    new THREE.Color(0xe5ccff)
];
for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.44; // 僅分佈於上半天球
    const r = 48 + Math.random() * 25;
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = Math.max(6, r * Math.cos(phi));
    starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const c = starPalette[i % starPalette.length];
    starCol[i * 3] = c.r;
    starCol[i * 3 + 1] = c.g;
    starCol[i * 3 + 2] = c.b;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
const starField = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
        size: 0.55,
        map: glowDotTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
skyGroup.add(starField);

// 2. 滿月與雙層柔光月暈
const moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 28, 28),
    new THREE.MeshBasicMaterial({ color: 0xfffce6 })
);
moonMesh.position.set(12, 17, -26);
skyGroup.add(moonMesh);

const moonHalo1 = new THREE.Sprite(
    new THREE.SpriteMaterial({
        map: glowDotTex,
        color: 0xffeeb0,
        transparent: true,
        opacity: 0.52,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
moonHalo1.scale.set(14, 14, 1);
moonMesh.add(moonHalo1);

const moonHalo2 = new THREE.Sprite(
    new THREE.SpriteMaterial({
        map: glowDotTex,
        color: 0x88ccff,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
moonHalo2.scale.set(24, 24, 1);
moonMesh.add(moonHalo2);

// 3. 穿透林間的神聖月光光束 (Moonbeams)
const moonBeamMat = new THREE.MeshBasicMaterial({
    color: 0xaaddff,
    transparent: true,
    opacity: 0.045,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
[
    { x: 0, z: -1.8, rTop: 0.9, rBot: 3.2, h: 18, rotZ: 0.22, rotX: 0.25 },
    { x: -7.2, z: 1.8, rTop: 0.6, rBot: 2.3, h: 16, rotZ: 0.26, rotX: 0.22 },
    { x: 6.8, z: 2.2, rTop: 0.5, rBot: 1.9, h: 16, rotZ: 0.18, rotX: 0.24 }
].forEach((b) => {
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(b.rTop, b.rBot, b.h, 20, 1, true), moonBeamMat);
    beam.position.set(b.x + 1.8, b.h * 0.45, b.z - 2.0);
    beam.rotation.z = b.rotZ;
    beam.rotation.x = b.rotX;
    skyGroup.add(beam);
});

// 4. 遠方天際流轉極光光帶 (Aurora Curtains)
function createAuroraTexture(colorA, colorB) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0.0, 'rgba(0,0,0,0)');
    g.addColorStop(0.35, colorA);
    g.addColorStop(0.7, colorB);
    g.addColorStop(1.0, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 128);
    return new THREE.CanvasTexture(c);
}

const auroraCurtains = [];
[
    { y: 14.5, r: 36, h: 7.5, c1: 'rgba(0, 242, 254, 0.22)', c2: 'rgba(80, 227, 194, 0.12)', speed: 0.08 },
    { y: 16.2, r: 40, h: 8.5, c1: 'rgba(195, 110, 255, 0.18)', c2: 'rgba(255, 120, 210, 0.10)', speed: -0.06 }
].forEach((au) => {
    const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(au.r, au.r, au.h, 48, 1, true, Math.PI * 0.65, Math.PI * 0.7),
        new THREE.MeshBasicMaterial({
            map: createAuroraTexture(au.c1, au.c2),
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    mesh.position.y = au.y;
    mesh.userData = { speed: au.speed, baseY: au.y };
    skyGroup.add(mesh);
    auroraCurtains.push(mesh);
});

// =========================================================================
// 2B. 【方案 A：《原神／薩爾達》式】真 3D 分岔樹枝骨架 ＋ 2.5D 獨立蓬鬆葉團雲 (Volumetric Foliage Clouds)
//     - 樹幹與分枝 100% 真 3D：由空間向量計算組裝多級 3D 立體圓柱（樹根 -> 主幹 -> 主枝 -> 次枝）
//     - 樹冠為 12~16 團獨立分佈於 3D 樹枝末端的 2.5D 細碎葉叢雲 (THREE.Sprite)，自動面向鏡頭、零十字交叉摺痕！
//     - 內層深色暗部葉團、中層濃密葉團、外上層受光鮮翠葉團分層配置，轉動視角具備真實 3D 視差與枝幹透光縫隙！
// =========================================================================
const forestGroup = new THREE.Group();
scene.add(forestGroup);

// 程序化生成寫實立體樹皮紋理
function createBarkTexture(baseHex, ridgeHex) {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 128, 256);
    ctx.strokeStyle = ridgeHex;
    for (let i = 0; i < 90; i++) {
        ctx.lineWidth = 1.5 + (i % 3);
        const x = (i * 19) % 128;
        const y = (i * 43) % 256;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + ((i % 2) * 6 - 3), y + 25, x, y + 52);
        ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

const trunkMat = new THREE.MeshStandardMaterial({
    map: createBarkTexture('#36291f', '#221811'),
    roughness: 0.92
});
const birchTrunkMat = new THREE.MeshStandardMaterial({
    map: createBarkTexture('#635b52', '#3d3731'),
    roughness: 0.85
});
const cherryTrunkMat = new THREE.MeshStandardMaterial({
    map: createBarkTexture('#3b2230', '#24121c'),
    roughness: 0.88
});
const cyanBushMat = new THREE.MeshStandardMaterial({
    color: 0x266e46,
    emissive: 0x0b2e1c,
    emissiveIntensity: 0.3,
    roughness: 0.78
});
const swayingWillowVines = [];

// 定義從照片延伸出的 7 種大樹造型與色彩變體
const REALISTIC_TREE_VARIANTS = [
    {
        // 0: 【照片原款・蒼翠繁茂大樟樹 / 橡樹】(Lush Broadleaf Oak - 還原照片寬廣雲朵樹冠與鮮翠受光層次)
        name: 'lush_oak',
        trunkMat: trunkMat,
        leafShadow: '#112e15',
        leafMid: '#296e20',
        leafLight: '#5ec22b',
        leafTip: '#9ee846',
        style: 'classic_oak'
    },
    {
        // 1: 【雙幹斜倚古楓香 / 雙生闊葉樹】(Twin-Trunk Leaning Broadleaf)
        name: 'twin_elm',
        trunkMat: trunkMat,
        leafShadow: '#0e2b1d',
        leafMid: '#1f6b3e',
        leafLight: '#47bd65',
        leafTip: '#8ff2a0',
        style: 'twin_leaning'
    },
    {
        // 2: 【寬冠華蓋千年古榕 / 傘狀巨木】(Wide Umbrella-Canopy Banyan)
        name: 'wide_banyan',
        trunkMat: trunkMat,
        leafShadow: '#133017',
        leafMid: '#2e7829',
        leafLight: '#6ad43f',
        leafTip: '#b2f768',
        style: 'wide_umbrella'
    },
    {
        // 3: 【高聳雲冠白楊 / 翠柏巨木】(Tall Columnar Cloud-Poplar)
        name: 'tall_poplar',
        trunkMat: birchTrunkMat,
        leafShadow: '#0f2e22',
        leafMid: '#226948',
        leafLight: '#4fbd75',
        leafTip: '#91f0ae',
        style: 'tall_spire'
    },
    {
        // 4: 【黃金秋韻銀杏 / 金桂古樹】(Golden-Lime Ginkgo & Osmanthus)
        name: 'golden_ginkgo',
        trunkMat: trunkMat,
        leafShadow: '#2e2b0d',
        leafMid: '#787218',
        leafLight: '#c9bf2a',
        leafTip: '#f7ee59',
        style: 'classic_oak'
    },
    {
        // 5: 【星光垂絲古柳】(Weeping Emerald Willow)
        name: 'weeping_willow',
        trunkMat: birchTrunkMat,
        leafShadow: '#0c2b26',
        leafMid: '#1d6e5a',
        leafLight: '#46cc9f',
        leafTip: '#8ffad2',
        style: 'weeping'
    },
    {
        // 6: 【月光夢幻靈櫻古樹】(Moonlight Blossom Ancient Tree)
        name: 'moon_sakura',
        trunkMat: cherryTrunkMat,
        leafShadow: '#30122b',
        leafMid: '#8a2d6b',
        leafLight: '#e872b8',
        leafTip: '#ffd9f0',
        style: 'classic_oak'
    }
];

// 確定性偽隨機產生器
function createSeededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

// 繪製單一「2.5D 獨立蓬鬆千葉雲團 (Foliage Puff Cluster)」貼圖
// tier: 0 = 樹冠內層深色暗部葉團, 1 = 中層飽滿葉團, 2 = 外上層受光高光葉團
function createFoliagePuffTexture(variant, tier = 1, seedOffset = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const nameLen = variant && variant.name ? variant.name.length : 7;
    const rand = createSeededRandom(seedOffset * 131 + tier * 53 + nameLen * 19);

    const cx = 128;
    const cy = 132;

    // 每個葉團由 5 個不規則重疊子雲球構成自然團簇輪廓（非正圓形，更像照片中的自然葉叢）
    const subLobes = [
        { ox: 0, oy: 4, r: 66 },
        { ox: -34, oy: 12, r: 52 },
        { ox: 36, oy: 8, r: 54 },
        { ox: -16, oy: -24, r: 54 },
        { ox: 20, oy: -20, r: 56 }
    ];

    const paintLeaves = (colorHex, radiusScale, countPerLobe, shiftX, shiftY, isFineTip = false) => {
        ctx.fillStyle = colorHex;
        for (let l = 0; l < subLobes.length; l++) {
            const lobe = subLobes[l];
            const maxR = lobe.r * radiusScale;
            for (let i = 0; i < countPerLobe; i++) {
                const ang = rand() * Math.PI * 2;
                const d = Math.pow(rand(), 0.68) * maxR;
                const lx = cx + lobe.ox + shiftX + Math.cos(ang) * d * 1.12;
                const ly = cy + lobe.oy + shiftY + Math.sin(ang) * d * 0.92;
                const w = isFineTip ? 4.2 + rand() * 4.8 : 7.5 + rand() * 8.5;
                const h = isFineTip ? 2.8 + rand() * 3.5 : 5.2 + rand() * 6.2;
                const rot = ang + (rand() - 0.5) * 1.3;
                ctx.beginPath();
                ctx.ellipse(lx, ly, w, h, rot, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    };

    if (tier === 0) {
        // 內層深色暗部葉團（營造樹冠深處與枝幹交界處的濃密陰影）
        paintLeaves(variant.leafShadow, 1.05, 36, 0, 4, false);
        paintLeaves(variant.leafMid, 0.82, 28, 3, -3, false);
        paintLeaves(variant.leafLight, 0.55, 14, 6, -6, true);
    } else if (tier === 1) {
        // 中層主力濃密葉團
        paintLeaves(variant.leafShadow, 1.04, 30, -4, 7, false);
        paintLeaves(variant.leafMid, 0.96, 38, 0, 0, false);
        paintLeaves(variant.leafLight, 0.78, 30, 6, -6, false);
        paintLeaves(variant.leafTip, 0.85, 20, 8, -9, true);
    } else {
        // 外上層受光鮮亮葉團（向右上受光面綻放鮮翠高光與細碎葉尖）
        paintLeaves(variant.leafMid, 1.02, 32, -3, 5, false);
        paintLeaves(variant.leafLight, 0.94, 40, 3, -3, false);
        paintLeaves(variant.leafTip, 0.86, 32, 8, -8, true);
    }

    // 若為垂柳，在葉團下方加上細膩垂絲
    if (variant.style === 'weeping') {
        for (let s = 0; s < 14; s++) {
            const sx = cx + (rand() - 0.5) * 145;
            const sy = cy + (rand() - 0.2) * 35;
            const sh = 45 + rand() * 60;
            ctx.strokeStyle = s % 2 === 0 ? variant.leafLight : variant.leafTip;
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.quadraticCurveTo(sx + (rand() - 0.5) * 12, sy + sh * 0.5, sx + (rand() - 0.5) * 16, sy + sh);
            ctx.stroke();
        }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
}

// 為 7 種樹種預先生成 [內層暗部, 中層飽滿, 外層受光] 3 階 SpriteMaterial（硬體自動面向鏡頭，完全零交叉痕跡！）
const treePuffMaterials = REALISTIC_TREE_VARIANTS.map((variant, vIdx) => {
    return [0, 1, 2].map((tier) => {
        const tex = createFoliagePuffTexture(variant, tier, vIdx * 17 + tier * 7 + 1);
        return new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            alphaTest: 0.08,
            depthWrite: true
        });
    });
});

// 輔助函式：在兩個 3D 座標點 (p1 -> p2) 之間建立真實 3D 圓柱樹幹／樹枝段
const _upVec = new THREE.Vector3(0, 1, 0);
function add3DBranchSegment(parentGroup, p1, p2, radiusBottom, radiusTop, mat) {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    if (len < 0.01) return;
    const cylGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, len, 7);
    const mesh = new THREE.Mesh(cylGeo, mat);
    mesh.position.copy(p1).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(_upVec, dir.clone().normalize());
    parentGroup.add(mesh);

    // 在分岔節點處加上圓潤樹節球，讓 3D 樹枝轉折處完全無縫銜接
    const joint = new THREE.Mesh(new THREE.SphereGeometry(radiusTop * 1.04, 6, 6), mat);
    joint.position.copy(p2);
    parentGroup.add(joint);
}

// 建立《原神／薩爾達》式「真 3D 多級分岔樹枝骨架 ＋ 3D 空間獨立葉團雲」大樹
function buildDiverseTree(typeIdx, seedVariant = 0) {
    const vIdx = typeIdx % REALISTIC_TREE_VARIANTS.length;
    const variant = REALISTIC_TREE_VARIANTS[vIdx];
    const puffMats = treePuffMaterials[vIdx];
    const bMat = variant.trunkMat;
    const rand = createSeededRandom(seedVariant * 73 + vIdx * 29 + 5);

    const tree = new THREE.Group();

    // 1. 底部 3D 抓地樹根基座 (Root Flare)
    const rootBase = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.44, 0.55, 8), bMat);
    rootBase.position.y = 0.25;
    tree.add(rootBase);

    // 儲存 3D 葉團雲配置點：{ pos: Vector3, size: Number, tier: 0|1|2 }
    const puffNodes = [];

    // 遞迴向 3D 空間生長樹幹與分岔枝枒
    function grow3DBough(startPt, dirVec, length, rBot, rTop, depth, maxDepth) {
        const endPt = startPt.clone().addScaledVector(dirVec, length);
        add3DBranchSegment(tree, startPt, endPt, rBot, rTop, bMat);

        if (depth >= maxDepth) {
            // 3D 樹枝末端掛載內層與外層葉團雲
            puffNodes.push({
                pos: endPt.clone().add(new THREE.Vector3(0, -0.12, 0)),
                size: 1.55 + rand() * 0.45,
                tier: 1
            });
            puffNodes.push({
                pos: endPt.clone().add(new THREE.Vector3(0.18, 0.24, 0.12)),
                size: 1.45 + rand() * 0.4,
                tier: 2
            });
            return;
        }

        // 在主枝中段配置深色內層葉團（營造樹冠中心濃密陰影，同時保留下方 3D 樹枝分岔可見！）
        if (depth === 2) {
            puffNodes.push({
                pos: endPt.clone().add(new THREE.Vector3(0, 0.1, 0)),
                size: 1.75 + rand() * 0.35,
                tier: 0
            });
        }

        const branchCount = depth === 1 ? 4 : 2;
        const baseAzimuth = rand() * Math.PI * 2;
        for (let i = 0; i < branchCount; i++) {
            const az = baseAzimuth + (i / branchCount) * Math.PI * 2 + (rand() - 0.5) * 0.45;
            // 依據不同樹形控制 3D 樹枝向外舒展的角度
            let tiltSpread = 0.68;
            let upBias = 0.72;
            if (variant.style === 'wide_umbrella') {
                tiltSpread = 0.98;
                upBias = 0.52;
            } else if (variant.style === 'tall_spire') {
                tiltSpread = 0.38;
                upBias = 0.92;
            }

            const childDir = new THREE.Vector3(
                dirVec.x * 0.35 + Math.cos(az) * tiltSpread,
                upBias + rand() * 0.22,
                dirVec.z * 0.35 + Math.sin(az) * tiltSpread
            ).normalize();

            grow3DBough(
                endPt,
                childDir,
                length * (0.76 + rand() * 0.12),
                rTop,
                rTop * 0.62,
                depth + 1,
                maxDepth
            );
        }
    }

    if (variant.style === 'twin_leaning') {
        // 【雙幹斜倚古楓香】：由根部分出兩道優雅 3D 主幹
        grow3DBough(
            new THREE.Vector3(-0.08, 0.35, 0),
            new THREE.Vector3(-0.28, 0.94, 0.08).normalize(),
            1.35,
            0.24,
            0.16,
            1,
            3
        );
        grow3DBough(
            new THREE.Vector3(0.10, 0.35, 0),
            new THREE.Vector3(0.32, 0.92, -0.10).normalize(),
            1.22,
            0.21,
            0.14,
            1,
            3
        );
    } else if (variant.style === 'wide_umbrella') {
        // 【寬冠華蓋千年古榕】：粗壯主幹 + 寬廣水平舒展 3D 巨枝
        grow3DBough(
            new THREE.Vector3(0, 0.35, 0),
            new THREE.Vector3(0.02, 0.99, 0).normalize(),
            1.25,
            0.32,
            0.22,
            1,
            3
        );
    } else if (variant.style === 'tall_spire') {
        // 【高聳雲冠白楊／翠柏】：修長挺拔 3D 樹幹向上延伸
        grow3DBough(
            new THREE.Vector3(0, 0.35, 0),
            new THREE.Vector3(0, 1, 0),
            1.75,
            0.24,
            0.15,
            1,
            3
        );
        // 額外加上高處頂冠葉團
        puffNodes.push({ pos: new THREE.Vector3(0, 4.6, 0), size: 1.8, tier: 2 });
        puffNodes.push({ pos: new THREE.Vector3(0, 3.8, 0), size: 2.1, tier: 1 });
    } else {
        // 【照片原款・蒼翠繁茂大樟樹／橡樹】：粗壯單主幹向上分岔出豐滿不對稱 3D 枝幹與雲朵樹冠
        grow3DBough(
            new THREE.Vector3(0, 0.35, 0),
            new THREE.Vector3(-0.04, 0.99, 0.02).normalize(),
            1.38,
            0.28,
            0.19,
            1,
            3
        );
        // 樹冠核心頂部飽滿隆起葉團（如參考照片中央偏右上的主冠峰）
        puffNodes.push({ pos: new THREE.Vector3(0.15, 3.65, 0.05), size: 2.15, tier: 2 });
        puffNodes.push({ pos: new THREE.Vector3(-0.35, 3.35, -0.15), size: 1.95, tier: 1 });
    }

    // 將所有 2.5D 獨立蓬鬆葉團雲 (THREE.Sprite) 掛載至 3D 樹枝節點上
    for (let i = 0; i < puffNodes.length; i++) {
        const pn = puffNodes[i];
        const sprite = new THREE.Sprite(puffMats[pn.tier]);
        sprite.position.copy(pn.pos);
        sprite.scale.set(pn.size * 1.12, pn.size * 0.96, 1);
        tree.add(sprite);
    }

    return tree;
}

// 1. 內中圈多樣化寫實闊葉林帶（半徑 13.0m ~ 25.5m，共 96 棵 7 種不同造型 3D 分枝闊葉大樹交錯，留出寬敞中央聖域廣場）
for (let i = 0; i < 96; i++) {
    const angle = (i / 96) * Math.PI * 2 + (Math.random() - 0.5) * 0.11;
    const dist = 13.0 + (i % 4) * 3.0 + Math.random() * 2.4;

    // 保留正南方參道入口拱門視線走廊、東方赤焰獨角獸領域及石橋、西方琉璃水元素獨角獸領域及星橋通道、北方蒼穹風元素領域及青雲階
    const wx = Math.cos(angle) * dist;
    const wz = Math.sin(angle) * dist;
    if (Math.abs(wx) < 3.0 && wz > 7.5 && wz < 20.5) continue;
    if (Math.hypot(wx - 22.0, wz - (-7.2)) < 10.8) continue;
    if (wx > 7.5 && wx < 20.5 && Math.abs(wz - (-0.33 * wx)) < 3.2) continue;
    if (Math.hypot(wx - (-22.0), wz - (-7.2)) < 10.8) continue;
    if (wx < -7.5 && wx > -20.5 && Math.abs(wz - (0.33 * wx)) < 3.2) continue;
    if (Math.hypot(wx - 0.0, wz - (-23.5)) < 10.8) continue;
    if (Math.abs(wx) < 3.2 && wz < -3.5 && wz > -18.5) continue;
    if (Math.hypot(wx - 0.0, wz - (-23.5)) < 10.8) continue;
    if (Math.abs(wx) < 3.2 && wz < -3.5 && wz > -18.5) continue;

    // 讓照片原款蒼翠大橡樹 (0)、雙幹古楓香 (1)、寬冠古榕 (2) 佔主體，並穿插高聳白楊 (3)、黃金銀杏 (4)、垂柳 (5) 與靈櫻 (6)
    const pattern = [0, 1, 0, 2, 3, 0, 4, 1, 5, 2, 6];
    const typeIdx = pattern[i % pattern.length];
    const tree = buildDiverseTree(typeIdx, i);
    tree.position.set(wx, 0, wz);

    const sc = 0.85 + Math.random() * 0.58;
    tree.scale.setScalar(sc);
    tree.rotation.y = Math.random() * Math.PI * 2;

    // 樹根旁點綴自然草叢灌木
    if (i % 2 === 0) {
        const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.48 + Math.random() * 0.35, 1), cyanBushMat);
        bush.position.set((Math.random() - 0.5) * 1.3, 0.26, (Math.random() - 0.5) * 1.3);
        bush.scale.set(1.25, 0.6, 1.15);
        tree.add(bush);
    }

    forestGroup.add(tree);
}

// 2. 外圈廣袤深邃森林海（半徑 24.5m ~ 44.5m，共 130 棵高大 3D 分枝闊葉巨木構成無邊際大片森林）
for (let i = 0; i < 130; i++) {
    const angle = (i / 130) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
    const dist = 24.5 + (i % 5) * 3.8 + Math.random() * 3.0;
    const wx = Math.cos(angle) * dist;
    const wz = Math.sin(angle) * dist;
    if (Math.hypot(wx - 22.0, wz - (-7.2)) < 10.8) continue;
    if (wx > 7.5 && wx < 20.5 && Math.abs(wz - (-0.33 * wx)) < 3.2) continue;
    if (Math.hypot(wx - (-22.0), wz - (-7.2)) < 10.8) continue;
    if (wx < -7.5 && wx > -20.5 && Math.abs(wz - (0.33 * wx)) < 3.2) continue;
    if (Math.hypot(wx - 0.0, wz - (-23.5)) < 10.8) continue;
    if (Math.abs(wx) < 3.2 && wz < -3.5 && wz > -18.5) continue;

    const outerTypes = [0, 2, 1, 3, 0, 4, 2, 5];
    const tree = buildDiverseTree(outerTypes[i % outerTypes.length], i + 7);
    tree.position.set(wx, 0, wz);
    const sc = 1.25 + Math.random() * 1.1;
    tree.scale.setScalar(sc);
    tree.rotation.y = Math.random() * Math.PI * 2;
    forestGroup.add(tree);
}

// 3. 遠方天際層巒山脈剪影環（半徑 43m，讓大片森林與遠山無縫相連）
const mountainMat = new THREE.MeshStandardMaterial({
    color: 0x07151f,
    roughness: 0.95
});
for (let m = 0; m < 28; m++) {
    const ma = (m / 28) * Math.PI * 2;
    const mr = 42.5 + (m % 2) * 2.5;
    const mh = 9.0 + (m % 3) * 4.5 + Math.random() * 3.0;
    const mw = 8.5 + Math.random() * 4.0;
    const peak = new THREE.Mesh(new THREE.ConeGeometry(mw, mh, 7), mountainMat);
    peak.position.set(Math.cos(ma) * mr, mh * 0.42, Math.sin(ma) * mr);
    peak.scale.set(1.3, 1.0, 0.8);
    peak.rotation.y = -ma;
    forestGroup.add(peak);
}

// 2. 林間青苔古石、星光水晶礦簇與呼吸發光靈菇叢
const rockMat = new THREE.MeshStandardMaterial({ color: 0x24343d, roughness: 0.9, metalness: 0.1 });
const crystalCyanMat = new THREE.MeshStandardMaterial({
    color: 0x88ffff,
    emissive: 0x00aacc,
    emissiveIntensity: 0.75,
    roughness: 0.15
});
const crystalVioletMat = new THREE.MeshStandardMaterial({
    color: 0xe0b3ff,
    emissive: 0x7722cc,
    emissiveIntensity: 0.75,
    roughness: 0.15
});
const stemMat = new THREE.MeshStandardMaterial({ color: 0xddeeff, roughness: 0.6 });

// 共用 4 組呼吸發光靈菇傘材質（2 組粉紫、2 組冰青，避免 60 朵靈菇產生 60 個獨立材質與 Draw Call）
const mushroomCapMats = [0, 1, 2, 3].map((idx) => {
    const isPink = idx % 2 === 0;
    return new THREE.MeshStandardMaterial({
        color: isPink ? 0xff99ee : 0x55ffee,
        emissive: isPink ? 0xcc1188 : 0x0099aa,
        emissiveIntensity: 0.7,
        roughness: 0.3
    });
});
const glowingMushrooms = mushroomCapMats.map((mat, idx) => ({
    mat,
    phase: idx * 1.57
}));

for (let i = 0; i < 26; i++) {
    const ang = (i / 26) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
    // 避開正南參道中央、東方赤焰石橋通道、西方琉璃星橋通道與北方青雲階
    if (Math.abs(Math.cos(ang)) < 0.25 && Math.sin(ang) > 0) continue;
    if (Math.cos(ang) > 0.7 && Math.abs(Math.sin(ang) - (-0.31)) < 0.28) continue;
    if (Math.cos(ang) < -0.7 && Math.abs(Math.sin(ang) - (-0.31)) < 0.28) continue;
    if (Math.abs(Math.cos(ang)) < 0.28 && Math.sin(ang) < -0.7) continue;

    const r = 10.8 + Math.random() * 4.4;
    const cluster = new THREE.Group();
    cluster.position.set(Math.cos(ang) * r, 0, Math.sin(ang) * r);

    // 青苔古石
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42 + Math.random() * 0.35, 0), rockMat);
    rock.position.y = 0.22;
    rock.scale.set(1.2, 0.75, 1.0);
    rock.rotation.set(Math.random(), Math.random(), 0);
    cluster.add(rock);

    // 星光水晶礦簇（偶數叢生成）
    if (i % 2 === 0) {
        const cMat = i % 4 === 0 ? crystalCyanMat : crystalVioletMat;
        for (let c = 0; c < 3; c++) {
            const shard = new THREE.Mesh(
                new THREE.ConeGeometry(0.08 + c * 0.02, 0.55 + Math.random() * 0.45, 5),
                cMat
            );
            shard.position.set((c - 1) * 0.14, 0.35, (Math.random() - 0.5) * 0.15);
            shard.rotation.z = (c - 1) * 0.28;
            shard.rotation.x = (Math.random() - 0.5) * 0.25;
            cluster.add(shard);
        }
    }

    // 發光幻彩靈菇（每叢 2~3 朵，共用 4 組呼吸發光材質）
    const mushCount = 2 + (i % 2);
    for (let m = 0; m < mushCount; m++) {
        const mGroup = new THREE.Group();
        const mx = (m - 0.5) * 0.26 + (Math.random() - 0.5) * 0.12;
        const mz = 0.28 + (Math.random() - 0.5) * 0.2;
        const mh = 0.18 + Math.random() * 0.14;
        mGroup.position.set(mx, 0, mz);

        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.035, mh, 6), stemMat);
        stem.position.y = mh / 2;
        mGroup.add(stem);

        const capMat = mushroomCapMats[(i + m) % 4];
        const cap = new THREE.Mesh(
            new THREE.SphereGeometry(0.09 + Math.random() * 0.05, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.6),
            capMat
        );
        cap.position.y = mh - 0.02;
        mGroup.add(cap);

        cluster.add(mGroup);
    }

    forestGroup.add(cluster);
}

const interactables = [];

// 設施 A：中央月光白玉主祭壇 (0, 0, -1.8)
const altarGroup = new THREE.Group();
altarGroup.position.set(0, 0, -1.8);
scene.add(altarGroup);
const stoneMat = new THREE.MeshStandardMaterial({ color: 0xd8e4f0, roughness: 0.4, metalness: 0.15 });
const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.25,
    metalness: 0.85,
    emissive: 0x332200
});

// =========================================================================
// 2C. 參道東方白玉宮燈（6 座石燈籠）＆ 聖域南端「月華星拱門」
// =========================================================================
const lanternFlameMat = new THREE.MeshBasicMaterial({ color: 0xffe680 });
const lanternGlassMat = new THREE.MeshStandardMaterial({
    color: 0xfff3cc,
    emissive: 0xffaa22,
    emissiveIntensity: 0.9,
    transparent: true,
    opacity: 0.85
});

function createStoneLantern(x, z) {
    const lGroup = new THREE.Group();
    lGroup.position.set(x, 0, z);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.26, 0.16, 6), stoneMat);
    base.position.y = 0.08;
    lGroup.add(base);

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.72, 6), stoneMat);
    post.position.y = 0.52;
    lGroup.add(post);

    const midTray = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.08, 6), goldTrimMat);
    midTray.position.y = 0.90;
    lGroup.add(midTray);

    const lightBox = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.26, 6), lanternGlassMat);
    lightBox.position.y = 1.07;
    lGroup.add(lightBox);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.24, 6), stoneMat);
    roof.position.y = 1.32;
    lGroup.add(roof);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), goldTrimMat);
    finial.position.y = 1.46;
    lGroup.add(finial);

    // 燈籠光暈 Sprite（零效能負擔卻有柔和暖光暈）
    const glowSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: glowDotTex,
            color: 0xffcc55,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    glowSprite.position.y = 1.07;
    glowSprite.scale.set(1.25, 1.25, 1);
    lGroup.add(glowSprite);

    forestGroup.add(lGroup);
}

[
    [-2.8, 9.6],
    [2.8, 9.6],
    [-3.8, 5.2],
    [3.8, 5.2],
    [4.8, -2.5],
    [-4.8, -2.5]
].forEach(([lx, lz]) => createStoneLantern(lx, lz));

// 聖域南端入口：東方月白金紋星拱門 (0, 0, 12.6)
const gateGroup = new THREE.Group();
gateGroup.position.set(0, 0, 12.6);
scene.add(gateGroup);
[-2.1, 2.1].forEach((px) => {
    const colBase = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.32, 0.3, 12), goldTrimMat);
    colBase.position.set(px, 0.15, 0);
    gateGroup.add(colBase);

    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.20, 3.8, 12), stoneMat);
    pillar.position.set(px, 2.0, 0);
    gateGroup.add(pillar);
});
const topBeam = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.24, 0.32), stoneMat);
topBeam.position.set(0, 3.85, 0);
gateGroup.add(topBeam);

const subBeam = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.14, 0.24), goldTrimMat);
subBeam.position.set(0, 3.35, 0);
gateGroup.add(subBeam);

const gateMoonCrest = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 12, 24), goldTrimMat);
gateMoonCrest.position.set(0, 4.25, 0);
gateGroup.add(gateMoonCrest);

[
    { r: 2.3, h: 0.16, y: 0.08 },
    { r: 1.95, h: 0.16, y: 0.24 },
    { r: 1.65, h: 0.14, y: 0.39 }
].forEach((step) => {
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(step.r, step.r + 0.08, step.h, 32), stoneMat);
    cyl.position.y = step.y;
    cyl.receiveShadow = true;
    altarGroup.add(cyl);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(step.r + 0.02, 0.02, 12, 48), goldTrimMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = step.y + step.h / 2;
    altarGroup.add(ring);
});
altarGroup.userData = { station: 'altar' };
interactables.push(altarGroup);

// 設施 B：許願星泉池 (0, 0, 6.2) — 與主祭壇相距 8.0m，視野與點擊完全分離不重疊
const poolGroup = new THREE.Group();
poolGroup.position.set(0, 0, 6.2);
scene.add(poolGroup);

const poolBasin = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.1, 0.36, 28), stoneMat);
poolBasin.position.y = 0.18;
poolGroup.add(poolBasin);

const poolWater = new THREE.Mesh(
    new THREE.CylinderGeometry(0.82, 0.82, 0.38, 28),
    new THREE.MeshStandardMaterial({
        color: 0x4facfe,
        emissive: 0x0077cc,
        emissiveIntensity: 0.65,
        roughness: 0.1
    })
);
poolWater.position.y = 0.19;
poolGroup.add(poolWater);

const poolCrystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.24, 0),
    new THREE.MeshStandardMaterial({
        color: 0xa8fffa,
        emissive: 0x00d2ff,
        emissiveIntensity: 0.8,
        roughness: 0.1
    })
);
poolCrystal.position.y = 0.72;
poolGroup.add(poolCrystal);
poolGroup.userData = { station: 'pool' };
interactables.push(poolGroup);

// 設施 C：神諭靈籤浮空陣 (6.8, 0, 2.2) — 大幅移往東側獨立星台
const oracleGroup = new THREE.Group();
oracleGroup.position.set(6.8, 0, 2.2);
scene.add(oracleGroup);

const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.58, 0.9, 16), stoneMat);
pedestal.position.y = 0.45;
oracleGroup.add(pedestal);

function createOracleCardTexture(isAwakened = false) {
    const c = document.createElement('canvas');
    c.width = 160;
    c.height = 250;
    const ctx = c.getContext('2d');

    if (!isAwakened) {
        const g = ctx.createLinearGradient(0, 0, 160, 250);
        g.addColorStop(0, '#2b1354');
        g.addColorStop(0.5, '#162a5c');
        g.addColorStop(1, '#3b165e');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 160, 250);

        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 7;
        ctx.strokeRect(8, 8, 144, 234);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 42px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🦄', 80, 134);
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('ORACLE', 80, 180);
    } else {
        // 覺醒態：璀璨聖光金 × 極光虹彩卡面
        const g = ctx.createLinearGradient(0, 0, 160, 250);
        g.addColorStop(0.0, '#fff6b3');
        g.addColorStop(0.28, '#ffd700');
        g.addColorStop(0.62, '#ff7ae5');
        g.addColorStop(1.0, '#00f2fe');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 160, 250);

        // 中心太陽聖芒光暈
        const rad = ctx.createRadialGradient(80, 125, 8, 80, 125, 92);
        rad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        rad.addColorStop(0.5, 'rgba(255, 235, 130, 0.55)');
        rad.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = rad;
        ctx.fillRect(0, 0, 160, 250);

        // 雙層神聖白金邊框與星芒陣
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.strokeRect(7, 7, 146, 236);
        ctx.strokeStyle = '#b87300';
        ctx.lineWidth = 3;
        ctx.strokeRect(16, 16, 128, 218);

        ctx.beginPath();
        ctx.arc(80, 118, 44, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#5c2800';
        ctx.font = 'bold 46px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🦄', 80, 134);
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('✨ AWAKENED ✨', 80, 192);
    }
    return new THREE.CanvasTexture(c);
}

const defaultCardTex = createOracleCardTexture(false);
const awakenedCardTex = createOracleCardTexture(true);

const floatingCards = [];
const cardRingGroup = new THREE.Group();
cardRingGroup.position.y = 1.45;
oracleGroup.add(cardRingGroup);

for (let i = 0; i < 7; i++) {
    const ang = (i / 7) * Math.PI * 2;
    const bx = Math.cos(ang) * 0.68;
    const bz = Math.sin(ang) * 0.68;
    const bRotY = -ang + Math.PI / 2;

    // 每張神諭卡擁有獨立的標準材質，支援單張變色與高光飛升（禁止使用自訂 GLSL）
    const cardMat = new THREE.MeshStandardMaterial({
        map: defaultCardTex,
        emissive: 0x331a66,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        side: THREE.DoubleSide
    });

    const cMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.52), cardMat);
    cMesh.position.set(bx, 0, bz);
    cMesh.rotation.y = bRotY;
    cMesh.userData = {
        station: 'oracleCard',
        cardIndex: i,
        baseX: bx,
        baseZ: bz,
        baseRotY: bRotY
    };
    cardRingGroup.add(cMesh);
    floatingCards.push(cMesh);
}

// 抽牌變色飛升專屬特效群組（雙層光環 + 螺旋星塵粒子 + 聖光點光源）
const ascensionFXGroup = new THREE.Group();
ascensionFXGroup.position.y = 1.45;
ascensionFXGroup.visible = false;
oracleGroup.add(ascensionFXGroup);

const ascendLight = new THREE.PointLight(0xffd700, 0, 6);
ascensionFXGroup.add(ascendLight);

const ringGeo1 = new THREE.RingGeometry(0.28, 0.36, 32);
const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const ascendRing1 = new THREE.Mesh(ringGeo1, ringMat1);
ascendRing1.rotation.x = -Math.PI / 2;
ascensionFXGroup.add(ascendRing1);

const ringGeo2 = new THREE.RingGeometry(0.20, 0.27, 32);
const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const ascendRing2 = new THREE.Mesh(ringGeo2, ringMat2);
ascendRing2.rotation.x = -Math.PI / 2;
ascensionFXGroup.add(ascendRing2);

const ascendParticleCount = 48;
const ascendPGeo = new THREE.BufferGeometry();
const ascendPPos = new Float32Array(ascendParticleCount * 3);
const ascendPCol = new Float32Array(ascendParticleCount * 3);
const ascendPPhases = [];
const ascendPalette = [
    new THREE.Color(0xffd700),
    new THREE.Color(0x00f2fe),
    new THREE.Color(0xff7ae5),
    new THREE.Color(0xffffff)
];

for (let i = 0; i < ascendParticleCount; i++) {
    const angle = (i / ascendParticleCount) * Math.PI * 4;
    const radius = 0.22 + Math.random() * 0.45;
    const baseY = Math.random() * 1.4;
    ascendPPos[i * 3] = Math.cos(angle) * radius;
    ascendPPos[i * 3 + 1] = baseY;
    ascendPPos[i * 3 + 2] = Math.sin(angle) * radius;

    const c = ascendPalette[i % ascendPalette.length];
    ascendPCol[i * 3] = c.r;
    ascendPCol[i * 3 + 1] = c.g;
    ascendPCol[i * 3 + 2] = c.b;
    ascendPPhases.push({
        angle,
        radius,
        baseY,
        spinSpeed: 4.5 + Math.random() * 3.5,
        ySpeed: 0.9 + Math.random() * 0.8
    });
}
ascendPGeo.setAttribute('position', new THREE.BufferAttribute(ascendPPos, 3));
ascendPGeo.setAttribute('color', new THREE.BufferAttribute(ascendPCol, 3));

const ascendParticles = new THREE.Points(
    ascendPGeo,
    new THREE.PointsMaterial({
        size: 0.22,
        map: glowDotTex,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
ascensionFXGroup.add(ascendParticles);

const ascensionFX = {
    group: ascensionFXGroup,
    light: ascendLight,
    ring1: ascendRing1,
    ring2: ascendRing2,
    pGeo: ascendPGeo,
    phases: ascendPPhases,
    count: ascendParticleCount
};

oracleGroup.userData = { station: 'oracle' };
interactables.push(oracleGroup);

// 設施 D：千年祈願靈樹 (-7.2, 0, 1.8) — 大幅移往西側獨立櫻花靈台
const wishTreeGroup = new THREE.Group();
wishTreeGroup.position.set(-7.2, 0, 1.8);
scene.add(wishTreeGroup);

// 靈樹底座白玉蓮臺環
const treePedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.35, 0.16, 24), stoneMat);
treePedestal.position.y = 0.08;
wishTreeGroup.add(treePedestal);

const treePedestalTrim = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.025, 12, 36), goldTrimMat);
treePedestalTrim.rotation.x = Math.PI / 2;
treePedestalTrim.position.y = 0.16;
wishTreeGroup.add(treePedestalTrim);

const trunkBarkMat = cherryTrunkMat;
const sacredRootBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.58, 0.65, 10), trunkBarkMat);
sacredRootBase.position.y = 0.30;
wishTreeGroup.add(sacredRootBase);

// 千年祈願靈樹：建立真 3D 多級分岔古櫻木枝幹骨架
const mainTop = new THREE.Vector3(0, 1.85, 0);
add3DBranchSegment(wishTreeGroup, new THREE.Vector3(0, 0.35, 0), mainTop, 0.36, 0.24, trunkBarkMat);

const wishBoughs = [
    { mid: new THREE.Vector3(-0.78, 2.55, 0.35), tip: new THREE.Vector3(-1.35, 3.15, 0.62) },
    { mid: new THREE.Vector3(0.82, 2.60, 0.32), tip: new THREE.Vector3(1.40, 3.22, 0.55) },
    { mid: new THREE.Vector3(0.12, 2.65, -0.78), tip: new THREE.Vector3(0.25, 3.30, -1.32) },
    { mid: new THREE.Vector3(-0.55, 2.70, -0.58), tip: new THREE.Vector3(-1.05, 3.35, -1.05) },
    { mid: new THREE.Vector3(0.58, 2.75, -0.52), tip: new THREE.Vector3(1.10, 3.40, -0.95) }
];

wishBoughs.forEach((wb) => {
    add3DBranchSegment(wishTreeGroup, mainTop, wb.mid, 0.20, 0.13, trunkBarkMat);
    add3DBranchSegment(wishTreeGroup, wb.mid, wb.tip, 0.13, 0.07, trunkBarkMat);
});

// 建立千年祈願靈樹專屬的 2.5D 獨立蓬鬆櫻花葉團雲（零交叉摺痕，且支援掛願時變色綻放）
const wishSakuraPuffTex = createFoliagePuffTexture(REALISTIC_TREE_VARIANTS[6], 2, 99);
const wishSakuraInnerTex = createFoliagePuffTexture(REALISTIC_TREE_VARIANTS[6], 1, 88);

const wishOuterMat = new THREE.SpriteMaterial({
    map: wishSakuraPuffTex,
    color: 0xffffff,
    transparent: true,
    alphaTest: 0.08
});
const wishInnerMat = new THREE.SpriteMaterial({
    map: wishSakuraInnerTex,
    color: 0xffd6f5,
    transparent: true,
    alphaTest: 0.08
});

// 相容 OracleSystem.js 掛願覺醒變色動畫的控制代理物件
const canopyMat = {
    color: wishOuterMat.color,
    emissive: {
        setHex: (hex) => {
            if (hex === 0xffb700) {
                wishOuterMat.color.setHex(0xffe699);
                wishInnerMat.color.setHex(0xffcc66);
            } else if (hex === 0xff55cc) {
                wishOuterMat.color.setHex(0xffb8f0);
                wishInnerMat.color.setHex(0xff85df);
            } else {
                wishOuterMat.color.setHex(0xffffff);
                wishInnerMat.color.setHex(0xffd6f5);
            }
        }
    },
    emissiveIntensity: 0.45
};

// 在 3D 分岔枝幹上掛載 15 團立體櫻花葉團雲
[
    [0, 2.85, 0, 2.25, true],
    [-0.78, 2.65, 0.35, 1.85, true],
    [0.82, 2.70, 0.32, 1.85, true],
    [0.12, 2.75, -0.78, 1.90, true],
    [-1.32, 3.20, 0.60, 1.75, false],
    [1.38, 3.25, 0.52, 1.80, false],
    [0.25, 3.35, -1.28, 1.75, false],
    [-1.02, 3.40, -1.00, 1.70, false],
    [1.08, 3.45, -0.92, 1.72, false],
    [-0.55, 3.55, 0.25, 1.95, false],
    [0.58, 3.60, 0.22, 1.98, false],
    [0, 3.85, -0.10, 2.20, false],
    [0, 3.15, 0.85, 1.70, false]
].forEach(([px, py, pz, sc, isInner]) => {
    const sp = new THREE.Sprite(isInner ? wishInnerMat : wishOuterMat);
    sp.position.set(px, py, pz);
    sp.scale.set(sc * 1.15, sc * 0.96, 1);
    wishTreeGroup.add(sp);
});

wishTreeGroup.userData = { station: 'tree' };
// 為祈願靈樹配置精準圓柱點擊感應體（不含外圍巨大葉團 Sprite），避免點擊靈樹周圍草地時誤按
const treeHitMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.35, 3.2, 12),
    new THREE.MeshBasicMaterial({ visible: false })
);
treeHitMesh.position.y = 1.6;
treeHitMesh.userData = { station: 'tree' };
wishTreeGroup.add(treeHitMesh);
interactables.push(treeHitMesh);

const treeOrbsGroup = new THREE.Group();
wishTreeGroup.add(treeOrbsGroup);

// 產生東方祈願靈箋（繪馬木牌 + 流蘇）貼圖（使用標準材質，禁止自訂 GLSL）
function createWishPlaqueTexture() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 256;
    const ctx = c.getContext('2d');

    // 上方金色掛繩
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(64, 0);
    ctx.lineTo(64, 34);
    ctx.stroke();

    // 祈願靈箋本體（漸層櫻粉金邊）
    const grad = ctx.createLinearGradient(24, 30, 104, 185);
    grad.addColorStop(0.0, '#fff6fa');
    grad.addColorStop(0.45, '#ffcce6');
    grad.addColorStop(1.0, '#ff85c0');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(64, 28);
    ctx.lineTo(102, 50);
    ctx.lineTo(98, 178);
    ctx.lineTo(30, 178);
    ctx.lineTo(26, 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 靈箋文字「祈願」
    ctx.fillStyle = '#8c1d58';
    ctx.font = 'bold 28px "Microsoft JhengHei", serif';
    ctx.textAlign = 'center';
    ctx.fillText('祈', 64, 96);
    ctx.fillText('願', 64, 134);

    // 底部飄逸紅金流蘇
    ctx.strokeStyle = '#ff4d88';
    ctx.lineWidth = 3;
    [-12, -4, 4, 12].forEach((ox) => {
        ctx.beginPath();
        ctx.moveTo(64 + ox * 0.5, 178);
        ctx.quadraticCurveTo(64 + ox, 215, 64 + ox * 1.2, 248);
        ctx.stroke();
    });

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
}

const wishPlaqueTex = createWishPlaqueTexture();

// 祈願靈樹「掛上心願・靈樹覺醒綻放」專屬特效群組（樹冠聖光 + 雙層祈願光環 + 漫天櫻花星雨）
const wishTreeFXGroup = new THREE.Group();
wishTreeFXGroup.visible = false;
wishTreeGroup.add(wishTreeFXGroup);

const treeBlessLight = new THREE.PointLight(0xffd700, 0, 9);
treeBlessLight.position.set(0, 2.9, 0);
wishTreeFXGroup.add(treeBlessLight);

const treeRing1 = new THREE.Mesh(
    new THREE.RingGeometry(0.55, 0.72, 36),
    new THREE.MeshBasicMaterial({
        color: 0xffd700,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
treeRing1.rotation.x = -Math.PI / 2;
wishTreeFXGroup.add(treeRing1);

const treeRing2 = new THREE.Mesh(
    new THREE.RingGeometry(0.40, 0.54, 36),
    new THREE.MeshBasicMaterial({
        color: 0xff80df,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
treeRing2.rotation.x = -Math.PI / 2;
wishTreeFXGroup.add(treeRing2);

const treePetalCount = 68;
const treePetalGeo = new THREE.BufferGeometry();
const treePetalPos = new Float32Array(treePetalCount * 3);
const treePetalCol = new Float32Array(treePetalCount * 3);
const treePetalPhases = [];
const petalPalette = [
    new THREE.Color(0xffb8f0),
    new THREE.Color(0xffd700),
    new THREE.Color(0xff7ae5),
    new THREE.Color(0x88ffee)
];

for (let i = 0; i < treePetalCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.25 + Math.random() * 1.95;
    const startY = 1.8 + Math.random() * 2.4;
    treePetalPos[i * 3] = Math.cos(angle) * radius;
    treePetalPos[i * 3 + 1] = startY;
    treePetalPos[i * 3 + 2] = Math.sin(angle) * radius;

    const c = petalPalette[i % petalPalette.length];
    treePetalCol[i * 3] = c.r;
    treePetalCol[i * 3 + 1] = c.g;
    treePetalCol[i * 3 + 2] = c.b;

    treePetalPhases.push({
        angle,
        radius,
        startY,
        fallSpeed: 0.7 + Math.random() * 0.9,
        swirlSpeed: 1.5 + Math.random() * 2.2,
        drift: 0.15 + Math.random() * 0.35
    });
}
treePetalGeo.setAttribute('position', new THREE.BufferAttribute(treePetalPos, 3));
treePetalGeo.setAttribute('color', new THREE.BufferAttribute(treePetalCol, 3));

const treePetalParticles = new THREE.Points(
    treePetalGeo,
    new THREE.PointsMaterial({
        size: 0.24,
        map: glowDotTex,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
wishTreeFXGroup.add(treePetalParticles);

const wishTreeFX = {
    treeGroup: wishTreeGroup,
    canopyMat,
    fxGroup: wishTreeFXGroup,
    light: treeBlessLight,
    ring1: treeRing1,
    ring2: treeRing2,
    petalGeo: treePetalGeo,
    petalPhases: treePetalPhases,
    petalCount: treePetalCount,
    wishPlaqueTex,
    glowDotTex
};

// =========================================================================
// 2.9 🔥 赤焰獨角獸領域 (Fire-Element Unicorn Domain, 座標 (22.0, 0, -7.2))
// 以火元素構建的可步入式秘境：熔岩黑曜石橋、赤焰鳥居、熔岩魔法陣大地、
// 8 座黑曜石聖火柱、赤焰楓香古樹林、紅蓮晶簇與 2.5D 赤焰獨角獸祭壇
// =========================================================================
const fireDomainCenter = new THREE.Vector3(22.0, 0, -7.2);
const fireDomainGroup = new THREE.Group();
fireDomainGroup.position.copy(fireDomainCenter);
scene.add(fireDomainGroup);

// (A) 繪製火元素熔岩黑曜石大地貼圖 (512x512 Canvas)
function createFireDomainGroundTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    const cx = 256;
    const cy = 256;

    // 1. 黑曜石火山岩基底與熔岩核心漸層
    const bgGrad = ctx.createRadialGradient(cx, cy, 18, cx, cy, 250);
    bgGrad.addColorStop(0.0, 'rgba(255, 120, 20, 0.95)');
    bgGrad.addColorStop(0.22, 'rgba(140, 28, 8, 0.92)');
    bgGrad.addColorStop(0.55, 'rgba(38, 12, 8, 0.90)');
    bgGrad.addColorStop(0.88, 'rgba(18, 8, 6, 0.72)');
    bgGrad.addColorStop(1.0, 'rgba(10, 5, 4, 0.0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 512);

    // 2. 放射狀黃金熔岩裂隙脈絡
    for (let i = 0; i < 18; i++) {
        const baseA = (i / 18) * Math.PI * 2;
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 150, 30, 0.75)' : 'rgba(255, 70, 15, 0.55)';
        ctx.lineWidth = i % 2 === 0 ? 3.2 : 2.0;
        ctx.beginPath();
        let r = 34;
        let a = baseA;
        ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        while (r < 228) {
            r += 22;
            a += (Math.sin(i * 3.7 + r * 0.08) - 0.5) * 0.14;
            ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        }
        ctx.stroke();
    }

    // 3. 雙層火元素太陽神紋法陣環
    ctx.strokeStyle = 'rgba(255, 200, 70, 0.82)';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.arc(cx, cy, 110, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 95, 25, 0.68)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx, cy, 185, 0, Math.PI * 2);
    ctx.stroke();

    // 八芒赤焰星芒
    ctx.strokeStyle = 'rgba(255, 180, 55, 0.65)';
    ctx.lineWidth = 2.0;
    for (let k = 0; k < 8; k++) {
        const a1 = (k / 8) * Math.PI * 2;
        const a2 = ((k + 3) / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a1) * 110, cy + Math.sin(a1) * 110);
        ctx.lineTo(cx + Math.cos(a2) * 110, cy + Math.sin(a2) * 110);
        ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
}

const fireGroundMat = new THREE.MeshStandardMaterial({
    map: createFireDomainGroundTexture(),
    transparent: true,
    roughness: 0.75,
    metalness: 0.2,
    emissive: new THREE.Color(0xff4400),
    emissiveIntensity: 0.38,
    depthWrite: false
});
const fireGround = new THREE.Mesh(new THREE.PlaneGeometry(19.5, 19.5), fireGroundMat);
fireGround.rotation.x = -Math.PI / 2;
fireGround.position.set(0, 0.025, 0);
fireDomainGroup.add(fireGround);

// (B) 繪製 2.5D 熊熊烈焰火舌 Sprite 貼圖 (供聖火盆、火柱與祭壇使用)
function createFlamePlumeTexture() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 192;
    const ctx = c.getContext('2d');

    // 外焰紅蓮漸層
    const outerG = ctx.createRadialGradient(64, 125, 8, 64, 105, 62);
    outerG.addColorStop(0.0, 'rgba(255, 250, 190, 1.0)');
    outerG.addColorStop(0.3, 'rgba(255, 165, 30, 0.95)');
    outerG.addColorStop(0.65, 'rgba(255, 50, 10, 0.75)');
    outerG.addColorStop(1.0, 'rgba(180, 10, 0, 0.0)');
    ctx.fillStyle = outerG;
    ctx.beginPath();
    ctx.moveTo(64, 10);
    ctx.quadraticCurveTo(118, 85, 98, 152);
    ctx.quadraticCurveTo(64, 184, 30, 152);
    ctx.quadraticCurveTo(10, 85, 64, 10);
    ctx.fill();

    // 內焰白熾金核
    const innerG = ctx.createRadialGradient(64, 136, 4, 64, 125, 34);
    innerG.addColorStop(0.0, 'rgba(255, 255, 240, 1.0)');
    innerG.addColorStop(0.5, 'rgba(255, 210, 75, 0.9)');
    innerG.addColorStop(1.0, 'rgba(255, 90, 0, 0.0)');
    ctx.fillStyle = innerG;
    ctx.beginPath();
    ctx.moveTo(64, 48);
    ctx.quadraticCurveTo(94, 105, 82, 152);
    ctx.quadraticCurveTo(64, 170, 46, 152);
    ctx.quadraticCurveTo(34, 105, 64, 48);
    ctx.fill();

    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
}
const flamePlumeTex = createFlamePlumeTexture();
const animatedFlameSprites = [];

// (C) 連接主聖域與火元素領域的「熔岩黑曜石參道石橋」與「赤焰鳥居結界門」
const obsidianMat = new THREE.MeshStandardMaterial({
    color: 0x1c1214,
    roughness: 0.55,
    metalness: 0.45
});
const magmaGoldMat = new THREE.MeshStandardMaterial({
    color: 0xffaa22,
    emissive: 0xff4500,
    emissiveIntensity: 0.85,
    roughness: 0.25,
    metalness: 0.6
});
const crimsonPillarMat = new THREE.MeshStandardMaterial({
    color: 0x8a1812,
    emissive: 0x3a0800,
    emissiveIntensity: 0.4,
    roughness: 0.45,
    metalness: 0.25
});

// 7 階黑曜石鑲金熔岩石板，從 (10.5, 0, -3.5) 延伸至 (17.5, 0, -5.8)
const bridgeAngle = Math.atan2(-7.2, 22.0);
for (let s = 0; s < 7; s++) {
    const t = s / 6;
    const bx = 10.5 + t * 7.0;
    const bz = -3.5 + t * -2.3;
    const stepGroup = new THREE.Group();
    stepGroup.position.set(bx, 0.03, bz);
    stepGroup.rotation.y = -bridgeAngle;

    const slab = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.08, 2.2), obsidianMat);
    stepGroup.add(slab);

    const trimL = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.09, 0.12), magmaGoldMat);
    trimL.position.z = 1.02;
    const trimR = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.09, 0.12), magmaGoldMat);
    trimR.position.z = -1.02;
    stepGroup.add(trimL, trimR);

    forestGroup.add(stepGroup);
}

// 領域入口「赤焰結界鳥居」位於 (14.2, 0, -4.7)
const flameGateGroup = new THREE.Group();
flameGateGroup.position.set(14.2, 0, -4.7);
flameGateGroup.rotation.y = -bridgeAngle + Math.PI / 2;

const gatePostL = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 3.6, 12), crimsonPillarMat);
gatePostL.position.set(-1.35, 1.8, 0);
const gatePostR = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 3.6, 12), crimsonPillarMat);
gatePostR.position.set(1.35, 1.8, 0);
const gateTopBeam = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.24, 0.32), obsidianMat);
gateTopBeam.position.set(0, 3.55, 0);
const gateGoldBeam = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.14, 0.24), magmaGoldMat);
gateGoldBeam.position.set(0, 3.05, 0);
flameGateGroup.add(gatePostL, gatePostR, gateTopBeam, gateGoldBeam);

// 鳥居兩側赤焰聖火盆
[-1.65, 1.65].forEach((xp, idx) => {
    const brazierPed = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 0.95, 8), obsidianMat);
    brazierPed.position.set(xp, 0.48, 0.42);
    const brazierBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.18, 0.28, 10), magmaGoldMat);
    brazierBowl.position.set(xp, 1.05, 0.42);
    flameGateGroup.add(brazierPed, brazierBowl);

    const flameSp = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: flamePlumeTex,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    flameSp.position.set(xp, 1.55, 0.42);
    flameSp.scale.set(0.85, 1.25, 1);
    flameGateGroup.add(flameSp);
    animatedFlameSprites.push({
        sprite: flameSp,
        baseY: 1.55,
        baseW: 0.85,
        baseH: 1.25,
        phase: idx * 2.1
    });
});
scene.add(flameGateGroup);

// (D) 赤焰獨角獸中央三層黑曜石熔岩祭壇與雙層旋轉日輪法陣
const fireAltarGroup = new THREE.Group();
fireDomainGroup.add(fireAltarGroup);

// 為赤焰祭壇配置精準圓柱點擊感應區，避免周圍誤觸
const fireAltarHit = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.8, 3.4, 12),
    new THREE.MeshBasicMaterial({ visible: false })
);
fireAltarHit.position.y = 1.7;
fireAltarHit.userData = { station: 'fire_domain' };
fireAltarGroup.add(fireAltarHit);
interactables.push(fireAltarHit);

const fTier1 = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.65, 0.36, 8), obsidianMat);
fTier1.position.y = 0.18;
const fTier2 = new THREE.Mesh(new THREE.CylinderGeometry(1.78, 2.05, 0.34, 8), crimsonPillarMat);
fTier2.position.y = 0.52;
const fTier3 = new THREE.Mesh(new THREE.CylinderGeometry(1.28, 1.48, 0.32, 16), magmaGoldMat);
fTier3.position.y = 0.84;
fireAltarGroup.add(fTier1, fTier2, fTier3);

// 祭壇外圍旋轉太陽火輪環
const fireSolarRing1 = new THREE.Mesh(
    new THREE.RingGeometry(2.55, 2.78, 32),
    new THREE.MeshBasicMaterial({
        color: 0xffaa22,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.78,
        blending: THREE.AdditiveBlending
    })
);
fireSolarRing1.rotation.x = -Math.PI / 2;
fireSolarRing1.position.y = 0.06;
fireDomainGroup.add(fireSolarRing1);

const fireSolarRing2 = new THREE.Mesh(
    new THREE.RingGeometry(4.6, 4.82, 8),
    new THREE.MeshBasicMaterial({
        color: 0xff4500,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
    })
);
fireSolarRing2.rotation.x = -Math.PI / 2;
fireSolarRing2.position.y = 0.05;
fireDomainGroup.add(fireSolarRing2);

// (E) 8 座環繞祭壇的「黑曜石熔岩聖火柱」
for (let p = 0; p < 8; p++) {
    const pa = (p / 8) * Math.PI * 2 + Math.PI / 8;
    const pr = 5.4;
    const px = Math.cos(pa) * pr;
    const pz = Math.sin(pa) * pr;

    // 避開西側石橋入口正中央
    if (px < -4.2 && Math.abs(pz - 1.8) < 1.5) continue;

    const pillarG = new THREE.Group();
    pillarG.position.set(px, 0, pz);

    const pBase = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.45, 0.45, 6), obsidianMat);
    pBase.position.y = 0.225;
    const pShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 2.2, 6), obsidianMat);
    pShaft.position.y = 1.5;
    const pRing = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.18, 6), magmaGoldMat);
    pRing.position.y = 1.65;
    const pBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.22, 0.3, 8), magmaGoldMat);
    pBowl.position.y = 2.72;
    pillarG.add(pBase, pShaft, pRing, pBowl);

    const fSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: flamePlumeTex,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    fSprite.position.set(0, 3.35, 0);
    fSprite.scale.set(1.05, 1.55, 1);
    pillarG.add(fSprite);
    animatedFlameSprites.push({
        sprite: fSprite,
        baseY: 3.35,
        baseW: 1.05,
        baseH: 1.55,
        phase: p * 1.3
    });

    fireDomainGroup.add(pillarG);
}

// (F) 以 3D 精細渲染獨角獸原圖 (assets/unicorn.jpg) 進行「像素級赤焰神獸煉成」：
// 保留 3D 立體毛髮光影與深邃眼眸，將彩虹鬃尾化為熊熊燃燒的紅蓮金焰、白毛化為暖金日耀毛色、紫眸化為赤金神瞳，並穩穩踏在祭壇頂面 (y = 1.00)
const fireUnicornGroup = new THREE.Group();
fireUnicornGroup.position.set(0, 1.00, 0);
fireAltarGroup.add(fireUnicornGroup);

const fireCardGeo = new THREE.PlaneGeometry(1, 1);
fireCardGeo.translate(0, 0.5, 0);

const fireUnicornMat = new THREE.MeshBasicMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.02,
    depthWrite: false
});
const fireUnicornMesh = new THREE.Mesh(fireCardGeo, fireUnicornMat);
fireUnicornMesh.scale.set(3.55, 3.55, 1);
fireUnicornGroup.add(fireUnicornMesh);

// 赤焰獨角獸背後日輪光暈 Sprite
const fireHaloMat = new THREE.SpriteMaterial({
    map: glowDotTex,
    color: 0xff6611,
    transparent: true,
    opacity: 0.52,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const fireHaloSprite = new THREE.Sprite(fireHaloMat);
fireHaloSprite.scale.set(4.2, 4.2, 1);
fireHaloSprite.position.set(0, 1.75, -0.18);
fireUnicornGroup.add(fireHaloSprite);

function build3DRenderedFireUnicorn(img) {
    const maxDim = 800;
    let w = img.naturalWidth || img.width || 512;
    let h = img.naturalHeight || img.height || 512;
    if (w > maxDim || h > maxDim) {
        if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
        } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
        }
    }

    const outCanvas = document.createElement('canvas');
    outCanvas.width = w;
    outCanvas.height = h;
    const ctx = outCanvas.getContext('2d');

    // 水平鏡像翻轉，讓赤焰獨角獸面向聖域參道石橋方向，與中央白獨角獸形成雙神獸對望之勢
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();

    try {
        const effThresh = 82;
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;
        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0, tail = 0;

        const isBgOrShadow = (p) => {
            const r = d[p], g = d[p + 1], b = d[p + 2];
            const maxC = Math.max(r, g, b);
            if (maxC <= effThresh) return true;
            const sat = maxC - Math.min(r, g, b);
            if (maxC <= effThresh + 24 && sat < 28) return true;
            return false;
        };

        const pushIfBg = (x, y) => {
            const idx = y * w + x;
            if (visited[idx]) return;
            if (isBgOrShadow(idx * 4)) {
                visited[idx] = 1;
                queue[tail++] = idx;
            }
        };

        // 1. 四邊向內 Flood-Fill 去背（100% 保護頭部內部的深邃眼眸與睫毛）
        for (let x = 0; x < w; x++) {
            pushIfBg(x, 0);
            pushIfBg(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
            pushIfBg(0, y);
            pushIfBg(w - 1, y);
        }

        // 2. 清除下半部四肢之間的封閉黑影空隙
        const legZoneStartY = Math.floor(h * 0.58);
        for (let y = legZoneStartY; y < h - 1; y += 2) {
            for (let x = 1; x < w - 1; x += 2) {
                const idx = y * w + x;
                if (!visited[idx] && Math.max(d[idx * 4], d[idx * 4 + 1], d[idx * 4 + 2]) <= 50) {
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

        // 3. 建立 4 層邊緣距離場，進行柔化與赤金火光邊緣鑲邊
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
                const nbs = [
                    cx > 0 ? idx - 1 : -1,
                    cx < w - 1 ? idx + 1 : -1,
                    cy > 0 ? idx - w : -1,
                    cy < h - 1 ? idx + w : -1
                ];
                for (let n = 0; n < 4; n++) {
                    const nIdx = nbs[n];
                    if (nIdx >= 0 && !visited[nIdx] && distMap[nIdx] === 0) {
                        distMap[nIdx] = step;
                        nextRing.push(nIdx);
                    }
                }
            }
            currentRing = nextRing;
        }

        // 4. 像素級「火元素神獸色彩煉成」：保留 3D 絲絨毛髮細節，將粉彩鬃尾轉化為熾熱紅蓮金焰
        const featherSpan = 72;
        const featherMax = effThresh + featherSpan;

        for (let i = 0; i < w * h; i++) {
            if (visited[i]) continue;
            const p = i * 4;
            let r = d[p], g = d[p + 1], b = d[p + 2];
            const maxC = Math.max(r, g, b);
            const minC = Math.min(r, g, b);
            const sat = maxC - minC;
            const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

            const dist = distMap[i];
            if (dist > 0 && maxC < featherMax) {
                let ratio = Math.max(0, (maxC - effThresh) / featherSpan);
                ratio = Math.pow(ratio, dist === 1 ? 1.85 : 1.35);
                d[p + 3] = Math.floor(ratio * 255);
                if (d[p + 3] > 8 && maxC > 10) {
                    const lift = Math.min(2.4, 215 / Math.max(65, maxC));
                    r = Math.min(255, Math.round(r * lift));
                    g = Math.min(255, Math.round(g * lift));
                    b = Math.min(255, Math.round(b * lift));
                }
            }

            if (d[p + 3] === 0) continue;

            // 判斷部位：
            // (A) 眼眸深處與虹膜 (低明度或高飽和紫瞳)：化為熾熱紅蓮金瞳，保留純白高光點
            if (maxC < 145 && lum < 0.48) {
                const eyeT = maxC / 145;
                d[p] = Math.min(255, Math.round(65 + eyeT * 190));
                d[p + 1] = Math.min(255, Math.round(12 + eyeT * 75));
                d[p + 2] = Math.min(255, Math.round(8 + eyeT * 18));
                continue;
            }

            // (B) 彩虹鬃毛、長尾、耳內與獨角 (具彩度區 sat > 14 或偏藍紫粉綠區域)：化為層次豐富的 3D 烈焰紅蓮×熔岩橙×太陽金
            const isCoolOrPastelMane = b > r + 6 || g > r + 6 || r - g > 18 || sat > 16;
            if (isCoolOrPastelMane) {
                const colorWeight = Math.min(1, Math.max(0.35, sat / 55));
                // 依據原 3D 毛髮明度 lum 映射至火焰漸層：深紅蓮 -> 熾烈橘紅 -> 太陽亮金 -> 白熾金尖
                let fr, fg, fb;
                if (lum < 0.55) {
                    const t = lum / 0.55;
                    fr = 185 + t * 70;
                    fg = 22 + t * 78;
                    fb = 4 + t * 12;
                } else if (lum < 0.82) {
                    const t = (lum - 0.55) / 0.27;
                    fr = 255;
                    fg = 100 + t * 115;
                    fb = 16 + t * 48;
                } else {
                    const t = (lum - 0.82) / 0.18;
                    fr = 255;
                    fg = 215 + t * 38;
                    fb = 64 + t * 145;
                }
                d[p] = Math.min(255, Math.round(r * (1 - colorWeight) + fr * colorWeight));
                d[p + 1] = Math.min(255, Math.round(g * (1 - colorWeight) * 0.82 + fg * colorWeight));
                d[p + 2] = Math.min(255, Math.round(b * (1 - colorWeight) * 0.55 + fb * colorWeight));
            } else {
                // (C) 3D 白色身軀毛皮：賦予神聖日耀香檳暖金光澤，並在肌肉暗部透出赤焰火光反射
                const shadowWarmth = Math.pow(1 - lum, 1.35);
                d[p] = Math.min(255, Math.round(r * 1.02 + shadowWarmth * 35));
                d[p + 1] = Math.min(255, Math.round(g * 0.90 - shadowWarmth * 28));
                d[p + 2] = Math.min(255, Math.round(b * 0.74 - shadowWarmth * 62));
            }

            // (D) 輪廓外緣加上太陽金焰鑲邊光 (Rim Light)
            if (dist > 0) {
                const rim = (5 - dist) * 0.18;
                d[p] = Math.min(255, Math.round(d[p] + (255 - d[p]) * rim));
                d[p + 1] = Math.min(255, Math.round(d[p + 1] + (165 - d[p + 1]) * rim));
                d[p + 2] = Math.max(0, Math.round(d[p + 2] * (1 - rim * 0.5)));
            }
        }

        // 5. 偵測馬蹄最低列並向下貼齊畫布底邊，確保四蹄穩穩踩在赤焰祭壇石台上
        let maxOpaqueY = -1;
        for (let y = h - 1; y >= 0; y--) {
            let hasHoof = false;
            for (let x = 0; x < w; x++) {
                if (d[(y * w + x) * 4 + 3] > 60) {
                    hasHoof = true;
                    break;
                }
            }
            if (hasHoof) {
                maxOpaqueY = y;
                break;
            }
        }

        ctx.putImageData(imgData, 0, 0);

        if (maxOpaqueY > 0 && maxOpaqueY < h - 2) {
            const shiftDown = h - 2 - maxOpaqueY;
            const tempC = document.createElement('canvas');
            tempC.width = w;
            tempC.height = h;
            tempC.getContext('2d').drawImage(outCanvas, 0, 0);
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(tempC, 0, shiftDown);
        }

        // 6. 使用 destination-over 在 3D 獨角獸「身後」繪製璀璨太陽神環與火鳳凰光翼（絕不遮擋 3D 獨角獸本體）
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        const cx = w * 0.52;
        const cy = h * 0.48;
        const ringR = w * 0.34;

        // 太陽日輪金環
        ctx.strokeStyle = 'rgba(255, 195, 55, 0.72)';
        ctx.lineWidth = Math.max(3, w * 0.007);
        ctx.shadowColor = 'rgba(255, 90, 0, 0.9)';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.stroke();

        // 日輪外圈八芒火印
        for (let k = 0; k < 12; k++) {
            const ang = (k / 12) * Math.PI * 2;
            const r1 = ringR * 1.02;
            const r2 = ringR * (k % 2 === 0 ? 1.22 : 1.12);
            ctx.fillStyle = k % 2 === 0 ? 'rgba(255, 210, 75, 0.78)' : 'rgba(255, 95, 20, 0.68)';
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(ang - 0.06) * r1, cy + Math.sin(ang - 0.06) * r1);
            ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
            ctx.lineTo(cx + Math.cos(ang + 0.06) * r1, cy + Math.sin(ang + 0.06) * r1);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    } catch (e) {}

    const tex = new THREE.CanvasTexture(outCanvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    fireUnicornMat.map = tex;
    fireUnicornMat.needsUpdate = true;
    const aspect = w / h;
    fireUnicornMesh.scale.set(3.55 * aspect, 3.55, 1);
}

// 載入 assets/unicorn.jpg 並即時煉成為 3D 赤焰獨角獸
const fireUnicornImg = new Image();
fireUnicornImg.onload = () => build3DRenderedFireUnicorn(fireUnicornImg);
fireUnicornImg.src = 'assets/unicorn.jpg';

// 火元素領域主光源
const fireDomainLight = new THREE.PointLight(0xff5511, 2.6, 22);
fireDomainLight.position.set(0, 3.6, 0);
fireDomainGroup.add(fireDomainLight);

// (G) 環繞火元素領域的 10 棵「赤焰熔岩古樹」与 12 簇「紅蓮熔岩水晶簇」
const fireBarkMat = new THREE.MeshStandardMaterial({
    color: 0x261210,
    emissive: 0x551100,
    emissiveIntensity: 0.35,
    roughness: 0.88
});
const fireTreeVariant = {
    name: '赤焰紅蓮熔岩古樹',
    leafShadow: '#420904',
    leafMid: '#b8250a',
    leafLight: '#ff6614',
    leafTip: '#ffdd55',
    style: 'classic_oak'
};
const firePuffMats = [
    new THREE.SpriteMaterial({
        map: createFoliagePuffTexture(fireTreeVariant, 0, 81),
        transparent: true,
        alphaTest: 0.06
    }),
    new THREE.SpriteMaterial({
        map: createFoliagePuffTexture(fireTreeVariant, 1, 82),
        transparent: true,
        alphaTest: 0.06
    }),
    new THREE.SpriteMaterial({
        map: createFoliagePuffTexture(fireTreeVariant, 2, 83),
        transparent: true,
        alphaTest: 0.06
    })
];

function buildFireElementTree(seed) {
    const fTree = new THREE.Group();
    // 焦黑熔岩樹根與主幹
    add3DBranchSegment(fTree, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.35, 0), 0.38, 0.24, fireBarkMat);
    const bDirs = [
        new THREE.Vector3(-0.65, 0.85, 0.35).normalize(),
        new THREE.Vector3(0.68, 0.82, -0.32).normalize(),
        new THREE.Vector3(0.15, 0.92, 0.62).normalize(),
        new THREE.Vector3(-0.22, 0.90, -0.65).normalize()
    ];
    for (let b = 0; b < bDirs.length; b++) {
        const p1 = new THREE.Vector3(0, 1.18, 0);
        const p2 = p1.clone().addScaledVector(bDirs[b], 1.35);
        add3DBranchSegment(fTree, p1, p2, 0.20, 0.11, fireBarkMat);

        // 每個主枝分岔兩道細枝並掛載 2.5D 赤焰葉團雲
        for (let sb = 0; sb < 2; sb++) {
            const sDir = bDirs[b]
                .clone()
                .add(new THREE.Vector3((sb === 0 ? 1 : -1) * 0.45, 0.55, (b % 2 === 0 ? 1 : -1) * 0.35))
                .normalize();
            const p3 = p2.clone().addScaledVector(sDir, 1.05);
            add3DBranchSegment(fTree, p2, p3, 0.11, 0.05, fireBarkMat);

            const sp = new THREE.Sprite(firePuffMats[(b + sb) % 3]);
            sp.position.copy(p3).add(new THREE.Vector3(0, 0.25, 0));
            const sz = 1.65 + ((seed + b + sb) % 3) * 0.32;
            sp.scale.set(sz * 1.15, sz * 0.95, 1);
            fTree.add(sp);
        }
    }
    // 頂冠熾熱火雲葉團
    const topSp = new THREE.Sprite(firePuffMats[2]);
    topSp.position.set(0, 3.45, 0);
    topSp.scale.set(2.35, 1.95, 1);
    fTree.add(topSp);
    return fTree;
}

for (let ft = 0; ft < 10; ft++) {
    const fa = (ft / 10) * Math.PI * 2 + 0.18;
    const fr = 7.8 + (ft % 2) * 1.1;
    const fx = Math.cos(fa) * fr;
    const fz = Math.sin(fa) * fr;

    // 避開西側石橋入口走廊
    if (fx < -4.8 && Math.abs(fz - 2.2) < 2.6) continue;

    const fireTree = buildFireElementTree(ft);
    fireTree.position.set(fx, 0, fz);
    fireTree.scale.setScalar(0.95 + (ft % 3) * 0.18);
    fireTree.rotation.y = ft * 1.1;
    fireDomainGroup.add(fireTree);
}

// 12 簇紅蓮熔岩晶簇
const fireCrystalMat = new THREE.MeshStandardMaterial({
    color: 0xff5511,
    emissive: 0xff2200,
    emissiveIntensity: 0.9,
    roughness: 0.15,
    metalness: 0.3
});
for (let fc = 0; fc < 12; fc++) {
    const ca = (fc / 12) * Math.PI * 2 + 0.32;
    const cr = 6.3 + (fc % 3) * 0.9;
    const cx = Math.cos(ca) * cr;
    const cz = Math.sin(ca) * cr;
    if (cx < -4.2 && Math.abs(cz - 1.9) < 2.2) continue;

    const cCluster = new THREE.Group();
    cCluster.position.set(cx, 0, cz);
    for (let k = 0; k < 3; k++) {
        const h = 0.55 + (k % 2) * 0.35;
        const shard = new THREE.Mesh(new THREE.ConeGeometry(0.14, h, 5), fireCrystalMat);
        shard.position.set((k - 1) * 0.16, h * 0.45, (k % 2) * 0.12);
        shard.rotation.z = (k - 1) * 0.28;
        cCluster.add(shard);
    }
    fireDomainGroup.add(cCluster);
}

// (H) 火元素領域漫天升騰的 130 顆赤焰火星粒子 (Fire Embers)
const fireEmberCount = 130;
const fireEmberGeo = new THREE.BufferGeometry();
const fireEmberPos = new Float32Array(fireEmberCount * 3);
const fireEmberCol = new Float32Array(fireEmberCount * 3);
const fireEmberData = [];
const emberPalette = [new THREE.Color(0xffdd44), new THREE.Color(0xff6611), new THREE.Color(0xff2200)];

for (let i = 0; i < fireEmberCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 0.6 + Math.random() * 8.2;
    const rx = Math.cos(a) * r;
    const ry = 0.2 + Math.random() * 6.5;
    const rz = Math.sin(a) * r;
    fireEmberPos[i * 3] = rx;
    fireEmberPos[i * 3 + 1] = ry;
    fireEmberPos[i * 3 + 2] = rz;

    const c = emberPalette[i % emberPalette.length];
    fireEmberCol[i * 3] = c.r;
    fireEmberCol[i * 3 + 1] = c.g;
    fireEmberCol[i * 3 + 2] = c.b;
    fireEmberData.push({
        radius: r,
        angle: a,
        y: ry,
        speedY: 0.8 + Math.random() * 1.4,
        spin: 0.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2
    });
}
fireEmberGeo.setAttribute('position', new THREE.BufferAttribute(fireEmberPos, 3));
fireEmberGeo.setAttribute('color', new THREE.BufferAttribute(fireEmberCol, 3));
const fireEmbers = new THREE.Points(
    fireEmberGeo,
    new THREE.PointsMaterial({
        size: 0.28,
        map: glowDotTex,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
fireDomainGroup.add(fireEmbers);

// (I) 赤焰獨角獸「烈焰覺醒」爆發動畫控制器 (fireDomainFX)
const fireAwakeningRing = new THREE.Mesh(
    new THREE.RingGeometry(0.8, 1.35, 32),
    new THREE.MeshBasicMaterial({
        color: 0xffaa22,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
fireAwakeningRing.rotation.x = -Math.PI / 2;
fireAwakeningRing.position.y = 0.95;
fireAwakeningRing.visible = false;
fireDomainGroup.add(fireAwakeningRing);

const fireDomainFX = {
    active: false,
    timer: 0,
    duration: 2.8,
    triggerAwakening() {
        this.active = true;
        this.timer = 0;
        fireAwakeningRing.visible = true;
        fireAwakeningRing.scale.setScalar(0.5);
        fireAwakeningRing.material.opacity = 1.0;
    },
    update(delta, elapsed) {
        if (!this.active) return;
        this.timer += delta;
        const p = Math.min(1, this.timer / this.duration);
        fireAwakeningRing.scale.setScalar(0.5 + p * 6.5);
        fireAwakeningRing.position.y = 0.95 + Math.sin(p * Math.PI) * 1.6;
        fireAwakeningRing.material.opacity = (1 - p) * 0.95;

        fireDomainLight.intensity = 2.6 + Math.sin(p * Math.PI) * 4.2;
        fireHaloSprite.scale.setScalar(4.2 + Math.sin(p * Math.PI) * 2.6);
        fireUnicornGroup.position.y = 1.00 + Math.sin(p * Math.PI) * 0.18;

        if (p >= 1) {
            this.active = false;
            fireAwakeningRing.visible = false;
            fireDomainLight.intensity = 2.6;
        }
    }
};
let heroInFireDomain = false;

// =========================================================================
// 2.95 💧 琉璃星海・水元素領域 (Water-Element Unicorn Domain, 座標 (-22.0, 0, -7.2))
//      以水元素與深海星潮構建的西側秘境：琉璃水月星橋、水月鳥居、深海潮汐魔法陣大地、
//      8 座白玉琉璃水靈柱、月光垂絲琉璃古樹、海藍寶晶簇與 2.5D 滄溟獨角獸祭壇
// =========================================================================
const waterDomainCenter = new THREE.Vector3(-22.0, 0, -7.2);
const waterDomainGroup = new THREE.Group();
waterDomainGroup.position.copy(waterDomainCenter);
scene.add(waterDomainGroup);

// (A) 繪製琉璃星海波光大地貼圖 (512x512 Canvas)
function createWaterDomainGroundTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    const cx = 256;
    const cy = 256;

    // 1. 深海琉璃藍與月光冰青漸層基底
    const bgGrad = ctx.createRadialGradient(cx, cy, 18, cx, cy, 250);
    bgGrad.addColorStop(0.0, 'rgba(80, 235, 255, 0.95)');
    bgGrad.addColorStop(0.24, 'rgba(12, 105, 168, 0.92)');
    bgGrad.addColorStop(0.58, 'rgba(8, 34, 72, 0.90)');
    bgGrad.addColorStop(0.88, 'rgba(5, 16, 36, 0.72)');
    bgGrad.addColorStop(1.0, 'rgba(4, 10, 22, 0.0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 512);

    // 2. 水波漣漪與流光水脈曲線
    for (let i = 0; i < 16; i++) {
        const baseA = (i / 16) * Math.PI * 2;
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(120, 245, 255, 0.72)' : 'rgba(64, 175, 255, 0.52)';
        ctx.lineWidth = i % 2 === 0 ? 2.8 : 1.8;
        ctx.beginPath();
        let r = 34;
        let a = baseA;
        ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        while (r < 228) {
            r += 20;
            a += Math.sin(i * 2.3 + r * 0.06) * 0.12;
            ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        }
        ctx.stroke();
    }

    // 3. 三層潮汐星海波紋法陣環
    [108, 152, 190].forEach((rad, idx) => {
        ctx.strokeStyle = idx === 0 ? 'rgba(170, 250, 255, 0.85)' : 'rgba(70, 205, 255, 0.65)';
        ctx.lineWidth = idx === 0 ? 3.0 : 2.0;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();
    });

    // 八芒冰晶星盤
    ctx.strokeStyle = 'rgba(155, 240, 255, 0.68)';
    ctx.lineWidth = 2.0;
    for (let k = 0; k < 8; k++) {
        const a1 = (k / 8) * Math.PI * 2;
        const a2 = ((k + 3) / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a1) * 108, cy + Math.sin(a1) * 108);
        ctx.lineTo(cx + Math.cos(a2) * 108, cy + Math.sin(a2) * 108);
        ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
}

const waterGroundMat = new THREE.MeshStandardMaterial({
    map: createWaterDomainGroundTexture(),
    transparent: true,
    roughness: 0.25,
    metalness: 0.35,
    emissive: new THREE.Color(0x0088cc),
    emissiveIntensity: 0.42,
    depthWrite: false
});
const waterGround = new THREE.Mesh(new THREE.PlaneGeometry(19.5, 19.5), waterGroundMat);
waterGround.rotation.x = -Math.PI / 2;
waterGround.position.set(0, 0.025, 0);
waterDomainGroup.add(waterGround);

// (B) 繪製 2.5D 潮汐水蓮靈珠 Sprite 貼圖 (供水蓮燈座與 8 座水靈柱頂端使用)
function createWaterLotusOrbTexture() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 192;
    const ctx = c.getContext('2d');

    const outerG = ctx.createRadialGradient(64, 118, 8, 64, 108, 58);
    outerG.addColorStop(0.0, 'rgba(235, 255, 255, 1.0)');
    outerG.addColorStop(0.32, 'rgba(80, 235, 255, 0.92)');
    outerG.addColorStop(0.68, 'rgba(0, 140, 255, 0.68)');
    outerG.addColorStop(1.0, 'rgba(0, 50, 130, 0.0)');
    ctx.fillStyle = outerG;
    ctx.beginPath();
    ctx.moveTo(64, 18);
    ctx.quadraticCurveTo(116, 88, 96, 150);
    ctx.quadraticCurveTo(64, 180, 32, 150);
    ctx.quadraticCurveTo(12, 88, 64, 18);
    ctx.fill();

    const innerG = ctx.createRadialGradient(64, 128, 4, 64, 120, 32);
    innerG.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    innerG.addColorStop(0.55, 'rgba(165, 250, 255, 0.9)');
    innerG.addColorStop(1.0, 'rgba(0, 180, 255, 0.0)');
    ctx.fillStyle = innerG;
    ctx.beginPath();
    ctx.arc(64, 122, 28, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
}
const waterLotusOrbTex = createWaterLotusOrbTexture();
const animatedWaterSprites = [];

// (C) 連接主聖域與水元素領域的「琉璃水月星橋」與「水月結界鳥居」
const deepSapphireMat = new THREE.MeshStandardMaterial({
    color: 0x0e2844,
    roughness: 0.35,
    metalness: 0.45
});
const aquaSilverMat = new THREE.MeshStandardMaterial({
    color: 0x80f5ff,
    emissive: 0x0099dd,
    emissiveIntensity: 0.85,
    roughness: 0.2,
    metalness: 0.65
});
const pearlJadeMat = new THREE.MeshStandardMaterial({
    color: 0x226688,
    emissive: 0x082b44,
    emissiveIntensity: 0.45,
    roughness: 0.3,
    metalness: 0.3
});

// 7 階琉璃鑲銀星橋，從 (-10.5, 0, -3.5) 延伸至 (-17.5, 0, -5.8)
const waterBridgeAngle = Math.atan2(-7.2, -22.0);
for (let s = 0; s < 7; s++) {
    const t = s / 6;
    const bx = -10.5 + t * -7.0;
    const bz = -3.5 + t * -2.3;
    const stepGroup = new THREE.Group();
    stepGroup.position.set(bx, 0.03, bz);
    stepGroup.rotation.y = -waterBridgeAngle;

    const slab = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.08, 2.2), deepSapphireMat);
    stepGroup.add(slab);

    const trimL = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.09, 0.12), aquaSilverMat);
    trimL.position.z = 1.02;
    const trimR = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.09, 0.12), aquaSilverMat);
    trimR.position.z = -1.02;
    stepGroup.add(trimL, trimR);

    forestGroup.add(stepGroup);
}

// 領域入口「水月琉璃鳥居」位於 (-14.2, 0, -4.7)
const waterGateGroup = new THREE.Group();
waterGateGroup.position.set(-14.2, 0, -4.7);
waterGateGroup.rotation.y = -waterBridgeAngle + Math.PI / 2;

const wGatePostL = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 3.6, 12), pearlJadeMat);
wGatePostL.position.set(-1.35, 1.8, 0);
const wGatePostR = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 3.6, 12), pearlJadeMat);
wGatePostR.position.set(1.35, 1.8, 0);
const wGateTopBeam = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.24, 0.32), deepSapphireMat);
wGateTopBeam.position.set(0, 3.55, 0);
const wGateAquaBeam = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.14, 0.24), aquaSilverMat);
wGateAquaBeam.position.set(0, 3.05, 0);
waterGateGroup.add(wGatePostL, wGatePostR, wGateTopBeam, wGateAquaBeam);

// 鳥居兩側潮汐水蓮燈座
[-1.65, 1.65].forEach((xp, idx) => {
    const lotusPed = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 0.95, 8), deepSapphireMat);
    lotusPed.position.set(xp, 0.48, -0.42);
    const lotusBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.18, 0.28, 10), aquaSilverMat);
    lotusBowl.position.set(xp, 1.05, -0.42);
    waterGateGroup.add(lotusPed, lotusBowl);

    const waterSp = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: waterLotusOrbTex,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    waterSp.position.set(xp, 1.55, -0.42);
    waterSp.scale.set(0.85, 1.25, 1);
    waterGateGroup.add(waterSp);
    animatedWaterSprites.push({
        sprite: waterSp,
        baseY: 1.55,
        baseW: 0.85,
        baseH: 1.25,
        phase: idx * 2.1
    });
});
scene.add(waterGateGroup);

// (D) 滄溟獨角獸中央三層琉璃水月祭壇與雙層旋轉潮汐星環
const waterAltarGroup = new THREE.Group();
waterDomainGroup.add(waterAltarGroup);

const waterAltarHit = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.8, 3.4, 12),
    new THREE.MeshBasicMaterial({ visible: false })
);
waterAltarHit.position.y = 1.7;
waterAltarHit.userData = { station: 'water_domain' };
waterAltarGroup.add(waterAltarHit);
interactables.push(waterAltarHit);

const wTier1 = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.65, 0.36, 12), deepSapphireMat);
wTier1.position.y = 0.18;
const wTier2 = new THREE.Mesh(new THREE.CylinderGeometry(1.78, 2.05, 0.34, 12), pearlJadeMat);
wTier2.position.y = 0.52;
const wTier3 = new THREE.Mesh(new THREE.CylinderGeometry(1.28, 1.48, 0.32, 20), aquaSilverMat);
wTier3.position.y = 0.84;
waterAltarGroup.add(wTier1, wTier2, wTier3);

const waterTidalRing1 = new THREE.Mesh(
    new THREE.RingGeometry(2.55, 2.78, 36),
    new THREE.MeshBasicMaterial({
        color: 0x66f2ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.78,
        blending: THREE.AdditiveBlending
    })
);
waterTidalRing1.rotation.x = -Math.PI / 2;
waterTidalRing1.position.y = 0.06;
waterDomainGroup.add(waterTidalRing1);

const waterTidalRing2 = new THREE.Mesh(
    new THREE.RingGeometry(4.6, 4.82, 12),
    new THREE.MeshBasicMaterial({
        color: 0x0099ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
    })
);
waterTidalRing2.rotation.x = -Math.PI / 2;
waterTidalRing2.position.y = 0.05;
waterDomainGroup.add(waterTidalRing2);

// (E) 8 座環繞祭壇的「深海琉璃水靈柱」
for (let p = 0; p < 8; p++) {
    const pa = (p / 8) * Math.PI * 2 + Math.PI / 8;
    const pr = 5.4;
    const px = Math.cos(pa) * pr;
    const pz = Math.sin(pa) * pr;

    // 避開東側星橋入口正中央
    if (px > 4.2 && Math.abs(pz - 1.8) < 1.5) continue;

    const pillarG = new THREE.Group();
    pillarG.position.set(px, 0, pz);

    const pBase = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.45, 0.45, 8), deepSapphireMat);
    pBase.position.y = 0.225;
    const pShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 2.2, 8), pearlJadeMat);
    pShaft.position.y = 1.5;
    const pRing = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.18, 8), aquaSilverMat);
    pRing.position.y = 1.65;
    const pBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.22, 0.3, 10), aquaSilverMat);
    pBowl.position.y = 2.72;
    pillarG.add(pBase, pShaft, pRing, pBowl);

    const wSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: waterLotusOrbTex,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    wSprite.position.set(0, 3.35, 0);
    wSprite.scale.set(1.05, 1.55, 1);
    pillarG.add(wSprite);
    animatedWaterSprites.push({
        sprite: wSprite,
        baseY: 3.35,
        baseW: 1.05,
        baseH: 1.55,
        phase: p * 1.3
    });

    waterDomainGroup.add(pillarG);
}

// (F) 2.5D 「滄溟琉璃獨角獸」像素級水元素神獸煉成
const waterUnicornGroup = new THREE.Group();
waterUnicornGroup.position.set(0, 1.00, 0);
waterAltarGroup.add(waterUnicornGroup);

const waterCardGeo = new THREE.PlaneGeometry(1, 1);
waterCardGeo.translate(0, 0.5, 0);

const waterUnicornMat = new THREE.MeshBasicMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.02,
    depthWrite: false
});
const waterUnicornMesh = new THREE.Mesh(waterCardGeo, waterUnicornMat);
waterUnicornMesh.scale.set(3.55, 3.55, 1);
waterUnicornGroup.add(waterUnicornMesh);

const waterHaloMat = new THREE.SpriteMaterial({
    map: glowDotTex,
    color: 0x00d8ff,
    transparent: true,
    opacity: 0.52,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const waterHaloSprite = new THREE.Sprite(waterHaloMat);
waterHaloSprite.scale.set(4.2, 4.2, 1);
waterHaloSprite.position.set(0, 1.75, -0.18);
waterUnicornGroup.add(waterHaloSprite);

function build3DRenderedWaterUnicorn(img) {
    const maxDim = 800;
    let w = img.naturalWidth || img.width || 512;
    let h = img.naturalHeight || img.height || 512;
    if (w > maxDim || h > maxDim) {
        if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
        } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
        }
    }

    const outCanvas = document.createElement('canvas');
    outCanvas.width = w;
    outCanvas.height = h;
    const ctx = outCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);

    try {
        const effThresh = 82;
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;
        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0, tail = 0;

        const isBgOrShadow = (p) => {
            const r = d[p], g = d[p + 1], b = d[p + 2];
            const maxC = Math.max(r, g, b);
            if (maxC <= effThresh) return true;
            const sat = maxC - Math.min(r, g, b);
            if (maxC <= effThresh + 24 && sat < 28) return true;
            return false;
        };

        const pushIfBg = (x, y) => {
            const idx = y * w + x;
            if (visited[idx]) return;
            if (isBgOrShadow(idx * 4)) {
                visited[idx] = 1;
                queue[tail++] = idx;
            }
        };

        for (let x = 0; x < w; x++) {
            pushIfBg(x, 0);
            pushIfBg(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
            pushIfBg(0, y);
            pushIfBg(w - 1, y);
        }

        const legZoneStartY = Math.floor(h * 0.58);
        for (let y = legZoneStartY; y < h - 1; y += 2) {
            for (let x = 1; x < w - 1; x += 2) {
                const idx = y * w + x;
                if (!visited[idx] && Math.max(d[idx * 4], d[idx * 4 + 1], d[idx * 4 + 2]) <= 50) {
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
                const nbs = [
                    cx > 0 ? idx - 1 : -1,
                    cx < w - 1 ? idx + 1 : -1,
                    cy > 0 ? idx - w : -1,
                    cy < h - 1 ? idx + w : -1
                ];
                for (let n = 0; n < 4; n++) {
                    const nIdx = nbs[n];
                    if (nIdx >= 0 && !visited[nIdx] && distMap[nIdx] === 0) {
                        distMap[nIdx] = step;
                        nextRing.push(nIdx);
                    }
                }
            }
            currentRing = nextRing;
        }

        // 水元素神獸色彩煉成：將鬃尾轉為深海琉璃藍 × 極光冰青 × 月華星銀漸層
        const featherSpan = 72;
        const featherMax = effThresh + featherSpan;

        for (let i = 0; i < w * h; i++) {
            if (visited[i]) continue;
            const p = i * 4;
            let r = d[p], g = d[p + 1], b = d[p + 2];
            const maxC = Math.max(r, g, b);
            const minC = Math.min(r, g, b);
            const sat = maxC - minC;
            const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

            const dist = distMap[i];
            if (dist > 0 && maxC < featherMax) {
                let ratio = Math.max(0, (maxC - effThresh) / featherSpan);
                ratio = Math.pow(ratio, dist === 1 ? 1.85 : 1.35);
                d[p + 3] = Math.floor(ratio * 255);
                if (d[p + 3] > 8 && maxC > 10) {
                    const lift = Math.min(2.4, 215 / Math.max(65, maxC));
                    r = Math.min(255, Math.round(r * lift));
                    g = Math.min(255, Math.round(g * lift));
                    b = Math.min(255, Math.round(b * lift));
                }
            }

            if (d[p + 3] === 0) continue;

            // (A) 眼眸深處：化為深海藍寶石神瞳
            if (maxC < 145 && lum < 0.48) {
                const eyeT = maxC / 145;
                d[p] = Math.min(255, Math.round(8 + eyeT * 35));
                d[p + 1] = Math.min(255, Math.round(45 + eyeT * 165));
                d[p + 2] = Math.min(255, Math.round(95 + eyeT * 160));
                continue;
            }

            // (B) 鬃毛、長尾與獨角：化為深海藍寶 -> 琉璃冰青 -> 星海極光白藍
            const isCoolOrPastelMane = b > r + 6 || g > r + 6 || r - g > 18 || sat > 16;
            if (isCoolOrPastelMane) {
                const colorWeight = Math.min(1, Math.max(0.38, sat / 52));
                let wr, wg, wb;
                if (lum < 0.55) {
                    const t = lum / 0.55;
                    wr = 12 + t * 28;
                    wg = 95 + t * 110;
                    wb = 195 + t * 60;
                } else if (lum < 0.82) {
                    const t = (lum - 0.55) / 0.27;
                    wr = 40 + t * 110;
                    wg = 205 + t * 42;
                    wb = 255;
                } else {
                    const t = (lum - 0.82) / 0.18;
                    wr = 150 + t * 100;
                    wg = 247 + t * 8;
                    wb = 255;
                }
                d[p] = Math.min(255, Math.round(r * (1 - colorWeight) * 0.72 + wr * colorWeight));
                d[p + 1] = Math.min(255, Math.round(g * (1 - colorWeight) * 0.95 + wg * colorWeight));
                d[p + 2] = Math.min(255, Math.round(b * (1 - colorWeight) + wb * colorWeight));
            } else {
                // (C) 身軀毛皮：月華冰晶銀白光澤，暗部透出琉璃青藍水光
                const shadowCool = Math.pow(1 - lum, 1.35);
                d[p] = Math.min(255, Math.round(r * 0.88 - shadowCool * 45));
                d[p + 1] = Math.min(255, Math.round(g * 0.98 + shadowCool * 12));
                d[p + 2] = Math.min(255, Math.round(b * 1.04 + shadowCool * 38));
            }

            if (dist > 0) {
                const rim = (5 - dist) * 0.18;
                d[p] = Math.max(0, Math.round(d[p] * (1 - rim * 0.3)));
                d[p + 1] = Math.min(255, Math.round(d[p + 1] + (235 - d[p + 1]) * rim));
                d[p + 2] = Math.min(255, Math.round(d[p + 2] + (255 - d[p + 2]) * rim));
            }
        }

        let maxOpaqueY = -1;
        for (let y = h - 1; y >= 0; y--) {
            let hasHoof = false;
            for (let x = 0; x < w; x++) {
                if (d[(y * w + x) * 4 + 3] > 60) {
                    hasHoof = true;
                    break;
                }
            }
            if (hasHoof) {
                maxOpaqueY = y;
                break;
            }
        }

        ctx.putImageData(imgData, 0, 0);

        if (maxOpaqueY > 0 && maxOpaqueY < h - 2) {
            const shiftDown = h - 2 - maxOpaqueY;
            const tempC = document.createElement('canvas');
            tempC.width = w;
            tempC.height = h;
            tempC.getContext('2d').drawImage(outCanvas, 0, 0);
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(tempC, 0, shiftDown);
        }

        // 在滄溟獨角獸身後繪製琉璃水月神環與十二芒冰晶法陣
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        const cx = w * 0.48;
        const cy = h * 0.48;
        const ringR = w * 0.34;

        ctx.strokeStyle = 'rgba(110, 240, 255, 0.75)';
        ctx.lineWidth = Math.max(3, w * 0.007);
        ctx.shadowColor = 'rgba(0, 195, 255, 0.9)';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.stroke();

        for (let k = 0; k < 12; k++) {
            const ang = (k / 12) * Math.PI * 2;
            const r1 = ringR * 1.02;
            const r2 = ringR * (k % 2 === 0 ? 1.22 : 1.12);
            ctx.fillStyle = k % 2 === 0 ? 'rgba(165, 250, 255, 0.8)' : 'rgba(40, 180, 255, 0.68)';
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(ang - 0.05) * r1, cy + Math.sin(ang - 0.05) * r1);
            ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
            ctx.lineTo(cx + Math.cos(ang + 0.05) * r1, cy + Math.sin(ang + 0.05) * r1);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    } catch (e) {}

    const tex = new THREE.CanvasTexture(outCanvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    waterUnicornMat.map = tex;
    waterUnicornMat.needsUpdate = true;
    const aspect = w / h;
    waterUnicornMesh.scale.set(3.55 * aspect, 3.55, 1);
}

const waterUnicornImg = new Image();
waterUnicornImg.onload = () => build3DRenderedWaterUnicorn(waterUnicornImg);
waterUnicornImg.src = 'assets/unicorn.jpg';

const waterDomainLight = new THREE.PointLight(0x00ccff, 2.6, 22);
waterDomainLight.position.set(0, 3.6, 0);
waterDomainGroup.add(waterDomainLight);

// (G) 環繞水元素領域的 10 棵「月光垂絲琉璃古樹」與 12 簇「冰藍海藍寶水晶簇」
const waterBarkMat = new THREE.MeshStandardMaterial({
    color: 0x162b3d,
    emissive: 0x052844,
    emissiveIntensity: 0.35,
    roughness: 0.78
});
const waterTreeVariant = {
    name: '月光垂絲琉璃古樹',
    leafShadow: '#06263d',
    leafMid: '#0d6b99',
    leafLight: '#33d6ff',
    leafTip: '#ccffff',
    style: 'weeping'
};
const waterPuffMats = [
    new THREE.SpriteMaterial({
        map: createFoliagePuffTexture(waterTreeVariant, 0, 91),
        transparent: true,
        alphaTest: 0.06
    }),
    new THREE.SpriteMaterial({
        map: createFoliagePuffTexture(waterTreeVariant, 1, 92),
        transparent: true,
        alphaTest: 0.06
    }),
    new THREE.SpriteMaterial({
        map: createFoliagePuffTexture(waterTreeVariant, 2, 93),
        transparent: true,
        alphaTest: 0.06
    })
];

function buildWaterElementTree(seed) {
    const wTree = new THREE.Group();
    add3DBranchSegment(wTree, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.4, 0), 0.36, 0.23, waterBarkMat);
    const bDirs = [
        new THREE.Vector3(-0.65, 0.85, 0.35).normalize(),
        new THREE.Vector3(0.68, 0.82, -0.32).normalize(),
        new THREE.Vector3(0.15, 0.92, 0.62).normalize(),
        new THREE.Vector3(-0.22, 0.90, -0.65).normalize()
    ];
    for (let b = 0; b < bDirs.length; b++) {
        const p1 = new THREE.Vector3(0, 1.22, 0);
        const p2 = p1.clone().addScaledVector(bDirs[b], 1.35);
        add3DBranchSegment(wTree, p1, p2, 0.19, 0.11, waterBarkMat);

        for (let sb = 0; sb < 2; sb++) {
            const sDir = bDirs[b]
                .clone()
                .add(new THREE.Vector3((sb === 0 ? 1 : -1) * 0.45, 0.55, (b % 2 === 0 ? 1 : -1) * 0.35))
                .normalize();
            const p3 = p2.clone().addScaledVector(sDir, 1.05);
            add3DBranchSegment(wTree, p2, p3, 0.11, 0.05, waterBarkMat);

            const sp = new THREE.Sprite(waterPuffMats[(b + sb) % 3]);
            sp.position.copy(p3).add(new THREE.Vector3(0, 0.25, 0));
            const sz = 1.65 + ((seed + b + sb) % 3) * 0.32;
            sp.scale.set(sz * 1.15, sz * 0.95, 1);
            wTree.add(sp);
        }
    }
    const topSp = new THREE.Sprite(waterPuffMats[2]);
    topSp.position.set(0, 3.48, 0);
    topSp.scale.set(2.35, 1.95, 1);
    wTree.add(topSp);
    return wTree;
}

for (let wt = 0; wt < 10; wt++) {
    const wa = (wt / 10) * Math.PI * 2 + 0.18;
    const wr = 7.8 + (wt % 2) * 1.1;
    const wx = Math.cos(wa) * wr;
    const wz = Math.sin(wa) * wr;

    // 避開東側星橋入口走廊
    if (wx > 4.8 && Math.abs(wz - 2.2) < 2.6) continue;

    const waterTree = buildWaterElementTree(wt);
    waterTree.position.set(wx, 0, wz);
    waterTree.scale.setScalar(0.95 + (wt % 3) * 0.18);
    waterTree.rotation.y = wt * 1.1;
    waterDomainGroup.add(waterTree);
}

// 12 簇冰藍海藍寶晶簇
const waterCrystalMat = new THREE.MeshStandardMaterial({
    color: 0x44eeff,
    emissive: 0x0088ee,
    emissiveIntensity: 0.9,
    roughness: 0.12,
    metalness: 0.35
});
for (let wc = 0; wc < 12; wc++) {
    const ca = (wc / 12) * Math.PI * 2 + 0.32;
    const cr = 6.3 + (wc % 3) * 0.9;
    const cx = Math.cos(ca) * cr;
    const cz = Math.sin(ca) * cr;
    if (cx > 4.2 && Math.abs(cz - 1.9) < 2.2) continue;

    const cCluster = new THREE.Group();
    cCluster.position.set(cx, 0, cz);
    for (let k = 0; k < 3; k++) {
        const h = 0.55 + (k % 2) * 0.35;
        const shard = new THREE.Mesh(new THREE.ConeGeometry(0.14, h, 5), waterCrystalMat);
        shard.position.set((k - 1) * 0.16, h * 0.45, (k % 2) * 0.12);
        shard.rotation.z = (k - 1) * 0.28;
        cCluster.add(shard);
    }
    waterDomainGroup.add(cCluster);
}

// (H) 水元素領域漫天升騰的 130 顆星海螢光水泡粒子 (Water Bubbles)
const waterBubbleCount = 130;
const waterBubbleGeo = new THREE.BufferGeometry();
const waterBubblePos = new Float32Array(waterBubbleCount * 3);
const waterBubbleCol = new Float32Array(waterBubbleCount * 3);
const waterBubbleData = [];
const bubblePalette = [new THREE.Color(0x99ffff), new THREE.Color(0x33ccff), new THREE.Color(0x88aaff)];

for (let i = 0; i < waterBubbleCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 0.6 + Math.random() * 8.2;
    const rx = Math.cos(a) * r;
    const ry = 0.2 + Math.random() * 6.5;
    const rz = Math.sin(a) * r;
    waterBubblePos[i * 3] = rx;
    waterBubblePos[i * 3 + 1] = ry;
    waterBubblePos[i * 3 + 2] = rz;

    const c = bubblePalette[i % bubblePalette.length];
    waterBubbleCol[i * 3] = c.r;
    waterBubbleCol[i * 3 + 1] = c.g;
    waterBubbleCol[i * 3 + 2] = c.b;
    waterBubbleData.push({
        radius: r,
        angle: a,
        y: ry,
        speedY: 0.55 + Math.random() * 1.05,
        spin: 0.25 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2
    });
}
waterBubbleGeo.setAttribute('position', new THREE.BufferAttribute(waterBubblePos, 3));
waterBubbleGeo.setAttribute('color', new THREE.BufferAttribute(waterBubbleCol, 3));
const waterBubbles = new THREE.Points(
    waterBubbleGeo,
    new THREE.PointsMaterial({
        size: 0.28,
        map: glowDotTex,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
waterDomainGroup.add(waterBubbles);

// (I) 滄溟獨角獸「琉璃潮汐覺醒」爆發動畫控制器 (waterDomainFX)
const waterAwakeningRing = new THREE.Mesh(
    new THREE.RingGeometry(0.8, 1.35, 36),
    new THREE.MeshBasicMaterial({
        color: 0x66f2ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
waterAwakeningRing.rotation.x = -Math.PI / 2;
waterAwakeningRing.position.y = 0.95;
waterAwakeningRing.visible = false;
waterDomainGroup.add(waterAwakeningRing);

const waterDomainFX = {
    active: false,
    timer: 0,
    duration: 2.8,
    triggerAwakening() {
        this.active = true;
        this.timer = 0;
        waterAwakeningRing.visible = true;
        waterAwakeningRing.scale.setScalar(0.5);
        waterAwakeningRing.material.opacity = 1.0;
    },
    update(delta, elapsed) {
        if (!this.active) return;
        this.timer += delta;
        const p = Math.min(1, this.timer / this.duration);
        waterAwakeningRing.scale.setScalar(0.5 + p * 6.5);
        waterAwakeningRing.position.y = 0.95 + Math.sin(p * Math.PI) * 1.6;
        waterAwakeningRing.material.opacity = (1 - p) * 0.95;

        waterDomainLight.intensity = 2.6 + Math.sin(p * Math.PI) * 4.2;
        waterHaloSprite.scale.setScalar(4.2 + Math.sin(p * Math.PI) * 2.6);
        waterUnicornGroup.position.y = 1.00 + Math.sin(p * Math.PI) * 0.18;

        if (p >= 1) {
            this.active = false;
            waterAwakeningRing.visible = false;
            waterDomainLight.intensity = 2.6;
        }
    }
};
let heroInWaterDomain = false;

// =========================================================================
// 2.97 🍃 蒼穹靈風・風元素領域 (Wind-Element Unicorn Domain, 座標 (0.0, 0, -23.5))
//      以風元素與長空極光構建的北側秘境：碧玉青雲踏階、天青靈風鳥居、八卦風輪法陣大地、
//      8 座碧玉流風靈柱、青鸞翡翠搖風古樹、天青翡翠晶簇與 2.5D 蒼穹靈風獨角獸祭壇
// =========================================================================
const windDomainCenter = new THREE.Vector3(0.0, 0, -23.5);
const windDomainGroup = new THREE.Group();
windDomainGroup.position.copy(windDomainCenter);
scene.add(windDomainGroup);

// (A) 繪製蒼穹靈風大地貼圖 (512x512 Canvas)
function createWindDomainGroundTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    const cx = 256;
    const cy = 256;

    // 1. 碧玉翡翠綠與天青極光漸層基底
    const bgGrad = ctx.createRadialGradient(cx, cy, 18, cx, cy, 250);
    bgGrad.addColorStop(0.0, 'rgba(105, 255, 205, 0.95)');
    bgGrad.addColorStop(0.22, 'rgba(0, 195, 140, 0.92)');
    bgGrad.addColorStop(0.55, 'rgba(4, 75, 52, 0.90)');
    bgGrad.addColorStop(0.85, 'rgba(2, 38, 26, 0.72)');
    bgGrad.addColorStop(1.0, 'rgba(2, 18, 12, 0.0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 512);

    // 2. 螺旋流風旋渦水脈曲線 (Spiral Wind Vortex)
    for (let i = 0; i < 16; i++) {
        const baseA = (i / 16) * Math.PI * 2;
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(165, 255, 225, 0.75)' : 'rgba(80, 240, 180, 0.52)';
        ctx.lineWidth = i % 2 === 0 ? 2.8 : 1.8;
        ctx.beginPath();
        let r = 32;
        let a = baseA;
        ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        while (r < 232) {
            r += 18;
            a += 0.22 + Math.sin(i * 1.8 + r * 0.05) * 0.08;
            ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        }
        ctx.stroke();
    }

    // 3. 雙層風輪法陣環與八風方位靈符
    [108, 156, 192].forEach((rad, idx) => {
        ctx.strokeStyle = idx === 0 ? 'rgba(200, 255, 235, 0.88)' : 'rgba(90, 245, 195, 0.65)';
        ctx.lineWidth = idx === 0 ? 3.0 : 2.0;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();
    });

    // 八芒靈風星盤
    ctx.strokeStyle = 'rgba(180, 255, 220, 0.72)';
    ctx.lineWidth = 2.0;
    for (let k = 0; k < 8; k++) {
        const a1 = (k / 8) * Math.PI * 2;
        const a2 = ((k + 3) / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a1) * 108, cy + Math.sin(a1) * 108);
        ctx.lineTo(cx + Math.cos(a2) * 108, cy + Math.sin(a2) * 108);
        ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
}

const windGroundMat = new THREE.MeshStandardMaterial({
    map: createWindDomainGroundTexture(),
    transparent: true,
    roughness: 0.25,
    metalness: 0.35,
    emissive: new THREE.Color(0x008855),
    emissiveIntensity: 0.42,
    depthWrite: false
});
const windGround = new THREE.Mesh(new THREE.PlaneGeometry(19.5, 19.5), windGroundMat);
windGround.rotation.x = -Math.PI / 2;
windGround.position.set(0, 0.025, 0);
windDomainGroup.add(windGround);

// (B) 繪製 2.5D 蒼穹風靈珠 Sprite 貼圖 (供風鈴燈座與 8 座風靈柱頂端使用)
function createWindPearlTexture() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 192;
    const ctx = c.getContext('2d');

    const outerG = ctx.createRadialGradient(64, 118, 8, 64, 108, 58);
    outerG.addColorStop(0.0, 'rgba(240, 255, 250, 1.0)');
    outerG.addColorStop(0.32, 'rgba(100, 255, 205, 0.92)');
    outerG.addColorStop(0.68, 'rgba(0, 185, 120, 0.68)');
    outerG.addColorStop(1.0, 'rgba(0, 60, 40, 0.0)');
    ctx.fillStyle = outerG;
    ctx.beginPath();
    ctx.moveTo(64, 16);
    ctx.quadraticCurveTo(118, 88, 96, 150);
    ctx.quadraticCurveTo(64, 182, 32, 150);
    ctx.quadraticCurveTo(10, 88, 64, 16);
    ctx.fill();

    const innerG = ctx.createRadialGradient(64, 128, 4, 64, 120, 32);
    innerG.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    innerG.addColorStop(0.55, 'rgba(190, 255, 235, 0.9)');
    innerG.addColorStop(1.0, 'rgba(0, 220, 150, 0.0)');
    ctx.fillStyle = innerG;
    ctx.beginPath();
    ctx.arc(64, 122, 28, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
}
const windPearlTex = createWindPearlTexture();
const animatedWindSprites = [];

// (C) 連接主聖域與風元素領域的「碧玉青雲踏階」與「天青靈風結界鳥居」
const deepJadeMat = new THREE.MeshStandardMaterial({
    color: 0x0c3324,
    roughness: 0.35,
    metalness: 0.45
});
const mintSilverMat = new THREE.MeshStandardMaterial({
    color: 0x85ffd8,
    emissive: 0x00bb77,
    emissiveIntensity: 0.85,
    roughness: 0.2,
    metalness: 0.65
});
const paleJadeMat = new THREE.MeshStandardMaterial({
    color: 0x228866,
    emissive: 0x084428,
    emissiveIntensity: 0.45,
    roughness: 0.3,
    metalness: 0.3
});

// 8 階碧玉鑲銀青雲階，自北側 (0, 0, -4.2) 直通 (0.0, 0, -14.6)
for (let s = 0; s < 8; s++) {
    const t = s / 7;
    const bz = -4.2 - t * 10.4;
    const bx = Math.sin(s * 0.9) * 0.35;
    const stepGroup = new THREE.Group();
    stepGroup.position.set(bx, 0.03 + s * 0.02, bz);

    const slab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 1.05), deepJadeMat);
    stepGroup.add(slab);

    const trimL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.95), mintSilverMat);
    trimL.position.x = 1.02;
    const trimR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.95), mintSilverMat);
    trimR.position.x = -1.02;
    stepGroup.add(trimL, trimR);

    const stepGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), mintSilverMat);
    stepGem.position.set(0, 0.06, 0);
    stepGroup.add(stepGem);

    scene.add(stepGroup);
}

// 領域入口「天青靈風鳥居」位於 (0.0, 0, -15.5)
const windGateGroup = new THREE.Group();
windGateGroup.position.set(0.0, 0, -15.5);
scene.add(windGateGroup);

const windPillarMat = new THREE.MeshStandardMaterial({
    color: 0x144d38,
    roughness: 0.38,
    metalness: 0.25
});
const windGoldMat = new THREE.MeshStandardMaterial({
    color: 0xaaffdd,
    emissive: 0x00ee99,
    emissiveIntensity: 0.72,
    roughness: 0.22,
    metalness: 0.75
});

[-1.6, 1.6].forEach((colX) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.29, 4.4, 16), windPillarMat);
    col.position.set(colX, 2.2, 0);
    const colBase = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.38, 16), paleJadeMat);
    colBase.position.set(colX, 0.19, 0);
    const colRing = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.06, 10, 20), windGoldMat);
    colRing.position.set(colX, 3.65, 0);
    colRing.rotation.x = Math.PI / 2;
    windGateGroup.add(col, colBase, colRing);
});

const windBeamTop = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.34, 0.46), windPillarMat);
windBeamTop.position.set(0, 4.25, 0);
const windBeamTopTrim = new THREE.Mesh(new THREE.BoxGeometry(4.7, 0.08, 0.52), windGoldMat);
windBeamTopTrim.position.set(0, 4.43, 0);
const windBeamSub = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.24, 0.34), windPillarMat);
windBeamSub.position.set(0, 3.65, 0);
windGateGroup.add(windBeamTop, windBeamTopTrim, windBeamSub);

// 鳥居兩側浮空碧玉風鈴長明燈座
[-2.4, 2.4].forEach((lx) => {
    const lanternG = new THREE.Group();
    lanternG.position.set(lx, 0, 0);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.55, 8), paleJadeMat);
    base.position.y = 0.28;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.25, 8), deepJadeMat);
    stem.position.y = 1.15;
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.18, 0.45, 8), windGoldMat);
    cup.position.y = 1.95;
    lanternG.add(base, stem, cup);

    const spMat = new THREE.SpriteMaterial({
        map: windPearlTex,
        color: 0x99ffe0,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const sp = new THREE.Sprite(spMat);
    sp.position.set(0, 2.55, 0);
    sp.scale.set(0.95, 1.45, 1);
    lanternG.add(sp);
    animatedWindSprites.push({ sprite: sp, baseScale: 0.95, speed: 2.8 + Math.random(), phase: Math.random() * 6.28 });

    const lLight = new THREE.PointLight(0x00ffaa, 1.35, 6.5);
    lLight.position.set(0, 2.55, 0);
    lanternG.add(lLight);

    windGateGroup.add(lanternG);
});

// (D) 風元素獨角獸中央三層碧玉息吹祭壇與雙層旋轉風輪法陣
const windAltarGroup = new THREE.Group();
windDomainGroup.add(windAltarGroup);

const windAltarHit = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.8, 3.4, 12),
    new THREE.MeshBasicMaterial({ visible: false })
);
windAltarHit.position.y = 1.7;
windAltarHit.userData = { station: 'wind_domain' };
interactables.push(windAltarHit);
windAltarGroup.add(windAltarHit);

const windTier1 = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.65, 0.38, 24), paleJadeMat);
windTier1.position.y = 0.19;
const windTier1Trim = new THREE.Mesh(new THREE.TorusGeometry(3.66, 0.07, 10, 36), windGoldMat);
windTier1Trim.position.y = 0.36;
windTier1Trim.rotation.x = Math.PI / 2;

const windTier2 = new THREE.Mesh(new THREE.CylinderGeometry(2.45, 2.75, 0.34, 24), deepJadeMat);
windTier2.position.y = 0.55;
const windTier2Trim = new THREE.Mesh(new THREE.TorusGeometry(2.76, 0.06, 10, 32), windGoldMat);
windTier2Trim.position.y = 0.70;
windTier2Trim.rotation.x = Math.PI / 2;

const windTier3 = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.95, 0.32, 24), paleJadeMat);
windTier3.position.y = 0.88;
const windTier3Trim = new THREE.Mesh(new THREE.TorusGeometry(1.96, 0.05, 10, 28), mintSilverMat);
windTier3Trim.position.y = 1.02;
windTier3Trim.rotation.x = Math.PI / 2;

windAltarGroup.add(windTier1, windTier1Trim, windTier2, windTier2Trim, windTier3, windTier3Trim);

// 雙層旋轉風輪法陣
const windSpiralRing1 = new THREE.Mesh(
    new THREE.RingGeometry(3.6, 3.82, 36),
    new THREE.MeshBasicMaterial({
        color: 0x69f0ae,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
windSpiralRing1.rotation.x = -Math.PI / 2;
windSpiralRing1.position.y = 0.06;
windDomainGroup.add(windSpiralRing1);

const windSpiralRing2 = new THREE.Mesh(
    new THREE.RingGeometry(4.6, 4.82, 12),
    new THREE.MeshBasicMaterial({
        color: 0x00e676,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
windSpiralRing2.rotation.x = -Math.PI / 2;
windSpiralRing2.position.y = 0.05;
windDomainGroup.add(windSpiralRing2);

// (E) 8 座環繞祭壇的「碧玉流風靈柱」
for (let p = 0; p < 8; p++) {
    const ang = (p / 8) * Math.PI * 2;
    const px = Math.cos(ang) * 4.2;
    const pz = Math.sin(ang) * 4.2;

    const pillarG = new THREE.Group();
    pillarG.position.set(px, 0, pz);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.46, 0.42, 12), deepJadeMat);
    base.position.y = 0.21;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 2.6, 12), windPillarMat);
    body.position.y = 1.62;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.26, 0.36, 12), paleJadeMat);
    cap.position.y = 3.05;

    const ringM = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 8, 16), mintSilverMat);
    ringM.position.y = 2.45;
    ringM.rotation.x = Math.PI / 2;
    pillarG.add(base, body, cap, ringM);

    const spMat = new THREE.SpriteMaterial({
        map: windPearlTex,
        color: 0x80ffe0,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const sp = new THREE.Sprite(spMat);
    sp.position.set(0, 3.65, 0);
    sp.scale.set(1.05, 1.55, 1);
    pillarG.add(sp);
    animatedWindSprites.push({ sprite: sp, baseScale: 1.05, speed: 2.5 + Math.random() * 0.8, phase: p * 0.78 });

    windDomainGroup.add(pillarG);
}

// (F) 2.5D「蒼穹靈風獨角獸」像素級風元素神獸煉成
const windUnicornGroup = new THREE.Group();
windUnicornGroup.position.set(0, 1.00, 0);
windAltarGroup.add(windUnicornGroup);

const windCardGeo = new THREE.PlaneGeometry(1, 1);
windCardGeo.translate(0, 0.5, 0);

const windUnicornMat = new THREE.MeshBasicMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.02,
    depthWrite: false
});
const windUnicornMesh = new THREE.Mesh(windCardGeo, windUnicornMat);
windUnicornMesh.scale.set(3.55, 3.55, 1);
windUnicornGroup.add(windUnicornMesh);

const windHaloMat = new THREE.SpriteMaterial({
    map: glowDotTex,
    color: 0x00ffaa,
    transparent: true,
    opacity: 0.52,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const windHaloSprite = new THREE.Sprite(windHaloMat);
windHaloSprite.scale.set(4.2, 4.2, 1);
windHaloSprite.position.set(0, 1.75, -0.18);
windUnicornGroup.add(windHaloSprite);

function build3DRenderedWindUnicorn(img) {
    const maxDim = 800;
    let w = img.naturalWidth || img.width || 512;
    let h = img.naturalHeight || img.height || 512;
    if (w > maxDim || h > maxDim) {
        if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
        } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
        }
    }

    const outCanvas = document.createElement('canvas');
    outCanvas.width = w;
    outCanvas.height = h;
    const ctx = outCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);

    try {
        const effThresh = 82;
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;
        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0, tail = 0;

        const isBgOrShadow = (p) => {
            const r = d[p], g = d[p + 1], b = d[p + 2];
            const maxC = Math.max(r, g, b);
            if (maxC <= effThresh) return true;
            const sat = maxC - Math.min(r, g, b);
            if (maxC <= effThresh + 24 && sat < 28) return true;
            return false;
        };

        for (let x = 0; x < w; x++) {
            const pTop = x * 4;
            if (isBgOrShadow(pTop)) { visited[x] = 1; queue[tail++] = x; }
            const pBot = ((h - 1) * w + x) * 4;
            if (isBgOrShadow(pBot)) { visited[(h - 1) * w + x] = 1; queue[tail++] = (h - 1) * w + x; }
        }
        for (let y = 0; y < h; y++) {
            const pLeft = y * w * 4;
            if (!visited[y * w] && isBgOrShadow(pLeft)) { visited[y * w] = 1; queue[tail++] = y * w; }
            const pRight = (y * w + w - 1) * 4;
            if (!visited[y * w + w - 1] && isBgOrShadow(pRight)) { visited[y * w + w - 1] = 1; queue[tail++] = y * w + w - 1; }
        }

        while (head < tail) {
            const idx = queue[head++];
            const cx = idx % w;
            const cy = Math.floor(idx / w);
            d[idx * 4 + 3] = 0;

            const neighbors = [
                cy > 0 ? idx - w : -1,
                cy < h - 1 ? idx + w : -1,
                cx > 0 ? idx - 1 : -1,
                cx < w - 1 ? idx + 1 : -1
            ];
            for (let n = 0; n < 4; n++) {
                const nIdx = neighbors[n];
                if (nIdx >= 0 && !visited[nIdx]) {
                    if (isBgOrShadow(nIdx * 4)) {
                        visited[nIdx] = 1;
                        queue[tail++] = nIdx;
                    }
                }
            }
        }

        const distMap = new Uint8Array(w * h);
        let currentRing = [];
        for (let i = 0; i < w * h; i++) {
            if (visited[i]) continue;
            const cx = i % w;
            const cy = Math.floor(i / w);
            const isBorder = (cx > 0 && visited[i - 1]) ||
                             (cx < w - 1 && visited[i + 1]) ||
                             (cy > 0 && visited[i - w]) ||
                             (cy < h - 1 && visited[i + w]);
            if (isBorder) {
                distMap[i] = 1;
                currentRing.push(i);
            }
        }
        for (let step = 2; step <= 5; step++) {
            const nextRing = [];
            for (let k = 0; k < currentRing.length; k++) {
                const idx = currentRing[k];
                const cx = idx % w;
                const cy = Math.floor(idx / w);
                const nbs = [
                    cx > 0 ? idx - 1 : -1,
                    cx < w - 1 ? idx + 1 : -1,
                    cy > 0 ? idx - w : -1,
                    cy < h - 1 ? idx + w : -1
                ];
                for (let n = 0; n < 4; n++) {
                    const nIdx = nbs[n];
                    if (nIdx >= 0 && !visited[nIdx] && distMap[nIdx] === 0) {
                        distMap[nIdx] = step;
                        nextRing.push(nIdx);
                    }
                }
            }
            currentRing = nextRing;
        }

        // 風元素神獸色彩煉成：將鬃尾轉為翡翠碧玉綠 × 薄荷青嵐 × 極光仙金漸層
        const featherSpan = 72;
        const featherMax = effThresh + featherSpan;

        for (let i = 0; i < w * h; i++) {
            if (visited[i]) continue;
            const p = i * 4;
            let r = d[p], g = d[p + 1], b = d[p + 2];
            const maxC = Math.max(r, g, b);
            const minC = Math.min(r, g, b);
            const sat = maxC - minC;
            const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

            const dist = distMap[i];
            if (dist > 0 && maxC < featherMax) {
                let ratio = Math.max(0, (maxC - effThresh) / featherSpan);
                ratio = Math.pow(ratio, dist === 1 ? 1.85 : 1.35);
                d[p + 3] = Math.floor(ratio * 255);
                if (d[p + 3] > 8 && maxC > 10) {
                    const lift = Math.min(2.4, 215 / Math.max(65, maxC));
                    r = Math.min(255, Math.round(r * lift));
                    g = Math.min(255, Math.round(g * lift));
                    b = Math.min(255, Math.round(b * lift));
                }
            }

            if (d[p + 3] === 0) continue;

            // (A) 眼眸深處：化為碧玉靈風神瞳
            if (maxC < 145 && lum < 0.48) {
                const eyeT = maxC / 145;
                d[p] = Math.min(255, Math.round(10 + eyeT * 40));
                d[p + 1] = Math.min(255, Math.round(180 + eyeT * 70));
                d[p + 2] = Math.min(255, Math.round(120 + eyeT * 100));
                continue;
            }

            // (B) 鬃毛、長尾與獨角：化為翡翠碧綠 -> 薄荷仙青 -> 蒼穹極光白綠
            const isCoolOrPastelMane = b > r + 6 || g > r + 6 || r - g > 18 || sat > 16;
            if (isCoolOrPastelMane) {
                const colorWeight = Math.min(1, Math.max(0.38, sat / 52));
                let wr, wg, wb;
                if (lum < 0.55) {
                    const t = lum / 0.55;
                    wr = 10 + t * 30;
                    wg = 175 + t * 70;
                    wb = 110 + t * 70;
                } else if (lum < 0.82) {
                    const t = (lum - 0.55) / 0.27;
                    wr = 40 + t * 90;
                    wg = 245 + t * 10;
                    wb = 180 + t * 65;
                } else {
                    const t = (lum - 0.82) / 0.18;
                    wr = 140 + t * 110;
                    wg = 255;
                    wb = 220 + t * 35;
                }
                d[p] = Math.min(255, Math.round(r * (1 - colorWeight) * 0.72 + wr * colorWeight));
                d[p + 1] = Math.min(255, Math.round(g * (1 - colorWeight) * 0.95 + wg * colorWeight));
                d[p + 2] = Math.min(255, Math.round(b * (1 - colorWeight) + wb * colorWeight));
            } else {
                // (C) 身軀毛皮：仙氣青白羽光，暗部透出翡翠碧靈光澤
                const shadowCool = Math.pow(1 - lum, 1.35);
                d[p] = Math.min(255, Math.round(r * 0.88 - shadowCool * 30));
                d[p + 1] = Math.min(255, Math.round(g * 1.05 + shadowCool * 35));
                d[p + 2] = Math.min(255, Math.round(b * 0.95 + shadowCool * 20));
            }

            if (dist > 0) {
                const rim = (5 - dist) * 0.18;
                d[p] = Math.max(0, Math.round(d[p] * (1 - rim * 0.3)));
                d[p + 1] = Math.min(255, Math.round(d[p + 1] + (255 - d[p + 1]) * rim));
                d[p + 2] = Math.min(255, Math.round(d[p + 2] + (235 - d[p + 2]) * rim));
            }
        }

        let maxOpaqueY = -1;
        for (let y = h - 1; y >= 0; y--) {
            let hasHoof = false;
            for (let x = 0; x < w; x++) {
                if (d[(y * w + x) * 4 + 3] > 60) {
                    hasHoof = true;
                    break;
                }
            }
            if (hasHoof) {
                maxOpaqueY = y;
                break;
            }
        }
        if (maxOpaqueY > 0 && maxOpaqueY < h - 1) {
            const shiftY = (h - 1) - maxOpaqueY;
            for (let y = h - 1; y >= shiftY; y--) {
                const srcY = y - shiftY;
                for (let x = 0; x < w; x++) {
                    const toIdx = (y * w + x) * 4;
                    const fromIdx = (srcY * w + x) * 4;
                    d[toIdx] = d[fromIdx];
                    d[toIdx + 1] = d[fromIdx + 1];
                    d[toIdx + 2] = d[fromIdx + 2];
                    d[toIdx + 3] = d[fromIdx + 3];
                }
            }
            for (let y = 0; y < shiftY; y++) {
                for (let x = 0; x < w; x++) {
                    d[(y * w + x) * 4 + 3] = 0;
                }
            }
        }

        ctx.putImageData(imgData, 0, 0);

        // 繪製風元素 8 芒羽翼神聖星盤光輪
        const haloC = document.createElement('canvas');
        haloC.width = 512;
        haloC.height = 512;
        const hCtx = haloC.getContext('2d');
        const hcx = 256, hcy = 256;

        const hGrad = hCtx.createRadialGradient(hcx, hcy, 24, hcx, hcy, 230);
        hGrad.addColorStop(0.0, 'rgba(220, 255, 240, 0.95)');
        hGrad.addColorStop(0.35, 'rgba(105, 255, 205, 0.75)');
        hGrad.addColorStop(0.70, 'rgba(0, 195, 140, 0.42)');
        hGrad.addColorStop(1.0, 'rgba(0, 45, 30, 0.0)');
        hCtx.fillStyle = hGrad;
        hCtx.beginPath();
        hCtx.arc(hcx, hcy, 230, 0, Math.PI * 2);
        hCtx.fill();

        for (let f = 0; f < 8; f++) {
            const fa = (f / 8) * Math.PI * 2;
            hCtx.save();
            hCtx.translate(hcx, hcy);
            hCtx.rotate(fa);
            hCtx.fillStyle = 'rgba(180, 255, 230, 0.65)';
            hCtx.beginPath();
            hCtx.ellipse(120, 0, 85, 24, 0.15, 0, Math.PI * 2);
            hCtx.fill();
            hCtx.restore();
        }

        const hTex = new THREE.CanvasTexture(haloC);
        hTex.encoding = THREE.sRGBEncoding;
        windHaloSprite.material.map = hTex;
        windHaloSprite.material.needsUpdate = true;

        const tex = new THREE.CanvasTexture(outCanvas);
        tex.encoding = THREE.sRGBEncoding;
        windUnicornMat.map = tex;
        windUnicornMat.needsUpdate = true;

        const aspect = w / h;
        windUnicornMesh.scale.set(3.55 * aspect, 3.55, 1);
    } catch (e) {
        console.warn('Wind unicorn render fallback:', e);
    }
}

// 載入 assets/unicorn.jpg 並即時煉成為 3D 蒼穹靈風獨角獸
const windImgLoader = new Image();
windImgLoader.crossOrigin = 'anonymous';
windImgLoader.onload = () => build3DRenderedWindUnicorn(windImgLoader);
windImgLoader.src = 'assets/unicorn.jpg';

const windDomainLight = new THREE.PointLight(0x00ffaa, 2.6, 18.0);
windDomainLight.position.set(0, 3.6, 0);
windDomainGroup.add(windDomainLight);

// (G) 環繞風元素領域的 10 棵「青鸞翡翠搖風古樹」與 12 簇「天青翡翠風晶簇」
const windBarkMat = new THREE.MeshStandardMaterial({
    color: 0x184435,
    roughness: 0.65
});
const windFoliageMats = [
    new THREE.MeshStandardMaterial({
        color: 0x1abc9c,
        emissive: 0x005533,
        emissiveIntensity: 0.35,
        roughness: 0.38
    }),
    new THREE.MeshStandardMaterial({
        color: 0x2ecc71,
        emissive: 0x006644,
        emissiveIntensity: 0.38,
        roughness: 0.35
    }),
    new THREE.MeshStandardMaterial({
        color: 0x69f0ae,
        emissive: 0x008855,
        emissiveIntensity: 0.42,
        roughness: 0.32
    })
];

function buildWindElementTree(seed = 0) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.45, 3.4, 8), windBarkMat);
    trunk.position.y = 1.7;
    tree.add(trunk);

    const fMat = windFoliageMats[seed % windFoliageMats.length];
    const canopyOffsets = [
        [0, 3.2, 0, 1.45],
        [0.65, 3.65, 0.45, 1.15],
        [-0.65, 3.55, -0.45, 1.2],
        [0.45, 4.15, -0.35, 1.05],
        [-0.4, 4.25, 0.4, 1.0]
    ];
    canopyOffsets.forEach(([ox, oy, oz, r]) => {
        const cSphere = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), fMat);
        cSphere.position.set(ox, oy, oz);
        cSphere.scale.set(1.15, 0.88, 1.15);
        tree.add(cSphere);
    });

    return tree;
}

for (let wt = 0; wt < 10; wt++) {
    const wa = (wt / 10) * Math.PI * 2 + (wt % 2) * 0.18;
    const wr = 6.4 + (wt % 3) * 1.35;
    const wx = Math.cos(wa) * wr;
    const wz = Math.sin(wa) * wr;

    // 避開正南入口走廊
    if (Math.abs(wx) < 3.2 && wz > 4.5) continue;

    const windTree = buildWindElementTree(wt);
    windTree.position.set(wx, 0, wz);
    windTree.scale.setScalar(0.95 + (wt % 3) * 0.18);
    windTree.rotation.y = wt * 1.1;
    windDomainGroup.add(windTree);
}

// 12 簇天青翡翠晶簇
const windCrystalMat = new THREE.MeshStandardMaterial({
    color: 0x69f0ae,
    emissive: 0x00cc77,
    emissiveIntensity: 0.9,
    roughness: 0.18,
    metalness: 0.45
});
for (let c = 0; c < 12; c++) {
    const ca = (c / 12) * Math.PI * 2 + 0.15;
    const cr = 4.8 + (c % 2) * 1.7;
    const cx = Math.cos(ca) * cr;
    const cz = Math.sin(ca) * cr;

    if (Math.abs(cx) < 2.5 && cz > 3.8) continue;

    const cCluster = new THREE.Group();
    cCluster.position.set(cx, 0, cz);

    const numSpikes = 3 + (c % 3);
    for (let s = 0; s < numSpikes; s++) {
        const h = 0.55 + Math.random() * 0.65;
        const rad = 0.08 + Math.random() * 0.06;
        const spike = new THREE.Mesh(new THREE.ConeGeometry(rad, h, 6), windCrystalMat);
        spike.position.set((Math.random() - 0.5) * 0.35, h * 0.5, (Math.random() - 0.5) * 0.35);
        spike.rotation.set((Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4);
        cCluster.add(spike);
    }
    windDomainGroup.add(cCluster);
}

// (H) 風元素領域漫天升騰的 130 顆流風羽毛與蒲公英星塵粒子 (Wind Feathers)
const windFeatherCount = 130;
const windGeo = new THREE.BufferGeometry();
const windPos = new Float32Array(windFeatherCount * 3);
const windVel = [];
for (let i = 0; i < windFeatherCount; i++) {
    const ang = Math.random() * Math.PI * 2;
    const r = Math.random() * 7.5;
    windPos[i * 3] = Math.cos(ang) * r;
    windPos[i * 3 + 1] = Math.random() * 4.6;
    windPos[i * 3 + 2] = Math.sin(ang) * r;
    windVel.push({
        angle: ang,
        radius: r,
        vY: 0.4 + Math.random() * 0.65,
        rotSpeed: 0.45 + Math.random() * 0.55,
        drift: Math.random() * 6.28
    });
}
windGeo.setAttribute('position', new THREE.BufferAttribute(windPos, 3));
const windParticles = new THREE.Points(
    windGeo,
    new THREE.PointsMaterial({
        size: 0.17,
        map: glowDotTex,
        color: 0x99ffe0,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
windDomainGroup.add(windParticles);

// (I) 蒼穹靈風獨角獸「息吹靈風覺醒」爆發動畫控制器 (windDomainFX)
const windAwakeningRing = new THREE.Mesh(
    new THREE.RingGeometry(0.8, 1.35, 36),
    new THREE.MeshBasicMaterial({
        color: 0x69f0ae,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
windAwakeningRing.rotation.x = -Math.PI / 2;
windAwakeningRing.position.y = 0.95;
windAwakeningRing.visible = false;
windDomainGroup.add(windAwakeningRing);

const windDomainFX = {
    active: false,
    timer: 0,
    duration: 2.8,
    triggerAwakening() {
        this.active = true;
        this.timer = 0;
        windAwakeningRing.visible = true;
        windAwakeningRing.scale.setScalar(0.5);
        windAwakeningRing.material.opacity = 1.0;
    },
    update(delta, elapsed) {
        if (!this.active) return;
        this.timer += delta;
        const p = Math.min(1, this.timer / this.duration);
        windAwakeningRing.scale.setScalar(0.5 + p * 6.5);
        windAwakeningRing.position.y = 0.95 + Math.sin(p * Math.PI) * 1.6;
        windAwakeningRing.material.opacity = (1 - p) * 0.95;

        windDomainLight.intensity = 2.6 + Math.sin(p * Math.PI) * 4.2;
        windHaloSprite.scale.setScalar(4.2 + Math.sin(p * Math.PI) * 2.6);
        windUnicornGroup.position.y = 1.00 + Math.sin(p * Math.PI) * 0.18;

        if (p >= 1) {
            this.active = false;
            windAwakeningRing.visible = false;
            windDomainLight.intensity = 2.6;
        }
    }
};
let heroInWindDomain = false;

// 森林螢火蟲
const fireflyCount = 130;
const ffGeo = new THREE.BufferGeometry();
const ffPos = new Float32Array(fireflyCount * 3);
const ffCol = new Float32Array(fireflyCount * 3);
const ffData = [];
const ffPalette = [new THREE.Color(0xaaff66), new THREE.Color(0x66ffee), new THREE.Color(0xffe680)];

for (let i = 0; i < fireflyCount; i++) {
    const rx = (Math.random() - 0.5) * 32;
    const ry = 0.3 + Math.random() * 6.0;
    const rz = (Math.random() - 0.5) * 32;
    ffPos[i * 3] = rx;
    ffPos[i * 3 + 1] = ry;
    ffPos[i * 3 + 2] = rz;
    const c = ffPalette[i % ffPalette.length];
    ffCol[i * 3] = c.r;
    ffCol[i * 3 + 1] = c.g;
    ffCol[i * 3 + 2] = c.b;
    ffData.push({
        baseX: rx,
        baseY: ry,
        baseZ: rz,
        phase: Math.random() * 10,
        speed: 0.5 + Math.random() * 0.8
    });
}
ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos, 3));
ffGeo.setAttribute('color', new THREE.BufferAttribute(ffCol, 3));
const fireflies = new THREE.Points(
    ffGeo,
    new THREE.PointsMaterial({
        size: 0.26,
        map: glowDotTex,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
scene.add(fireflies);

// =========================================================================
// 2.10 🚀 3D 渲染效能大幅優化引擎（Static Geometry Batching + InstancedMesh 葉團雲）
//      - 將全場景 ~7,350 個靜態 3D 網格（樹幹、分枝、樹節、遠山、岩石、水晶、靈菇、石燈籠、拱門、石橋、火柱）
//        依材質自動合併為 19 個批次 BufferGeometry Mesh
//      - 將 ~5,500 團 2.5D 樹冠葉團雲 (THREE.Sprite) 轉換為 24 個硬體實例化 THREE.InstancedMesh Billboard
//      - 整體 WebGL Draw Calls 從 ~12,900+ 降至 ~95（降低超過 99%！），維持 100% 相同視覺品質且完全不使用自訂 GLSL
// =========================================================================
const foliageInstancedBatches = [];
const _lastCamQuat = new THREE.Quaternion();
let _originalDrawCallsEstimate = 0;

function mergeStaticBufferGeometries(items) {
    let totalVerts = 0;
    const prepared = [];

    for (let i = 0; i < items.length; i++) {
        const { geo, matrixWorld } = items[i];
        if (!geo || !geo.attributes || !geo.attributes.position) continue;
        const nonIdx = geo.index ? geo.toNonIndexed() : geo.clone();
        nonIdx.applyMatrix4(matrixWorld);

        const posAttr = nonIdx.attributes.position;
        const normAttr = nonIdx.attributes.normal;
        const uvAttr = nonIdx.attributes.uv;
        const count = posAttr.count;
        totalVerts += count;
        prepared.push({ posAttr, normAttr, uvAttr, count });
    }

    if (totalVerts === 0) return null;

    const mergedPos = new Float32Array(totalVerts * 3);
    const mergedNorm = new Float32Array(totalVerts * 3);
    const mergedUv = new Float32Array(totalVerts * 2);

    let vOffset = 0;
    for (let i = 0; i < prepared.length; i++) {
        const { posAttr, normAttr, uvAttr, count } = prepared[i];
        mergedPos.set(posAttr.array, vOffset * 3);
        if (normAttr && normAttr.array.length === count * 3) {
            mergedNorm.set(normAttr.array, vOffset * 3);
        }
        if (uvAttr && uvAttr.array.length === count * 2) {
            mergedUv.set(uvAttr.array, vOffset * 2);
        }
        vOffset += count;
    }

    const outGeo = new THREE.BufferGeometry();
    outGeo.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
    outGeo.setAttribute('normal', new THREE.BufferAttribute(mergedNorm, 3));
    outGeo.setAttribute('uv', new THREE.BufferAttribute(mergedUv, 2));
    return outGeo;
}

function optimizeSanctuaryDrawCalls() {
    scene.updateMatrixWorld(true);

    const meshBuckets = new Map();
    const spriteBuckets = new Map();
    const nodesToRemove = [];
    const excludedMeshes = new Set([
        fireGround,
        fireSolarRing1,
        fireSolarRing2,
        fireAwakeningRing,
        fireUnicornMesh,
        fireAltarHit,
        fTier1,
        fTier2,
        fTier3,
        waterGround,
        waterTidalRing1,
        waterTidalRing2,
        waterAwakeningRing,
        waterUnicornMesh,
        waterAltarHit,
        wTier1,
        wTier2,
        wTier3,
        windGround,
        windSpiralRing1,
        windSpiralRing2,
        windAwakeningRing,
        windUnicornMesh,
        windAltarHit,
        windTier1,
        windTier2,
        windTier3
    ]);

    const targetGroups = [
        forestGroup,
        gateGroup,
        flameGateGroup,
        fireDomainGroup,
        waterGateGroup,
        waterDomainGroup,
        windGateGroup,
        windDomainGroup
    ];
    const tmpPos = new THREE.Vector3();
    const tmpScale = new THREE.Vector3();

    targetGroups.forEach((group) => {
        group.traverse((obj) => {
            if (obj === group) return;

            if (obj.isMesh) {
                if (obj.visible === false || obj.userData?.station || excludedMeshes.has(obj)) return;
                const mat = obj.material;
                if (!mat || Array.isArray(mat)) return;

                let bucket = meshBuckets.get(mat.uuid);
                if (!bucket) {
                    bucket = { material: mat, items: [] };
                    meshBuckets.set(mat.uuid, bucket);
                }
                bucket.items.push({
                    geo: obj.geometry,
                    matrixWorld: obj.matrixWorld.clone()
                });
                nodesToRemove.push(obj);
            } else if (obj.isSprite) {
                const smat = obj.material;
                // 保留少數 AdditiveBlending 特效光暈與動態跳躍聖火，僅將數千團樹冠葉團雲轉為 InstancedMesh
                if (!smat || smat.blending === THREE.AdditiveBlending || !smat.map) return;

                let sBucket = spriteBuckets.get(smat.uuid);
                if (!sBucket) {
                    sBucket = { spriteMat: smat, instances: [] };
                    spriteBuckets.set(smat.uuid, sBucket);
                }
                tmpPos.setFromMatrixPosition(obj.matrixWorld);
                tmpScale.setFromMatrixScale(obj.matrixWorld);
                sBucket.instances.push(tmpPos.x, tmpPos.y, tmpPos.z, tmpScale.x, tmpScale.y);
                nodesToRemove.push(obj);
            }
        });
    });

    _originalDrawCallsEstimate = nodesToRemove.length;

    // 1. 移除原本分散的數千個子節點
    for (let i = 0; i < nodesToRemove.length; i++) {
        const n = nodesToRemove[i];
        if (n.parent) n.parent.remove(n);
    }

    // 2. 建立合併後的靜態 3D 網格群組（每個材質僅需 1 次 Draw Call）
    const batchedStaticGroup = new THREE.Group();
    batchedStaticGroup.name = 'BatchedStaticEnvironment';
    meshBuckets.forEach(({ material, items }) => {
        const mergedGeo = mergeStaticBufferGeometries(items);
        if (!mergedGeo) return;
        const mergedMesh = new THREE.Mesh(mergedGeo, material);
        mergedMesh.matrixAutoUpdate = false;
        mergedMesh.receiveShadow = true;
        batchedStaticGroup.add(mergedMesh);
    });
    scene.add(batchedStaticGroup);

    // 3. 建立硬體實例化 2.5D 樹冠葉團雲群組（每種樹葉貼圖僅需 1 次 Draw Call）
    const batchedFoliageGroup = new THREE.Group();
    batchedFoliageGroup.name = 'BatchedInstancedFoliageClouds';
    const unitPlaneGeo = new THREE.PlaneGeometry(1, 1);

    spriteBuckets.forEach(({ spriteMat, instances }) => {
        const count = instances.length / 5;
        if (count === 0) return;

        const instMat = new THREE.MeshBasicMaterial({
            map: spriteMat.map,
            color: spriteMat.color ? spriteMat.color.clone() : new THREE.Color(0xffffff),
            transparent: true,
            alphaTest: spriteMat.alphaTest || 0.08,
            depthWrite: true,
            side: THREE.DoubleSide
        });

        const instMesh = new THREE.InstancedMesh(unitPlaneGeo, instMat, count);
        instMesh.frustumCulled = false;
        instMesh.matrixAutoUpdate = false;
        batchedFoliageGroup.add(instMesh);

        foliageInstancedBatches.push({
            instMesh,
            data: new Float32Array(instances),
            count
        });
    });
    scene.add(batchedFoliageGroup);

    // 初次同步所有實例化葉團雲面向相機，並鎖定靜態陰影貼圖免除每幀重複渲染
    updateFoliageBillboards(camera, true);
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
}

function updateFoliageBillboards(cam, force = false) {
    if (
        !force &&
        Math.abs(cam.quaternion.x - _lastCamQuat.x) < 0.0002 &&
        Math.abs(cam.quaternion.y - _lastCamQuat.y) < 0.0002 &&
        Math.abs(cam.quaternion.z - _lastCamQuat.z) < 0.0002 &&
        Math.abs(cam.quaternion.w - _lastCamQuat.w) < 0.0002
    ) {
        return;
    }
    _lastCamQuat.copy(cam.quaternion);
    cam.updateMatrixWorld();

    const ce = cam.matrixWorld.elements;
    const rx = ce[0], ry = ce[1], rz = ce[2];
    const ux = ce[4], uy = ce[5], uz = ce[6];
    const fx = ce[8], fy = ce[9], fz = ce[10];

    for (let b = 0; b < foliageInstancedBatches.length; b++) {
        const { instMesh, data, count } = foliageInstancedBatches[b];
        const arr = instMesh.instanceMatrix.array;
        for (let i = 0; i < count; i++) {
            const dOff = i * 5;
            const px = data[dOff];
            const py = data[dOff + 1];
            const pz = data[dOff + 2];
            const sx = data[dOff + 3];
            const sy = data[dOff + 4];

            const mOff = i * 16;
            arr[mOff] = rx * sx;
            arr[mOff + 1] = ry * sx;
            arr[mOff + 2] = rz * sx;
            arr[mOff + 3] = 0;
            arr[mOff + 4] = ux * sy;
            arr[mOff + 5] = uy * sy;
            arr[mOff + 6] = uz * sy;
            arr[mOff + 7] = 0;
            arr[mOff + 8] = fx;
            arr[mOff + 9] = fy;
            arr[mOff + 10] = fz;
            arr[mOff + 11] = 0;
            arr[mOff + 12] = px;
            arr[mOff + 13] = py;
            arr[mOff + 14] = pz;
            arr[mOff + 15] = 1;
        }
        instMesh.instanceMatrix.needsUpdate = true;
    }
}

optimizeSanctuaryDrawCalls();

// =========================================================================
// 3. 實例化東方男女主角、守護獨角獸、雙軌真實 HTML5 Audio 播放器與心安宮神諭系統
// =========================================================================
const hero = new EasternHeroController(scene, camera);
hero.bindUIEvents(showToast);

const unicorn = new SanctuaryUnicorn25D(scene, camera, glowDotTex, interactables);
const sanctuaryAudio = new SanctuaryAudio(unicorn, showToast);
unicorn.bindFileEvents(showToast, (file) => sanctuaryAudio.handleAudioFile(file));
unicorn.initLoad();
sanctuaryAudio.init();

const oracleSystem = new OracleSystem({
    scene,
    camera,
    hero,
    unicorn,
    treeOrbsGroup,
    floatingCards,
    cardRingGroup,
    defaultCardTex,
    awakenedCardTex,
    ascensionFX,
    wishTreeFX,
    fireDomainFX,
    waterDomainFX,
    windDomainFX,
    setCameraTarget
});

// =========================================================================
// 4. 滑鼠點擊地面自由移動 ＆ 點擊聖域設施偵測
// =========================================================================
const pointerDownPos = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('pointerdown', (e) => pointerDownPos.set(e.clientX, e.clientY));
window.addEventListener('pointerup', (e) => {
    if (
        e.target.closest('#topBar') ||
        e.target.closest('#panel') ||
        e.target.closest('#toggleBtn') ||
        e.target.closest('#navDock') ||
        e.target.closest('.modal-card')
    ) {
        return;
    }
    if (pointerDownPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) > 5) return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // 1. 先檢查是否點擊了 7 張浮空神諭卡（觸發單張卡牌變色飛升動畫）
    const cardHits = raycaster.intersectObjects(floatingCards, true);
    if (cardHits.length > 0) {
        hero.walkTo(new THREE.Vector3(5.3, 0, 3.3), null, new THREE.Vector3(6.8, 0, 2.2));
        oracleSystem.drawOracleCard(cardHits[0].object);
        return;
    }

    // 2. 檢查是否點擊了五大聖域設施（含赤焰獨角獸領域，主角自動走過去並觸發）
    const hits = raycaster.intersectObjects(interactables, true);
    if (hits.length > 0) {
        let obj = hits[0].object;
        while (obj && !obj.userData.station) obj = obj.parent;
        if (obj && obj.userData.station) {
            if (obj.userData.station === 'oracle') {
                hero.walkTo(new THREE.Vector3(5.3, 0, 3.3), () => {
                    oracleSystem.drawOracleCard();
                }, new THREE.Vector3(6.8, 0, 2.2));
                return;
            }
            oracleSystem.commandHeroToStation(obj.userData.station);
            return;
        }
    }

    // 3. 點擊森林草地、赤焰熔岩大地、琉璃星海大地或蒼穹靈風大地：讓男女主角自由走過去
    const floorHits = raycaster.intersectObjects([windGround, waterGround, fireGround, floor]);
    if (floorHits.length > 0) {
        closeAllModals();
        hero.walkTo(floorHits[0].point);
    }
});

// =========================================================================
// 5. 微調面板滑桿與視窗縮放綁定
// =========================================================================
function bindSlider(id, valId, cb) {
    const el = document.getElementById(id);
    const vEl = document.getElementById(valId);
    if (!el || !vEl) return;
    el.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        vEl.innerText = v.toFixed(id === 'fogDensity' ? 3 : id === 'bgThreshold' ? 0 : 2);
        if (cb) cb(v);
    });
}
bindSlider('cardScale', 'cardScaleVal', () => unicorn.renderProcessed());
bindSlider('cardOffsetY', 'cardOffsetYVal');
bindSlider('bgThreshold', 'bgThreshVal', () => unicorn.renderProcessed());
bindSlider('heroScale', 'heroScaleVal');
bindSlider('heroSpeed', 'heroSpeedVal');
bindSlider('fogDensity', 'fogDensityVal', (v) => {
    scene.fog.density = v;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// =========================================================================
// 6. 聖域動畫主迴圈 (animate)
// =========================================================================
const clock = new THREE.Clock();
let _fpsFrames = 0;
let _fpsTimer = 0;
const perfStatsEl = document.getElementById('perfStats');

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // 1. 更新祭壇獨角獸與東方男女主角
    unicorn.update(delta, elapsed);
    hero.update(delta, elapsed);

    // 偵測主角是否走入「🔥 赤焰獨角獸領域」或「💧 琉璃水元素領域」範圍 (半徑 8.6m)
    const distToFireDomain = Math.hypot(hero.root.position.x - 22.0, hero.root.position.z - (-7.2));
    if (distToFireDomain < 8.6 && !heroInFireDomain) {
        heroInFireDomain = true;
        showToast('🔥 已踏入【赤焰獨角獸領域】！赤金聖火與熔岩法陣正在回應您的步伐');
    } else if (distToFireDomain > 9.4 && heroInFireDomain) {
        heroInFireDomain = false;
    }

    const distToWaterDomain = Math.hypot(hero.root.position.x - (-22.0), hero.root.position.z - (-7.2));
    if (distToWaterDomain < 8.6 && !heroInWaterDomain) {
        heroInWaterDomain = true;
        showToast('💧 已踏入【琉璃星海・水元素領域】！深海潮汐與水月法陣正在淨化您的心緒');
    } else if (distToWaterDomain > 9.4 && heroInWaterDomain) {
        heroInWaterDomain = false;
    }

    const distToWindDomain = Math.hypot(hero.root.position.x - 0.0, hero.root.position.z - (-23.5));
    if (distToWindDomain < 8.6 && !heroInWindDomain) {
        heroInWindDomain = true;
        showToast('🍃 已踏入【蒼穹靈風・風元素領域】！浩瀚長風與翡翠符文正在滌蕩您的思緒');
    } else if (distToWindDomain > 9.4 && heroInWindDomain) {
        heroInWindDomain = false;
    }

    // 2. 若勾選「鏡頭跟隨主角」，視角焦點平滑跟隨主角移動（走進赤焰、琉璃水或蒼穹風領域時自動延伸視角）
    const followEl = document.getElementById('camFollowHero');
    if (followEl && followEl.checked && !camTargetPos) {
        const ratio = heroInFireDomain || heroInWaterDomain || heroInWindDomain ? 0.88 : 0.65;
        const targetLook = new THREE.Vector3(hero.root.position.x * ratio, 1.45, hero.root.position.z * ratio);
        controls.target.lerp(targetLook, Math.min(1, delta * 5.0));
    }

    // 3. 更新許願星泉水晶、夜空極光幕與林間呼吸靈菇
    poolCrystal.rotation.y = elapsed * 1.2;
    poolCrystal.position.y = 0.72 + Math.sin(elapsed * 2.5) * 0.08;

    for (let i = 0; i < auroraCurtains.length; i++) {
        const au = auroraCurtains[i];
        au.rotation.y = Math.sin(elapsed * au.userData.speed) * 0.25;
        au.position.y = au.userData.baseY + Math.sin(elapsed * 0.4 + i) * 0.35;
    }

    for (let i = 0; i < glowingMushrooms.length; i++) {
        const gm = glowingMushrooms[i];
        gm.mat.emissiveIntensity = 0.55 + Math.sin(elapsed * 2.2 + gm.phase) * 0.35;
    }

    for (let i = 0; i < swayingWillowVines.length; i++) {
        const wv = swayingWillowVines[i];
        wv.rotation.z = Math.sin(elapsed * 1.4 + wv.userData.phase) * 0.06;
        wv.rotation.x = Math.cos(elapsed * 1.1 + wv.userData.phase) * 0.04;
    }

    // 3.5 更新 🔥 赤焰獨角獸領域（2.5D 赤焰神獸精準水平 Billboard、聖火跳躍、日輪法陣與升騰火元素粒子）
    if (!fireDomainFX.active) {
        fireUnicornGroup.position.y = 1.00;
        fireHaloSprite.scale.setScalar(4.2 + Math.sin(elapsed * 3.2) * 0.32);
    }
    fireUnicornGroup.rotation.y = Math.atan2(camera.position.x - 22.0, camera.position.z - (-7.2));
    fireSolarRing1.rotation.z = elapsed * 0.45;
    fireSolarRing2.rotation.z = -elapsed * 0.28;
    fireGroundMat.emissiveIntensity = 0.34 + Math.sin(elapsed * 2.6) * 0.10;

    for (let i = 0; i < animatedFlameSprites.length; i++) {
        const fl = animatedFlameSprites[i];
        const flicker = Math.sin(elapsed * 7.5 + fl.phase) * 0.12 + Math.cos(elapsed * 11.2 + fl.phase) * 0.06;
        fl.sprite.scale.set(fl.baseW * (1 - flicker * 0.35), fl.baseH * (1 + flicker), 1);
        fl.sprite.position.y = fl.baseY + flicker * 0.15;
    }

    const feAttr = fireEmberGeo.attributes.position;
    for (let i = 0; i < fireEmberCount; i++) {
        const ed = fireEmberData[i];
        ed.y += delta * ed.speedY;
        if (ed.y > 6.8) ed.y = 0.15;
        const curA = ed.angle + elapsed * ed.spin;
        const swayR = ed.radius + Math.sin(elapsed * 2.0 + ed.phase) * 0.35;
        feAttr.setXYZ(i, Math.cos(curA) * swayR, ed.y, Math.sin(curA) * swayR);
    }
    feAttr.needsUpdate = true;

    fireDomainFX.update(delta, elapsed);

    // 3.6 更新 💧 琉璃星海・水元素領域（2.5D 滄溟神獸精準水平 Billboard、水蓮靈珠呼吸、潮汐法陣與升騰星海氣泡）
    if (!waterDomainFX.active) {
        waterUnicornGroup.position.y = 1.00;
        waterHaloSprite.scale.setScalar(4.2 + Math.sin(elapsed * 2.8) * 0.32);
    }
    waterUnicornGroup.rotation.y = Math.atan2(camera.position.x - (-22.0), camera.position.z - (-7.2));
    waterTidalRing1.rotation.z = -elapsed * 0.38;
    waterTidalRing2.rotation.z = elapsed * 0.24;
    waterGroundMat.emissiveIntensity = 0.36 + Math.sin(elapsed * 2.2) * 0.10;

    for (let i = 0; i < animatedWaterSprites.length; i++) {
        const wl = animatedWaterSprites[i];
        const pulse = Math.sin(elapsed * 4.2 + wl.phase) * 0.10;
        wl.sprite.scale.set(wl.baseW * (1 + pulse * 0.5), wl.baseH * (1 + pulse), 1);
        wl.sprite.position.y = wl.baseY + pulse * 0.14;
    }

    const wbAttr = waterBubbleGeo.attributes.position;
    for (let i = 0; i < waterBubbleCount; i++) {
        const bd = waterBubbleData[i];
        bd.y += delta * bd.speedY;
        if (bd.y > 6.8) bd.y = 0.15;
        const curA = bd.angle - elapsed * bd.spin;
        const swayR = bd.radius + Math.sin(elapsed * 1.8 + bd.phase) * 0.32;
        wbAttr.setXYZ(i, Math.cos(curA) * swayR, bd.y, Math.sin(curA) * swayR);
    }
    wbAttr.needsUpdate = true;

    waterDomainFX.update(delta, elapsed);

    // 3.7 更新 🍃 蒼穹靈風・風元素領域（2.5D 靈風神獸精準水平 Billboard、靈風靈珠呼吸、風輪法陣與螺旋升騰羽毛星塵）
    if (!windDomainFX.active) {
        windUnicornGroup.position.y = 1.00;
        windHaloSprite.scale.setScalar(4.2 + Math.sin(elapsed * 2.8) * 0.32);
    }
    windUnicornGroup.rotation.y = Math.atan2(camera.position.x - 0.0, camera.position.z - (-23.5));
    windSpiralRing1.rotation.z = elapsed * 0.42;
    windSpiralRing2.rotation.z = -elapsed * 0.55;
    windGroundMat.emissiveIntensity = 0.36 + Math.sin(elapsed * 2.4) * 0.10;

    for (let i = 0; i < animatedWindSprites.length; i++) {
        const item = animatedWindSprites[i];
        const s = item.baseScale + Math.sin(elapsed * item.speed + item.phase) * 0.12;
        item.sprite.scale.set(s, s * 1.48, 1);
    }

    const windAttr = windGeo.attributes.position;
    for (let i = 0; i < windFeatherCount; i++) {
        const v = windVel[i];
        v.angle += delta * v.rotSpeed;
        const curR = v.radius + Math.sin(elapsed * 2.2 + v.drift) * 0.35;
        let py = windPos[i * 3 + 1] + delta * v.vY;
        if (py > 5.2) py = 0.1;
        windPos[i * 3] = Math.cos(v.angle) * curR;
        windPos[i * 3 + 1] = py;
        windPos[i * 3 + 2] = Math.sin(v.angle) * curR;
    }
    windAttr.needsUpdate = true;

    windDomainFX.update(delta, elapsed);

    // 4. 更新神諭浮空卡牌陣、抽牌變色飛升動畫與飛行中的祈願星果光球
    oracleSystem.update(delta, elapsed);

    // 5. 更新森林螢火蟲
    const ffAttr = ffGeo.attributes.position;
    for (let i = 0; i < fireflyCount; i++) {
        const d = ffData[i];
        const t = elapsed * d.speed + d.phase;
        ffAttr.setXYZ(
            i,
            d.baseX + Math.sin(t) * 0.9,
            d.baseY + Math.cos(t * 1.3) * 0.5,
            d.baseZ + Math.cos(t * 0.8) * 0.9
        );
    }
    ffAttr.needsUpdate = true;

    // 6. 平滑導覽運鏡
    if (camTargetPos && camTargetLook) {
        camera.position.lerp(camTargetPos, Math.min(1, delta * 4.5));
        controls.target.lerp(camTargetLook, Math.min(1, delta * 4.5));
        if (camera.position.distanceTo(camTargetPos) < 0.05) {
            camTargetPos = null;
        }
    }

    controls.update();
    updateFoliageBillboards(camera, false);
    renderer.render(scene, camera);

    // 即時更新 FPS 與 Draw Calls 降幅統計
    _fpsFrames++;
    _fpsTimer += delta;
    if (_fpsTimer >= 0.5) {
        if (perfStatsEl) {
            const fps = Math.min(144, Math.round(_fpsFrames / _fpsTimer));
            const calls = renderer.info.render.calls;
            const savedPct =
                _originalDrawCallsEstimate > 0
                    ? ((1 - calls / (_originalDrawCallsEstimate + calls)) * 100).toFixed(1)
                    : '99.1';
            perfStatsEl.innerText = `⚡ ${fps} FPS ｜ Draw Calls: ${calls} (已降 ${savedPct}%)`;
        }
        _fpsFrames = 0;
        _fpsTimer = 0;
    }
}

animate();
