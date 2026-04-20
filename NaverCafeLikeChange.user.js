// ==UserScript==
// @name           네이버 카페 좋아요 변경
// @name:ko        네이버 카페 좋아요 변경
// @name:en        Naver Cafe Like Change
// @namespace    https://github.com/DJ-Danjin/NaverCafeLikeChange
// @version      2026-04-20-2
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
      /* 좋아요 컨테이너 정렬 */
      .ReplyBox .box_left {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          margin: 15px 0 !important;
          visibility: visible !important;
      }

      /* 기본 좋아요 버튼 스타일 */
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

      /* 마우스 호버 시 색상 반전 */
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

      /* [핵심] 내가 좋아요를 누른 상태 (.on 클래스)일 때 스타일 반전 유지 */
      .renewLikeArticle .renewLikeText.on,
      .renewLikeArticle .renewLikeText.on .u_cnt {
          color: #ffffff !important; /* 글자 및 숫자 흰색 */
      }

      .renewLikeArticle:has(.on) {
          background-color: #5cb85c !important; /* 배경색 초록색으로 고정 */
          border-color: #449d44 !important;
      }

      .renewLikeArticle:hover .renewLikeText,
      .renewLikeArticle:hover .u_cnt {
          color: #ffffff !important;
      }

      /* 불필요 요소 제거 */
      .like_count_btn, .button_like_list, .u_ico, .u_likeit_list_module:after,
      .ReplyBox .box_left .button_comment, .u_likeit_list_module .u_txt._count {
          display: none !important;
      }
  `;

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

  injectAssets();

  if (document.readyState === 'complete') {
      transformLikeButton();
  } else {
      window.addEventListener('load', transformLikeButton);
  }

  const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
          if (mutation.addedNodes.length) {
              transformLikeButton();
          }
      }
  });

  observer.observe(document.body, {
      childList: true,
      subtree: true
  });
})();