// =========================================================================
// EasternHeroController：東方男女主角三視角（正面／側面／背面）立繪、4 套古風漢服色系切換、WASD 與點擊移動、自動翻面
// =========================================================================

export const HANFU_PALETTES = {
    sakura: {
        name: '🌸 櫻粉流仙',
        shadow: 'rgba(255, 160, 210, 0.72)',
        robeStops: ['#fff6fb', '#ffd4e8', '#f29ec8', '#c85a96'],
        trimStroke: '#ffd700',
        collarStroke: '#ffd700',
        beltFill: '#d94f8c',
        ribbonFill: '#ff85b3',
        ribbonSide: 'rgba(255, 180, 215, 0.85)',
        jadeColor: '#50e3c2',
        ornamentColor: '#ffd700',
        footRingHex: 0xff88cc,
        lightHex: 0xffb3e6
    },
    moonwhite: {
        name: '🌙 月白仙衣',
        shadow: 'rgba(136, 238, 255, 0.72)',
        robeStops: ['#ffffff', '#e3f6ff', '#9ad4f5', '#3b73a8'],
        trimStroke: '#a8f0ff',
        collarStroke: '#d4f8ff',
        beltFill: '#24588a',
        ribbonFill: '#7cd4f8',
        ribbonSide: 'rgba(160, 228, 255, 0.85)',
        jadeColor: '#72f7ff',
        ornamentColor: '#e0f7ff',
        footRingHex: 0x00f2fe,
        lightHex: 0x88eeff
    },
    xuanjin: {
        name: '🌌 玄金星袍',
        shadow: 'rgba(255, 215, 90, 0.75)',
        robeStops: ['#3c315e', '#231c3d', '#141126', '#090714'],
        trimStroke: '#ffd700',
        collarStroke: '#ffdf6b',
        beltFill: '#7c5316',
        ribbonFill: '#d4a024',
        ribbonSide: 'rgba(255, 210, 85, 0.82)',
        jadeColor: '#ffd700',
        ornamentColor: '#ffd700',
        footRingHex: 0xffd700,
        lightHex: 0xffe082
    },
    crimson: {
        name: '🔥 赤焰戰袍',
        shadow: 'rgba(255, 95, 40, 0.78)',
        robeStops: ['#ffe6d9', '#ff7b47', '#cc2218', '#660808'],
        trimStroke: '#ffbe3b',
        collarStroke: '#ffd700',
        beltFill: '#3b0909',
        ribbonFill: '#ff5233',
        ribbonSide: 'rgba(255, 110, 64, 0.85)',
        jadeColor: '#ffaa00',
        ornamentColor: '#ffbe3b',
        footRingHex: 0xff5511,
        lightHex: 0xff8844
    }
};

