const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

document.querySelectorAll(".photo-card img").forEach(function (img) {
    img.addEventListener("click", function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("open");
        document.body.classList.add("no-scroll");
    });
});

function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.classList.remove("no-scroll");
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
});

/* Kho câu đùa: bấm lần 1 xem đáp án, bấm lần 2 sang câu khác (câu đầu luôn là câu cũ) */
const JOKES = [
    ["Tại sao con cá không bao giờ thất tình?", "Vì nó biết có rất nhiều cá ngoài biển"],
    ["Cá nào không biết bơi?", "Cá khô."],
    ["Tại sao cá sợ lên mạng?", "Vì sợ dính lưới."],
    ["Tại sao cá hồi đi xa rồi cũng quay về?", "Vì tên nó là cá \"hồi\" mà."],
    ["Tại sao cua hay bị chê là ngang?", "Vì nó đi ngang thật."],
    ["Tại sao cá không chơi game online?", "Vì sợ lag đáy biển."],
    ["Tại sao cá hay đi trễ?", "Vì bị người ta câu giờ."],
    ["Tại sao cá luôn đi học theo đàn?", "Vì sợ bị gọi là cá biệt."],
    ["Tại sao sao biển không đi làm?", "Vì nó là ngôi sao, chỉ đi diễn thôi."],
    ["Cá nào giàu nhất biển?", "Cá vàng."],
    ["Tại sao cá nóc hay bị bạn bè né?", "Vì cứ nói không hợp là phồng lên."],
    ["Con gì sống dưới nước mà hay \"tám\" chuyện nhất?", "Bạch tuộc, vì có tám cái tay."],
    ["Tại sao cá không bao giờ khóc?", "Vì khóc dưới nước thì ai mà biết."],
    ["Tại sao sứa không đi học?", "Vì nó chẳng có não để nhớ bài."]
];
let jokeOrder = [0];
let jokePos = 0;
let jokeShowingAnswer = false;

function nextJokeOrder(keepFirst) {
    const rest = [];
    for (let i = keepFirst ? 1 : 0; i < JOKES.length; i++) rest.push(i);
    for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = rest[i]; rest[i] = rest[j]; rest[j] = t;
    }
    return keepFirst ? [0].concat(rest) : rest;
}
jokeOrder = nextJokeOrder(true);

function changeGreeting() {
    const el = document.getElementById("greeting");
    const btn = document.querySelector(".btn-joke");
    if (!jokeShowingAnswer) {
        el.textContent = JOKES[jokeOrder[jokePos]][1];
        btn.textContent = "Câu khác";
        jokeShowingAnswer = true;
    } else {
        jokePos++;
        if (jokePos >= jokeOrder.length) {
            const lastIdx = jokeOrder[jokeOrder.length - 1];
            jokeOrder = nextJokeOrder(false);
            if (jokeOrder[0] === lastIdx) jokeOrder.push(jokeOrder.shift());   // tránh lặp ngay câu vừa xem
            jokePos = 0;
        }
        el.textContent = JOKES[jokeOrder[jokePos]][0];
        btn.textContent = "Xem đáp án";
        jokeShowingAnswer = false;
    }
}

let isDark = localStorage.getItem("isDark") === "true";

function applyTheme() {
    const button = document.getElementById("colorButton");
    document.body.classList.toggle("dark", isDark);
    button.textContent = isDark ? "biến sáng" : "biến sâu";
}

function changeBackground() {
    isDark = !isDark;
    localStorage.setItem("isDark", isDark);
    applyTheme();
}

applyTheme();

let count = Number(localStorage.getItem("myCount")) || 0;
const counterEl = document.getElementById("counter");
counterEl.textContent = "Bạn đã nhấn " + count + " lần.";

function increase() {
    count = count + 1;
    localStorage.setItem("myCount", count);
    counterEl.textContent = "Bạn đã nhấn " + count + " lần.";
}

function resetCounter() {
    count = 0;
    localStorage.setItem("myCount", count);
    counterEl.textContent = "Bạn đã nhấn " + count + " lần.";
}
window.addEventListener("load", function () {
    const fish = document.querySelector(".fish-swimmer");
    if (!fish) return;

    const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const speed = 1.2;
    let direction = 1;
    let animationFrameId = null;
    let held = false;      // true khi đang giữ cá
    let grabDX = 0;        // khoảng lệch giữa chuột và góc cá
    let grabDY = 0;

    function pageWidth() {
        return document.documentElement.clientWidth;
    }
    function pageHeight() {
        return document.documentElement.scrollHeight;
    }

    let x = Math.random() * (pageWidth() - fish.offsetWidth);
    let y = Math.random() * (pageHeight() - fish.offsetHeight);
    let targetX = x;
    let targetY = y;

    function pickTarget() {
        targetX = Math.random() * (pageWidth() - fish.offsetWidth);
        targetY = Math.random() * (pageHeight() - fish.offsetHeight);
    }

    function render() {
        fish.style.transform =
            "translate(" + x + "px, " + y + "px) scaleX(" + direction + ")";
    }

    function swim() {
        animationFrameId = null;
        if (document.hidden) return;

        if (!held) {
            const dx = targetX - x;
            const dy = targetY - y;
            const distance = Math.hypot(dx, dy);

            if (distance < speed) {
                pickTarget();
            } else {
                x += (dx / distance) * speed;
                y += (dy / distance) * speed;
                if (Math.abs(dx) > 1) direction = dx > 0 ? 1 : -1;
            }
            render();
        }
        animationFrameId = requestAnimationFrame(swim);
    }

    function startSwimming() {
        if (!reduceMotion && !document.hidden && animationFrameId === null) {
            animationFrameId = requestAnimationFrame(swim);
        }
    }

    function stopSwimming() {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            stopSwimming();
        } else {
            startSwimming();
        }
    });

    // Bấm vào cá: giữ lại
    fish.addEventListener("pointerdown", function (e) {
        held = true;
        stopSwimming();
        fish.classList.add("held");
        fish.setPointerCapture(e.pointerId);

        // vị trí chuột trên cả trang (cộng thêm phần đã cuộn)
        const pageX = e.clientX + window.scrollX;
        const pageY = e.clientY + window.scrollY;
        grabDX = pageX - x;
        grabDY = pageY - y;
    });

    // Kéo cá theo chuột
    fish.addEventListener("pointermove", function (e) {
        if (!held) return;
        const pageX = e.clientX + window.scrollX;
        const pageY = e.clientY + window.scrollY;

        x = Math.max(0, Math.min(pageX - grabDX, pageWidth() - fish.offsetWidth));
        y = Math.max(0, Math.min(pageY - grabDY, pageHeight() - fish.offsetHeight));
        render();
    });

    // Thả ra: cá bơi tiếp
    function release() {
        if (!held) return;
        held = false;
        fish.classList.remove("held");
        pickTarget();
        startSwimming();
    }
    fish.addEventListener("pointerup", release);
    fish.addEventListener("pointercancel", release);

    startSwimming();
    render();
});

/* Hiệu ứng biển: bong bóng nổi + gợn nước khi bấm */
(function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = document.querySelector(".bubbles");
    const total = window.innerWidth < 600 ? 6 : 12;

    for (let i = 0; i < total; i++) {
        const b = document.createElement("span");
        const size = 6 + Math.random() * 26;
        b.className = "bubble";
        b.style.width = b.style.height = size + "px";
        b.style.left = Math.random() * 100 + "%";
        b.style.setProperty("--dur", 9 + Math.random() * 12 + "s");
        b.style.setProperty("--delay", -Math.random() * 20 + "s");
        b.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
        layer.appendChild(b);
    }

    document.addEventListener("pointerdown", function (e) {
        const ring = document.createElement("span");
        ring.className = "ripple";
        ring.style.left = e.clientX + "px";
        ring.style.top = e.clientY + "px";
        ring.addEventListener("animationend", function () { ring.remove(); });
        document.body.appendChild(ring);

        for (let i = 0; i < 4; i++) {
            const pop = document.createElement("span");
            const size = 5 + Math.random() * 9;
            pop.className = "bubble-pop";
            pop.style.width = pop.style.height = size + "px";
            pop.style.left = e.clientX + "px";
            pop.style.top = e.clientY + "px";
            pop.style.setProperty("--px", (Math.random() * 60 - 30) + "px");
            pop.style.animationDelay = Math.random() * 0.2 + "s";
            pop.addEventListener("animationend", function () { pop.remove(); });
            document.body.appendChild(pop);
        }
    });
})();

