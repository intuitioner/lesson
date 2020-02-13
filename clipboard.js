/**
 * Copyrightⓒ2020 by Moon Hanju (github.com/it-crafts)
 * All rights reserved. 무단전재 및 재배포 금지.
 * All contents cannot be copied without permission.
 */
(async () => {
  const common = (() => {
    const IMG_PATH = "https://it-crafts.github.io/lesson/img";
    const fetchApiData = async (url, page = "info") => {
      const res = await fetch(url + page);
      const data = await res.json();
      return data.data;
    };
    Array.prototype.myFilter = function(callback) {
      const result = [];
      for (let i = 0, length = this.length; i < length; i++) {
        if (callback(this[i])) {
          result.push(this[i]);
        }
      }
      return result;
    };
    // Array.prototype에 mySort 메소드 등록
    Array.prototype.mySort = function(callback) {
      for (let i = 0, length = this.length; i < length - 1; i++) {
        if (callback(this[i], this[i + 1]) > 0) {
          const temp = this[i];
          this[i] = this[i + 1];
          this[i + 1] = temp;
          i = -1;
        }
      }
      return this;
    };
    return { IMG_PATH, fetchApiData };
  })();

  const root = (() => {
    let $el;

    const create = () => {
      $el = document.querySelector("main");
    };

    create();
    return { $el };
  })();

  const timeline = await (async $parent => {
    let $el;
    const url =
      "https://my-json-server.typicode.com/it-crafts/lesson/timeline/";
    const infoData = await common.fetchApiData(url);
    const totalPage = infoData.totalPage * 1;
    const profileData = infoData.profile;

    const create = () => {
      render();
      $el = $parent.firstElementChild;
    };

    const render = () => {
      $parent.innerHTML = `
                <div class="v9tJq">
                    <div class="fx7hk">
                        <a class="_9VEo1 T-jvg" href="./timeline.htm" data-type="grid"><span aria-label="게시물" class="glyphsSpritePhoto_grid__outline__24__grey_5 u-__7"></span></a>
                        <a class="_9VEo1" href="javascript:;" data-type="feed"><span aria-label="피드" class="glyphsSpritePhoto_list__outline__24__grey_5 u-__7"></span></a>
                        <a class="_9VEo1" href="javascript:;" data-type=""><span aria-label="태그됨" class="glyphsSpriteTag_up__outline__24__blue_5 u-__7"></span></a>
                    </div>
                </div>
            `;
    };

    create();
    return { $el, totalPage, profileData, url };
  })(root.$el);

  const timelineProfile = (($parent, profileData) => {
    let $el;

    const create = () => {
      render(profileData);
      $el = $parent.firstElementChild;
    };

    const scaleDown = numstring => {
      const num = numstring.replace(/,/g, "");
      if (num >= 1000000) {
        return Math.floor(num / 100000) / 10 + "백만";
      }
      if (num >= 1000) {
        return Math.floor(num / 100) / 10 + "천";
      }
      return num;
    };

    const render = data => {
      $parent.insertAdjacentHTML(
        "afterbegin",
        `
                <div>
                    <header class="HVbuG">
                        <div class="XjzKX">
                            <div class="RR-M- h5uC0" role="button" tabindex="0">
                                <canvas class="CfWVH" height="91" width="91" style="position: absolute; top: -7px; left: -7px; width: 91px; height: 91px;"></canvas>
                                <span class="_2dbep" role="link" tabindex="0" style="width: 77px; height: 77px;"><img alt="${
                                  data.name
                                }님의 프로필 사진" class="_6q-tv" src="${
          common.IMG_PATH
        }${data.img}"></span>
                            </div>
                        </div>
                        <section class="zwlfE">
                            <div class="nZSzR">
                                <h1 class="_7UhW9 fKFbl yUEEX KV-D4 fDxYl">${
                                  data.name
                                }</h1>
                                <span class="mrEK_ Szr5J coreSpriteVerifiedBadge" title="인증됨">인증됨</span>
                                <div class="AFWDX"><button class="dCJp8 afkep"><span aria-label="옵션" class="glyphsSpriteMore_horizontal__outline__24__grey_9 u-__7"></span></button></div>
                            </div>
                            <div class="Y2E37">
                                <div class="Igw0E IwRSH eGOV_ vwCYk">
                                    <span class="ffKix bqE32">
                                        <span class="vBF20 _1OSdk"><button class="_5f5mN jIbKX _6VtSN yZn4P">팔로우</button></span>
                                        <span class="mLCHD _1OSdk"><button class="_5f5mN jIbKX KUBKM yZn4P"><div class="OfoBO"><div class="_5fEvj coreSpriteDropdownArrowWhite"></div></div></button></span>
                                    </span>
                                </div>
                            </div>
                        </section>
                    </header>
                    <div class="-vDIg">
                        <h1 class="rhpdm">${data.title}</h1><br><span>${
          data.text
        }</span>
                    </div>
                    <ul class="_3dEHb">
                        <li class="LH36I"><span class="_81NM2">게시물 <span class="g47SY lOXF2">${
                          data.post
                        }</span></span></li>
                        <li class="LH36I"><a class="_81NM2" href="javascript:;">팔로워 <span class="g47SY lOXF2" title="${
                          data.follower
                        }">${scaleDown(data.follower)}</span></a></li>
                        <li class="LH36I"><a class="_81NM2" href="javascript:;">팔로우 <span class="g47SY lOXF2">${
                          data.follow
                        }</span></a></li>
                    </ul>
                </div>
            `
      );
    };

    create();
    return { $el };
  })(timeline.$el, timeline.profileData);

  const timelineContent = ($parent => {
    let $el;

    const create = () => {
      render();
      $el = $parent.lastElementChild;
    };

    const render = () => {
      $parent.insertAdjacentHTML(
        "beforeend",
        `
                <div class="_2z6nI">
                    <div style="flex-direction: column;">
                    </div>
                </div>
            `
      );
    };

    create();
    return { $el };
  })(timeline.$el);

  const grid = await (async ($parent, url) => {
    let $el;
    const getEvalValue = item => item.clipCount + item.commentCount * 2;
    let page = 1;
    const timelineList = await common.fetchApiData(url, page++);
    let filterdList = [...timelineList];
    const popularList = filterdList.mySort((x, y) => {
      return getEvalValue(y) - getEvalValue(x);
    });

    // 정렬 상태 변수 초기화
    let mode = "latest";

    const create = () => {
      render();
      const [
        $latestBtn,
        $popularBtn
      ] = $parent.lastElementChild.firstElementChild.getElementsByTagName(
        "button"
      );
      const $searchInput = $parent.getElementsByTagName("input")[0];
      const $searchCancelBtn = document.getElementById("searchCancelBtn");

      // 최신순 버튼 클릭 시, 정렬 상태 저장
      $latestBtn.addEventListener("click", () => {
        sort("latest");
        mode = "latest";
      });
      // 인기순 버튼 클릭 시, 정렬 상태 저장
      $popularBtn.addEventListener("click", () => {
        sort("popular");
        mode = "popular";
      });
      $searchInput.addEventListener("keyup", e => {
        $searchCancelBtn.style.display = "";
        filter(e, $searchCancelBtn);
      });
      $searchCancelBtn.addEventListener("click", () => {
        $searchCancelBtn.style.display = "none";
        cancelSearch($searchInput);
      });
      $el = $parent.lastElementChild;
    };

    const divide = (list, size) => {
      const copy = list.slice();
      const cnt = Math.ceil(copy.length / size);
      const listList = [];
      for (let i = 0; i < cnt; i++) {
        listList.push(copy.splice(0, size));
      }
      return listList;
    };
    const listList = divide(timelineList, ITEM_PER_ROW);

    // 불필요 코드 제거 & 검색 시 기존 최신순/인기순 선택 상태 반영되지 않는 점 개선
    const filter = (e, $searchCancelBtn) => {
      $el.lastElementChild.firstElementChild.innerHTML = "";
      filterdList = (mode === "popular" ? popularList : timelineList).myFilter(
        item => {
          return (
            item.name.search(e.target.value) !== -1 ||
            item.text.search(e.target.value) !== -1
          );
        }
      );
      const listList = divide(filterdList, 3);
      items.render(listList);
    };

    const cancelSearch = $searchInput => {
      $el.lastElementChild.firstElementChild.innerHTML = "";
      $searchInput.value = "";
      if (mode === "popular") {
        filterdList = [...popularList];
        const listList = divide(popularList, 3);
        items.render(listList);
      } else {
        filterdList = [...timelineList];
        const listList = divide(timelineList, 3);
        items.render(listList);
      }
    };

    const sort = mode => {
      $el.lastElementChild.firstElementChild.innerHTML = "";
      if (mode === "latest") {
        filterdList.mySort((x, y) => {
          return Date.parse(y.timestamp) - Date.parse(x.timestamp);
        });
        const listList = divide(filterdList, 3);
        items.render(listList);
      } else if (mode === "popular") {
        filterdList.mySort((x, y) => {
          return getEvalValue(y) - getEvalValue(x);
        });
        const listList = divide(filterdList, 3);
        items.render(listList);
      }
    };

    const render = () => {
      $parent.insertAdjacentHTML(
        "beforeend",
        `
                <article class="FyNDV">
                    <div class="Igw0E rBNOH YBx95 ybXk5 _4EzTm soMvl JI_ht bkEs3 DhRcB">
                        <button class="sqdOP L3NKy y3zKF JI_ht" type="button">최신순</button>
                        <button class="sqdOP L3NKy y3zKF JI_ht" type="button">인기순</button>
                        <h1 class="K3Sf1">
                            <div class="Igw0E rBNOH eGOV_ ybXk5 _4EzTm">
                                <div class="Igw0E IwRSH eGOV_ vwCYk">
                                    <div class="Igw0E IwRSH eGOV_ ybXk5 _4EzTm">
                                        <div class="Igw0E IwRSH eGOV_ vwCYk">
                                            <label class="NcCcD">
                                                <input autocapitalize="none" autocomplete="off" class="j_2Hd iwQA6 RO68f M5V28" placeholder="검색" spellcheck="true" type="search" value="" />
                                                <div class="DWAFP">
                                                    <div class="Igw0E IwRSH eGOV_ _4EzTm">
                                                        <span aria-label="검색" class="glyphsSpriteSearch u-__7"></span>
                                                    </div>
                                                    <span class="rwQu7">검색</span>
                                                </div>
                                                <div id="searchCancelBtn" class="aIYm8 coreSpriteSearchClear" role="button" style="display: none;"></div>
                                                <div class="Igw0E rBNOH YBx95 _4EzTm ItkAi O1flK fm1AK TxciK yiMZG"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </h1>
                    </div>
                    <div>
                        <div style="flex-direction: column; padding-bottom: 0px; padding-top: 0px;">
                        </div>
                    </div>
                </article>
            `
      );
    };

    create();
    return { $el, listList };
  })(timelineContent.$el.firstElementChild, timeline.url);

  const items = (($parent, listList) => {
    let $el;
    const create = () => {
      render(listList);
      $el = $parent.firstElementChild;
    };
    const render = listList => {
      listList.forEach(list => {
        let $el;
        const create = () => {
          render(list);
          $el = $parent.firstElementChild.lastElementChild;
        };
        const render = list => {
          let html = list.reduce((html, data) => {
            html += `
                                    <div class="v1Nh3 kIKUG _bz0w">
                                        <a href="javascript:;">
                                            <div class="eLAPa">
                                                <div class="KL4Bh"><img class="FFVAD" decoding="auto" src="${common.IMG_PATH}${data.img}" style="object-fit: cover;"></div>
                                            </div>
                                        </a>
                                    </div>
                                `;
            return html;
          }, "");

          const rest = list.length % 3;
          if (rest === 1) {
            html += `<div class="_bz0w"></div><div class="_bz0w"></div>`;
          } else if (rest === 2) {
            html += `<div class="_bz0w"></div>`;
          }
          $parent.firstElementChild.insertAdjacentHTML(
            "beforeend",
            `
                                <div class="Nnq7C weEfm">
                                    ${html}
                                </div>
                            `
          );
        };
        create();
        return { $el };
      });
    };
    create();
    return { $el, render };
  })(grid.$el.lastElementChild, grid.listList);
})();
