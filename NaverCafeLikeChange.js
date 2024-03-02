// ==UserScript==
// @name           네이버 카페 좋아요 변경
// @name:ko        네이버 카페 좋아요 변경
// @name:en        Naver Cafe Like Change
// @namespace    https://github.com/DJ-Danjin/NaverCafeLikeChange
// @version      000000
// @description    좋아요 버튼을 트게더스럽게 변경
// @description:ko 좋아요 버튼을 트게더스럽게 변경
// @description:en Change like button looks like tgd
// @author       DJ-Danjin
// @match        https://cafe.naver.com/*
// @icon         https://cafe.naver.com/favicon.ico?2
// @updateURL    https://github.com/DJ-Danjin/NaseongKimTgdShortcut/raw/main/NaverCafeLikeChange.user.js
// @downloadURL  https://github.com/DJ-Danjin/NaseongKimTgdShortcut/raw/main/NaverCafeLikeChange.user.js
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// ==/UserScript==

(function () {

  window.onload = function () {
    let likeRenew = document.createElement("link");
    likeRenew.rel = "stylesheet";
    likeRenew.type = "text/css";
    likeRenew.href = "https://github.com/DJ-Danjin/NaseongKimTgdShortcut/raw/main/likeRenew.user.css";
    document.head.appendChild(likeRenew);
    console.log("Append likeRenew");
  }

  $(document).ajaxStop(function () {
    let boxLeft = document.querySelector(".ReplyBox .box_left");
    let likeArticle = document.querySelector(".ReplyBox .box_left .like_article");
    let likeText = document.querySelector(".ReplyBox .box_left .like_article a");
    let likeit = document.querySelector(".ReplyBox .box_left .u_likeit_list_module");

    if (boxLeft !== null && likeArticle !== null && likeText !== null && likeit !== null) {
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

      let likeLabel = document.querySelector(".ReplyBox .box_left .like_article a ._label");
      likeLabel.innerText = "추천";
      console.log("Edit text");
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

  });

})();