/* Đáy biển: rong biển, san hô, hải quỳ + sinh vật (cua, sao biển, nhím biển, ngựa vằn, sứa, đàn cá) */
(function () {
    const box = document.querySelector(".seabed .weeds");
    if (!box) return;
    const crit = document.querySelector(".seabed .creatures");

    const rnd = function (a, b) { return a + Math.random() * (b - a); };
    const pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
    const f = function (v) { return v.toFixed(1); };
    /* máy yếu (ít nhân CPU / ít RAM) hoặc màn nhỏ -> dùng số lượng ít */
    const lowEnd = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
    const mobile = window.innerWidth < 600 || lowEnd;
    const num = function (desktop, phone) { return mobile ? phone : desktop; };
    let uid = 0;

    /* Màu rong (xanh) và màu san hô (hồng, cam, tím, đỏ, vàng) */
    const greens = [
        { g: "wg1", leaf: "#10b981" },
        { g: "wg2", leaf: "#65a30d" },
        { g: "wg3", leaf: "#14b8a6" },
        { g: "wg4", leaf: "#22c55e" }
    ];
    const corals = [
        { g: "wg5", leaf: "#ec4899" },
        { g: "wg6", leaf: "#f97316" },
        { g: "wg7", leaf: "#8b5cf6" },
        { g: "wg8", leaf: "#ef4444" },
        { g: "wg9", leaf: "#eab308" }
    ];

    /* Rong kelp: thân cong + lá hai bên */
    const kelpLeaves = [
        [182, -38, 1], [160, 218, 1], [136, -34, 0.95], [114, 214, 0.95],
        [90, -36, 0.85], [68, 216, 0.8], [44, -32, 0.65], [24, 212, 0.5]
    ];
    function kelp(pal) {
        let out = '<path d="M30 200 C26 160 34 130 30 100 C26 70 34 40 30 8" fill="none" ' +
                  'stroke="url(#' + pal.g + ')" stroke-width="4.5" stroke-linecap="round"/>';
        kelpLeaves.forEach(function (l) {
            out += '<g transform="translate(30 ' + l[0] + ') rotate(' + l[1] + ') scale(' + l[2] + ')">' +
                   '<g class="leaf" style="animation-delay:' + (-Math.random() * 2.2).toFixed(2) + 's">' +
                   '<path class="blade" d="M0 0 C8 -9 24 -10 34 -2 C24 7 8 6 0 0 Z"/>' +
                   '<path class="rib" d="M2 0 C12 -2 24 -3 31 -2"/></g></g>';
        });
        return { w: 60, body: out, h: rnd(110, 190) };
    }

    /* Rong dải: một dải dài uốn lượn, thon dần về ngọn */
    function ribbon(pal) {
        const out =
            '<path d="M20 200 C6 160 34 124 20 84 C10 54 26 28 20 2 C30 28 34 58 28 88 C22 128 42 164 28 200 Z" fill="url(#' + pal.g + ')"/>' +
            '<path d="M24 196 C14 160 34 126 24 88 C18 60 28 34 22 8" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1.2" stroke-linecap="round"/>';
        return { w: 40, body: out, h: rnd(100, 170) };
    }

    /* Cụm lá cỏ biển: nhiều lá mảnh xòe quạt từ một gốc */
    const tuftBlades = [
        "M40 200 C37 160 22 130 12 78",
        "M40 200 C38 150 30 110 28 56",
        "M40 200 C41 140 46 100 42 28",
        "M40 200 C44 150 56 118 62 62",
        "M40 200 C46 165 62 140 72 104"
    ];
    function tuft(pal) {
        let out = "";
        tuftBlades.forEach(function (d, k) {
            out += '<g class="blade-g" style="animation-delay:' + (-Math.random() * 2.6).toFixed(2) +
                   's;animation-duration:' + rnd(2.2, 3.4).toFixed(2) + 's">' +
                   '<path d="' + d + '" fill="none" stroke="url(#' + pal.g + ')" stroke-width="' +
                   (4.2 + (k % 2) * 0.8) + '" stroke-linecap="round"/></g>';
        });
        return { w: 80, body: out, h: rnd(60, 100) };
    }

    /* San hô cành: chia nhánh nhiều tầng, đầu cành tròn sáng */
    function branchCoral(pal) {
        let out = "", tips = "";
        function grow(x, y, a, len, wd, d) {
            const x2 = x + Math.sin(a) * len, y2 = y - Math.cos(a) * len;
            out += '<path d="M' + f(x) + ' ' + f(y) + ' L' + f(x2) + ' ' + f(y2) + '" fill="none" stroke="url(#' + pal.g +
                   ')" stroke-width="' + f(wd) + '" stroke-linecap="round"/>';
            if (d > 0) {
                grow(x2, y2, a - rnd(0.35, 0.65), len * rnd(0.68, 0.82), wd * 0.72, d - 1);
                grow(x2, y2, a + rnd(0.35, 0.65), len * rnd(0.68, 0.82), wd * 0.72, d - 1);
                if (Math.random() < 0.35) grow(x2, y2, a + rnd(-0.2, 0.2), len * 0.7, wd * 0.68, d - 1);
            } else {
                tips += '<circle cx="' + f(x2) + '" cy="' + f(y2) + '" r="' + f(wd * 0.7) + '" fill="#fff" fill-opacity=".55"/>';
            }
        }
        grow(50, 200, rnd(-0.12, 0.12), rnd(40, 50), 9, 3);
        return { w: 100, body: out + tips, h: rnd(95, 150) };
    }

    /* San hô quạt: nhiều nan xòe từ một gốc, nối bằng các vòng cung */
    function fanCoral(pal) {
        const cx = 70, by = 168, R = rnd(80, 100), N = 13;
        let out = '<path d="M70 200 C69 188 70 178 70 ' + by + '" fill="none" stroke="url(#' + pal.g + ')" stroke-width="6" stroke-linecap="round"/>';
        for (let i = 0; i < N; i++) {
            const a = (i - (N - 1) / 2) * 0.12;
            const mx = cx + Math.sin(a) * R * 0.55 + Math.cos(a) * rnd(-5, 5);
            const my = by - Math.cos(a) * R * 0.55 + Math.sin(a) * rnd(-5, 5);
            const ex = cx + Math.sin(a) * R, ey = by - Math.cos(a) * R;
            out += '<path d="M' + cx + ' ' + by + ' Q' + f(mx) + ' ' + f(my) + ' ' + f(ex) + ' ' + f(ey) +
                   '" fill="none" stroke="url(#' + pal.g + ')" stroke-width="1.8" stroke-linecap="round"/>';
        }
        [0.38, 0.62, 0.84].forEach(function (r) {
            let d = "";
            for (let i = 0; i < N; i++) {
                const a = (i - (N - 1) / 2) * 0.12;
                d += (i ? "L" : "M") + f(cx + Math.sin(a) * R * r) + " " + f(by - Math.cos(a) * R * r) + " ";
            }
            out += '<path d="' + d + '" fill="none" stroke="url(#' + pal.g + ')" stroke-width="1" stroke-opacity=".8"/>';
        });
        return { w: 140, body: out, h: rnd(80, 125) };
    }

    /* Hải quỳ: gốc tròn + nhiều xúc tu đung đưa, đầu xúc tu sáng */
    function anemone(pal) {
        let out = '<path d="M36 200 C36 188 40 182 50 182 C60 182 64 188 64 200 Z" fill="url(#' + pal.g + ')"/>';
        const n = 15;
        for (let i = 0; i < n; i++) {
            const t = i / (n - 1) - 0.5;
            const x0 = 50 + t * 24, x1 = 50 + t * 110 + rnd(-6, 6), x2 = 50 + t * 150 + rnd(-10, 10);
            const y2 = rnd(85, 125);
            out += '<g class="blade-g" style="animation-delay:' + (-Math.random() * 2.6).toFixed(2) +
                   's;animation-duration:' + rnd(2, 3.2).toFixed(2) + 's">' +
                   '<path d="M' + f(x0) + ' 184 Q' + f(x1) + ' 150 ' + f(x2) + ' ' + f(y2) +
                   '" fill="none" stroke="url(#' + pal.g + ')" stroke-width="4.2" stroke-linecap="round"/>' +
                   '<circle cx="' + f(x2) + '" cy="' + f(y2) + '" r="3.6" fill="#fff" fill-opacity=".6"/></g>';
        }
        return { w: 100, body: out, h: rnd(70, 110) };
    }

    /* San hô não: mô tròn có đốm */
    function dome(pal) {
        let out = '<path d="M0 200 C-2 120 40 96 60 96 C80 96 122 120 120 200 Z" fill="url(#' + pal.g + ')"/>';
        for (let i = 0; i < 14; i++) {
            const a = rnd(Math.PI, Math.PI * 2.1), r = Math.sqrt(Math.random()) * 0.8;
            const x = 60 + Math.cos(a) * 52 * r, y = 172 + Math.sin(a) * 70 * r;
            out += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(rnd(2.5, 4.5)) + '" fill="#fff" fill-opacity="' + f(rnd(0.15, 0.35)) + '"/>';
        }
        return { w: 120, body: out, h: rnd(50, 80) };
    }

    const kinds = {
        kelp:    [kelp, greens],
        ribbon:  [ribbon, greens],
        tuft:    [tuft, greens],
        branch:  [branchCoral, corals],
        fan:     [fanCoral, corals],
        dome:    [dome, corals],
        anemone: [anemone, corals]
    };

    /* [lớp, tỉ lệ kích thước, số cụm desktop, số cụm mobile, độ chậm, các loại có thể mọc] */
    const layers = [
        ["back",  0.65, 8, 4, 1.5, ["kelp", "kelp", "ribbon", "tuft", "fan"]],
        ["mid",   0.85, 7, 4, 1.2, ["kelp", "ribbon", "tuft", "branch", "fan", "dome", "anemone"]],
        ["front", 1.00, 6, 3, 1.0, ["kelp", "ribbon", "tuft", "branch", "branch", "fan", "dome", "anemone"]]
    ];

    layers.forEach(function (L) {
        const layer = document.createElement("div");
        layer.className = "layer " + L[0];
        const clumps = mobile ? L[3] : L[2];
        let html = "";

        for (let c = 0; c < clumps; c++) {
            const center = ((c + 0.5) / clumps) * 100 + rnd(-3, 3);
            const count = 1 + Math.floor(Math.random() * 2);

            for (let n = 0; n < count; n++) {
                const kind = kinds[pick(L[5])];
                const pal = pick(kind[1]);
                const t = kind[0](pal);
                const h = Math.min(t.h * L[1], 215);
                const w = h * t.w / 200;
                const off = rnd(-14, 14);
                html += '<svg class="weed" viewBox="0 0 ' + t.w + ' 200" ' +
                        'style="left:calc(' + center.toFixed(2) + '% + ' + off.toFixed(1) + 'px);' +
                        'bottom:' + rnd(10, 16).toFixed(1) + 'px;width:' + w.toFixed(1) + 'px;height:' + h.toFixed(1) + 'px;' +
                        '--leaf:' + pal.leaf + ';--dur:' + (rnd(2.6, 4.6) * L[4]).toFixed(2) + 's;' +
                        '--delay:' + (-Math.random() * 4).toFixed(2) + 's;">' + t.body + '</svg>';
            }
        }
        layer.innerHTML = html;
        box.appendChild(layer);
    });

    /* Bong bóng nhỏ bốc lên từ gốc rong */
    const bubbleCount = num(8, 4);
    for (let i = 0; i < bubbleCount; i++) {
        const size = rnd(4, 10);
        const b = document.createElement("span");
        b.className = "sb-bubble";
        b.style.width = b.style.height = size + "px";
        b.style.left = rnd(3, 97) + "%";
        b.style.setProperty("--dur", rnd(3.5, 6.5) + "s");
        b.style.setProperty("--delay", -rnd(0, 6) + "s");
        box.appendChild(b);
    }

    if (!crit) return;

    /* ======== SINH VẬT ======== */
    function add(html, style, cls) {
        const d = document.createElement("div");
        d.className = "crit " + cls;
        d.style.cssText = style;
        d.innerHTML = html;
        crit.appendChild(d);
    }
    /* rải đều theo chiều ngang, mỗi con lệch ngẫu nhiên một chút */
    function spread(i, count) { return f(((i + rnd(0.2, 0.8)) / count) * 100) + "%"; }

    /* Cua đi ngang */
    function crabSvg(c1, c2) {
        const id = "cg" + (uid++);
        const legs = [["M21 26 L11 28 L8 34", "-.05s"], ["M20 28 L10 33 L7 39", "-.15s"], ["M22 30 L14 36 L12 40", "-.25s"]]
            .map(function (l) { return '<path class="leg" style="animation-delay:' + l[1] + '" d="' + l[0] + '"/>'; }).join("");
        const legG = '<g stroke="' + c2 + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">' + legs + '</g>';
        const claw = '<g class="claw"><path d="M18 22 C12 21 9 17 9 13" fill="none" stroke="' + c2 + '" stroke-width="3" stroke-linecap="round"/>' +
            '<path d="M9 13 C3 12 2 4 7 2 C7 6 10 7 11 5 C14 8 13 12 9 13 Z" fill="' + c1 + '" stroke="' + c2 + '" stroke-width=".8" stroke-linejoin="round"/></g>';
        const both = function (inner) { return inner + '<g transform="translate(60 0) scale(-1 1)">' + inner + '</g>'; };
        return '<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">' +
            '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs>' +
            both(legG) +
            '<ellipse cx="30" cy="25" rx="15" ry="10" fill="url(#' + id + ')"/>' +
            '<ellipse cx="28" cy="21" rx="8" ry="3" fill="#fff" fill-opacity=".25"/>' +
            '<path d="M24 17 L23 11 M36 17 L37 11" stroke="' + c2 + '" stroke-width="1.6" stroke-linecap="round"/>' +
            '<circle cx="23" cy="10" r="2.6" fill="#fff"/><circle cx="23.4" cy="10" r="1.3" fill="#1f2937"/>' +
            '<circle cx="37" cy="10" r="2.6" fill="#fff"/><circle cx="36.6" cy="10" r="1.3" fill="#1f2937"/>' +
            '<path d="M27 29 Q30 31 33 29" stroke="#7f1d1d" stroke-width="1" fill="none" stroke-linecap="round"/>' +
            both(claw) + '</svg>';
    }
    const crabCols = [["#f87171", "#b91c1c"], ["#fb923c", "#c2410c"]];
    const crabN = num(2, 1);
    for (let i = 0; i < crabN; i++) {
        const c = crabCols[i % 2];
        add(crabSvg(c[0], c[1]),
            "left:" + spread(i, crabN) + ";bottom:" + rnd(4, 10).toFixed(0) + "px;width:" + rnd(46, 58).toFixed(0) +
            "px;--range:" + rnd(10, 20).toFixed(0) + "vw;--dur:" + rnd(18, 28).toFixed(0) + "s;--delay:-" + rnd(0, 18).toFixed(0) + "s",
            "crab");
    }

    /* Sao biển */
    function starSvg(c1, c2) {
        const pts = [];
        for (let i = 0; i < 10; i++) {
            const r = i % 2 ? 7 : 17, a = -Math.PI / 2 + i * Math.PI / 5;
            pts.push(f(22 + Math.cos(a) * r) + "," + f(22 + Math.sin(a) * r));
        }
        let dots = "";
        for (let i = 0; i < 5; i++) {
            const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
            [6, 11, 15].forEach(function (r) {
                dots += '<circle cx="' + f(22 + Math.cos(a) * r) + '" cy="' + f(22 + Math.sin(a) * r) + '" r=".9" fill="#fff" fill-opacity=".65"/>';
            });
        }
        return '<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">' +
            '<polygon points="' + pts.join(" ") + '" fill="' + c1 + '" stroke="' + c1 + '" stroke-width="5" stroke-linejoin="round"/>' +
            dots + '<circle cx="22" cy="22" r="2.4" fill="' + c2 + '"/></svg>';
    }
    const starCols = [["#fb923c", "#c2410c"], ["#f472b6", "#be185d"], ["#a78bfa", "#6d28d9"], ["#f87171", "#b91c1c"]];
    const starN = num(4, 2);
    for (let i = 0; i < starN; i++) {
        const c = pick(starCols);
        add(starSvg(c[0], c[1]),
            "left:" + spread(i, starN) + ";bottom:" + rnd(2, 10).toFixed(0) + "px;width:" + rnd(24, 36).toFixed(0) +
            "px;transform:rotate(" + rnd(-35, 35).toFixed(0) + "deg)",
            "star");
    }

    /* Nhím biển */
    function urchinSvg(c1, c2) {
        let sp = "";
        for (let i = 0; i < 24; i++) {
            const a = (i / 24) * Math.PI * 2, r1 = 8, r2 = rnd(17, 22);
            sp += '<line x1="' + f(24 + Math.cos(a) * r1) + '" y1="' + f(24 + Math.sin(a) * r1) +
                  '" x2="' + f(24 + Math.cos(a) * r2) + '" y2="' + f(24 + Math.sin(a) * r2) + '"/>';
        }
        return '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
            '<g stroke="' + c2 + '" stroke-width="1.4" stroke-linecap="round">' + sp + '</g>' +
            '<circle cx="24" cy="24" r="9.5" fill="' + c1 + '"/>' +
            '<ellipse cx="21" cy="20.5" rx="4" ry="2.4" fill="#fff" fill-opacity=".3"/></svg>';
    }
    const urchinCols = [["#4c1d95", "#8b5cf6"], ["#9f1239", "#fb7185"], ["#1e1b4b", "#6366f1"]];
    const urchinN = num(3, 1);
    for (let i = 0; i < urchinN; i++) {
        const c = pick(urchinCols);
        add(urchinSvg(c[0], c[1]),
            "left:" + spread(i, urchinN) + ";bottom:" + rnd(4, 12).toFixed(0) + "px;width:" + rnd(28, 38).toFixed(0) + "px",
            "urchin");
    }

    /* Vỏ sò */
    function shellSvg(c1, c2) {
        const ridges = [[4, 14], [8, 6], [15, 3], [22, 6], [26, 14]].map(function (p) {
            return '<line x1="15" y1="24" x2="' + p[0] + '" y2="' + p[1] + '"/>';
        }).join("");
        return '<svg viewBox="0 0 30 26" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M15 24 L3 15 C0 7 8 1 15 3 C22 1 30 7 27 15 Z" fill="' + c1 + '" stroke="' + c2 + '" stroke-width=".8" stroke-linejoin="round"/>' +
            '<g stroke="' + c2 + '" stroke-width=".8" stroke-opacity=".6">' + ridges + '</g>' +
            '<rect x="11" y="23" width="8" height="3" rx="1" fill="' + c2 + '"/></svg>';
    }
    const shellCols = [["#fde4cf", "#e8a87c"], ["#fbcfe8", "#db7093"], ["#fef3c7", "#d4a24c"]];
    const shellN = num(4, 2);
    for (let i = 0; i < shellN; i++) {
        const c = pick(shellCols);
        add(shellSvg(c[0], c[1]),
            "left:" + spread(i, shellN) + ";bottom:" + rnd(3, 10).toFixed(0) + "px;width:" + rnd(20, 28).toFixed(0) +
            "px;transform:rotate(" + rnd(-25, 25).toFixed(0) + "deg)",
            "shell");
    }

    /* Ngựa vằn */
    function seahorseSvg(c1, c2) {
        return '<svg viewBox="0 0 40 70" xmlns="http://www.w3.org/2000/svg">' +
            '<path class="sh-fin" d="M14 24 C6 26 5 36 13 39 Z" fill="' + c2 + '" fill-opacity=".7"/>' +
            '<path d="M22 44 C22 54 13 57 13 63 C13 68 21 68 21 63 C21 60 17 60 18 62" fill="none" stroke="' + c1 + '" stroke-width="5" stroke-linecap="round"/>' +
            '<ellipse cx="23" cy="31" rx="8" ry="12" fill="' + c1 + '"/>' +
            '<circle cx="24" cy="11" r="7.5" fill="' + c1 + '"/>' +
            '<path d="M29 8 L38 10.5 Q40 12 38 13.5 L29 15.5 Z" fill="' + c1 + '"/>' +
            '<path d="M18 6 L16 1 L21 4 L23 0 L25 4 Z" fill="' + c2 + '"/>' +
            '<path d="M16 26 Q23 29 30 26 M15 32 Q23 35 31 32 M17 38 Q24 41 30 38" stroke="' + c2 + '" stroke-opacity=".45" stroke-width="1.2" fill="none"/>' +
            '<circle cx="26.5" cy="10" r="2" fill="#fff"/><circle cx="27" cy="10" r="1" fill="#1f2937"/></svg>';
    }
    const horseCols = [["#fb923c", "#c2410c"], ["#facc15", "#a16207"], ["#f9a8d4", "#be185d"]];
    const horseN = num(2, 1);
    for (let i = 0; i < horseN; i++) {
        const c = horseCols[i % 3];
        add(seahorseSvg(c[0], c[1]),
            "left:" + spread(i, horseN) + ";bottom:" + rnd(50, 110).toFixed(0) + "px;width:" + rnd(26, 34).toFixed(0) +
            "px;--dur:" + rnd(4, 6.5).toFixed(1) + "s;--delay:-" + rnd(0, 5).toFixed(1) + "s",
            "seahorse");
    }

    /* Sứa */
    function jellySvg(c) {
        let tents = "";
        for (let k = 0; k < 5; k++) {
            const x = 12 + k * 6.5;
            tents += '<g class="tent" style="animation-delay:' + (-rnd(0, 2)).toFixed(2) + 's">' +
                '<path d="M' + f(x) + ' 27 C' + f(x - 4) + ' 38 ' + f(x + 4) + ' 50 ' + f(x) + ' ' + f(rnd(60, 76)) +
                '" fill="none" stroke="' + c + '" stroke-opacity=".75" stroke-width="1.6" stroke-linecap="round"/></g>';
        }
        const arms = '<g class="tent"><path d="M21 27 C18 36 24 44 21 52 M29 27 C32 36 26 44 29 52" fill="none" stroke="' + c +
            '" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/></g>';
        return '<svg viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg">' + tents + arms +
            '<g class="jbell"><path d="M5 28 C5 4 45 4 45 28 C38 23 12 23 5 28 Z" fill="' + c + '" fill-opacity=".55" stroke="#fff" stroke-opacity=".7" stroke-width="1"/>' +
            '<ellipse cx="20" cy="13" rx="9" ry="3.6" fill="#fff" fill-opacity=".4"/>' +
            '<path d="M16 25 Q25 21 34 25" stroke="#fff" stroke-opacity=".5" stroke-width="1" fill="none"/></g></svg>';
    }
    const jellyCols = ["#f9a8d4", "#c4b5fd", "#67e8f9"];
    const jellyN = num(2, 1);
    for (let i = 0; i < jellyN; i++) {
        const c = jellyCols[i % 3];
        add(jellySvg(c),
            "left:" + spread(i, jellyN) + ";bottom:" + (mobile ? rnd(30, 60) : rnd(50, 100)).toFixed(0) + "px;width:" + rnd(38, 54).toFixed(0) +
            "px;--glow:" + c + ";--dx:" + rnd(-30, 30).toFixed(0) + "px;--dur:" + rnd(8, 14).toFixed(1) + "s;--delay:-" + rnd(0, 8).toFixed(1) + "s",
            "jelly");
    }

    /* Đàn cá nhỏ */
    function tinyFish(color) {
        return '<svg viewBox="0 0 30 14" xmlns="http://www.w3.org/2000/svg">' +
            '<path class="fish-tail" d="M9 7 L1 1 C3 5 3 9 1 13 Z" fill="' + color + '"/>' +
            '<path d="M7 7 C11 0 22 0 28 7 C22 14 11 14 7 7 Z" fill="' + color + '"/>' +
            '<path d="M10 9 C14 12 21 12 25 9" stroke="#fff" stroke-opacity=".45" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
            '<circle cx="23" cy="5.5" r="1.6" fill="#fff"/><circle cx="23.4" cy="5.5" r=".8" fill="#1f2937"/></svg>';
    }
    const schoolCols = ["#fde047", "#67e8f9", "#fda4af", "#a5f3fc", "#fdba74"];
    const schoolN = num(3, 2);
    for (let i = 0; i < schoolN; i++) {
        const col = pick(schoolCols);
        let fishes = "";
        for (let k = 0; k < 3; k++) {
            fishes += tinyFish(col).replace("<svg ", '<svg style="left:' + (k * 17) + 'px;top:' + (k % 2 ? 12 : 0) + 'px" ');
        }
        add(fishes,
            "top:" + rnd(25, mobile ? 120 : 170).toFixed(0) + "px;--dur:" + rnd(16, 30).toFixed(0) + "s;--delay:-" + rnd(0, 25).toFixed(0) + "s",
            "sb-fish");
    }

    const seabed = document.querySelector(".seabed");
    if ("IntersectionObserver" in window && seabed) {
        let inView = false;
        function updateAnimationState() {
            seabed.classList.toggle(
                "animations-paused",
                !inView || document.hidden
            );
        }

        const observer = new IntersectionObserver(function (entries) {
            inView = entries[0].isIntersecting;
            updateAnimationState();
        }, { rootMargin: "100px" });
        observer.observe(seabed);
        document.addEventListener("visibilitychange", updateAnimationState);
    }
})();

