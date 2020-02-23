/**
 * Copyrightⓒ2020 by Moon Hanju (github.com/it-crafts)
 * All rights reserved. 무단전재 및 재배포 금지.
 * All contents cannot be copied without permission.
 */
const common = (function() {
  const IMG_PATH = "https://it-crafts.github.io/lesson/img";
  const fetchApiData = async (url, page = "info") => {
    const res = await fetch(url + page);
    const data = await res.json();
    return data.data;
  };

  return { IMG_PATH, fetchApiData };
})();

const Root = (() => {
  const Root = function(selector) {
    this.$el = document.querySelector(selector);
    this._page;
  };
  const proto = Root.prototype;

  proto.create = function() {
    this._page = new ItemDetail(this.$el);
    this._page.create();
  };
  proto.destroy = function() {
    this._page && this._page.destroy();
  };

  return Root;
})();

const PageTurner = (() => {
  const PageTurner = function($loading, $more) {
    this.$loading = $loading;
    this.$more = $more;
  };
  const proto = PageTurner.prototype;

  proto.more = async function(ajaxMore) {
    this.beforeMore();
    const hasNext = await ajaxMore();
    this.afterMore(hasNext);
  };
  proto.beforeMore = function() {
    this.$more.style.display = "none";
    this.$loading.style.display = "";
  };
  proto.afterMore = function(hasNext) {
    this.$loading.style.display = "none";
    if (hasNext) {
      this.$more.style.display = "";
    }
  };

  return PageTurner;
})();

const AutoPageTurner = (() => {
  const AutoPageTurner = function($loading, $more) {
    PageTurner.call(this, $loading, $more);
  };
  AutoPageTurner.prototype = Object.create(PageTurner.prototype);
  AutoPageTurner.prototype.constructor = AutoPageTurner;
  const proto = AutoPageTurner.prototype;

  proto.more = function(ajaxMore) {
    this.beforeMore();
    const io = new IntersectionObserver(
      (entryList, observer) => {
        entryList.forEach(async entry => {
          if (!entry.isIntersecting) {
            return;
          }
          const hasNext = await ajaxMore();
          if (!hasNext) {
            observer.unobserve(entry.target);
            this.afterMore(hasNext);
          }
        });
      },
      { rootMargin: innerHeight + "px" }
    );
    io.observe(this.$loading);
  };

  return AutoPageTurner;
})();

// ImageSlider 객체 생성
const ImageSlider = (() => {
  const ImageSlider = function($left, $right, $imageSlider, $pagebar) {
    this.$left = $left;
    this.$right = $right;
    this.$imageSlider = $imageSlider;
    this.$pagebar = $pagebar;
    this.numberOfImages = this.$imageSlider.lastElementChild.lastElementChild.childElementCount;
    this.numberOfShown = 1;
  };
  const proto = ImageSlider.prototype;

  proto.slideLeft = function() {
    this.beforeSlide();
    const px = Number(
      this.$imageSlider.style.transform.slice(
        11,
        this.$imageSlider.style.transform.length - 3
      )
    );
    this.$imageSlider.style.transform = `translateX(${px + innerWidth}px)`;
    this.afterSlideLeft();
  };
  proto.slideRight = function() {
    this.beforeSlide();
    const px = Number(
      this.$imageSlider.style.transform.slice(
        11,
        this.$imageSlider.style.transform.length - 3
      )
    );
    this.$imageSlider.style.transform = `translateX(${px - innerWidth}px)`;
    this.afterSlideRight();
  };
  proto.beforeSlide = function() {
    this.$imageSlider.style["transition-duration"] = "0.25s";
  };
  proto.afterSlideLeft = function() {
    this.$pagebar.children[this.numberOfShown - 1].classList.remove("XCodT");
    this.$pagebar.children[this.numberOfShown - 2].classList.add("XCodT");
    this.numberOfShown -= 1;
    this.$right.style.display = "";
    if (this.numberOfShown === 1) {
      this.$left.style.display = "none";
    }
  };
  proto.afterSlideRight = function() {
    this.$pagebar.children[this.numberOfShown - 1].classList.remove("XCodT");
    this.$pagebar.children[this.numberOfShown].classList.add("XCodT");
    this.numberOfShown += 1;
    this.$left.style.display = "";
    if (this.numberOfShown === this.numberOfImages) {
      this.$right.style.display = "none";
    }
  };
  // 화면 리사이즈 시, 이미지 슬라이더의 이미지 위치 보정 처리
  proto.adjustResizing = function() {
    // 리사이즈 시, 슬라이드의 이미지 흔들림 방지 위해 transition-duration 0으로 설정(슬라이드 버튼 누를 경우 0.25s로 복원)
    this.$imageSlider.style["transition-duration"] = "0s";
    this.$imageSlider.style.transform = `translateX(${-innerWidth *
      (this.numberOfShown - 1)}px)`;
  };

  return ImageSlider;
})();

