/**
 * Copyrightⓒ2020 by Moon Hanju (github.com/it-crafts)
 * All rights reserved. 무단전재 및 재배포 금지.
 * All contents cannot be copied without permission.
 */
const common = (() => {
  const IMG_PATH = "https://it-crafts.github.io/lesson/img";
  const fetchApiData = async (url, page = "info") => {
    const res = await fetch(url + page);
    const data = await res.json();
    return data.data;
  };

  return { IMG_PATH, fetchApiData };
})();

const Root = selector => {
  let $el;
  let $page;

  const create = () => {
    $el = document.querySelector(selector);
    $page = Timeline($el);
    $page.create();
  };

  const destroy = () => {
    $page && $page.destroy();
  };

  return { $el, create, destroy };
};

const Timeline = $parent => {
  const URL = "https://my-json-server.typicode.com/it-crafts/lesson/timeline/";
  let $el;
  let $profile;
  let $content;

  const create = async () => {
    render();
    $el = $parent.firstElementChild;
    const [totalPage, profileData] = await fetch();
    $profile = TimelineProfile($el, profileData);
    $profile.create();
    $content = TimelineContent($el, URL, profileData, totalPage);
    $content.create();
  };

  const destroy = () => {
    $profile && $profile.destroy();
    $content && $content.destroy();
    $parent.removeChild($el);
  };

  const fetch = async () => {
    const infoData = await common.fetchApiData(URL);
    const totalPage = infoData.totalPage * 1;
    const profileData = infoData.profile;
    return [totalPage, profileData];
  };

  const render = () => {
    $parent.innerHTML = `
            <div class="v9tJq">
                <div class="fx7hk">
                    <a class="_9VEo1 T-jvg" href="javascript:;" data-type="grid"><span aria-label="게시물" class="glyphsSpritePhoto_grid__outline__24__grey_5 u-__7"></span></a>
                    <a class="_9VEo1" href="javascript:;" data-type="feed"><span aria-label="피드" class="glyphsSpritePhoto_list__outline__24__blue_5 u-__7"></span></a>
                    <a class="_9VEo1" href="javascript:;" data-type=""><span aria-label="태그됨" class="glyphsSpriteTag_up__outline__24__grey_5 u-__7"></span></a>
                </div>
            </div>
        `;
  };

  return { $el, create, destroy };
};