/* ============ LỜI NHẮN ============ */
(function () {
    /* Địa chỉ Firebase Realtime Database. Để trống = chế độ thử (chỉ lưu trên máy này). */
    const FIREBASE_URL = "https://saka-a28f9-default-rtdb.firebaseio.com";

    const MAX_SHOW = 30;          // số lời nhắn mới nhất hiển thị
    const COOLDOWN_MS = 20000;    // chống gửi liên tục
    const REFRESH_MS = 30000;     // tự cập nhật lời nhắn mới
    const base = FIREBASE_URL.replace(/\/+$/, "");
    const useCloud = base !== "";

    const section = document.getElementById("guestbook");
    const form = document.getElementById("gbForm");
    if (!form) return;
    const nameEl = document.getElementById("gbName");
    const textEl = document.getElementById("gbText");
    const hpEl = document.getElementById("gbWebsite");
    const countEl = document.getElementById("gbCount");
    const sendBtn = document.getElementById("gbSend");
    const statusEl = document.getElementById("gbStatus");
    const listEl = document.getElementById("gbList");
    const noticeEl = document.getElementById("gbNotice");

    const AVATARS = ["🐠", "🐙", "🦀", "🐢", "🐬", "🦑", "🐡", "🐚", "🦭", "🐳"];
    const ACCENTS = ["#38bdf8", "#f472b6", "#fb923c", "#34d399", "#a78bfa", "#facc15"];

    if (!useCloud) {
        noticeEl.hidden = false;
        noticeEl.textContent = "Đang ở chế độ thử: lời nhắn chỉ lưu trên máy này. Chủ trang cần nối Firebase để mọi người cùng thấy.";
    }

    function setStatus(msg, kind) {
        statusEl.textContent = msg || "";
        statusEl.className = "gb-status" + (kind ? " " + kind : "");
    }

    function hash(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
        return Math.abs(h);
    }

    function readLocal() {
        try { return JSON.parse(localStorage.getItem("gbLocal") || "[]"); } catch (e) { return []; }
    }
    function writeLocal(arr) {
        try { localStorage.setItem("gbLocal", JSON.stringify(arr.slice(-100))); } catch (e) {}
    }

    async function fetchMessages() {
        if (!useCloud) return readLocal();
        const url = base + '/guestbook.json?orderBy="$key"&limitToLast=' + MAX_SHOW;
        const res = await fetch(url);
        if (!res.ok) throw new Error("load " + res.status);
        const data = (await res.json()) || {};
        return Object.keys(data).map(function (k) { return data[k]; });
    }

    async function postMessage(msg) {
        if (!useCloud) {
            const arr = readLocal();
            arr.push({ name: msg.name, text: msg.text, ts: Date.now() });
            writeLocal(arr);
            return;
        }
        const res = await fetch(base + "/guestbook.json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: msg.name, text: msg.text, ts: { ".sv": "timestamp" } })
        });
        if (!res.ok) throw new Error("send " + res.status);
    }

    function fmtTime(ts) {
        if (typeof ts !== "number") return "";
        return new Date(ts).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    }

    const PAGE_SIZE = 3;                 // số lời nhắn mỗi trang
    const navEl = document.getElementById("gbNav");
    const prevBtn = document.getElementById("gbPrev");
    const nextBtn = document.getElementById("gbNext");
    const pageEl = document.getElementById("gbPage");

    let signature = "";
    let latestTs = 0;
    let firstRender = true;
    let allItems = [];
    let page = 0;

    function buildCard(m, isNew) {
        const who = String(m.name || "Khách ẩn danh").slice(0, 30);
        const h = hash(who);

        const box = document.createElement("div");
        box.className = "gb-msg" + (isNew ? " gb-new" : "");
        box.style.setProperty("--accent", ACCENTS[h % ACCENTS.length]);

        const ava = document.createElement("div");
        ava.className = "gb-ava";
        ava.setAttribute("aria-hidden", "true");
        ava.textContent = AVATARS[h % AVATARS.length];

        const body = document.createElement("div");
        body.className = "gb-body";
        const b = document.createElement("b");
        b.textContent = who;
        const t = document.createElement("time");
        t.textContent = fmtTime(m.ts);
        const p = document.createElement("p");
        p.textContent = String(m.text).slice(0, 300);
        body.appendChild(b);
        body.appendChild(t);
        body.appendChild(p);

        box.appendChild(ava);
        box.appendChild(body);
        return box;
    }

    function showPage(newAfter) {
        listEl.textContent = "";
        if (!allItems.length) {
            const p = document.createElement("p");
            p.className = "gb-empty";
            p.textContent = "Chai còn trống. Bạn thả lời nhắn đầu tiên đi!";
            listEl.appendChild(p);
            navEl.hidden = true;
            return;
        }
        const pages = Math.ceil(allItems.length / PAGE_SIZE);
        page = Math.min(Math.max(page, 0), pages - 1);
        allItems.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).forEach(function (m) {
            listEl.appendChild(buildCard(m, newAfter !== null && (m.ts || 0) > newAfter));
        });
        navEl.hidden = pages <= 1;
        pageEl.textContent = (page + 1) + "/" + pages;
        prevBtn.disabled = page === 0;
        nextBtn.disabled = page >= pages - 1;
    }

    prevBtn.addEventListener("click", function () { page--; showPage(null); });
    nextBtn.addEventListener("click", function () { page++; showPage(null); });

    function render(msgs) {
        const items = msgs
            .filter(function (m) { return m && typeof m.text === "string"; })
            .sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); })
            .slice(0, MAX_SHOW);

        const sig = items.length + ":" + (items[0] ? items[0].ts : 0);
        if (sig === signature) return;          // không có gì mới thì khỏi vẽ lại
        signature = sig;

        const prevLatest = latestTs;
        const animate = !firstRender;
        allItems = items;
        page = 0;                                // có tin mới thì quay về trang đầu
        showPage(animate ? prevLatest : null);
        if (items.length) latestTs = Math.max(latestTs, items[0].ts || 0);
        firstRender = false;
    }

    async function refresh(quiet) {
        try {
            render(await fetchMessages());
        } catch (e) {
            if (quiet) return;
            listEl.textContent = "";
            const p = document.createElement("p");
            p.className = "gb-empty";
            p.textContent = "Chưa tải được lời nhắn, thử tải lại trang sau nhé.";
            listEl.appendChild(p);
        }
    }

    /* chai bay xuống biển khi gửi xong */
    function dropBottle() {
        const el = document.createElement("span");
        el.className = "gb-flyer";
        el.setAttribute("aria-hidden", "true");
        el.textContent = "🍾";
        form.appendChild(el);
        setTimeout(function () { el.remove(); }, 1200);
    }

    textEl.addEventListener("input", function () {
        const n = textEl.value.length;
        countEl.textContent = n + "/300";
        countEl.classList.toggle("warn", n >= 270);
    });

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const text = textEl.value.trim();
        const name = nameEl.value.trim().slice(0, 30) || "Khách ẩn danh";
        if (!text) { setStatus("Bạn chưa viết gì cả.", "err"); return; }
        if (hpEl.value) { setStatus("Đã gửi!", "ok"); form.reset(); return; }   // bot điền ô ẩn

        let last = 0;
        try { last = Number(localStorage.getItem("gbLast")) || 0; } catch (err) {}
        const wait = COOLDOWN_MS - (Date.now() - last);
        if (wait > 0) { setStatus("Chậm một chút nhé, đợi " + Math.ceil(wait / 1000) + " giây nữa.", "err"); return; }

        sendBtn.disabled = true;
        setStatus("Đang thả chai xuống biển...");
        try {
            await postMessage({ name: name, text: text.slice(0, 300) });
            try { localStorage.setItem("gbLast", String(Date.now())); } catch (err) {}
            form.reset();
            countEl.textContent = "0/300";
            countEl.classList.remove("warn");
            setStatus("Chai đã trôi đi, cảm ơn bạn!", "ok");
            dropBottle();
            await refresh();
        } catch (err) {
            setStatus("Gửi chưa được, thử lại sau nhé.", "err");
        } finally {
            sendBtn.disabled = false;
        }
    });

    /* dừng hiệu ứng khi mục này không nằm trong màn hình */
    if ("IntersectionObserver" in window && section) {
        let visible = false;
        const update = function () { section.classList.toggle("gb-paused", !visible || document.hidden); };
        new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
            update();
        }, { rootMargin: "100px" }).observe(section);
        document.addEventListener("visibilitychange", update);
    }

    /* tự cập nhật lời nhắn mới của người khác */
    setInterval(function () { if (!document.hidden) refresh(true); }, REFRESH_MS);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) refresh(true); });

    refresh();
})();

