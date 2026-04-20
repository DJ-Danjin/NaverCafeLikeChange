// ==UserScript==
// @name           네이버 카페 좋아요 변경
// @name:ko        네이버 카페 좋아요 변경
// @name:en        Naver Cafe Like Change
// @namespace    https://github.com/DJ-Danjin/NaverCafeLikeChange
// @version      2026-04-20-3
// @description    좋아요 버튼을 트게더스럽게 변경
// @description:ko 좋아요 버튼을 트게더스럽게 변경
// @description:en Change like button looks like tgd
// @author       DJ-Danjin / Edited by Gemini
// @match        https://cafe.naver.com/*
// @icon         https://cafe.naver.com/favicon.ico?2
// @updateURL    https://github.com/DJ-Danjin/NaverCafeLikeChange/raw/main/NaverCafeLikeChange.user.js
// @downloadURL  https://github.com/DJ-Danjin/NaverCafeLikeChange/raw/main/NaverCafeLikeChange.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  const renewStyle = `
      /* 좋아요 관련 스타일 */
      .ReplyBox .box_left {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          margin: 15px 0 !important;
          visibility: visible !important;
      }
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
      .renewLikeArticle .renewLikeText.on,
      .renewLikeArticle .renewLikeText.on .u_cnt {
          color: #ffffff !important;
      }
      .renewLikeArticle:has(.on) {
          background-color: #5cb85c !important;
          border-color: #449d44 !important;
      }
      .like_count_btn, .button_like_list, .u_ico, .u_likeit_list_module:after,
      .ReplyBox .box_left .button_comment, .u_likeit_list_module .u_txt._count {
          display: none !important;
      }

      /* 이스터에그: 복제인간 호버 스타일 (점선 제거) */
      .easter-egg-clone {
          color: inherit !important;
          text-decoration: none !important; /* 하단 점선 제거 */
          cursor: default !important;      /* 커서 모양도 일반 텍스트처럼 변경 */
      }
      #easter-egg-img-container {
          position: fixed;
          z-index: 99999;
          pointer-events: none;
          display: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          border-radius: 12px;
          overflow: hidden;
          background: white;
          border: 1px solid #ddd;
      }
      #easter-egg-img-container img {
          display: block;
          max-width: 250px; /* 이미지 크기 살짝 조정 */
          height: auto;
      }
  `;

  const createEasterEggContainer = () => {
      if (!document.getElementById('easter-egg-img-container')) {
          const container = document.createElement('div');
          container.id = 'easter-egg-img-container';
          const img = document.createElement('img');
          img.src = 'https://github.com/user-attachments/assets/c5f48f19-9a67-4c83-baf5-8f5d2173231f';
          container.appendChild(img);
          document.body.appendChild(container);
      }
  };

  const applyEasterEgg = () => {
      // 네이버 카페 게시글 영역 선택
      const content = document.querySelector('.se-main-container, .ContentRenderer, #tbody');
      if (!content || content.dataset.easterEggApplied) return;

      const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
      let node;
      const nodesToReplace = [];

      while (node = walker.nextNode()) {
          if (node.nodeValue.includes('복제인간')) {
              nodesToReplace.push(node);
          }
      }

      nodesToReplace.forEach(textNode => {
          const parent = textNode.parentNode;
          if (parent.closest('.easter-egg-clone')) return;

          const html = textNode.nodeValue.replace(/복제인간/g, '<span class="easter-egg-clone">복제인간</span>');
          const wrapper = document.createElement('span');
          wrapper.innerHTML = html;

          while (wrapper.firstChild) {
              parent.insertBefore(wrapper.firstChild, textNode);
          }
          parent.removeChild(textNode);
      });

      content.dataset.easterEggApplied = "true";

      // 이벤트 바인딩
      document.querySelectorAll('.easter-egg-clone').forEach(el => {
          el.addEventListener('mouseenter', () => {
              document.getElementById('easter-egg-img-container').style.display = 'block';
          });
          el.addEventListener('mouseleave', () => {
              document.getElementById('easter-egg-img-container').style.display = 'none';
          });
      });
  };

  const trackMouse = () => {
      document.addEventListener('mousemove', (e) => {
          const container = document.getElementById('easter-egg-img-container');
          if (container && container.style.display === 'block') {
              container.style.left = (e.clientX + 20) + 'px';
              container.style.top = (e.clientY + 20) + 'px';
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

          if (likeCount) {
              likeAnchor.appendChild(likeCount);
          }
      }
  };

  const init = () => {
      injectAssets();
      createEasterEggContainer();
      trackMouse();
      transformLikeButton();
      applyEasterEgg();
  };

  if (document.readyState === 'complete') {
      init();
  } else {
      window.addEventListener('load', init);
  }

  const observer = new MutationObserver(() => {
      transformLikeButton();
      applyEasterEgg();
  });

  observer.observe(document.body, {
      childList: true,
      subtree: true
  });
})();