const TimelineProfile = ($parent, profileData = {}) => {
  let $el;

  const create = () => {
    render(profileData);
    $el = $parent.firstElementChild;
  };

  const destroy = () => {
    $parent.removeChild($el);
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

  return { $el, create, destroy };
};

const TimelineContent = (
  $parent,
  url = "",
  profileData = {},
  totalPage = 1
) => {
  let $el;
  let $feed;

  let page = 0;
  const dataList = [];

  const create = async () => {
    render();
    $el = $parent.lastElementChild;
    const pageDataList = await fetch();
    $feed = Feed($el.firstElementChild, profileData, pageDataList);
    $feed.create();
    initInfiniteScroll();
  };

  const destroy = () => {
    $feed && $feed.destroy();
    $parent.removeChild($el);
  };

  const fetch = async () => {
    const pageDataList = await common.fetchApiData(url, ++page);
    dataList.push(pageDataList);
    return pageDataList;
  };

  const initInfiniteScroll = () => {
    const $loading = $el.lastElementChild;
    const io = new IntersectionObserver(
      (entryList, observer) => {
        entryList.forEach(async entry => {
          if (!entry.isIntersecting) {
            return;
          }
          await ajaxMore();
          if (page >= totalPage) {
            observer.unobserve(entry.target);
            $loading.style.display = "none";
          }
        });
      },
      // rootMargin 추가
      { rootMargin: "0px 0px 2000px 0px" }
    );
    io.observe($loading);
  };

  const ajaxMore = async () => {
    const pageDataList = await fetch();
    $feed && $feed.addFeedItems(profileData, pageDataList);
  };

  const render = () => {
    $parent.insertAdjacentHTML(
      "beforeend",
      `
            <div class="_2z6nI">
                <div style="flex-direction: column;">
                </div>
                <div class="_4emnV">
                    <div class="Igw0E IwRSH YBx95 _4EzTm _9qQ0O ZUqME" style="height: 32px; width: 32px;"><svg aria-label="읽어들이는 중..." class="By4nA" viewBox="0 0 100 100"><rect fill="#555555" height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"></rect></svg></div>
                </div>
            </div>
        `
    );
  };

  return { $el, create, destroy };
};

const Feed = ($parent, profileData = {}, pageDataList = []) => {
  const $elList = [];

  const create = () => {
    addFeedItems(profileData, pageDataList);
  };

  const destroy = () => {
    $elList.forEach($el => $parent.removeChild($el));
  };

  // 이미지 요소 배열을 전달받아 관찰대상으로 등록 & 해당 이미지 요소가 화면에 나타날 때, 이미지 src 속성을 data-src 값으로 교체
  const lazyLoad = $imgs => {
    /* TODO 현재는 페이지수 만큼 io객체가 생성되고 있습니다, 만약 10페이지, 100페이지, ... 가 있다면 그 만큼 생성됩니다
    로직상 Feed는 List를 담는 컴포넌트이기 때문에, 사실 io는 하나만 있으면 충분합니다
    io 생성은 컴포넌트 레벨로 올리고, observe하는 로직만 반복되면 성능이 개선될 수 있을 것 같습니다 */
    const io = new IntersectionObserver((entryList, observer) => {
      entryList.forEach(async entry => {
        if (!entry.isIntersecting) {
          return;
        }
        /* COMMENT data 속성은 커스텀 어트리뷰트가 아니라, 엘리먼트에 데이터를 담기위한 표준입니다
        아마도 크로스 브라우징을 위해 DOM 어트리뷰트 값에 직접 접근하신 것 같습니다
        아래 표준 API도 참고 해보세요 (IE11부터 정상적으로 작동합니다, 모바일 화면이므로 사실 IE 대응 불필요합니다) */
        entry.target.src = entry.target.dataset.src;
        delete entry.target.dataset.src;
        // 관찰대상에서 제외
        observer.unobserve(entry.target);
      });
    });
    // imgs에 포함된 이미지 요소를 관찰대상으로 등록
    $imgs.forEach($img => io.observe($img));
  };

  const addFeedItems = (profileData = {}, pageDataList = []) => {
    const firstIndex = $parent.children.length;
    render(profileData, pageDataList);
    $elList.push(...[].slice.call($parent.children, firstIndex));
    // lazyLoad를 위해 관찰대상에 추가할 이미지 요소 추출하여 lazyLoad 함수에 전달
    const $imgs = [];
    $elList.forEach($el => {
      /* FIXME 일단 여기서는 FFVAD 클래스가 내부적으로 이미지를 뜻하는 게 아니어서 바람직하지 못합니다
      해당 클래스가 이미지가 맞더라도, 추후 확장시 다른 엘리먼트에 해당 클래스가 사용되면 버그가 발생합니다
      또는 해당 클래스의 이름이 변경될 경우에도 의도치 않은 동작이 발생합니다 (이 때는 장애)
      스타일을 위해 사용한 마크업 상의 클래스는 컴포넌트 로직에서는 되도록 사용을 지양해주세요
      마크업의 클래스와 컴포넌트의 로직이 의미상으로 1:1로 일치되는 경우는 거의 없습니다
      거의 대부분 우연히 그 시점에만 때려맞았을 뿐이고, 잠재적인 버그를 갖고 있습니다
      (참고로 NHN에서는, 꼭 필요할 경우 js-classname 같은 클래스를 직접 추가해서 쓰는 걸 권장합니다)
      만약 제가 했다면 img[data-src] 정도로 썼을 것 같은데, 여기부터는 취향이라 참고만 해주세요 */
      $imgs.push(...$el.querySelectorAll("img.FFVAD"));
    });
    /* BUG 추가한 이미지만 뽑으려던 것 같으나, 실제로는 $imgs에 전체 이미지(이전 페이지 포함) 들어 있습니다
    2페이지, 3페이지, ... addFeedItems 호출 시에 이전페이지 이미지들이 다시 옵저버에 등록됩니다
    겸사겸사 delete entry.target.dataset.src; 추가했으니, 끝까지 내렸다가 다시 올려보세요
    해법은 추가한 엘리먼트 대상으로 룩업을 하는 방법이 있을 것 같고 (push 하기 전에 미리 뽑아두고?)
    아니면 data-src 속성을 기준으로 뽑을 수도 있을 것 같습니다 */
    lazyLoad($imgs);
  };

  const render = (profileData, pageDataList) => {
    const html = pageDataList.reduce((html, data) => {
      html += `
                <article id="feed" class="M9sTE h0YNM SgTZ1">
                    <header class="Ppjfr UE9AK wdOqh">
                        <div class="RR-M- h5uC0 mrq0Z" role="button" tabindex="0">
                            <canvas class="CfWVH" height="126" width="126" style="position: absolute; top: -5px; left: -5px; width: 42px; height: 42px;"></canvas>
                            <span class="_2dbep" role="link" tabindex="0" style="width: 32px; height: 32px;"><img alt="${profileData.name}님의 프로필 사진" class="_6q-tv" src="${common.IMG_PATH}${profileData.img}"></span>
                        </div>
                        <div class="o-MQd">
                            <div class="e1e1d">
                                <h2 class="BrX75"><a class="FPmhX notranslate nJAzx" title="${profileData.name}" href="javascript:;">${profileData.name}</a></h2>
                            </div>
                        </div>
                    </header>
                    <div class="_97aPb">
                        <div role="button" tabindex="0" class="ZyFrc">
                            <div class="eLAPa kPFhm">
                                <div class="KL4Bh" style="padding-bottom: 100%;"><img class="FFVAD" alt="${data.name}" src="${common.IMG_PATH}/lazy${data.img}" data-src="${common.IMG_PATH}${data.img}" style="object-fit: cover;"></div>
                                <div class="_9AhH0"></div>
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
                                <div class="Nm9Fw"><a class="zV_Nj" href="javascript:;">좋아요 <span>${data.clipCount}</span>개</a></div>
                            </div>
                        </section>
                        <div class="KlCQn EtaWk">
                            <ul class="k59kT">
                                <div role="button" class="ZyFrc">
                                    <li class="gElp9" role="menuitem">
                                        <div class="P9YgZ">
                                            <div class="C7I1f X7jCj">
                                                <div class="C4VMK">
                                                    <h2 class="_6lAjh"><a class="FPmhX notranslate TlrDj" title="${profileData.name}" href="javascript:;">${profileData.name}</a></h2>
                                                    <span>${data.text}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </div>
                                <li class="lnrre">
                                    <button class="Z4IfV sqdOP yWX7d y3zKF" type="button">댓글 <span>${data.commentCount}</span>개 모두 보기</button>
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
            `;
      return html;
    }, "");
    $parent.insertAdjacentHTML("beforeend", html);
  };

  return { $elList, create, destroy, addFeedItems };
};

const root = Root("main");
root.create();
// root.destroy();
// root.create();