const ItemDetail = (() => {
  const URL = "https://my-json-server.typicode.com/it-crafts/lesson/detail/";

  const ItemDetail = function($parent) {
    this.$parent = $parent;
    this.render();
    this.$el = $parent.firstElementChild;
    this.$loading = this.$el.querySelector(".js-loading");
    this.$more = this.$el.querySelector(".js-more");
    this._item;
    this._detail;
    this._pageTurner;
    this._data = {};
    this.$click;
  };
  const proto = ItemDetail.prototype;

  proto.create = async function() {
    const detailData = await this.fetch();
    this._item = new Item(
      this.$el.firstElementChild,
      detailData,
      detailData.imgList,
      detailData.profile
    );
    this._item.create();
    this._detail = new Detail(
      this.$el.firstElementChild,
      detailData.detailList
    );
    this._detail.create();
    this._pageTurner = new PageTurner(this.$loading, this.$more);
    this.addEvent();
  };
  proto.destroy = function() {
    this._item && this._item.destroy();
    this._detail && this._detail.destroy();
    this.removeEvent();
    this.$parent.removeChild(this.$el);
  };

  proto.click = function(e) {
    const listener = e.target.dataset.listener;
    if (listener === "infinite") {
      Object.setPrototypeOf(this._pageTurner, AutoPageTurner.prototype);
    }

    this._pageTurner.more(async () => {
      const { hasNext } = await this._detail.addImg();
      return hasNext;
    });
  };

  proto.addEvent = function() {
    this.$click = this.click.bind(this);
    this.$more.addEventListener("click", this.$click);
  };
  proto.removeEvent = function() {
    this.$more.removeEventListener("click", this.$click);
  };

  proto.fetch = async function() {
    const detailData = await common.fetchApiData(URL, 1);
    Object.assign(this._data, detailData);
    return detailData;
  };

  proto.render = function() {
    this.$parent.innerHTML = `
              <div class="_2z6nI">
                  <div style="flex-direction: column;">
                  </div>
                  <div class="js-more Igw0E rBNOH YBx95 ybXk5 _4EzTm soMvl" style="margin-right: 8px;">
                      <button data-listener="more" class="sqdOP L3NKy y3zKF _4pI4F" type="button" style="margin: 16px 8px">더보기</button>
                      <button data-listener="infinite" class="sqdOP L3NKy y3zKF _4pI4F" type="button" style="margin: 16px 8px">전체보기</button>
                  </div>
                  <div class="js-loading _4emnV" style="display: none;">
                      <div class="Igw0E IwRSH YBx95 _4EzTm _9qQ0O ZUqME" style="height: 32px; width: 32px;"><svg aria-label="읽어들이는 중..." class="By4nA" viewBox="0 0 100 100"><rect fill="#555555" height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"></rect></svg></div>
                  </div>
              </div>
          `;
  };

  return ItemDetail;
})();

