// ==UserScript==
// @name         NSM LOADER
// @namespace    http://tampermonkey.net/
// @version      2.8
// @author       NamSomain
// @description  nigga
// @icon         https://i.postimg.cc/mgB9fBPZ/Capture.png
// @match        https://vi.khanacademy.org/*
// @match        https://*.khanacademy.org/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const V1 = 'https://raw.githubusercontent.com/Niximkk/Khanware/refs/heads/main/Khanware.js';
    const V2 = 'https://raw.githubusercontent.com/OnePrism0/KhanTool/refs/heads/main/KhanTool.js';

    GM_addStyle(`
      #nsmLoader {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 350px;
        background: #0f172a;
        border-radius: 12px;
        box-shadow: 0 0 20px rgba(0,238,255,0.25);
        font-family: 'Segoe UI', sans-serif;
        z-index: 999999;
        overflow: hidden;
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      #nsmLoader.hidden {
        opacity: 0;
        transform: translateY(-20px);
        pointer-events: none;
      }
      #nsmHeader {
        background: linear-gradient(90deg, #06b6d4, #3b82f6);
        padding: 10px 14px;
        color: white;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: move;
      }
      #nsmToggle {
        background: transparent;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        transition: transform .2s;
      }
      #nsmToggle:hover { transform: rotate(90deg); }
      #nsmBody { padding: 12px; }
      .nsmBtnRow, .verBtnRow { display: flex; gap: 8px; margin-bottom: 8px; }
      #nsmUrl {
        width: 100%;
        padding: 8px;
        background: #1e293b;
        color: #e2e8f0;
        border: none;
        border-radius: 8px;
        margin-bottom: 8px;
      }
      .nsmBtn {
        flex: 1;
        padding: 8px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }
      .nsmBtn.load { background: #06b6d4; color: #fff; }
      .nsmBtn.clear { background: #334155; color: #fff; }
      .nsmBtn.run { background: #f97316; color: #fff; }
      .nsmBtn.load:hover { background: #0ea5e9; }
      .nsmBtn.clear:hover { background: #475569; }
      .nsmBtn.run:hover { background: #fb923c; }
      #nsmStatus {
        font-size: 12px;
        color: #94a3b8;
        margin-bottom: 4px;
      }
      #nsmSource {
        width: 100%;
        height: 150px;
        background: #0f172a;
        color: #e2e8f0;
        border: 1px solid #1e293b;
        border-radius: 8px;
        padding: 8px;
        resize: vertical;
        font-family: monospace;
        font-size: 12px;
      }
      #nsmIcon {
        font-size: 20px;
        text-align: center;
        margin-top: 8px;
        cursor: pointer;
        filter: drop-shadow(0 0 5px #06b6d4);
        transition: transform .2s;
      }
      #nsmIcon:hover { transform: scale(1.2); }
      .verBtn {
        flex: 1;
        padding: 6px;
        border: none;
        border-radius: 8px;
        background: #0f172a;
        color: #06b6d4;
        border: 1px solid #06b6d4;
        cursor: pointer;
        font-weight: 600;
      }
      .verBtn:hover { background: #06b6d4; color: #fff; }
    `);

    const panel = document.createElement('div');
    panel.id = 'nsmLoader';
    panel.innerHTML = `
      <div id="nsmHeader">
        <span>NSM LOADER ✨</span>
        <button id="nsmToggle">−</button>
      </div>
      <div id="nsmBody">
        <div class="verBtnRow">
          <button class="verBtn" id="verV1">V1</button>
          <button class="verBtn" id="verV2">V2</button>
        </div>
        <input type="text" id="nsmUrl" value="${V1}">
        <div class="nsmBtnRow">
          <button class="nsmBtn load" id="nsmLoad">Load</button>
          <button class="nsmBtn clear" id="nsmClear">Clear</button>
          <button class="nsmBtn run" id="nsmRun">Run</button>
        </div>
        <div id="nsmStatus">Status: idle</div>
        <textarea id="nsmSource">// Source preview...</textarea>
        <div id="nsmIcon">🚀</div>
      </div>
    `;
    document.body.appendChild(panel);

    const header = document.getElementById('nsmHeader');
    const toggle = document.getElementById('nsmToggle');
    const input = document.getElementById('nsmUrl');
    const btnLoad = document.getElementById('nsmLoad');
    const btnClear = document.getElementById('nsmClear');
    const btnRun = document.getElementById('nsmRun');
    const status = document.getElementById('nsmStatus');
    const source = document.getElementById('nsmSource');
    const icon = document.getElementById('nsmIcon');
    const verV1 = document.getElementById('verV1');
    const verV2 = document.getElementById('verV2');

    let collapsed = false;
    toggle.onclick = () => {
      collapsed = !collapsed;
      document.getElementById('nsmBody').style.display = collapsed ? 'none' : 'block';
      toggle.textContent = collapsed ? '+' : '−';
    };

    let drag = false, offX, offY;
    header.addEventListener('mousedown', e => {
      drag = true;
      offX = e.clientX - panel.offsetLeft;
      offY = e.clientY - panel.offsetTop;
    });
    document.addEventListener('mousemove', e => {
      if (drag) {
        panel.style.left = (e.clientX - offX) + 'px';
        panel.style.top = (e.clientY - offY) + 'px';
      }
    });
    document.addEventListener('mouseup', () => drag = false);

    function setStatus(s) { status.textContent = 'Status: ' + s; }

    btnLoad.onclick = async () => {
      setStatus('fetching...');
      const url = input.value.trim();
      try {
        const res = await fetch(url);
        source.value = await res.text();
        setStatus('loaded ✅');
      } catch (e) {
        setStatus('error: ' + e.message);
      }
    };

    btnClear.onclick = () => {
      input.value = V1;
      source.value = '';
      setStatus('cleared');
    };

    btnRun.onclick = () => {
      const code = source.value;
      if (!code) return;
      new Function(code)();
      setStatus('executed 🚀');
    };

    verV1.onclick = () => { input.value = V1; };
    verV2.onclick = () => { input.value = V2; };
    icon.onclick = () => { window.open('https://guns.lol/namsomain', '_blank'); };

    document.addEventListener('keydown', (e) => {
      if (e.code === 'AltLeft') {
        panel.classList.toggle('hidden');
      }
    });
})();
s
