// ==UserScript==
// @name           네이버 카페 좋아요 변경
// @name:ko        네이버 카페 좋아요 변경
// @name:en        Naver Cafe Like Change
// @namespace    https://github.com/DJ-Danjin/NaverCafeLikeChange
// @version      2024-03-02-2
// @description    좋아요 버튼을 트게더스럽게 변경
// @description:ko 좋아요 버튼을 트게더스럽게 변경
// @description:en Change like button looks like tgd
// @author       DJ-Danjin
// @match        https://cafe.naver.com/*
// @icon         https://cafe.naver.com/favicon.ico?2
// @updateURL    https://github.com/DJ-Danjin/NaverCafeLikeChange/raw/main/NaverCafeLikeChange.user.js
// @downloadURL  https://github.com/DJ-Danjin/NaverCafeLikeChange/raw/main/NaverCafeLikeChange.user.js
// @grant        none
// ==/UserScript==

(function () {

  window.onload = function () {
    const renewStyle = `
    .renewBoxLeft {
      text-align: center;
    }
    
    .renewLikeIt {
      margin-right: 0 !important;
    }
    
    .renewLikeArticle {
      color: #5cb85c;
      background-color: rgba(0, 0, 0, 0);
      border-color: #5CB860;
      display: inline-block;
      padding: 6px 12px;
      margin-bottom: 0;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.42857143;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      touch-action: manipulation;
      cursor: pointer;
      user-select: none;
      background-image: none;
      border: 1px solid #5cb85c;
      border-radius: 4px;
      box-sizing: border-box;
      letter-spacing: normal;
      word-spacing: normal;
      text-indent: 0px;
      text-shadow: none;
    }

    .renewLikeText {
      color: #5cb85c;
      text-decoration: none;
    }

    .renewLikeText:focus {
      color: #5cb85c;
      text-decoration: none;
    }
    
    .renewLikeArticle:hover {
      color: #ffffff;
      background-color: #449d44;
      border-color: #255625;
    }
    
    .renewLikeText:hover {
      color: #ffffff;
      text-decoration: none;
    }
    
    .renewLikeLabel {
      margin-left: 3px !important;
    }
    `;

    const likeRenew = document.createElement("style");
    likeRenew.type = "text/css";
    likeRenew.appendChild(document.createTextNode(renewStyle));
    document.head.appendChild(likeRenew);
    console.log("Append likeRenew");
  }

  let target = document.querySelector("body");

  let observer = new MutationObserver((mutations) => {

    let appHeight = document.getElementById('app');
    let maxHeight = document.getElementById('cafe_main');
    maxHeight.style.maxHeight = appHeight.offsetHeight;

    let boxLeft = document.querySelector(".ReplyBox .box_left");
    let likeArticle = document.querySelector(".ReplyBox .box_left .like_article");
    let likeText = document.querySelector(".ReplyBox .box_left .like_article a");
    let likeit = document.querySelector(".ReplyBox .box_left .u_likeit_list_module");
    let likeLabel = document.querySelector(".ReplyBox .box_left .like_article a ._label");

    if (boxLeft !== null && likeArticle !== null && likeText !== null && likeit !== null && !likeLabel.classList.contains("renewLikeLabel")) {
      let favi = document.createElement("link");
      favi.rel = "stylesheet";
      favi.type = "text/css";
      favi.href = "https://cdn-assets.tgd.kr/css/tgd.layout.min.css?v=b351";
      document.head.appendChild(favi);
      console.log("Append Favi");

      let thumbs = document.createElement("i");
      thumbs.classList.add("fa");
      thumbs.classList.add("fa-thumbs-up");
      likeText.insertBefore(thumbs, likeText.firstChild);
      console.log("Edit icon");

      boxLeft.classList.add("renewBoxLeft");
      likeArticle.classList.add("renewLikeArticle");
      likeText.classList.add("renewLikeText");
      likeit.classList.add("renewLikeIt");
      likeLabel.classList.add("renewLikeLabel");
    }

    let likeList = document.querySelector(".ReplyBox .box_left .button_like_list");
    let comment = document.querySelector(".ReplyBox .box_left .button_comment");
    let ico = document.querySelector(".ReplyBox .box_left .like_article .u_ico");
    if (likeList !== null && comment !== null && ico !== null) {
      likeList.remove();
      comment.remove();
      ico.remove();
      console.log("Remove Tag");
    }

  })

  let option = {
    attributes: true,
    childList: true,
    characterData: true
  };

  observer.observe(target, option);

})();