const Item = (() => {
  const Item = function(
    $parent,
    detailData = {},
    imgDataList = [],
    profileData = {}
  ) {
    this.$parent = $parent;
    this._dataList = imgDataList;
    this.render(detailData, profileData);
    this.$el = this.$parent.firstElementChild;
    this.$slider = this.$el.querySelector(".js-slider");
    this.$sliderList = this.$slider.querySelector("ul");
    this.$left = this.$el.querySelector(".js-left");
    this.$right = this.$el.querySelector(".js-right");
    this.$pagebar = this.$el.querySelector(".js-pagebar");
    this._imageSlider;
  };
  const proto = Item.prototype;

  proto.create = function() {
    this._imageSlider = new ImageSlider(
      this.$left,
      this.$right,
      this.$slider,
      this.$pagebar
    );
    this.addEvent();
  };
  proto.destroy = function() {
    this.removeEvent();
    this.$parent.removeChild(this.$el);
  };

  proto.click = function(e) {
    const direction = e.target.dataset.direction;
    this._imageSlider[`slide${direction}`]();
  };
  proto.resize = function() {
    while (this.$sliderList.firstChild) {
      this.$sliderList.removeChild(this.$sliderList.firstChild);
    }
    this.$sliderList.insertAdjacentHTML(
      "beforeend",
      `
              ${this.htmlSliderImgs(this._dataList)}
          `
    );
    this._imageSlider.adjustResizing();
  };

  proto.addEvent = function() {
    this.$click = this.click.bind(this);
    this.$resize = this.resize.bind(this);
    this.$left.addEventListener("click", this.$click);
    this.$right.addEventListener("click", this.$click);
    window.addEventListener("resize", this.$resize);
  };
  proto.removeEvent = function() {
    this.$left.removeEventListener("click", this.$click);
    this.$right.removeEventListener("click", this.$click);
    window.removeEventListener("resize", this.$resize);
  };

  proto.htmlSliderImgs = function(imgDataList) {
    const imgs = imgDataList.reduce((html, img) => {
      html += `
                  <li class="_-1_m6" style="opacity: 1; width: ${innerWidth}px;">
                      <div class="bsGjF" style="margin-left: 0px; width: ${innerWidth}px;">
                          <div class="Igw0E IwRSH eGOV_ _4EzTm" style="width: ${innerWidth}px;">
                              <div role="button" tabindex="0" class="ZyFrc">
                                  <div class="eLAPa RzuR0">
                                      <div class="KL4Bh" style="padding-bottom: 100%;">
                                          <img class="FFVAD" decoding="auto" src="${common.IMG_PATH}${img}" style="object-fit: cover;">
                                      </div>
                                      <div class="_9AhH0"></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </li>
              `;
      return html;
    }, "");
    return imgs;
  };
  proto.render = function(data, profileData) {
    const navs = this._dataList.reduce((html, img, index) => {
      const on = index === 0 ? "XCodT" : "";
      html += `
                  <div class="Yi5aA ${on}"></div>
              `;
      return html;
    }, "");
    this.$parent.insertAdjacentHTML(
      "afterbegin",
      `
              <article class="QBXjJ M9sTE h0YNM SgTZ1 Tgarh">
                  <header class="Ppjfr UE9AK wdOqh">
                      <div class="RR-M- h5uC0 mrq0Z" role="button" tabindex="0">
                          <canvas class="CfWVH" height="126" width="126" style="position: absolute; top: -5px; left: -5px; width: 42px; height: 42px;"></canvas>
                          <span class="_2dbep" role="link" tabindex="0" style="width: 32px; height: 32px;"><img alt="${
                            profileData.name
                          }님의 프로필 사진" class="_6q-tv" src="${
        common.IMG_PATH
      }${profileData.img}"></span>
                      </div>
                      <div class="o-MQd">
                          <div class="e1e1d">
                              <h2 class="BrX75"><a class="FPmhX notranslate nJAzx" title="${
                                profileData.name
                              }" href="javascript:;">${
        profileData.name
      }</a></h2>
                          </div>
                      </div>
                  </header>
                  <div class="_97aPb wKWK0">
                      <div class="rQDP3">
                          <div class="pR7Pc">
                              <div class="tR2pe" style="padding-bottom: 100%;"></div>
                              <div class="Igw0E IwRSH eGOV_ _4EzTm O1flK D8xaz fm1AK TxciK yiMZG">
                                  <div class="tN4sQ zRsZI">
                                      <div class="NgKI_">
                                          <div class="js-slider MreMs" tabindex="0" style="transition-duration: 0.25s; transform: translateX(0px);">
                                              <div class="qqm6D">
                                                  <ul class="YlNGR" style="padding-left: 0px; padding-right: 0px;">
                                                      ${this.htmlSliderImgs(
                                                        this._dataList
                                                      )}
                                                  </ul>
                                              </div>
                                          </div>
                                      </div>
                                      <button class="js-left POSa_" tabindex="-1" style="display : none;">
                                          <div class="coreSpriteLeftChevron" data-direction="Left"></div>
                                      </button>
                                      <button class="js-right _6CZji" tabindex="-1">
                                          <div class="coreSpriteRightChevron" data-direction="Right"></div>
                                      </button>
                                  </div>
                              </div>
                              <div class="js-pagebar ijCUd _3eoV- IjCL9 _19dxx">
                                  ${navs}
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="eo2As">
                      <section class="ltpMr Slqrh">
                          <span class="fr66n"><button class="dCJp8 afkep"><span aria-label="좋아요" class="glyphsSpriteHeart__outline__24__grey_9 u-__7"></span></button></span>
                          <span class="_15y0l"><button class="dCJp8 afkep"><span aria-label="댓글 달기" class="glyphsSpriteComment__outline__24__grey_9 u-__7"></span></button></span>
                          <span class="_5e4p"><button class="dCJp8 afkep"><span aria-label="게시물 공유" class="glyphsSpriteDirect__outline__24__grey_9 u-__7"></span></button></span>
                          <span class="wmtNn"><button class="dCJp8 afkep"><span aria-label="저장" class="glyphsSpriteSave__outline__24__grey_9 u-__7"></span></button></span>
                      </section>
                      <section class="EDfFK ygqzn">
                          <div class=" Igw0E IwRSH eGOV_ ybXk5 vwCYk">
                              <div class="Nm9Fw"><a class="zV_Nj" href="javascript:;">좋아요 <span>${
                                data.clipCount
                              }</span>개</a></div>
                          </div>
                      </section>
                      <div class="KlCQn EtaWk">
                          <ul class="k59kT">
                              <div role="button" class="ZyFrc">
                                  <li class="gElp9" role="menuitem">
                                      <div class="P9YgZ">
                                          <div class="C7I1f X7jCj">
                                              <div class="C4VMK">
                                                  <h2 class="_6lAjh"><a class="FPmhX notranslate TlrDj" title="${
                                                    profileData.name
                                                  }" href="javascript:;">${
        profileData.name
      }</a></h2>
                                                  <span>${data.text}</span>
                                              </div>
                                          </div>
                                      </div>
                                  </li>
                              </div>
                              <li class="lnrre">
                                  <button class="Z4IfV sqdOP yWX7d y3zKF" type="button">댓글 <span>${
                                    data.commentCount
                                  }</span>개 모두 보기</button>
                              </li>
                          </ul>
                      </div>
                      <section class="sH9wk _JgwE eJg28">
                          <div class="RxpZH"></div>
                      </section>
                  </div>
                  <div class="MEAGs">
                      <button class="dCJp8 afkep"><span aria-label="옵션 더 보기" class="glyphsSpriteMore_horizontal__outline__24__grey_9 u-__7"></span></button>
                  </div>
              </article>
          `
    );
  };

  return Item;
})();

const Detail = (() => {
  const Detail = function($parent, detailDataList = []) {
    this.$parent = $parent;
    this._dataListTemp = detailDataList;
    this.$elList = [];
    this._dataList = [];
  };
  const proto = Detail.prototype;

  proto.create = function() {};
  proto.destroy = function() {
    this.$elList.forEach($el => this.$parent.removeChild($el));
  };

  proto.addImg = function() {
    return new Promise(resolve => {
      const detailData = this._dataListTemp.shift();
      if (!detailData) {
        resolve({ hasNext: false });
      }

      this.render(detailData);
      const $el = this.$parent.lastElementChild;
      this.$elList.push($el);
      this._dataList.push(detailData);

      $el.querySelector("img").onload = e => {
        resolve({ hasNext: this._dataListTemp.length > 0 });
      };
    });
  };

  proto.render = function(img) {
    this.$parent.insertAdjacentHTML(
      "beforeend",
      `
              <article class="M9sTE h0YNM SgTZ1">
                  <img style="width: 100%; height: auto;" src="${common.IMG_PATH}${img}">
              </article>
          `
    );
  };

  return Detail;
})();

const root = new Root("main");
root.create();