export function createEasternCharacterTexture(gender, view = 'front', outfitKey = 'sakura') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 640);

    const cx = 256;
    const isFemale = gender === 'female';
    const pal = HANFU_PALETTES[outfitKey] || HANFU_PALETTES.sakura;

    ctx.save();
    // 柔和仙氣背光外暈（依古風漢服色系切換）
    ctx.shadowColor = pal.shadow;
    ctx.shadowBlur = 18;

    const hairGrad = ctx.createLinearGradient(cx, 65, cx, 485);
    hairGrad.addColorStop(0, '#1a1c29');
    hairGrad.addColorStop(0.5, '#10121c');
    hairGrad.addColorStop(1, '#23273d');

    const robeGrad = ctx.createLinearGradient(cx - 90, 230, cx + 90, 595);
    robeGrad.addColorStop(0.0, pal.robeStops[0]);
    robeGrad.addColorStop(0.35, pal.robeStops[1]);
    robeGrad.addColorStop(0.75, pal.robeStops[2]);
    robeGrad.addColorStop(1.0, pal.robeStops[3]);

    if (view === 'front') {
        // =========================================================
        // 【正面視角 Front View】
        // =========================================================
        ctx.fillStyle = hairGrad;
        ctx.beginPath();
        if (isFemale) {
            ctx.moveTo(cx - 58, 130);
            ctx.bezierCurveTo(cx - 96, 220, cx - 105, 360, cx - 72, 465);
            ctx.quadraticCurveTo(cx, 495, cx + 72, 465);
            ctx.bezierCurveTo(cx + 105, 360, cx + 96, 220, cx + 58, 130);
        } else {
            ctx.moveTo(cx - 50, 125);
            ctx.bezierCurveTo(cx - 78, 200, cx - 75, 310, cx - 52, 380);
            ctx.lineTo(cx + 52, 380);
            ctx.bezierCurveTo(cx + 75, 310, cx + 78, 200, cx + 50, 125);
        }
        ctx.closePath();
        ctx.fill();

        // 東方飄逸漢服 / 長袍下擺與廣袖
        ctx.fillStyle = robeGrad;
        ctx.strokeStyle = pal.trimStroke;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.moveTo(cx - 42, 232);
        ctx.bezierCurveTo(cx - 88, 310, cx - 95, 450, cx - 78, 590);
        ctx.quadraticCurveTo(cx, 608, cx + 78, 590);
        ctx.bezierCurveTo(cx + 95, 450, cx + 88, 310, cx + 42, 232);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 寬大飄逸袖擺（兩側垂落）
        ctx.beginPath();
        ctx.moveTo(cx - 42, 238);
        ctx.bezierCurveTo(cx - 110, 275, cx - 125, 365, cx - 88, 420);
        ctx.quadraticCurveTo(cx - 62, 385, cx - 52, 315);
        ctx.moveTo(cx + 42, 238);
        ctx.bezierCurveTo(cx + 110, 275, cx + 125, 365, cx + 88, 420);
        ctx.quadraticCurveTo(cx + 62, 385, cx + 52, 315);
        ctx.fill();
        ctx.stroke();

        // 交領領口與腰封玉佩
        ctx.strokeStyle = pal.collarStroke;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(cx - 26, 228);
        ctx.lineTo(cx + 8, 288);
        ctx.moveTo(cx + 26, 228);
        ctx.lineTo(cx, 274);
        ctx.stroke();

        // 腰封與靈玉吊墜
        ctx.fillStyle = pal.beltFill;
        ctx.fillRect(cx - 46, 305, 92, 22);
        ctx.strokeRect(cx - 46, 305, 92, 22);
        ctx.fillStyle = pal.jadeColor;
        ctx.beginPath();
        ctx.arc(cx, 342, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 溫潤東方膚色頸部與臉龐
        ctx.fillStyle = '#ffe9dc';
        ctx.fillRect(cx - 14, 200, 28, 36);

        const faceGrad = ctx.createRadialGradient(cx, 152, 10, cx, 155, 62);
        faceGrad.addColorStop(0, '#fff3eb');
        faceGrad.addColorStop(0.8, '#ffe4d4');
        faceGrad.addColorStop(1, '#f0c8b4');
        ctx.fillStyle = faceGrad;
        ctx.beginPath();
        ctx.ellipse(cx, 154, 48, 54, 0, 0, Math.PI * 2);
        ctx.fill();

        // 東方溫婉/俊朗五官
        if (isFemale) {
            ctx.fillStyle = 'rgba(255, 130, 165, 0.35)';
            ctx.beginPath();
            ctx.arc(cx - 26, 168, 12, 0, Math.PI * 2);
            ctx.arc(cx + 26, 168, 12, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.strokeStyle = '#1c1d28';
        ctx.lineWidth = isFemale ? 2.6 : 3.8;
        ctx.beginPath();
        if (isFemale) {
            ctx.moveTo(cx - 32, 136);
            ctx.quadraticCurveTo(cx - 20, 128, cx - 9, 135);
            ctx.moveTo(cx + 9, 135);
            ctx.quadraticCurveTo(cx + 20, 128, cx + 32, 136);
        } else {
            ctx.moveTo(cx - 34, 132);
            ctx.lineTo(cx - 9, 137);
            ctx.moveTo(cx + 9, 137);
            ctx.lineTo(cx + 34, 132);
        }
        ctx.stroke();

        [-20, 20].forEach((ox) => {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(cx + ox, 150, 10, isFemale ? 8.5 : 7, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#1e1612';
            ctx.beginPath();
            ctx.arc(cx + ox, 150, isFemale ? 7 : 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(cx + ox - 2.5, 147.5, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#14141c';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(cx + ox, 150, 10, Math.PI * 1.1, Math.PI * 1.9);
            ctx.stroke();
        });

        ctx.strokeStyle = isFemale ? '#e05275' : '#c47a70';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.arc(cx, 178, 8, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();

        if (isFemale) {
            ctx.fillStyle = '#ff3b6b';
            ctx.beginPath();
            ctx.arc(cx, 128, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // 前額烏黑瀏海與髮髻 / 玉冠
        ctx.fillStyle = '#151722';
        ctx.beginPath();
        ctx.arc(cx, 138, 52, Math.PI, Math.PI * 2);
        ctx.lineTo(cx + 52, 155);
        ctx.quadraticCurveTo(cx + 25, 118, cx, 132);
        ctx.quadraticCurveTo(cx - 25, 118, cx - 52, 155);
        ctx.closePath();
        ctx.fill();

        if (isFemale) {
            ctx.beginPath();
            ctx.arc(cx - 34, 86, 20, 0, Math.PI * 2);
            ctx.arc(cx + 34, 86, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = pal.ornamentColor;
            ctx.beginPath();
            ctx.arc(cx - 34, 96, 6, 0, Math.PI * 2);
            ctx.arc(cx + 34, 96, 6, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(cx, 78, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = pal.ornamentColor;
            ctx.fillRect(cx - 18, 84, 36, 12);
            ctx.fillStyle = pal.jadeColor;
            ctx.beginPath();
            ctx.arc(cx, 90, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (view === 'back') {
        // =========================================================
        // 【背面視角 Back View】
        // =========================================================
        ctx.fillStyle = robeGrad;
        ctx.strokeStyle = pal.trimStroke;
        ctx.lineWidth = 2.5;

        // 寬大飄逸袖擺（背面兩側展開垂落）
        ctx.beginPath();
        ctx.moveTo(cx - 42, 236);
        ctx.bezierCurveTo(cx - 112, 275, cx - 128, 368, cx - 90, 424);
        ctx.quadraticCurveTo(cx - 60, 388, cx - 50, 315);
        ctx.moveTo(cx + 42, 236);
        ctx.bezierCurveTo(cx + 112, 275, cx + 128, 368, cx + 90, 424);
        ctx.quadraticCurveTo(cx + 60, 388, cx + 50, 315);
        ctx.fill();
        ctx.stroke();

        // 長袍背面裙擺主體
        ctx.beginPath();
        ctx.moveTo(cx - 44, 228);
        ctx.bezierCurveTo(cx - 88, 310, cx - 96, 450, cx - 80, 590);
        ctx.quadraticCurveTo(cx, 610, cx + 80, 590);
        ctx.bezierCurveTo(cx + 96, 450, cx + 88, 310, cx + 44, 228);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 背面衣領與中縫刺繡紋飾
        ctx.strokeStyle = pal.collarStroke;
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.moveTo(cx - 32, 226);
        ctx.quadraticCurveTo(cx, 240, cx + 32, 226);
        ctx.moveTo(cx, 234);
        ctx.lineTo(cx, 592);
        ctx.stroke();

        // 背後腰封與蝴蝶結披帛（女）或古風雲紋綬帶（男）
        ctx.fillStyle = pal.beltFill;
        ctx.fillRect(cx - 47, 305, 94, 22);
        ctx.strokeRect(cx - 47, 305, 94, 22);

        if (isFemale) {
            ctx.fillStyle = pal.ribbonFill;
            ctx.beginPath();
            ctx.ellipse(cx - 24, 316, 22, 13, -0.25, 0, Math.PI * 2);
            ctx.ellipse(cx + 24, 316, 22, 13, 0.25, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cx - 12, 322);
            ctx.quadraticCurveTo(cx - 36, 435, cx - 28, 545);
            ctx.lineTo(cx - 12, 540);
            ctx.quadraticCurveTo(cx - 18, 430, cx - 4, 322);
            ctx.moveTo(cx + 12, 322);
            ctx.quadraticCurveTo(cx + 36, 435, cx + 28, 545);
            ctx.lineTo(cx + 12, 540);
            ctx.quadraticCurveTo(cx + 18, 430, cx + 4, 322);
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.strokeStyle = pal.collarStroke;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(cx, 270, 22, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = pal.ribbonFill;
            ctx.strokeStyle = pal.trimStroke;
            ctx.beginPath();
            ctx.moveTo(cx - 14, 327);
            ctx.lineTo(cx - 24, 515);
            ctx.lineTo(cx - 8, 515);
            ctx.lineTo(cx - 4, 327);
            ctx.moveTo(cx + 14, 327);
            ctx.lineTo(cx + 24, 515);
            ctx.lineTo(cx + 8, 515);
            ctx.lineTo(cx + 4, 327);
            ctx.fill();
            ctx.stroke();
        }

        // 背面烏黑秀髮（覆蓋後腦勺與背部）
        ctx.fillStyle = hairGrad;
        if (isFemale) {
            ctx.beginPath();
            ctx.arc(cx - 34, 86, 20, 0, Math.PI * 2);
            ctx.arc(cx + 34, 86, 20, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, 146, 52, Math.PI, Math.PI * 2);
            ctx.bezierCurveTo(cx + 92, 220, cx + 104, 365, cx + 76, 478);
            ctx.quadraticCurveTo(cx + 35, 502, cx, 492);
            ctx.quadraticCurveTo(cx - 35, 502, cx - 76, 478);
            ctx.bezierCurveTo(cx - 104, 365, cx - 92, 220, cx - 52, 146);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = 'rgba(160, 185, 235, 0.28)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(cx - 32, 165);
            ctx.quadraticCurveTo(cx, 182, cx + 32, 165);
            ctx.moveTo(cx - 26, 220);
            ctx.bezierCurveTo(cx - 35, 310, cx - 35, 390, cx - 22, 465);
            ctx.moveTo(cx, 210);
            ctx.bezierCurveTo(cx - 4, 310, cx + 4, 395, cx, 475);
            ctx.moveTo(cx + 26, 220);
            ctx.bezierCurveTo(cx + 35, 310, cx + 35, 390, cx + 22, 465);
            ctx.stroke();

            ctx.fillStyle = pal.ornamentColor;
            ctx.beginPath();
            ctx.arc(cx - 34, 96, 6, 0, Math.PI * 2);
            ctx.arc(cx + 34, 96, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = pal.ornamentColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx - 38, 102);
            ctx.lineTo(cx - 42, 142);
            ctx.moveTo(cx + 38, 102);
            ctx.lineTo(cx + 42, 142);
            ctx.stroke();

            ctx.fillStyle = pal.ornamentColor;
            ctx.beginPath();
            ctx.ellipse(cx - 10, 178, 10, 5, -0.2, 0, Math.PI * 2);
            ctx.ellipse(cx + 10, 178, 10, 5, 0.2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(cx, 146, 51, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(cx - 46, 155);
            ctx.bezierCurveTo(cx - 72, 220, cx - 68, 305, cx - 48, 365);
            ctx.quadraticCurveTo(cx, 382, cx + 48, 365);
            ctx.bezierCurveTo(cx + 68, 305, cx + 72, 220, cx + 46, 155);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, 78, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = pal.ornamentColor;
            ctx.fillRect(cx - 19, 84, 38, 12);
            ctx.fillStyle = pal.jadeColor;
            ctx.fillRect(cx - 32, 87, 64, 5);

            ctx.fillStyle = '#121521';
            ctx.beginPath();
            ctx.moveTo(cx - 12, 96);
            ctx.bezierCurveTo(cx - 34, 185, cx - 30, 310, cx - 10, 415);
            ctx.quadraticCurveTo(cx, 435, cx + 14, 412);
            ctx.bezierCurveTo(cx + 32, 310, cx + 34, 185, cx + 12, 96);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = 'rgba(136, 220, 255, 0.3)';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(cx - 4, 110);
            ctx.bezierCurveTo(cx - 12, 210, cx - 10, 310, cx - 2, 398);
            ctx.moveTo(cx + 6, 115);
            ctx.bezierCurveTo(cx + 14, 215, cx + 12, 310, cx + 5, 392);
            ctx.stroke();
        }
    } else if (view === 'side') {
        // =========================================================
        // 【側面視角 Side View（預設面向右側 +X，向左移動時自動水平鏡像）】
        // =========================================================
        ctx.fillStyle = hairGrad;
        if (isFemale) {
            ctx.beginPath();
            ctx.moveTo(cx - 10, 115);
            ctx.bezierCurveTo(cx - 78, 165, cx - 105, 315, cx - 86, 468);
            ctx.quadraticCurveTo(cx - 52, 488, cx - 28, 455);
            ctx.bezierCurveTo(cx - 38, 330, cx - 28, 225, cx + 2, 165);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(cx - 10, 88);
            ctx.bezierCurveTo(cx - 75, 115, cx - 96, 245, cx - 74, 382);
            ctx.quadraticCurveTo(cx - 52, 392, cx - 38, 360);
            ctx.bezierCurveTo(cx - 50, 250, cx - 38, 145, cx - 2, 102);
            ctx.closePath();
            ctx.fill();
        }

        // 側面漢服 / 長袍身軀與A字飄逸裙擺
        ctx.fillStyle = robeGrad;
        ctx.strokeStyle = pal.trimStroke;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.moveTo(cx - 24, 226);
        ctx.bezierCurveTo(cx - 58, 320, cx - 76, 460, cx - 64, 590);
        ctx.quadraticCurveTo(cx + 4, 606, cx + 62, 588);
        ctx.bezierCurveTo(cx + 58, 455, cx + 44, 320, cx + 24, 230);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 側面交領斜襟線條
        ctx.strokeStyle = pal.collarStroke;
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(cx - 8, 224);
        ctx.quadraticCurveTo(cx + 18, 265, cx + 26, 305);
        ctx.stroke();

        // 側面腰封與垂落靈玉玉佩
        ctx.fillStyle = pal.beltFill;
        ctx.fillRect(cx - 32, 304, 64, 22);
        ctx.strokeRect(cx - 32, 304, 64, 22);
        ctx.fillStyle = pal.jadeColor;
        ctx.beginPath();
        ctx.arc(cx + 8, 344, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 側面身後飄揚披帛 / 綬帶
        ctx.fillStyle = pal.ribbonSide;
        ctx.beginPath();
        ctx.moveTo(cx - 26, 315);
        ctx.bezierCurveTo(cx - 82, 360, cx - 98, 445, cx - 82, 535);
        ctx.lineTo(cx - 64, 530);
        ctx.bezierCurveTo(cx - 76, 445, cx - 62, 365, cx - 18, 324);
        ctx.closePath();
        ctx.fill();

        // 側面頸部與東方立體側顏輪廓（面向右方 +X）
        ctx.fillStyle = '#ffe9dc';
        ctx.fillRect(cx - 8, 198, 24, 34);

        const sideFaceGrad = ctx.createRadialGradient(cx + 10, 152, 8, cx + 2, 154, 58);
        sideFaceGrad.addColorStop(0, '#fff3eb');
        sideFaceGrad.addColorStop(0.8, '#ffe4d4');
        sideFaceGrad.addColorStop(1, '#f0c8b4');
        ctx.fillStyle = sideFaceGrad;

        ctx.beginPath();
        ctx.moveTo(cx - 38, 145);
        ctx.quadraticCurveTo(cx - 38, 102, cx + 6, 102);
        ctx.quadraticCurveTo(cx + 38, 106, cx + 40, 138);
        ctx.lineTo(cx + 52, 156);
        ctx.quadraticCurveTo(cx + 46, 162, cx + 42, 166);
        ctx.quadraticCurveTo(cx + 45, 171, cx + 41, 176);
        ctx.quadraticCurveTo(cx + 40, 196, cx + 16, 204);
        ctx.quadraticCurveTo(cx - 28, 202, cx - 38, 145);
        ctx.closePath();
        ctx.fill();

        if (isFemale) {
            ctx.fillStyle = 'rgba(255, 130, 165, 0.35)';
            ctx.beginPath();
            ctx.arc(cx + 22, 168, 11, 0, Math.PI * 2);
            ctx.fill();
        }

        // 側面柳葉眉 / 英氣劍眉
        ctx.strokeStyle = '#1c1d28';
        ctx.lineWidth = isFemale ? 2.6 : 3.6;
        ctx.beginPath();
        if (isFemale) {
            ctx.moveTo(cx + 12, 135);
            ctx.quadraticCurveTo(cx + 26, 129, cx + 38, 135);
        } else {
            ctx.moveTo(cx + 10, 136);
            ctx.lineTo(cx + 38, 131);
        }
        ctx.stroke();

        // 側面東方丹鳳眼眸與黑曜石瞳孔
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(cx + 27, 149, 9, isFemale ? 7.5 : 6.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e1612';
        ctx.beginPath();
        ctx.arc(cx + 30, 149, isFemale ? 6 : 5.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx + 31.5, 146.5, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#14141c';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(cx + 15, 147);
        ctx.quadraticCurveTo(cx + 27, 140, cx + 37, 147);
        ctx.stroke();

        ctx.strokeStyle = isFemale ? '#e05275' : '#c47a70';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx + 41, 175);
        ctx.quadraticCurveTo(cx + 33, 177, cx + 27, 173);
        ctx.stroke();

        // 側面頭頂後腦烏黑髮絲、鬢角長縷與髮髻/玉冠
        ctx.fillStyle = '#151722';
        ctx.beginPath();
        ctx.moveTo(cx + 38, 128);
        ctx.quadraticCurveTo(cx + 20, 96, cx - 10, 98);
        ctx.bezierCurveTo(cx - 52, 102, cx - 56, 172, cx - 22, 204);
        ctx.lineTo(cx - 6, 192);
        ctx.quadraticCurveTo(cx - 10, 155, cx + 8, 138);
        ctx.quadraticCurveTo(cx + 24, 122, cx + 38, 128);
        ctx.closePath();
        ctx.fill();

        // 耳前垂落飄逸鬢角
        ctx.beginPath();
        ctx.moveTo(cx + 8, 132);
        ctx.quadraticCurveTo(cx + 16, 185, cx + 8, 245);
        ctx.quadraticCurveTo(cx + 1, 195, cx - 2, 142);
        ctx.closePath();
        ctx.fill();

        // 側面耳朵與珍珠耳墜
        ctx.fillStyle = '#ffe4d4';
        ctx.beginPath();
        ctx.ellipse(cx - 4, 158, 7, 12, -0.1, 0, Math.PI * 2);
        ctx.fill();
        if (isFemale) {
            ctx.fillStyle = pal.ornamentColor;
            ctx.beginPath();
            ctx.arc(cx - 4, 175, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // 頭頂雙環髻側面（女）或白玉金冠側面（男）
        ctx.fillStyle = '#151722';
        if (isFemale) {
            ctx.beginPath();
            ctx.arc(cx - 10, 84, 21, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = pal.ornamentColor;
            ctx.beginPath();
            ctx.arc(cx - 6, 94, 6.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = pal.ornamentColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx - 6, 100);
            ctx.lineTo(cx - 10, 138);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(cx - 6, 78, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = pal.ornamentColor;
            ctx.fillRect(cx - 22, 84, 34, 12);
            ctx.fillStyle = pal.jadeColor;
            ctx.beginPath();
            ctx.arc(cx + 4, 90, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        // 側面近端廣袖
        ctx.fillStyle = robeGrad;
        ctx.strokeStyle = pal.trimStroke;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx - 4, 240);
        ctx.bezierCurveTo(cx + 48, 268, cx + 64, 338, cx + 32, 412);
        ctx.quadraticCurveTo(cx - 6, 402, cx - 18, 332);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
}

export class EasternHeroController {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.root = new THREE.Group();
        this.root.position.set(0, 0, 6.2);
        this.scene.add(this.root);

        this.gender = 'female';
        this.outfit = 'sakura'; // 'sakura' | 'moonwhite' | 'xuanjin' | 'crimson'
        try {
            const savedOutfit = localStorage.getItem('sanctuary_hero_outfit_v1');
            if (savedOutfit && HANFU_PALETTES[savedOutfit]) {
                this.outfit = savedOutfit;
            }
        } catch (e) {}

        this.viewMode = 'auto'; // 'auto' | 'front' | 'side' | 'back'
        this.currentView = 'front';
        this.facingDir = new THREE.Vector3(0, 0, 1);

        // 依「性別_漢服色系_視角」動態快取貼圖，切換漢服零延遲且不重複建立 Canvas
        this._textureCache = {};
        this.textures = {
            custom: null
        };

        this.currentAspect = 512 / 640;
        this.facingFlip = 1;
        this.targetPos = null;
        this.lookAtAfterArrive = null;
        this.onArriveCallback = null;
        this.walkCycle = 0;
        this.keys = { w: false, a: false, s: false, d: false };
        this._camForward = new THREE.Vector3();
        this._camRight = new THREE.Vector3();
        this._toCam = new THREE.Vector3();

        this._initMesh();
        this._initKeyboard();
        this._syncAuraColors();
    }

    _getTexture(gender, outfit, view) {
        const key = `${gender}_${outfit}_${view}`;
        if (!this._textureCache[key]) {
            this._textureCache[key] = createEasternCharacterTexture(gender, view, outfit);
        }
        return this._textureCache[key];
    }

    _syncAuraColors() {
        const pal = HANFU_PALETTES[this.outfit] || HANFU_PALETTES.sakura;
        if (this.footRing && this.footRing.material) {
            this.footRing.material.color.setHex(pal.footRingHex);
        }
        if (this.heroLight) {
            this.heroLight.color.setHex(pal.lightHex);
        }
    }

    _initMesh() {
        const ringGeo = new THREE.RingGeometry(0.32, 0.48, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xff88cc,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        this.footRing = new THREE.Mesh(ringGeo, ringMat);
        this.footRing.rotation.x = -Math.PI / 2;
        this.footRing.position.y = 0.025;
        this.root.add(this.footRing);

        this.heroLight = new THREE.PointLight(0x88eeff, 0.85, 5);
        this.heroLight.position.set(0, 1.2, 0.3);
        this.root.add(this.heroLight);

        const geo = new THREE.PlaneGeometry(1, 1);
        geo.translate(0, 0.5, 0);
        // 遵守防呆鐵律：維持使用 MeshBasicMaterial，禁止使用 onBeforeCompile
        this.mat = new THREE.MeshBasicMaterial({
            map: this._getTexture(this.gender, this.outfit, 'front'),
            transparent: true,
            alphaTest: 0.03,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(geo, this.mat);
        const hs = parseFloat(document.getElementById('heroScale')?.value || 1.85);
        this.mesh.scale.set(hs * this.currentAspect, hs, 1);
        this.root.add(this.mesh);

        this.moveMarker = new THREE.Mesh(
            new THREE.RingGeometry(0.15, 0.28, 32),
            new THREE.MeshBasicMaterial({
                color: 0x00f2fe,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.85
            })
        );
        this.moveMarker.rotation.x = -Math.PI / 2;
        this.moveMarker.position.y = 0.03;
        this.moveMarker.visible = false;
        this.scene.add(this.moveMarker);
    }

    _initKeyboard() {
        window.addEventListener('keydown', (e) => {
            if (document.activeElement && document.activeElement.tagName === 'TEXTAREA') return;
            const k = e.key.toLowerCase();
            if (k === 'w' || e.key === 'ArrowUp') this.keys.w = true;
            if (k === 's' || e.key === 'ArrowDown') this.keys.s = true;
            if (k === 'a' || e.key === 'ArrowLeft') this.keys.a = true;
            if (k === 'd' || e.key === 'ArrowRight') this.keys.d = true;
            if (this.keys.w || this.keys.s || this.keys.a || this.keys.d) {
                this.targetPos = null;
                this.lookAtAfterArrive = null;
                this.onArriveCallback = null;
                this.moveMarker.visible = false;
            }
        });
        window.addEventListener('keyup', (e) => {
            const k = e.key.toLowerCase();
            if (k === 'w' || e.key === 'ArrowUp') this.keys.w = false;
            if (k === 's' || e.key === 'ArrowDown') this.keys.s = false;
            if (k === 'a' || e.key === 'ArrowLeft') this.keys.a = false;
            if (k === 'd' || e.key === 'ArrowRight') this.keys.d = false;
        });
    }

    _applyCurrentTexture() {
        if (this.textures.custom) {
            const nextTex =
                this.textures.custom[this.currentView] ||
                this.textures.custom.front ||
                this.textures.custom;
            if (this.mat.map !== nextTex) {
                this.mat.map = nextTex;
                this.mat.needsUpdate = true;
            }
        } else {
            const nextTex = this._getTexture(this.gender, this.outfit, this.currentView);
            if (this.mat.map !== nextTex) {
                this.mat.map = nextTex;
                this.mat.needsUpdate = true;
            }
        }
    }

    setGender(g) {
        this.gender = g;
        this.textures.custom = null;
        this.currentAspect = 512 / 640;
        this._applyCurrentTexture();
        this._syncAuraColors();
    }

    setOutfit(outfitKey) {
        if (!HANFU_PALETTES[outfitKey]) return;
        this.outfit = outfitKey;
        this.textures.custom = null;
        this.currentAspect = 512 / 640;
        try {
            localStorage.setItem('sanctuary_hero_outfit_v1', outfitKey);
        } catch (e) {}
        this._applyCurrentTexture();
        this._syncAuraColors();
    }

    setViewMode(mode) {
        this.viewMode = mode;
        if (mode !== 'auto') {
            this.currentView = mode;
            if (mode !== 'side') this.facingFlip = 1;
            this._applyCurrentTexture();
        }
    }

    setCustomTextureSet({ frontCanvas, sideCanvas, backCanvas }) {
        const w = frontCanvas.width || 512;
        const h = frontCanvas.height || 640;
        this.currentAspect = w / h;

        const makeTex = (cv) => {
            const t = new THREE.CanvasTexture(cv);
            t.minFilter = THREE.LinearFilter;
            return t;
        };

        const frontTex = makeTex(frontCanvas);
        const sideTex = sideCanvas ? makeTex(sideCanvas) : frontTex;
        const backTex = backCanvas ? makeTex(backCanvas) : frontTex;

        this.textures.custom = {
            front: frontTex,
            side: sideTex,
            back: backTex
        };
        this._applyCurrentTexture();
    }

    setCustomHeroImage(img) {
        const w = img.naturalWidth || img.width || 512;
        const h = img.naturalHeight || img.height || 512;
        this.currentAspect = w / h;

        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // 智慧保眼去背：四邊向內 Flood-Fill 去除純色外框背景
        try {
            const imgData = ctx.getImageData(0, 0, w, h);
            const d = imgData.data;
            const visited = new Uint8Array(w * h);
            const queue = new Int32Array(w * h);
            let head = 0, tail = 0;
            const cornerR = d[0], cornerG = d[1], cornerB = d[2];

            const pushBg = (x, y) => {
                const idx = y * w + x;
                if (visited[idx]) return;
                const p = idx * 4;
                const diff = Math.abs(d[p] - cornerR) + Math.abs(d[p + 1] - cornerG) + Math.abs(d[p + 2] - cornerB);
                if (diff < 68) {
                    visited[idx] = 1;
                    queue[tail++] = idx;
                }
            };
            for (let x = 0; x < w; x++) {
                pushBg(x, 0);
                pushBg(x, h - 1);
            }
            for (let y = 0; y < h; y++) {
                pushBg(0, y);
                pushBg(w - 1, y);
            }
            while (head < tail) {
                const curr = queue[head++];
                d[curr * 4 + 3] = 0;
                const cx = curr % w, cy = (curr / w) | 0;
                if (cx > 0) pushBg(cx - 1, cy);
                if (cx < w - 1) pushBg(cx + 1, cy);
                if (cy > 0) pushBg(cx, cy - 1);
                if (cy < h - 1) pushBg(cx, cy + 1);
            }
            ctx.putImageData(imgData, 0, 0);
        } catch (e) { }

        // 自動由去背正面圖衍生「側面」與「背面（後腦秀髮與背袍披帛）」視角
        const sideCanvas = document.createElement('canvas');
        sideCanvas.width = w;
        sideCanvas.height = h;
        const sCtx = sideCanvas.getContext('2d');
        sCtx.save();
        sCtx.translate(w * 0.5, 0);
        sCtx.scale(0.86, 1.0);
        sCtx.drawImage(c, -w * 0.5, 0);
        sCtx.restore();

        const backCanvas = document.createElement('canvas');
        backCanvas.width = w;
        backCanvas.height = h;
        const bCtx = backCanvas.getContext('2d');
        bCtx.drawImage(c, 0, 0);
        bCtx.globalCompositeOperation = 'source-atop';
        // 在原剪影上渲染背影層次（上方烏黑後腦秀髮，下方古風背袍與金色中縫）
        const backGrad = bCtx.createLinearGradient(0, 0, 0, h);
        backGrad.addColorStop(0.0, 'rgba(20, 22, 36, 0.94)');
        backGrad.addColorStop(0.38, 'rgba(24, 28, 46, 0.92)');
        backGrad.addColorStop(0.45, 'rgba(45, 65, 105, 0.45)');
        backGrad.addColorStop(1.0, 'rgba(25, 38, 68, 0.55)');
        bCtx.fillStyle = backGrad;
        bCtx.fillRect(0, 0, w, h);
        bCtx.strokeStyle = 'rgba(255, 215, 0, 0.55)';
        bCtx.lineWidth = Math.max(2, w * 0.006);
        bCtx.beginPath();
        bCtx.moveTo(w * 0.5, h * 0.38);
        bCtx.lineTo(w * 0.5, h * 0.92);
        bCtx.stroke();
        bCtx.globalCompositeOperation = 'source-over';

        this.setCustomTextureSet({ frontCanvas: c, sideCanvas, backCanvas });
    }

    walkTo(point, onArrive, lookAtPoint) {
        const flat = new THREE.Vector2(point.x, point.z);
        if (flat.length() > 32.0) flat.normalize().multiplyScalar(32.0);

        // 避開中央月光白玉主祭壇臺座 (0, -1.8)
        const mainAltarCenter = new THREE.Vector2(0, -1.8);
        const toMain = new THREE.Vector2().subVectors(flat, mainAltarCenter);
        if (toMain.length() < 2.45) {
            if (toMain.length() < 0.01) toMain.set(0, 1);
            toMain.normalize().multiplyScalar(2.45);
            flat.copy(mainAltarCenter).add(toMain);
        }

        // 避開火元素獨角獸主祭壇中央臺座 (22.0, -7.2)
        const fireCenter = new THREE.Vector2(22.0, -7.2);
        const toFire = new THREE.Vector2().subVectors(flat, fireCenter);
        if (toFire.length() < 2.25) {
            if (toFire.length() < 0.01) toFire.set(0, 1);
            toFire.normalize().multiplyScalar(2.25);
            flat.copy(fireCenter).add(toFire);
        }

        this.targetPos = new THREE.Vector3(flat.x, 0, flat.y);
        this.lookAtAfterArrive = lookAtPoint ? lookAtPoint.clone() : null;
        this.onArriveCallback = onArrive || null;
        this.moveMarker.position.set(flat.x, 0.03, flat.y);
        this.moveMarker.visible = true;
    }

    update(delta, elapsed) {
        const hs = parseFloat(document.getElementById('heroScale')?.value || 1.85);
        const speed = parseFloat(document.getElementById('heroSpeed')?.value || 3.6);
        let isMoving = false;
        const moveDir = new THREE.Vector3();

        this.camera.getWorldDirection(this._camForward);
        this._camForward.y = 0;
        if (this._camForward.lengthSq() > 0.0001) this._camForward.normalize();
        this._camRight.setFromMatrixColumn(this.camera.matrixWorld, 0);
        this._camRight.y = 0;
        if (this._camRight.lengthSq() > 0.0001) this._camRight.normalize();

        // 1. 鍵盤 WASD / 方向鍵自由移動
        if (this.keys.w || this.keys.s || this.keys.a || this.keys.d) {
            if (this.keys.w) moveDir.add(this._camForward);
            if (this.keys.s) moveDir.sub(this._camForward);
            if (this.keys.d) moveDir.add(this._camRight);
            if (this.keys.a) moveDir.sub(this._camRight);

            if (moveDir.lengthSq() > 0.001) {
                moveDir.normalize();
                isMoving = true;
                this.facingDir.copy(moveDir);
                const nextPos = this.root.position.clone().addScaledVector(moveDir, speed * delta);
                const flat = new THREE.Vector2(nextPos.x, nextPos.z);
                const distToMain = flat.distanceTo(new THREE.Vector2(0, -1.8));
                const distToFire = flat.distanceTo(new THREE.Vector2(22.0, -7.2));
                if (flat.length() <= 32.0 && distToMain >= 2.4 && distToFire >= 2.2) {
                    this.root.position.copy(nextPos);
                }
            }
        }
        // 2. 滑鼠點擊目標移動
        else if (this.targetPos) {
            const cur = this.root.position.clone();
            cur.y = 0;
            const dist = cur.distanceTo(this.targetPos);
            if (dist > 0.14) {
                isMoving = true;
                moveDir.subVectors(this.targetPos, cur).normalize();
                this.facingDir.copy(moveDir);
                this.root.position.addScaledVector(moveDir, speed * delta);
            } else {
                this.targetPos = null;
                this.moveMarker.visible = false;
                if (this.lookAtAfterArrive) {
                    const lookVec = new THREE.Vector3().subVectors(this.lookAtAfterArrive, this.root.position);
                    lookVec.y = 0;
                    if (lookVec.lengthSq() > 0.001) this.facingDir.copy(lookVec.normalize());
                    this.lookAtAfterArrive = null;
                }
                if (this.onArriveCallback) {
                    const cb = this.onArriveCallback;
                    this.onArriveCallback = null;
                    cb();
                }
            }
        }

        // 3. 依據角色面對方向與鏡頭相對角度，自動切換「正面 / 側面（左右） / 背面」
        const camPos = this.camera.position;
        const hPos = this.root.position;
        this.mesh.rotation.y = Math.atan2(camPos.x - hPos.x, camPos.z - hPos.z);

        if (this.viewMode === 'auto') {
            this._toCam.set(camPos.x - hPos.x, 0, camPos.z - hPos.z);
            if (this._toCam.lengthSq() > 0.0001) this._toCam.normalize();

            const dotFront = this.facingDir.dot(this._toCam);
            const dotRight = this.facingDir.dot(this._camRight);

            if (dotFront > 0.52) {
                this.currentView = 'front';
                this.facingFlip = 1;
            } else if (dotFront < -0.52) {
                this.currentView = 'back';
                this.facingFlip = 1;
            } else {
                this.currentView = 'side';
                this.facingFlip = dotRight >= 0 ? 1 : -1;
            }
            this._applyCurrentTexture();
        } else {
            this.currentView = this.viewMode;
            if (this.viewMode === 'side' && isMoving) {
                const dotRight = this.facingDir.dot(this._camRight);
                if (Math.abs(dotRight) > 0.1) this.facingFlip = dotRight >= 0 ? 1 : -1;
            }
            this._applyCurrentTexture();
        }

        const targetScaleX = hs * this.currentAspect * this.facingFlip;
        this.mesh.scale.x += (targetScaleX - this.mesh.scale.x) * Math.min(1, delta * 14);
        this.mesh.scale.y = hs;

        if (isMoving) {
            this.walkCycle += delta * speed * 4.2;
            this.mesh.position.y = Math.abs(Math.sin(this.walkCycle)) * 0.11;
            this.mesh.rotation.z = Math.cos(this.walkCycle) * 0.04;
        } else {
            this.mesh.position.y = Math.sin(elapsed * 2.4) * 0.025;
            this.mesh.rotation.z *= 0.85;
        }

        this.footRing.rotation.z = -elapsed * 0.8;
    }

    bindUIEvents(showToast) {
        const updateOutfitButtons = (activeKey) => {
            document.getElementById('btnOutfitSakura')?.classList.toggle('active', activeKey === 'sakura');
            document.getElementById('btnOutfitMoonwhite')?.classList.toggle('active', activeKey === 'moonwhite');
            document.getElementById('btnOutfitXuanjin')?.classList.toggle('active', activeKey === 'xuanjin');
            document.getElementById('btnOutfitCrimson')?.classList.toggle('active', activeKey === 'crimson');
        };
        updateOutfitButtons(this.outfit);

        window.switchHeroGender = (g) => {
            this.setGender(g);
            document.getElementById('btnFemale')?.classList.toggle('active', g === 'female');
            document.getElementById('btnMale')?.classList.toggle('active', g === 'male');
            const pal = HANFU_PALETTES[this.outfit] || HANFU_PALETTES.sakura;
            if (showToast) {
                showToast(
                    g === 'female'
                        ? `👧 已切換為「東方女主角（身著：${pal.name}）」`
                        : `👦 已切換為「東方男主角（身著：${pal.name}）」`
                );
            }
        };

        window.switchHeroOutfit = (outfitKey) => {
            if (!HANFU_PALETTES[outfitKey]) return;
            this.setOutfit(outfitKey);
            updateOutfitButtons(outfitKey);
            const pal = HANFU_PALETTES[outfitKey];
            if (showToast) {
                showToast(`👘 主角已換上古風漢服：【${pal.name}】（正面／側面／背面同步煥新）`);
            }
        };

        window.switchHeroViewMode = (mode) => {
            this.setViewMode(mode);
            document.getElementById('btnViewAuto')?.classList.toggle('active', mode === 'auto');
            document.getElementById('btnViewFront')?.classList.toggle('active', mode === 'front');
            document.getElementById('btnViewSide')?.classList.toggle('active', mode === 'side');
            document.getElementById('btnViewBack')?.classList.toggle('active', mode === 'back');
            const labelMap = {
                auto: '🔄 已設為「自動隨移動與視角切換正面／側面／背面」',
                front: '😊 已固定檢視主角「正面」立繪',
                side: '🚶 已固定檢視主角「側面」立繪',
                back: '🙇 已固定檢視主角「背面」參拜背影'
            };
            if (showToast && labelMap[mode]) showToast(labelMap[mode]);
        };

        const heroImgInput = document.getElementById('heroImgInput');
        if (heroImgInput) {
            heroImgInput.addEventListener('change', (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => {
                        this.setCustomHeroImage(img);
                        if (showToast) showToast('👤 已成功換上您自訂的主角立繪！');
                    };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    }
}
