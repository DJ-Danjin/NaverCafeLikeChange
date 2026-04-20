// ==UserScript==
// @name           네이버 카페 좋아요 변경
// @name:ko        네이버 카페 좋아요 변경
// @name:en        Naver Cafe Like Change
// @namespace    https://github.com/DJ-Danjin/NaverCafeLikeChange
// @version      2026-04-20-4
// @description    좋아요 버튼을 트게더스럽게 변경
// @description:ko 좋아요 버튼을 트게더스럽게 변경
// @description:en Change like button looks like tgd
// @author       DJ-Danjin / Edited by Gemini
// @match        https://cafe.naver.com/*
// @icon         https://cafe.naver.com/favicon.ico?2
// @updateURL    https://github.com/DJ-Danjin/NaverCafeLikeChange/raw/main/NaverCafeLikeChange.user.js
// @downloadURL  https://github.com/DJ-Danjin/NaverCafeLikeChange/raw/main/NaverCafeLikeChange.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  // 설정값 로드
  const settings = {
      cloneEgg: GM_getValue('cloneEgg', true), // 복제인간 이스터에그
      speakiEgg: GM_getValue('speakiEgg', true) // 스핔이 이스터에그
  };

  const renewStyle = `
      /* 좋아요 관련 스타일 */
      .ReplyBox .box_left { display: flex !important; justify-content: center !important; align-items: center !important; margin: 15px 0 !important; visibility: visible !important; }

      .renewLikeArticle {
          color: #5cb85c !important;
          background-color: transparent !important;
          border: 1px solid #5cb85c !important;
          border-radius: 4px !important;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex !important;
          align-items: center;
          text-decoration: none !important;
          font-family: inherit !important;
      }

      .renewLikeArticle:hover {
          background-color: #449d44 !important;
          border-color: #255625 !important;
      }

      .renewLikeText {
          color: #5cb85c !important;
          padding: 6px 12px !important;
          display: flex !important;
          align-items: center;
          gap: 6px;
          text-decoration: none !important;
          font-family: inherit !important;
          font-size: 14px !important;
          font-weight: 400 !important;
      }

      .u_cnt {
          font-style: normal !important;
          margin-left: 4px;
          color: #5cb85c !important;
          font-family: inherit !important;
          font-size: 14px !important;
          font-weight: 600 !important;
      }

      /* 호버 시 글자색을 흰색으로 */
      .renewLikeArticle:hover .renewLikeText,
      .renewLikeArticle:hover .u_cnt,
      .renewLikeArticle:hover i.fa-thumbs-up {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
      }

      /* 내가 누른 글 스타일 반전 유지 */
      .renewLikeArticle:has(.on) { background-color: #5cb85c !important; border-color: #449d44 !important; }
      .renewLikeArticle .renewLikeText.on,
      .renewLikeArticle .renewLikeText.on .u_cnt,
      .renewLikeArticle:has(.on) i.fa-thumbs-up {
          color: #ffffff !important;
      }

      .like_count_btn, .button_like_list, .u_ico, .u_likeit_list_module:after, .ReplyBox .box_left .button_comment, .u_likeit_list_module .u_txt._count { display: none !important; }

      /* 이스터에그 공통 스타일 */
      .easter-egg-clone { color: inherit !important; text-decoration: none !important; cursor: default !important; }
      #easter-egg-container-clone, #easter-egg-container-speaki { position: fixed; z-index: 99999; pointer-events: none; display: none; box-shadow: 0 4px 20px rgba(0,0,0,0.4); border-radius: 12px; overflow: hidden; background: white; border: 1px solid #ddd; }
      #easter-egg-container-clone img, #easter-egg-container-speaki img { display: block; height: auto; }
      #easter-egg-container-clone img { max-width: 250px; }
      #easter-egg-container-speaki img { max-width: 200px; }
  `;

  // 팝업 설정창 HTML 생성
  const openSettingsPopup = () => {
      const popupWidth = 380;
      const popupHeight = 350;
      const left = (window.screen.width / 2) - (popupWidth / 2);
      const top = (window.screen.height / 2) - (popupHeight / 2);

      const popup = window.open("", "ScriptSettings", `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`);

      popup.document.open();
      const popupHtml = `
          <html>
          <head>
              <title>이스터에그 설정</title>
              <style>
                  body { font-family: 'Malgun Gothic', sans-serif; padding: 20px; background: #f9f9f9; color: #333; margin: 0; }
                  .header { font-size: 18px; font-weight: bold; border-bottom: 2px solid #5cb85c; padding-bottom: 10px; margin-bottom: 20px; }
                  .item { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; background: white; padding: 12px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                  .item-label { font-size: 14px; font-weight: 500; }
                  .switch { position: relative; display: inline-block; width: 44px; height: 22px; }
                  .switch input { opacity: 0; width: 0; height: 0; }
                  .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 22px; }
                  .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
                  input:checked + .slider { background-color: #5cb85c; }
                  input:checked + .slider:before { transform: translateX(22px); }
                  .footer { margin-top: 25px; text-align: center; }
                  .save-btn { background: #5cb85c; color: white; border: none; padding: 10px 45px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px; transition: 0.2s; }
                  .save-btn:hover { background: #449d44; }
              </style>
          </head>
          <body>
              <div class="header">이스터에그 설정</div>
              <div class="item">
                  <span class="item-label">복제인간</span>
                  <label class="switch">
                      <input type="checkbox" id="cloneEgg" ${settings.cloneEgg ? 'checked' : ''}>
                      <span class="slider"></span>
                  </label>
              </div>
              <div class="item">
                  <span class="item-label">스핔이</span>
                  <label class="switch">
                      <input type="checkbox" id="speakiEgg" ${settings.speakiEgg ? 'checked' : ''}>
                      <span class="slider"></span>
                  </label>
              </div>
              <div class="footer">
                  <button class="save-btn" onclick="save()">저장 및 적용</button>
              </div>
              <script>
                  function save() {
                      const data = {
                          cloneEgg: document.getElementById('cloneEgg').checked,
                          speakiEgg: document.getElementById('speakiEgg').checked
                      };
                      window.opener.postMessage({ type: 'SAVE_SETTINGS', data }, "*");
                      window.close();
                  }
              </script>
          </body>
          </html>
      `;
      popup.document.write(popupHtml);
      popup.document.close();
  };

  window.addEventListener("message", (event) => {
      if (event.data.type === 'SAVE_SETTINGS') {
          GM_setValue('cloneEgg', event.data.data.cloneEgg);
          GM_setValue('speakiEgg', event.data.data.speakiEgg);
          location.reload();
      }
  });

  GM_registerMenuCommand("이스터에그 설정 열기 (팝업)", openSettingsPopup);

  const createEasterEggContainers = () => {
      if (settings.cloneEgg && !document.getElementById('easter-egg-container-clone')) {
          const container = document.createElement('div');
          container.id = 'easter-egg-container-clone';
          const img = document.createElement('img');
          img.src = 'https://github.com/user-attachments/assets/c5f48f19-9a67-4c83-baf5-8f5d2173231f';
          container.appendChild(img);
          document.body.appendChild(container);
      }
      if (settings.speakiEgg && !document.getElementById('easter-egg-container-speaki')) {
          const container = document.createElement('div');
          container.id = 'easter-egg-container-speaki';
          const img = document.createElement('img');
          img.src = 'https://github.com/user-attachments/assets/cc3dd872-c0fd-41bd-b21b-6bb7a646a7ac';
          container.appendChild(img);
          document.body.appendChild(container);
      }
  };

  const applyEasterEggs = () => {
      if (settings.cloneEgg) {
          const content = document.querySelector('.se-main-container, .ContentRenderer, #tbody');
          if (content && !content.dataset.easterEggApplied) {
              const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
              let node;
              const nodesToReplace = [];
              while (node = walker.nextNode()) {
                  if (node.nodeValue.includes('복제인간')) nodesToReplace.push(node);
              }
              nodesToReplace.forEach(textNode => {
                  const parent = textNode.parentNode;
                  if (parent.closest('.easter-egg-clone')) return;
                  const html = textNode.nodeValue.replace(/복제인간/g, '<span class="easter-egg-clone">복제인간</span>');
                  const wrapper = document.createElement('span');
                  wrapper.innerHTML = html;
                  while (wrapper.firstChild) parent.insertBefore(wrapper.firstChild, textNode);
                  parent.removeChild(textNode);
              });
              content.dataset.easterEggApplied = "true";
              document.querySelectorAll('.easter-egg-clone').forEach(el => {
                  el.addEventListener('mouseenter', () => { document.getElementById('easter-egg-container-clone').style.display = 'block'; });
                  el.addEventListener('mouseleave', () => { document.getElementById('easter-egg-container-clone').style.display = 'none'; });
              });
          }
      }
  };

  const trackMouse = () => {
      document.addEventListener('mousemove', (e) => {
          const cloneContainer = document.getElementById('easter-egg-container-clone');
          if (cloneContainer && cloneContainer.style.display === 'block') {
              cloneContainer.style.left = (e.clientX + 20) + 'px';
              cloneContainer.style.top = (e.clientY + 20) + 'px';
          }
          const speakiContainer = document.getElementById('easter-egg-container-speaki');
          if (speakiContainer && speakiContainer.style.display === 'block') {
              speakiContainer.style.left = (e.clientX + 20) + 'px';
              speakiContainer.style.top = (e.clientY + 20) + 'px';
          }
      });
  };

  const injectAssets = () => {
      if (!document.getElementById('naver-like-style')) {
          const styleTag = document.createElement("style");
          styleTag.id = 'naver-like-style';
          styleTag.textContent = renewStyle;
          document.head.appendChild(styleTag);
      }
      if (!document.querySelector('link[href*="font-awesome"]')) {
          const faTag = document.createElement("link");
          faTag.rel = "stylesheet";
          faTag.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
          document.head.appendChild(faTag);
      }
  };

  const transformLikeButton = () => {
      const boxLeft = document.querySelector(".ReplyBox .box_left");
      if (!boxLeft) return;
      const likeitModule = boxLeft.querySelector(".u_likeit_list_module");
      const likeAnchor = boxLeft.querySelector("a.u_likeit_list_btn");
      const likeLabel = boxLeft.querySelector("._label");
      const likeCount = boxLeft.querySelector(".u_cnt");

      if (likeAnchor && !likeAnchor.classList.contains("renewLikeText")) {
          boxLeft.classList.add("renewBoxLeft");
          likeitModule.classList.add("renewLikeArticle");
          likeAnchor.classList.add("renewLikeText");
          if (likeLabel) {
              likeLabel.innerText = "좋아요";
              likeLabel.classList.add("renewLikeLabel");
          }
          if (!likeAnchor.querySelector(".fa-thumbs-up")) {
              const thumbs = document.createElement("i");
              thumbs.className = "fa fa-thumbs-up";
              likeAnchor.insertBefore(thumbs, likeAnchor.firstChild);
          }
          if (likeCount) likeAnchor.appendChild(likeCount);

          if (settings.speakiEgg) {
              likeitModule.addEventListener('mouseenter', () => {
                  const container = document.getElementById('easter-egg-container-speaki');
                  if (container) container.style.display = 'block';
              });
              likeitModule.addEventListener('mouseleave', () => {
                  const container = document.getElementById('easter-egg-container-speaki');
                  if (container) container.style.display = 'none';
              });
          }
      }
  };

  const init = () => {
      injectAssets();
      createEasterEggContainers();
      trackMouse();
      transformLikeButton();
      applyEasterEggs();
  };

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);

  const observer = new MutationObserver(() => {
      transformLikeButton();
      applyEasterEggs();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();