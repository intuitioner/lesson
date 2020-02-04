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

    let page = 1;
    let timelineList = await common.fetchApiData(url, page++);

    const create = () => {
      render();
      // 최신순, 인기순 버튼 셀렉트
      const [
        $latestBtn,
        $popularBtn
      ] = $parent.lastElementChild.firstElementChild.getElementsByTagName(
        "button"
      );
      // 검색 인풋 셀렉트
      const $searchInput = $parent.getElementsByTagName("input")[0];
      // 검색 취소 버튼 셀렉트
      const $searchCancelBtn = document.getElementById("searchCancelBtn");
      // 이벤트 리스너 추가
      $latestBtn.addEventListener("click", () => {
        sort("latest");
      });
      $popularBtn.addEventListener("click", () => {
        sort("popular");
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
      // 마지막 Line의 사진의 수량이 1개 이거나 2개인 경우에도 버리지 않고 포함하도록 수정(검색 시 문제가 있음)
      const cnt = Math.ceil(copy.length / size);
      const listList = [];
      for (let i = 0; i < cnt; i++) {
        listList.push(copy.splice(0, size));
      }
      return listList;
    };
    const listList = divide(timelineList, 3);

    // 검색창 input에 key이벤트 발생 시, 검색하여 재렌더링 수행 함수
    const filter = (e, $searchCancelBtn) => {
      $el.lastElementChild.firstElementChild.innerHTML = "";
      if (e.target.value === "") {
        $searchCancelBtn.style.display = "none";
      }
      const filterdList = timelineList.filter(item => {
        return (
          item.name.search(e.target.value) !== -1 ||
          item.text.search(e.target.value) !== -1
        );
      });
      const listList = divide(filterdList, 3);
      items.render(listList);
    };

    const cancelSearch = $searchInput => {
      $searchInput.value = "";
      const listList = divide(timelineList, 3);
      items.render(listList);
    };

    // 최신순, 인기순 버튼 클릭 시, 정렬하여 재렌더링 수행 함수
    const sort = mode => {
      $el.lastElementChild.firstElementChild.innerHTML = "";
      if (mode === "latest") {
        timelineList.sort((x, y) => {
          return Date.parse(y.timestamp) - Date.parse(x.timestamp);
        });
        const listList = divide(timelineList, 3);
        items.render(listList);
      } else if (mode === "popular") {
        const getEvalValue = item => item.clipCount + item.commentCount * 2;
        timelineList.sort((x, y) => {
          return getEvalValue(y) - getEvalValue(x);
        });
        const listList = divide(timelineList, 3);
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

  // 그리드 영역 내 아이템 부분 객체 생성
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
          // 마지막 Line의 사진 수량이 1개이거나 2개인 경우, 빈 사진 추가하여 UI 문제점 해결
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