/* ============ CHO CÁ ĂN: bấm vào đáy biển để thả thức ăn ============ */
(function () {
    const seabed = document.querySelector(".seabed");
    if (!seabed) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowEnd = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
    const fishCount = (window.innerWidth < 600 || lowEnd) ? 3 : 5;
    const rnd = function (a, b) { return a + Math.random() * (b - a); };

    const layer = document.createElement("div");
    layer.className = "feed-layer";
    const hint = document.createElement("div");
    hint.className = "feed-hint";
    layer.appendChild(hint);
    seabed.appendChild(layer);

    /* nhớ số viên cá đã ăn sau khi tải lại trang (F5) */
    const EAT_KEY = "sakaFishEaten";
    let eaten = 0;
    try {
        const saved = parseInt(localStorage.getItem(EAT_KEY), 10);
        if (saved > 0) eaten = saved;
    } catch (err) {}
    function saveEaten() {
        try { localStorage.setItem(EAT_KEY, String(eaten)); } catch (err) {}
    }
    function updateHint() {
        hint.textContent = "🍤 Bấm vào biển để cho cá ăn" + (eaten ? " · cá đã ăn " + eaten + " viên" : "");
    }
    updateHint();

    let W = 0, H = 0, floorY = 0;
    function measure() {
        const r = layer.getBoundingClientRect();
        W = r.width; H = r.height; floorY = H - 32;
    }
    measure();

    const COLORS = ["#fb923c", "#38bdf8", "#f472b6", "#facc15", "#2dd4bf", "#a78bfa"];
    function fishSvg(c) {
        return '<svg viewBox="0 0 30 14" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M9 7 L1 1 C3 5 3 9 1 13 Z" fill="' + c + '"/>' +
            '<path d="M7 7 C11 0 22 0 28 7 C22 14 11 14 7 7 Z" fill="' + c + '"/>' +
            '<path d="M10 9 C14 12 21 12 25 9" stroke="#fff" stroke-opacity=".45" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
            '<circle cx="23" cy="5.5" r="1.6" fill="#fff"/><circle cx="23.4" cy="5.5" r=".8" fill="#1f2937"/></svg>';
    }

    const fishes = [];
    for (let i = 0; i < fishCount; i++) {
        const size = rnd(30, 42);
        const el = document.createElement("div");
        el.className = "ff";
        el.style.width = size.toFixed(0) + "px";
        el.innerHTML = fishSvg(COLORS[i % COLORS.length]);
        layer.appendChild(el);
        fishes.push({
            el: el, svg: el.firstChild, size: size, h: size * 14 / 30,
            x: rnd(0, Math.max(1, W - size)), y: rnd(24, Math.max(25, H - 80)),
            vx: 0, vy: 0, tx: 0, ty: 0, speed: 35, dir: 1, nextWander: 0,
            phase: rnd(0, 6.28), chase: rnd(150, 210)
        });
    }
    fishes.forEach(function (f) { f.tx = f.x; f.ty = f.y; });

    const foods = [];
    const MAX_FOOD = 14;
    layer.addEventListener("click", function (e) {
        measure();
        const r = layer.getBoundingClientRect();
        const cx = e.clientX - r.left, cy = e.clientY - r.top;
        for (let k = 0; k < 3; k++) {
            const el = document.createElement("div");
            el.className = "food";
            layer.appendChild(el);
            foods.push({
                el: el, x: Math.min(W - 4, Math.max(4, cx + rnd(-12, 12))),
                y: Math.min(floorY, Math.max(18, cy + rnd(-6, 6))),
                baseX: 0, speed: rnd(34, 48), phase: rnd(0, 6.28), rest: 0
            });
            foods[foods.length - 1].baseX = foods[foods.length - 1].x;
        }
        while (foods.length > MAX_FOOD) foods.shift().el.remove();
    });

    function stepFood(dt, now) {
        for (let i = foods.length - 1; i >= 0; i--) {
            const p = foods[i];
            if (p.y < floorY) {
                p.y = Math.min(floorY, p.y + p.speed * dt);
                p.x = p.baseX + Math.sin(now / 500 + p.phase) * 5;
                if (p.y >= floorY) p.rest = now;
            } else if (now - p.rest > 7000) {
                p.el.remove();
                foods.splice(i, 1);
                continue;
            }
            p.el.style.transform = "translate(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px)";
        }
    }

    function stepFish(dt, now) {
        fishes.forEach(function (f) {
            const cx = f.x + f.size / 2, cy = f.y + f.h / 2;
            let target = null, best = 1e9;
            for (let i = 0; i < foods.length; i++) {
                const d = Math.hypot(foods[i].x - cx, foods[i].y - cy);
                if (d < best) { best = d; target = foods[i]; }
            }
            let tx, ty, spd;
            if (target) {
                tx = target.x - f.size / 2; ty = target.y - f.h / 2; spd = f.chase;
            } else {
                if (now > f.nextWander) {
                    if (reduce) { f.tx = f.x; f.ty = f.y; }
                    else { f.tx = rnd(0, Math.max(1, W - f.size)); f.ty = rnd(24, Math.max(25, H - 80)); }
                    f.speed = rnd(25, 50);
                    f.nextWander = now + rnd(2500, 6000);
                }
                tx = f.tx; ty = f.ty; spd = f.speed;
            }
            const dx = tx - f.x, dy = ty - f.y, dist = Math.hypot(dx, dy);
            const k = dist > 0.5 ? Math.min(1, dist / 40) * spd / dist : 0;
            f.vx += (dx * k - f.vx) * Math.min(1, dt * 3);
            f.vy += (dy * k - f.vy) * Math.min(1, dt * 3);
            f.x = Math.min(Math.max(f.x + f.vx * dt, -4), Math.max(0, W - f.size + 4));
            f.y = Math.min(Math.max(f.y + f.vy * dt, 14), Math.max(15, floorY - f.h / 2));
            if (Math.abs(f.vx) > 8) {
                const nd = f.vx > 0 ? 1 : -1;
                if (nd !== f.dir) { f.dir = nd; f.svg.style.transform = nd > 0 ? "" : "scaleX(-1)"; }
            }
            const ang = f.dir * Math.max(-20, Math.min(20, f.vy * 0.12));
            const bob = target ? 0 : Math.sin(now / 400 + f.phase) * 2;
            f.el.style.transform = "translate(" + f.x.toFixed(1) + "px," + (f.y + bob).toFixed(1) + "px) rotate(" + ang.toFixed(1) + "deg)";

            /* đớp mồi */
            const mx = f.x + f.size / 2 + f.dir * f.size * 0.38, my = f.y + f.h / 2;
            for (let i = foods.length - 1; i >= 0; i--) {
                if (Math.hypot(foods[i].x - mx, foods[i].y - my) < 11) {
                    foods[i].el.remove();
                    foods.splice(i, 1);
                    eaten++;
                    saveEaten();
                    updateHint();
                    if (f.svg.animate) f.svg.animate([{ scale: "1" }, { scale: "1.3 0.8" }, { scale: "1" }], { duration: 260 });
                    break;
                }
            }
        });
    }

    let running = false, inView = false, rafId = 0, last = 0;
    function frame(now) {
        rafId = 0;
        if (!running) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        stepFood(dt, now);
        stepFish(dt, now);
        rafId = requestAnimationFrame(frame);
    }
    function updateRun() {
        const should = inView && !document.hidden;
        if (should && !running) {
            running = true; measure(); last = performance.now();
            rafId = requestAnimationFrame(frame);
        } else if (!should) {
            running = false;
            if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        }
    }
    if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
            inView = entries[0].isIntersecting;
            updateRun();
        }, { rootMargin: "100px" }).observe(seabed);
    } else {
        inView = true; updateRun();
    }
    document.addEventListener("visibilitychange", updateRun);
    window.addEventListener("resize", measure);
})();

