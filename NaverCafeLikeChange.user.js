// ==UserScript==
// @name           네이버 카페 좋아요 변경
// @name:ko        네이버 카페 좋아요 변경
// @name:en        Naver Cafe Like Change
// @namespace      https://github.com/DJ-Danjin/NaverCafeLikeChange
// @version        2026-04-20-6
// @description    좋아요 버튼을 트게더스럽게 변경
// @description:ko 좋아요 버튼을 트게더스럽게 변경
// @description:en Change like button looks like tgd
// @author         DJ-Danjin / Edited by Gemini
// @match          https://cafe.naver.com/*
// @icon           https://cafe.naver.com/favicon.ico?2
// @updateURL      https://github.com/DJ-Danjin/NaverCafeLikeChange/raw/main/NaverCafeLikeChange.user.js
// @downloadURL    https://github.com/DJ-Danjin/NaverCafeLikeChange/raw/main/NaverCafeLikeChange.user.js
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @run-at         document-end
// ==/UserScript==

(function () {
  'use strict';

  const settings = {
      cloneEgg: GM_getValue('cloneEgg', true),
      speakiEgg: GM_getValue('speakiEgg', true)
  };

  const renewStyle = `
      /* [공통] 레이아웃 설정 */
      .ReplyBox .box_left { display: flex !important; justify-content: center !important; align-items: center !important; margin: 15px 0 !important; visibility: visible !important; }

      /* [공통] 버튼 기본 구조 */
      .renewLikeArticle, .renewCommentLike {
          color: #5cb85c !important;
          background-color: transparent !important;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex !important;
          align-items: center;
          text-decoration: none !important;
      }

      /* [본문] 게시글 좋아요 버튼 스타일 */
      .renewLikeArticle {
          border: 1px solid #5cb85c !important;
          border-radius: 4px !important;
      }
      .renewLikeText {
          color: #5cb85c !important;
          padding: 6px 14px !important;
          font-size: 14px !important;
          display: flex !important;
          align-items: center !important;
          gap: 0 !important; /* gap 대신 개별 마진 사용 */
      }

      /* 게시글 아이콘 간격 조정 */
      .renewLikeText i.fa-thumbs-up {
          margin-right: 8px !important; /* 아이콘과 글자 사이 간격 확대 */
      }

      /* [댓글] 댓글 좋아요 버튼 스타일 */
      .renewCommentLike {
          border: none !important;
          padding: 2px 6px !important;
      }
      .renewCommentLike i.fa-thumbs-up {
          font-size: 16px !important;
          width: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 5px !important; /* 댓글 아이콘 간격 */
      }
      .renewCommentLike .u_cnt {
          font-size: 13px !important;
          font-style: normal !important;
          font-weight: 600 !important;
      }

      /* [호버 효과] */
      .renewLikeArticle:hover, .renewCommentLike:hover {
          background-color: #5cb85c !important;
          border-color: #449d44 !important;
          border-radius: 4px !important;
      }

      .renewLikeArticle:hover .renewLikeText,
      .renewLikeArticle:hover .u_cnt,
      .renewLikeArticle:hover i.fa-thumbs-up,
      .renewCommentLike:hover,
      .renewCommentLike:hover i.fa-thumbs-up,
      .renewCommentLike:hover .u_cnt {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
      }

      /* [활성화] 내가 누른 상태(On) */
      .renewLikeArticle:has(.on), .renewCommentLike.on { background-color: #5cb85c !important; }
      .renewLikeArticle .on,
      .renewLikeArticle .on .u_cnt,
      .renewLikeArticle:has(.on) i.fa-thumbs-up,
      .renewCommentLike.on,
      .renewCommentLike.on i.fa-thumbs-up,
      .renewCommentLike.on .u_cnt {
          color: #ffffff !important;
      }

      /* 기존 요소 숨기기 */
      .like_count_btn, .button_like_list, .u_ico, .u_likeit_list_module:after,
      .ReplyBox .box_left .button_comment, .u_likeit_list_module .u_txt._count,
      .CommentItem .Lottie, .CommentItem .u_ico { display: none !important; }

      /* 이스터에그 스타일 */
      #easter-egg-container-clone, #easter-egg-container-speaki { position: fixed; z-index: 99999; pointer-events: none; display: none; box-shadow: 0 4px 20px rgba(0,0,0,0.4); border-radius: 12px; overflow: hidden; background: white; border: 1px solid #ddd; }
      #easter-egg-container-clone img { max-width: 250px; }
      #easter-egg-container-speaki img { max-width: 200px; }
      .easter-egg-clone { color: inherit !important; text-decoration: none !important; }
  `;

  // 설정 팝업 로직
  const openSettingsPopup = () => {
      const popup = window.open("", "ScriptSettings", `width=380,height=350`);
      popup.document.open();
      popup.document.write(`<html><head><title>설정</title><style>body{font-family:sans-serif;padding:20px;background:#f9f9f9}.header{font-size:18px;font-weight:bold;border-bottom:2px solid #5cb85c;margin-bottom:20px;padding-bottom:10px}.item{display:flex;justify-content:space-between;background:white;padding:12px;border-radius:8px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,0.1)}.save-btn{background:#5cb85c;color:white;border:none;padding:10px 45px;border-radius:5px;cursor:pointer;width:100%}</style></head><body><div class="header">이스터에그 설정</div><div class="item">복제인간 <input type="checkbox" id="c" ${settings.cloneEgg?'checked':''}></div><div class="item">스핔이 <input type="checkbox" id="s" ${settings.speakiEgg?'checked':''}></div><button class="save-btn" onclick="save()">저장</button><script>function save(){window.opener.postMessage({type:'SAVE_SETTINGS',data:{cloneEgg:document.getElementById('c').checked,speakiEgg:document.getElementById('s').checked}},"*");window.close()}</script></body></html>`);
      popup.document.close();
  };

  window.addEventListener("message", (e) => {
      if (e.data.type === 'SAVE_SETTINGS') {
          GM_setValue('cloneEgg', e.data.data.cloneEgg);
          GM_setValue('speakiEgg', e.data.data.speakiEgg);
          location.reload();
      }
  });

  GM_registerMenuCommand("이스터에그 설정 열기", openSettingsPopup);

  const transformCommentLikeButtons = () => {
      const commentLikes = document.querySelectorAll(".CommentItem .u_likeit_list_module:not(.transformed)");
      commentLikes.forEach(module => {
          const btn = module.querySelector(".u_likeit_list_btn");
          if (btn) {
              btn.classList.add("renewCommentLike");
              if (!btn.querySelector(".fa-thumbs-up")) {
                  const icon = document.createElement("i");
                  icon.className = "fa fa-thumbs-up";
                  btn.insertBefore(icon, btn.firstChild);
              }
              const count = module.querySelector(".u_cnt");
              if (count) {
                  count.style.display = "inline-block";
                  btn.appendChild(count);
              }
              module.classList.add("transformed");
          }
      });
  };

  const transformLikeButton = () => {
      const boxLeft = document.querySelector(".ReplyBox .box_left");
      if (boxLeft) {
          const likeitModule = boxLeft.querySelector(".u_likeit_list_module");
          const likeAnchor = boxLeft.querySelector("a.u_likeit_list_btn");
          if (likeAnchor && !likeAnchor.classList.contains("renewLikeText")) {
              likeitModule.classList.add("renewLikeArticle");
              likeAnchor.classList.add("renewLikeText");
              if (!likeAnchor.querySelector(".fa-thumbs-up")) {
                  const thumbs = document.createElement("i");
                  thumbs.className = "fa fa-thumbs-up";
                  likeAnchor.insertBefore(thumbs, likeAnchor.firstChild);
              }
              const likeCount = boxLeft.querySelector(".u_cnt");
              if (likeCount) likeAnchor.appendChild(likeCount);
              if (settings.speakiEgg) {
                  likeitModule.addEventListener('mouseenter', () => { document.getElementById('easter-egg-container-speaki').style.display = 'block'; });
                  likeitModule.addEventListener('mouseleave', () => { document.getElementById('easter-egg-container-speaki').style.display = 'none'; });
              }
          }
      }
      transformCommentLikeButtons();
  };

  const createEasterEggContainers = () => {
      if (settings.cloneEgg && !document.getElementById('easter-egg-container-clone')) {
          const c = document.createElement('div'); c.id = 'easter-egg-container-clone';
          c.innerHTML = '<img src="https://github.com/user-attachments/assets/c5f48f19-9a67-4c83-baf5-8f5d2173231f">';
          document.body.appendChild(c);
      }
      if (settings.speakiEgg && !document.getElementById('easter-egg-container-speaki')) {
          const s = document.createElement('div'); s.id = 'easter-egg-container-speaki';
          s.innerHTML = '<img src="https://github.com/user-attachments/assets/cc3dd872-c0fd-41bd-b21b-6bb7a646a7ac">';
          document.body.appendChild(s);
      }
  };

  const applyEasterEggs = () => {
      if (!settings.cloneEgg) return;
      const content = document.querySelector('.se-main-container, .ContentRenderer, #tbody');
      if (content && !content.dataset.easterEggApplied) {
          const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
          let node; const nodes = [];
          while (node = walker.nextNode()) { if (node.nodeValue.includes('복제인간')) nodes.push(node); }
          nodes.forEach(t => {
              const p = t.parentNode; if (p.closest('.easter-egg-clone')) return;
              const span = document.createElement('span');
              span.innerHTML = t.nodeValue.replace(/복제인간/g, '<span class="easter-egg-clone">복제인간</span>');
              while (span.firstChild) p.insertBefore(span.firstChild, t);
              p.removeChild(t);
          });
          content.dataset.easterEggApplied = "true";
          document.querySelectorAll('.easter-egg-clone').forEach(el => {
              el.addEventListener('mouseenter', () => { document.getElementById('easter-egg-container-clone').style.display = 'block'; });
              el.addEventListener('mouseleave', () => { document.getElementById('easter-egg-container-clone').style.display = 'none'; });
          });
      }
  };

  const trackMouse = () => {
      document.addEventListener('mousemove', (e) => {
          ['easter-egg-container-clone', 'easter-egg-container-speaki'].forEach(id => {
              const el = document.getElementById(id);
              if (el && el.style.display === 'block') {
                  el.style.left = (e.clientX + 20) + 'px';
                  el.style.top = (e.clientY + 20) + 'px';
              }
          });
      });
  };

  const injectAssets = () => {
      if (!document.getElementById('naver-like-style')) {
          const s = document.createElement("style"); s.id = 'naver-like-style'; s.textContent = renewStyle; document.head.appendChild(s);
      }
      if (!document.querySelector('link[href*="font-awesome"]')) {
          const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"; document.head.appendChild(l);
      }
  };

  const init = () => { injectAssets(); createEasterEggContainers(); trackMouse(); transformLikeButton(); applyEasterEggs(); };

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);

  const observer = new MutationObserver(() => { transformLikeButton(); applyEasterEggs(); });
  observer.observe(document.body, { childList: true, subtree: true });
})();