/* ============ HÔM NAY BẠN LÀ CON CÁ NÀO ============ */
(function () {
    const form = document.getElementById("ftForm");
    if (!form) return;
    const nameEl = document.getElementById("ftName");
    const out = document.getElementById("ftResult");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const FISH = [
        { e: "🐠", n: "Cá hề", c: "#ea580c", d: "Nhỏ xíu nhưng cả rạn san hô đều biết tên bạn. Hay ở lì trong nhà và nói nhiều hơn mức cần thiết." },
        { e: "🦈", n: "Cá mập", c: "#475569", d: "Nhìn thì dữ vậy thôi, thật ra chỉ đang đói. Bạn đi tới đâu thiên hạ tự dạt ra tới đó." },
        { e: "🐬", n: "Cá heo", c: "#0284c7", d: "Thông minh, vui tính, thích nhảy lên khoe. Cả đàn quý bạn, kể cả mấy người mới gặp." },
        { e: "🐡", n: "Cá nóc", c: "#b45309", d: "Ngày thường hiền khô, bị chọc là phồng lên liền. Đừng ai hỏi bạn về deadline hôm nay." },
        { e: "🐳", n: "Cá voi", c: "#1d4ed8", d: "To con, hiền lành, thích hát một mình lúc nửa đêm. Tâm hồn rộng cỡ đại dương." },
        { e: "🪼", n: "Sứa", c: "#a21caf", d: "Hôm nay bạn cứ trôi theo dòng đời, không cần nghĩ nhiều. Mong manh, nhưng đừng ai dại chọc vào." },
        { e: "🐙", n: "Bạch tuộc", c: "#be123c", d: "Tám cái tay làm tám việc cùng lúc, và việc nào cũng xong sát giờ." },
        { e: "🦀", n: "Cua", c: "#dc2626", d: "Đi ngang, nghĩ ngang, sống ngang. Vỏ ngoài cứng nhưng bên trong rất mềm." },
        { e: "🐟", n: "Cá chép", c: "#c2410c", d: "Đang trên đường hóa rồng, nhưng hôm nay chỉ muốn nằm im dưới đáy ao." },
        { e: "🐢", n: "Rùa biển", c: "#15803d", d: "Chậm mà chắc, sống thọ nhờ không vội việc gì. Hôm nay cứ thong thả." },
        { e: "🦭", n: "Hải cẩu", c: "#6d28d9", d: "Nằm ườn phơi nắng, vỗ tay khi có đồ ăn. Cuộc sống lý tưởng là đây chứ đâu." },
        { e: "🦐", n: "Tôm", c: "#e11d48", d: "Lúc nào cũng cong lưng làm việc, đến khi chín mới chịu nghỉ. Nhớ uống nước và thẳng lưng lên nhé." },
        { e: "🐟", n: "Cá khô", c: "#92400e", d: "Mặn, cứng đầu, nhưng là món đưa cơm nhất bữa. Có bạn là bữa nào cũng hết nồi cơm." },
        { e: "🐟", n: "Cá lòng tong", c: "#0e7490", d: "Bé tí, đi theo đàn, cái gì cũng sợ mà vẫn vui vẻ bơi tới bơi lui." }
    ];
    const STATS = ["Độ lầy", "Độ ngầu", "Độ đói"];

    function hashStr(s) {
        let h = 2166136261 >>> 0;
        for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
        return h;
    }
    function mix(h) {
        h = (h ^ (h >>> 15)) >>> 0; h = Math.imul(h, 2246822507) >>> 0;
        h = (h ^ (h >>> 13)) >>> 0; h = Math.imul(h, 3266489909) >>> 0;
        return (h ^ (h >>> 16)) >>> 0;
    }
    function dayKey() {
        const d = new Date();
        return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    }
    function el(tag, cls, text) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    }

    function show(name) {
        const named = name !== "";
        const seed = named ? hashStr(name.toLowerCase() + "|" + dayKey()) : (Math.random() * 4294967296) >>> 0;
        const f = FISH[mix(seed) % FISH.length];

        out.textContent = "";
        out.style.setProperty("--ft-accent", f.c);
        out.appendChild(el("div", "ft-emoji", f.e));
        out.appendChild(el("p", "ft-who", named ? "Hôm nay " + name + " là..." : "Hôm nay bạn là..."));
        out.appendChild(el("h3", "ft-name", f.n));
        out.appendChild(el("p", "ft-desc", f.d));

        const stats = el("div", "ft-stats");
        const fills = [];
        STATS.forEach(function (label, i) {
            const v = 35 + (mix(seed + (i + 1) * 7919) % 66);
            const row = el("div", "ft-stat");
            const bar = el("div", "ft-bar");
            const fill = document.createElement("i");
            bar.appendChild(fill);
            row.appendChild(el("span", "", label));
            row.appendChild(bar);
            row.appendChild(el("b", "", v + "%"));
            stats.appendChild(row);
            fills.push([fill, v]);
        });
        out.appendChild(stats);

        const note = el("p", "ft-note", named ? "Mai bạn sẽ ra con khác. Quay lại thử nhé!" : "Bấm lần nữa để thử vận may khác.");
        out.appendChild(note);

        out.hidden = false;
        out.classList.remove("ft-pop");
        void out.offsetWidth;
        out.classList.add("ft-pop");
        requestAnimationFrame(function () {
            requestAnimationFrame(function () { fills.forEach(function (p) { p[0].style.width = p[1] + "%"; }); });
        });
        out.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        show(nameEl.value.trim().slice(0, 30));
    });
})();

/* ============ TIẾNG SÓNG BIỂN (tạo bằng Web Audio, không cần file âm thanh) ============ */
(function () {
    const btn = document.getElementById("waveToggle");
    if (!btn) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { btn.hidden = true; return; }
    const ico = btn.querySelector(".wave-ico");
    let ctx = null, master = null, on = false, stopTimer = 0;

    function noiseBuffer(seconds, brown) {
        const sr = ctx.sampleRate, len = Math.floor(sr * seconds);
        const buf = ctx.createBuffer(1, len, sr);
        const d = buf.getChannelData(0);
        if (!brown) {
            for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
            return buf;
        }
        /* nhiễu nâu (trầm như tiếng biển), nối đầu-đuôi mượt để lặp không bị tiếng "bụp" */
        const ov = Math.floor(sr * 0.5), raw = new Float32Array(len + ov);
        let last = 0;
        for (let i = 0; i < raw.length; i++) {
            last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
            raw[i] = last * 3.5;
        }
        for (let i = 0; i < len; i++) {
            d[i] = i < ov ? raw[i] * (i / ov) + raw[len + i] * (1 - i / ov) : raw[i];
        }
        return buf;
    }

    function build() {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0;
        master.connect(ctx.destination);

        const lfo = ctx.createOscillator();      /* nhịp sóng lên xuống */
        lfo.frequency.value = 0.11;

        /* tầng trầm: tiếng ì ầm của sóng */
        const rumble = ctx.createBufferSource();
        rumble.buffer = noiseBuffer(6, true);
        rumble.loop = true;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass"; lp.frequency.value = 800; lp.Q.value = 0.7;
        const swell = ctx.createGain();
        swell.gain.value = 0.55;
        rumble.connect(lp); lp.connect(swell); swell.connect(master);
        const lfoSwell = ctx.createGain(); lfoSwell.gain.value = 0.35;
        const lfoCut = ctx.createGain(); lfoCut.gain.value = 500;
        lfo.connect(lfoSwell); lfoSwell.connect(swell.gain);
        lfo.connect(lfoCut); lfoCut.connect(lp.frequency);

        /* tầng bọt: tiếng rì rào khi sóng vỡ */
        const foam = ctx.createBufferSource();
        foam.buffer = noiseBuffer(2, false);
        foam.loop = true;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass"; bp.frequency.value = 1800; bp.Q.value = 0.5;
        const foamGain = ctx.createGain();
        foamGain.gain.value = 0.02;
        foam.connect(bp); bp.connect(foamGain); foamGain.connect(master);
        const lfoFoam = ctx.createGain(); lfoFoam.gain.value = 0.016;
        lfo.connect(lfoFoam); lfoFoam.connect(foamGain.gain);

        rumble.start(); foam.start(); lfo.start();
    }

    function setUi() {
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        ico.textContent = on ? "🔊" : "🔇";
    }

    btn.addEventListener("click", function () {
        on = !on;
        setUi();
        if (on) {
            if (!ctx) build();
            clearTimeout(stopTimer);
            ctx.resume();
            master.gain.cancelScheduledValues(ctx.currentTime);
            master.gain.setTargetAtTime(0.6, ctx.currentTime, 0.5);
        } else if (ctx) {
            master.gain.cancelScheduledValues(ctx.currentTime);
            master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
            stopTimer = setTimeout(function () { if (!on) ctx.suspend(); }, 1500);
        }
    });

    /* chuyển tab thì tạm im, quay lại thì tiếp tục */
    document.addEventListener("visibilitychange", function () {
        if (!ctx || !on) return;
        if (document.hidden) ctx.suspend(); else ctx.resume();
    });
})();

/* Menu: tô sáng mục đang xem */
(function () {
  if (!("IntersectionObserver" in window)) return;
  var links = [].slice.call(document.querySelectorAll(".menu a[href^='#']")), map = {};
  links.forEach(function (a) { var s = document.querySelector(a.getAttribute("href")); if (s) map[s.id] = a; });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove("on"); });
      map[e.target.id].classList.add("on");
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  Object.keys(map).forEach(function (k) { io.observe(document.getElementById(k)); });
})();

/* ===== ĐÀN CÁ NỀN Ở HERO (siêu chi tiết): vảy, vây có tia, mang, đường bên, mắt, nhiều loài + đàn cá nhỏ ===== */
(function () {
  var hf = document.querySelector(".hero-fish");
  if (!hf) return;
  var R = function (a, b) { return a + Math.random() * (b - a); };
  var f = function (n) { return n.toFixed(1); };
  var mob = innerWidth <= 600, uid = 0;
  var sm = function (t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  var svg = function (i) { return '<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">' + i + "</svg>"; };

  hf.insertAdjacentHTML("beforebegin", '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs id="hfDefs">' +
    '<pattern id="hfScale" width="7" height="5" patternUnits="userSpaceOnUse"><path d="M0 5A3.5 3.5 0 0 1 7 5M-3.5 2.5A3.5 3.5 0 0 1 3.5 2.5M3.5 2.5A3.5 3.5 0 0 1 10.5 2.5" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width=".5"/></pattern>' +
    '<linearGradient id="hfBack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".42"/><stop offset=".5" stop-color="#000" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="hfBelly" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".55"/></linearGradient>' +
    '<radialGradient id="hfEye"><stop offset="0" stop-color="#0b0b0b"/><stop offset=".45" stop-color="#0b0b0b"/><stop offset=".5" stop-color="#f59e0b"/><stop offset="1" stop-color="#78350f"/></radialGradient>' +
    "</defs></svg>");
  var defs = document.getElementById("hfDefs");

  var band = function (x, w, c, st) {
    return '<path d="M' + f(x - w) + " 0Q" + f(x - w - 6) + " 50 " + f(x - w) + " 100L" + f(x + w) + " 100Q" + f(x + w - 6) + " 50 " + f(x + w) + ' 0Z" fill="' + c + '" ' + (st || "") + "/>";
  };
  var P = function (d, a) { return '<path d="' + d + '" ' + a + "/>"; };

  var S = {
    tuna: { N: 176, T: 50, H: 44, h: 8, bf: .9, c: ["#1e3a8a", "#3b82f6", "#e2e8f0"], tail: "fork", tl: 38, tw: 64, fc: "#2f5fb8",
      d: { a: .5, b: .22, h: 20, l: 6 }, a: { a: .42, b: .2, h: 14 },
      extra: function (g) { var o = ""; for (var k = 0; k < 6; k++) { var x = g.T + 7 + k * 8; o += P("M" + f(x) + " " + f(g.bk(x) + 1.5) + "L" + f(x - 3) + " " + f(g.bk(x) - 5) + "L" + f(x - 7) + " " + f(g.bk(x) + 1.5) + "Z", 'fill="#facc15"') + P("M" + f(x) + " " + f(g.bl(x) - 1.5) + "L" + f(x - 3) + " " + f(g.bl(x) + 5) + "L" + f(x - 7) + " " + f(g.bl(x) - 1.5) + "Z", 'fill="#facc15"'); } return o; },
      deco: function (g) { var o = P("M" + f(g.T + 4) + " " + f(g.cy + 3) + "C" + f(g.T + g.L * .35) + " " + f(g.cy - 3) + " " + f(g.T + g.L * .7) + " " + f(g.cy - 5) + " " + f(g.N - 10) + " " + f(g.cy - 1), 'stroke="#facc15" stroke-opacity=".75" stroke-width="2.6" fill="none"'); for (var k = 0; k < 8; k++) { var x = g.T + 14 + k * 10; o += P("M" + f(x) + " " + f(g.cy - g.H * .5) + "L" + f(x - 3) + " " + f(g.cy + g.H * .08), 'stroke="#0b1b4d" stroke-opacity=".35" stroke-width="1.2"'); } return o; } },
    angel: { N: 150, T: 62, H: 84, h: 14, bf: 1, c: ["#fde68a", "#e5e7eb", "#f8fafc"], tail: "round", tl: 26, tw: 44, fc: "#facc15",
      d: { a: .62, b: .06, h: 62, l: 22, pf: function (t) { return .3 + .7 * Math.sin(Math.PI * (.05 + .45 * t)); } },
      a: { a: .5, b: .04, h: 54, l: 20, pf: function (t) { return .3 + .7 * Math.sin(Math.PI * (.05 + .45 * t)); } },
      deco: function (g) { return band(g.N - g.L * .62, 6, "#111827", 'fill-opacity=".8"') + band(g.N - g.L * .36, 7, "#111827", 'fill-opacity=".8"') + band(g.T + g.L * .1, 9, "#111827", 'fill-opacity=".7"') + band(g.N - g.L * .1, 5, "#f59e0b", 'fill-opacity=".55"'); } },
    clown: { N: 166, T: 56, H: 56, h: 16, bf: 1, c: ["#fb923c", "#f97316", "#ea580c"], tail: "round", tl: 26, tw: 44, fst: 'stroke="#1f1306" stroke-width=".9" stroke-opacity=".8"',
      d: { a: .5, b: .12, h: 15 }, a: { a: .4, b: .15, h: 12 },
      deco: function (g) { var st = 'stroke="#111" stroke-width="1.6" stroke-opacity=".85"'; return band(g.N - g.L * .3, 5, "#fff", st) + band(g.N - g.L * .6, 6, "#fff", st) + band(g.T + g.L * .06, 4, "#fff", st); } },
    tang: { N: 164, T: 58, H: 78, h: 14, bf: 1, c: ["#2563eb", "#1d4ed8", "#1e3a8a"], tail: "lunate", tl: 30, tw: 50, tcol: "#facc15", fc: "#1d4ed8",
      d: { a: .72, b: .08, h: 30 }, a: { a: .56, b: .08, h: 24 },
      deco: function (g) { var N = g.N, T = g.T, L = g.L, cy = g.cy, H = g.H; return P("M" + f(N - L * .3) + " " + f(cy - H * .3) + "C" + f(N - L * .5) + " " + f(cy - H * .42) + " " + f(T + L * .2) + " " + f(cy - H * .22) + " " + f(T + L * .02) + " " + f(cy) + "C" + f(T + L * .2) + " " + f(cy + H * .1) + " " + f(N - L * .45) + " " + f(cy + H * .22) + " " + f(N - L * .5) + " " + f(cy + H * .04) + "C" + f(N - L * .42) + " " + f(cy) + " " + f(N - L * .36) + " " + f(cy - H * .1) + " " + f(N - L * .3) + " " + f(cy - H * .3) + "Z", 'fill="#0a1230" fill-opacity=".9"') + P("M" + f(T + 4) + " " + f(cy - 2) + "h6", 'stroke="#facc15" stroke-width="2.4"'); } },
    ytang: { N: 164, T: 58, H: 74, h: 14, bf: 1, c: ["#fde047", "#facc15", "#eab308"], tail: "lunate", tl: 26, tw: 46, fc: "#facc15",
      d: { a: .72, b: .08, h: 28 }, a: { a: .56, b: .08, h: 22 },
      deco: function (g) { return P("M" + f(g.T + 3) + " " + f(g.cy - 3) + "h9", 'stroke="#fff" stroke-width="2.6"') + P("M" + f(g.N - g.L * .3) + " " + f(g.cy - g.H * .3) + "Q" + f(g.T + g.L * .4) + " " + f(g.cy - g.H * .1) + " " + f(g.T + 14) + " " + f(g.cy), 'stroke="#a16207" stroke-opacity=".35" stroke-width="1.6" fill="none"'); } },
    snapper: { N: 178, T: 50, H: 54, h: 12, bf: .9, c: ["#fb7185", "#f43f5e", "#fecdd3"], tail: "fork", tl: 32, tw: 56, fc: "#fde047",
      d: { a: .55, b: .15, h: 22 }, a: { a: .4, b: .18, h: 14 },
      deco: function (g) { var o = ""; for (var k = -1; k < 3; k++) o += P("M" + f(g.T + 6) + " " + f(g.cy + k * 8) + "Q" + f(g.T + g.L * .5) + " " + f(g.cy + k * 8 - 4) + " " + f(g.N - 14) + " " + f(g.cy + k * 7), 'stroke="#fde047" stroke-opacity=".5" stroke-width="1.4" fill="none"'); return o; } },
    sardine: { N: 176, T: 56, H: 30, h: 7, bf: 1, c: ["#1e3a8a", "#cbd5e1", "#f8fafc"], tail: "fork", tl: 30, tw: 36, still: 1, noscale: 1,
      d: { a: .4, b: .2, h: 9 },
      deco: function (g) { return P("M" + f(g.T + 2) + " " + f(g.cy - 3) + "C" + f(g.T + g.L * .4) + " " + f(g.cy - 8) + " " + f(g.N - g.L * .3) + " " + f(g.cy - 9) + " " + f(g.N - 10) + " " + f(g.cy - 5), 'stroke="#0f2a5a" stroke-opacity=".75" stroke-width="6" fill="none"') + P("M" + f(g.T + 4) + " " + f(g.cy + 1) + "L" + f(g.N - 14) + " " + f(g.cy + 1), 'stroke="#fff" stroke-opacity=".6" stroke-width="1.6"'); } }
  };

  function fish(s, col) {
    var id = "hq" + (++uid), N = s.N, T = s.T, cy = 50, L = N - T, H = s.H, h = s.h, bf = s.bf || 1, Pk = N - L * .36, B = N - L * .42;
    var bk = function (x) { return cy - h / 2 - (H / 2 - h / 2) * sm((x - T) / (Pk - T)); };
    var bl = function (x) { return cy + h / 2 + (H / 2 * bf - h / 2) * sm((x - T) / (B - T)); };
    var g = { N: N, T: T, L: L, H: H, h: h, cy: cy, bk: bk, bl: bl };
    var c = col || s.c, fc = s.fc || c[1], fcl = "", tcl = s.still ? "" : 'class="fish-tail"', fst = s.fst || "";
    var bd = "M" + N + " " + (cy + 2) + "C" + f(N - L * .04) + " " + f(cy - H * .42) + " " + f(Pk + L * .18) + " " + f(cy - H / 2) + " " + f(Pk) + " " + f(cy - H / 2) +
      "C" + f(Pk - L * .22) + " " + f(cy - H / 2) + " " + f(T + L * .18) + " " + f(cy - h / 2) + " " + T + " " + f(cy - h / 2) + "L" + T + " " + f(cy + h / 2) +
      "C" + f(T + L * .18) + " " + f(cy + h / 2) + " " + f(B - L * .2) + " " + f(cy + H / 2 * bf) + " " + f(B) + " " + f(cy + H / 2 * bf) +
      "C" + f(B + L * .2) + " " + f(cy + H / 2 * bf) + " " + f(N - L * .03) + " " + f(cy + H * .36) + " " + N + " " + (cy + 2) + "Z";
    var fin = function (n, colr, bp, end, cls, st) {
      var q = [], r = "", i, d;
      for (i = 0; i <= n; i++) { var b = bp(i / n); q.push([b, end(i / n, b[0], b[1])]); }
      d = "M" + f(q[0][0][0]) + " " + f(q[0][0][1]) + "L" + f(q[0][1][0]) + " " + f(q[0][1][1]);
      for (i = 1; i <= n; i++) {
        var a = q[i - 1], z = q[i], mx = (a[1][0] + z[1][0]) / 2, my = (a[1][1] + z[1][1]) / 2, bx = (a[0][0] + z[0][0]) / 2, by = (a[0][1] + z[0][1]) / 2;
        d += "Q" + f(mx + (bx - mx) * .14) + " " + f(my + (by - my) * .14) + " " + f(z[1][0]) + " " + f(z[1][1]);
      }
      for (i = 0; i <= n; i++) r += "M" + f(q[i][0][0]) + " " + f(q[i][0][1]) + "L" + f(q[i][1][0]) + " " + f(q[i][1][1]);
      d += "L" + f(q[n][0][0]) + " " + f(q[n][0][1]) + "Z";
      return "<g " + cls + '><path d="' + d + '" fill="' + colr + '" fill-opacity=".8" ' + (st || "") + '/><path d="' + r + '" stroke="#000" stroke-opacity=".3" stroke-width=".45" fill="none"/></g>';
    };
    var pf0 = function (t) { return .25 + .75 * Math.sin(Math.PI * (.15 + .7 * t)); };
    var tail = fin(11, s.tcol || fc, function (t) { return [T + 7, cy - h / 2 + t * h]; }, function (t) {
      var u = 2 * t - 1, ex = s.tail === "fork" ? T - s.tl * (.5 + .5 * Math.abs(u)) : s.tail === "lunate" ? T - s.tl * (.7 + .3 * Math.abs(u)) : T - s.tl * (1 - .35 * u * u);
      return [ex, cy + u * s.tw / 2];
    }, tcl, fst);
    var dd = s.d, x1 = N - L * dd.a, x2 = N - L * dd.b;
    var dors = fin(12, fc, function (t) { var x = x1 + (x2 - x1) * t; return [x, bk(x) + H * .1]; }, function (t, bx, by) { return [bx - (dd.l == null ? L * .06 : dd.l) * (.3 + t), by - dd.h * (dd.pf || pf0)(t)]; }, fcl, fst);
    var aa = s.a, y1 = N - L * aa.a, y2 = N - L * aa.b;
    var anal = fin(9, fc, function (t) { var x = y1 + (y2 - y1) * t; return [x, bl(x) - H * .1]; }, function (t, bx, by) { return [bx - (aa.l == null ? L * .05 : aa.l) * (.3 + t), by + aa.h * (aa.pf || pf0)(t)]; }, fcl, fst);
    var pelv = s.still ? "" : fin(5, fc, function (t) { return [N - L * .4 + t * 5, bl(N - L * .4) - H * .08]; }, function (t, bx, by) { return [bx - L * .1, by + H * .22 * (1 - .3 * t)]; }, fcl, fst);
    var gx = N - L * .24, ex = N - L * .14, ey = cy - H * .1, r = Math.max(2.2, H * .1);
    var pect = fin(7, fc, function (t) { return [gx - 1 - t * 3, cy + H * .08 + t * H * .14]; }, function (t, bx, by) { return [bx - L * .17 * (.6 + .4 * Math.sin(t * 3)), by + H * .05 + t * H * .04]; }, fcl, fst);
    defs.insertAdjacentHTML("beforeend",
      '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".5" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></linearGradient>' +
      '<clipPath id="' + id + 'c"><path d="' + bd + '"/></clipPath>');
    return tail + dors + anal + pelv + (s.extra ? s.extra(g) : "") +
      P(bd, 'fill="url(#' + id + 'g)"') + (s.noscale ? "" : P(bd, 'fill="url(#hfScale)"')) + P(bd, 'fill="url(#hfBack)"') + P(bd, 'fill="url(#hfBelly)"') +
      '<g clip-path="url(#' + id + 'c)">' + s.deco(g) +
      P("M" + f(N - L * .2) + " " + f(cy - H * .36) + "C" + f(N - L * .45) + " " + f(cy - H * .46) + " " + f(T + L * .35) + " " + f(cy - H * .42) + " " + f(T + L * .2) + " " + f(cy - h * .3), 'stroke="#fff" stroke-opacity=".38" stroke-width="' + f(H * .05) + '" stroke-linecap="round" fill="none"') +
      P("M" + f(N - L * .27) + " " + f(cy - H * .04) + "C" + f(N - L * .5) + " " + f(cy - H * .1) + " " + f(T + L * .3) + " " + f(cy - H * .04) + " " + (T + 2) + " " + cy, 'stroke="#000" stroke-opacity=".28" stroke-width=".6" stroke-dasharray="1.4 1.2" fill="none"') + "</g>" +
      P("M" + f(gx) + " " + f(cy - H * .36) + "Q" + f(gx - L * .08) + " " + cy + " " + f(gx) + " " + f(cy + H * .3), 'fill="#fff" fill-opacity=".1" stroke="#000" stroke-opacity=".4" stroke-width=".9"') +
      P("M" + f(gx + 1.6) + " " + f(cy - H * .33) + "Q" + f(gx - L * .06) + " " + cy + " " + f(gx + 1.6) + " " + f(cy + H * .27), 'fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".6"') +
      pect + P("M" + (N - .5) + " " + f(cy + H * .06) + "q" + f(-L * .04) + " " + f(H * .05) + " " + f(-L * .07) + " " + f(H * .03), 'stroke="#000" stroke-opacity=".5" stroke-width=".8" fill="none" stroke-linecap="round"') +
      '<circle cx="' + f(ex) + '" cy="' + f(ey) + '" r="' + f(r * 1.3) + '" fill="#fff" fill-opacity=".9" stroke="#000" stroke-opacity=".55" stroke-width=".7"/>' +
      '<circle cx="' + f(ex) + '" cy="' + f(ey) + '" r="' + f(r) + '" fill="url(#hfEye)"/>' +
      '<circle cx="' + f(ex + r * .32) + '" cy="' + f(ey - r * .34) + '" r="' + f(r * .3) + '" fill="#fff"/>';
  }

  function whale() {
    var sp = "", i, x, y;
    for (i = 0; i < 90; i++) { x = R(50, 370); y = R(36, 104); if (Math.pow((x - 210) / 170, 2) + Math.pow((y - 70) / 32, 2) < .9) sp += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(R(.9, 2.2)) + '"/>'; }
    var sl = ""; for (i = 0; i < 5; i++) sl += P("M" + (300 + i * 8) + " 48Q" + (296 + i * 8) + " 66 " + (300 + i * 8) + " 84", 'stroke="#0f172a" stroke-opacity=".5" stroke-width="1.4" fill="none"');
    var b = "M30 66C90 50 150 36 230 34C300 33 350 42 382 62C390 68 390 74 382 80C350 96 300 104 230 106C150 108 90 90 30 74Z";
    return '<svg viewBox="0 0 400 130" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hqW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b4a63"/><stop offset=".6" stop-color="#6b7f9c"/><stop offset="1" stop-color="#cbd5e1"/></linearGradient><clipPath id="hqWc"><path d="' + b + '"/></clipPath></defs>' +
      '<g class="fish-tail"><path d="M30 66C16 50 8 30 4 8C22 18 34 36 52 56Z M30 74C20 84 14 96 12 110C28 104 40 90 56 78Z" fill="#4a5a75"/></g>' +
      P("M180 36C190 14 206 8 218 10C212 20 214 30 224 35Z", 'fill="#4a5a75"') + P("M290 90C280 112 262 124 244 126C256 114 262 104 266 96Z", 'fill="#4a5a75"') +
      P(b, 'fill="url(#hqW)"') + '<g clip-path="url(#hqWc)" fill="#fff" fill-opacity=".8">' + sp + "</g>" + sl +
      '<circle cx="366" cy="62" r="3" fill="#0f172a"/><circle cx="367" cy="61" r="1" fill="#fff"/></svg>';
  }

  function add(inner, top, dur, w, cls) {
    hf.insertAdjacentHTML("beforeend", '<div class="sw ' + cls + '" style="top:' + top + "%;--dur:" + dur + "s;--delay:-" + f(R(0, dur)) + "s;--w:" + w + 'px"><div class="wy" style="--wd:' + f(R(7, 13)) + "s;--wl:-" + f(R(0, 8)) + 's">' + inner + "</div></div>");
  }

  var list = [
    ["whale", 30, 110, 520, "far whale"], ["tuna", 8, 70, 200, "far"], ["snapper", 58, 55, 110, "far"],
    ["angel", 18, 36, 140, "mid"], ["tang", 42, 40, 130, "mid"], ["ytang", 76, 34, 118, "mid"], ["snapper", 50, 44, 150, "mid"],
    ["tuna", 24, 46, 340, "near big"], ["angel", 58, 52, 220, "near big"], ["tang", 4, 58, 200, "near big"]
  ].filter(function (_, i) { return !mob || i % 2 === 0; });
  list.forEach(function (o) { add(o[0] === "whale" ? whale() : svg(fish(S[o[0]])), o[1], o[2], o[3], o[4]); });

  /* Đàn cá nhỏ bơi sát nhau như một khối */
  var scols = [["#1e3a8a", "#cbd5e1", "#f8fafc"], ["#92400e", "#fcd34d", "#fffbeb"], ["#0e7490", "#a5f3fc", "#ecfeff"]];
  scols.forEach(function (c, k) {
    defs.insertAdjacentHTML("beforeend", '<symbol id="hqS' + k + '" viewBox="0 0 200 100" overflow="visible">' + fish(S.sardine, c) + "</symbol>");
    var m = "", n = mob ? 9 : 18, i;
    for (i = 0; i < n; i++) {
      var a = R(0, 6.28), r = Math.sqrt(Math.random()), bd = R(1.4, 2.4);
      m += '<span class="sm" style="left:' + f(75 + Math.cos(a) * r * 75) + "px;top:" + f(35 + Math.sin(a) * r * 28) + "px;--sw:" + f(R(24, 34)) + "px;--bd:" + f(bd) + "s;--bl:-" + f(R(0, 2)) + "s;transform:rotate(" + f(R(-8, 8)) + 'deg)"><svg viewBox="0 0 200 100"><use href="#hqS' + k + '"/></svg></span>';
    }
    add('<div class="school">' + m + "</div>", [22, 48, 72][k], [22, 27, 31][k], 150, "sch mid");
  });

  /* Tạm dừng khi hero khuất khỏi màn hình cho đỡ lag */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { hf.classList.toggle("paused", !e[0].isIntersecting); }, { rootMargin: "100px" }).observe(document.querySelector(".hero"));
  }
})();
