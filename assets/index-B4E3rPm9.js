(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const $header = ({
  title,
  buttonTitle,
  buttonImage
}) => {
  const header = document.createElement("header");
  header.classList.add("gnb");
  const headerTitle = document.createElement("h1");
  headerTitle.classList.add("gnb__title", "text-title");
  headerTitle.innerText = title;
  header.appendChild(headerTitle);
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("gnb__button");
  button.setAttribute("aria-label", buttonTitle);
  const img = document.createElement("img");
  img.src = buttonImage;
  img.alt = buttonTitle;
  button.appendChild(img);
  header.appendChild(button);
  return header;
};
const $inputItem = (fieldGroup, fieldName) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("form-item");
  const field = fieldGroup.fields[fieldName];
  if (field.attribute.required) {
    wrapper.classList.add("form-item--required");
  }
  const label = document.createElement("label");
  label.htmlFor = `${field.attribute.id} text-caption`;
  label.innerText = field.label;
  wrapper.appendChild(label);
  wrapper.appendChild(fieldGroup.create(field));
  if (field.helperText) {
    const helperText = document.createElement("span");
    helperText.classList.add("help-text", "text-caption");
    helperText.innerText = field.helperText;
    wrapper.appendChild(helperText);
  }
  return wrapper;
};
const handleAddRestaurant = (e) => {
  e.preventDefault();
  try {
    const form = document.getElementById(
      "add-restaurant-form"
    );
    const formData = new FormData(form);
    const data = {
      category: formData.get("category"),
      name: formData.get("name"),
      distance: formData.get("distance") ? Number(formData.get("distance")) : 0,
      description: formData.get("description"),
      link: formData.get("link"),
      isFavorite: false
    };
    validateForm(form);
    addRestaurant(data);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert("알 수 없는 오류가 발생했습니다.");
    }
  }
};
const validateForm = (form) => {
  const requiredFields = form.querySelectorAll("input[required], select[required], textarea[required]");
  requiredFields.forEach((requiredField) => {
    if (!requiredField.value.trim()) {
      const label = document.querySelector(
        `label[for="${requiredField.id} text-caption"]`
      );
      const labelText = label ? label.innerText : "";
      throw new Error(`${labelText}(은)는 필수 값입니다.`);
    }
  });
};
const $form = (form) => {
  const wrapper = document.createElement("form");
  wrapper.id = "add-restaurant-form";
  if (Array.isArray(form)) {
    form.forEach((element) => wrapper.appendChild(element));
  } else {
    wrapper.appendChild(form);
  }
  return wrapper;
};
const $favoriteButton = ({
  isFavorite,
  className = []
}) => {
  const favoriteButton = document.createElement("img");
  favoriteButton.classList.add(...className);
  if (isFavorite) favoriteButton.src = "images/star-filled.png";
  else favoriteButton.src = "images/star-outline.png";
  return favoriteButton;
};
const $restaurantItem = ({
  dataId,
  categoryIcon,
  categoryTitle,
  name,
  distance,
  distanceCaption,
  description,
  isFavorite
}) => {
  const restaurantItem = document.createElement("li");
  restaurantItem.classList.add("restaurant");
  restaurantItem.setAttribute("data-id", dataId.toString());
  const category = document.createElement("div");
  category.classList.add("restaurant__category");
  const categoryImg = document.createElement("img");
  categoryImg.src = categoryIcon;
  categoryImg.alt = categoryTitle;
  categoryImg.classList.add("category");
  category.appendChild(categoryImg);
  restaurantItem.appendChild(category);
  const info = document.createElement("div");
  info.classList.add("restaurant__info");
  const restaurantHeader = document.createElement("div");
  restaurantHeader.classList.add("restaurant-header");
  const restaurantDetails = document.createElement("div");
  const restaurantName = document.createElement("h3");
  restaurantName.classList.add("restaurant__name", "text-subtitle");
  restaurantName.innerText = name;
  restaurantDetails.appendChild(restaurantName);
  const restaurantDistance = document.createElement("span");
  restaurantDistance.classList.add("restaurant__distance", "text-body");
  restaurantDistance.innerText = distanceCaption;
  restaurantDetails.appendChild(restaurantDistance);
  restaurantHeader.appendChild(restaurantDetails);
  const favButton = $favoriteButton({
    isFavorite,
    className: ["button-favorite"]
  });
  favButton.setAttribute("data-restaurant-id", dataId.toString());
  restaurantHeader.appendChild(favButton);
  info.appendChild(restaurantHeader);
  const restaurantDescription = document.createElement("p");
  restaurantDescription.classList.add("restaurant__description", "text-body");
  restaurantDescription.innerText = description;
  info.appendChild(restaurantDescription);
  restaurantItem.appendChild(info);
  return restaurantItem;
};
const restaurantData = [
  {
    dataId: 1,
    categoryIcon: "images/category-korean.png",
    categoryTitle: "한식",
    name: "피양콩할마니",
    distance: 10,
    distanceCaption: "캠퍼스부터 10분 내",
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니...",
    link: "https://naver.me/5Rh0ttMw",
    isFavorite: false
  },
  {
    dataId: 2,
    categoryIcon: "images/category-chinese.png",
    categoryTitle: "중식",
    name: "친친",
    distance: 5,
    distanceCaption: "캠퍼스부터 5분 내",
    description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과 정성으로...",
    link: "https://naver.me/FV7Y4RTm",
    isFavorite: false
  },
  {
    dataId: 3,
    categoryIcon: "images/category-japanese.png",
    categoryTitle: "일식",
    name: "잇쇼우",
    distance: 10,
    distanceCaption: "캠퍼스부터 10분 내",
    description: "잇쇼우는 정통 자가제면 사누끼 우동이 대표메뉴입니다...",
    link: "https://naver.me/FLyTJ4dC",
    isFavorite: false
  },
  {
    dataId: 4,
    categoryIcon: "images/category-western.png",
    categoryTitle: "양식",
    name: "이태리키친",
    distance: 20,
    distanceCaption: "캠퍼스부터 20분 내",
    description: "늘 변화를 추구하는 이태리키친입니다.",
    link: "https://naver.me/5huapW2k",
    isFavorite: false
  },
  {
    dataId: 5,
    categoryIcon: "images/category-asian.png",
    categoryTitle: "아시안",
    name: "호아빈 삼성점",
    distance: 15,
    distanceCaption: "캠퍼스부터 15분 내",
    description: "푸짐한 양에 국물이 일품인 쌀국수",
    link: "https://naver.me/5WOQLjn6",
    isFavorite: false
  },
  {
    dataId: 6,
    categoryIcon: "images/category-etc.png",
    categoryTitle: "기타",
    name: "도스타코스 선릉점",
    distance: 5,
    distanceCaption: "캠퍼스부터 5분 내",
    description: "멕시칸 캐주얼 그릴",
    link: "https://naver.me/Gn0yLQ8K",
    isFavorite: false
  }
];
const saveRestaurantsToLocalStorage = (restaurants) => {
  if (!localStorage.getItem("restaurants")) {
    localStorage.setItem("restaurants", JSON.stringify(restaurantData));
    console.log(JSON.stringify(restaurantData));
  } else localStorage.setItem("restaurants", JSON.stringify(restaurants));
};
const getRestaurantsFromLocalStorage = () => {
  const storedData = localStorage.getItem("restaurants");
  if (!storedData) {
    localStorage.setItem("restaurants", JSON.stringify(restaurantData));
    return restaurantData;
  }
  return JSON.parse(storedData);
};
let currentRestaurantData = getRestaurantsFromLocalStorage();
const CATEGORY_ICON = {
  한식: "images/category-korean.png",
  중식: "images/category-chinese.png",
  일식: "images/category-japanese.png",
  양식: "images/category-western.png",
  아시안: "images/category-asian.png",
  기타: "images/category-etc.png"
};
const addRestaurant = (data) => {
  handleModalClose();
  const lastId = currentRestaurantData.length > 0 ? Math.max(...currentRestaurantData.map((r) => r.dataId)) : 0;
  const newId = lastId + 1;
  const categoryIcon = CATEGORY_ICON[data.category];
  const newRestaurant = {
    dataId: newId,
    categoryIcon,
    categoryTitle: data.category,
    name: data.name,
    distance: data.distance,
    distanceCaption: `캠퍼스부터 ${data.distance}분 내`,
    description: data.description,
    link: data.link,
    isFavorite: data.isFavorite
  };
  currentRestaurantData.push(newRestaurant);
  saveRestaurantsToLocalStorage(currentRestaurantData);
  const restaurantList = document.querySelector(".restaurant-list");
  if (!restaurantList) return;
  restaurantList.appendChild($restaurantItem(newRestaurant));
  location.reload();
};
const handleModalClose = () => {
  const modal = document.querySelector(".modal");
  if (!modal) return;
  modal.classList.remove("modal--open");
};
const handleModalOpen = () => {
  const modal = document.querySelector(".modal");
  if (!modal) return;
  modal.classList.add("modal--open");
};
const $addRestaurantModal = ({ form }) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("modal");
  const background = document.createElement("div");
  background.classList.add("modal-backdrop");
  wrapper.appendChild(background);
  const container = document.createElement("div");
  container.classList.add("modal-container");
  const title = document.createElement("h2");
  title.classList.add("modal-title", "text-title");
  title.innerText = "새로운 음식점";
  container.appendChild(title);
  container.appendChild($form(form));
  wrapper.appendChild(container);
  document.addEventListener("keydown", (e) => {
    e.key === "Escape" && handleModalClose();
  });
  background.addEventListener("click", handleModalClose);
  const headerButton = document.querySelector(".gnb__button");
  if (!headerButton) throw new Error("헤더에서 버튼을 찾을 수 없습니다.");
  headerButton.addEventListener("click", handleModalOpen);
  return wrapper;
};
const $button = ({
  id,
  text,
  type = "button",
  className = [],
  event
}) => {
  const button = document.createElement("button");
  button.id = id;
  button.innerText = text;
  button.type = type;
  button.classList.add(...className);
  if (event) {
    button.addEventListener("click", event);
  }
  return button;
};
const $buttonContainer = ({
  buttons = []
}) => {
  const container = document.createElement("div");
  container.classList.add("button-container");
  buttons.forEach((button) => {
    container.appendChild(button);
  });
  return container;
};
const $filter = ({
  attribute = {},
  options
}) => {
  const select = document.createElement("select");
  Object.assign(select, attribute);
  Object.keys(options).forEach((selectName) => {
    const option = document.createElement("option");
    option.value = String(options[selectName]);
    option.textContent = selectName;
    select.appendChild(option);
  });
  return select;
};
const UI_CONFIG = Object.freeze({
  HEADER: Object.freeze({
    title: "점심 뭐 먹지",
    buttonTitle: "음식점 추가",
    buttonImage: "images/add-button.png"
  }),
  BUTTONS: Object.freeze({
    CANCEL: {
      id: "cancel-restaurant-add-button",
      text: "취소하기",
      type: "button",
      className: [
        "button",
        "button--secondary",
        "text-caption",
        "cancel-button"
      ]
    },
    ADD: {
      id: "restaurant-add-button",
      text: "추가하기",
      type: "submit",
      className: ["button", "button--primary", "text-caption", "add-button"]
    },
    DELETE: {
      id: "delete-restaurant-button",
      text: "삭제하기",
      type: "button",
      className: [
        "button",
        "button--secondary",
        "text-caption",
        "cancel-button"
      ]
    },
    CLOSE: {
      id: "close-restaurant-detail-button",
      text: "닫기",
      type: "button",
      className: ["button", "button--primary", "text-caption", "add-button"]
    },
    FAVORITE: {
      isFavorite: false,
      className: ["button-favorite"]
    }
  })
});
const $restaurantDetailContent = (restaurant) => {
  const info = document.createElement("div");
  info.classList.add("restaurant__info");
  const restaurantHeader = document.createElement("div");
  restaurantHeader.classList.add("restaurant-header");
  const iconContainer = document.createElement("div");
  iconContainer.classList.add("restaurant_detail_category");
  const categoryIcon = document.createElement("img");
  categoryIcon.src = restaurant.categoryIcon;
  categoryIcon.alt = `${restaurant.categoryTitle} icon`;
  iconContainer.appendChild(categoryIcon);
  restaurantHeader.appendChild(iconContainer);
  const favButton = $favoriteButton({
    isFavorite: restaurant.isFavorite,
    className: ["button-favorite"]
  });
  favButton.setAttribute("data-restaurant-id", restaurant.dataId.toString());
  restaurantHeader.appendChild(favButton);
  favButton.addEventListener("mouseover", () => {
    if (!restaurant.isFavorite) favButton.src = "images/star-filled.png";
  });
  favButton.addEventListener("mouseout", () => {
    if (!restaurant.isFavorite) favButton.src = "images/star-outline.png";
  });
  favButton.addEventListener("click", (e) => {
    e.stopPropagation();
    restaurant.isFavorite = !restaurant.isFavorite;
    favButton.src = restaurant.isFavorite ? "images/star-filled.png" : "images/star-outline.png";
    saveRestaurantsToLocalStorage(currentRestaurantData);
    location.reload();
  });
  info.appendChild(restaurantHeader);
  const title = document.createElement("h3");
  title.classList.add("restaurant__name", "text-subtitle");
  title.innerText = restaurant.name;
  info.appendChild(title);
  const distance = document.createElement("span");
  distance.classList.add("restaurant_detail_distance", "text-body");
  distance.innerText = `캠퍼스로부터 ${restaurant.distance}분 내`;
  info.appendChild(distance);
  const description = document.createElement("p");
  description.classList.add("restaurant_detail_description", "text-body");
  description.innerText = restaurant.description;
  info.appendChild(description);
  const link = document.createElement("a");
  link.classList.add("restaurant_detail_link", "text-body");
  link.href = restaurant.link;
  link.innerText = restaurant.link;
  info.appendChild(link);
  const deleteButton = $button(UI_CONFIG.BUTTONS.DELETE);
  deleteButton.setAttribute("data-restaurant-id", restaurant.dataId.toString());
  const closeButton = $button(UI_CONFIG.BUTTONS.CLOSE);
  const submitCancelButtons = $buttonContainer({
    buttons: [deleteButton, closeButton]
  });
  info.appendChild(submitCancelButtons);
  return info;
};
const handleRestaurantDetailModalClose = () => {
  var _a;
  const modal = document.querySelector(".restaurant-detail-modal");
  if (!modal) return;
  modal.classList.remove("modal--open");
  (_a = document.querySelector("main")) == null ? void 0 : _a.removeChild(modal);
};
const handleRestaurantDetailModalOpen = () => {
  const modal = document.querySelector(".restaurant-detail-modal");
  if (!modal) return;
  modal.classList.add("modal--open");
};
const handleDeleteRestaurant = (id) => {
  const updatedRestaurants = currentRestaurantData.filter(
    (restaurant) => restaurant.dataId !== id
  );
  saveRestaurantsToLocalStorage(updatedRestaurants);
  location.reload();
};
const $restaurantDetailModal = (restaurant) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("restaurant-detail-modal");
  const background = document.createElement("div");
  background.classList.add("modal-backdrop");
  wrapper.appendChild(background);
  const container = document.createElement("div");
  container.classList.add("modal-container");
  const info = $restaurantDetailContent(restaurant);
  container.appendChild(info);
  wrapper.appendChild(container);
  background.addEventListener("click", () => {
    handleRestaurantDetailModalClose();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") handleRestaurantDetailModalClose();
  });
  return wrapper;
};
const $tabbar = () => {
  const tabContainer = document.createElement("div");
  tabContainer.classList.add("tab-container");
  const tab1 = document.createElement("input");
  tab1.setAttribute("type", "radio");
  tab1.name = "tab";
  tab1.id = "tab1";
  tab1.value = "all";
  tab1.classList.add("tab", "tab--1");
  tab1.checked = true;
  const tab1Label = document.createElement("label");
  tab1Label.classList.add("tab_label");
  tab1Label.setAttribute("for", "tab1");
  tab1Label.innerText = "모든 음식점";
  tabContainer.appendChild(tab1);
  tabContainer.appendChild(tab1Label);
  const tab2 = document.createElement("input");
  tab2.setAttribute("type", "radio");
  tab2.name = "tab";
  tab2.id = "tab2";
  tab2.value = "frequent";
  tab2.classList.add("tab", "tab--2");
  const tab2Label = document.createElement("label");
  tab2Label.classList.add("tab_label");
  tab2Label.setAttribute("for", "tab2");
  tab2Label.innerText = "자주 가는 음식점";
  tabContainer.appendChild(tab2);
  tabContainer.appendChild(tab2Label);
  const indicator = document.createElement("div");
  indicator.classList.add("indicator");
  tabContainer.appendChild(indicator);
  return tabContainer;
};
const $select = ({
  attribute = {},
  options
}) => {
  const select = document.createElement("select");
  Object.assign(select, attribute);
  Object.keys(options).forEach((selectName) => {
    const option = document.createElement("option");
    option.value = String(options[selectName]);
    option.textContent = selectName;
    select.appendChild(option);
  });
  return select;
};
const $input = ({ attribute = {} }) => {
  const input = document.createElement("input");
  Object.assign(input, attribute);
  return input;
};
const $textarea = ({ attribute = {} }) => {
  const textarea = document.createElement("textarea");
  Object.assign(textarea, attribute);
  return textarea;
};
const categoryOptions = {
  "선택해 주세요": "",
  한식: "한식",
  중식: "중식",
  일식: "일식",
  양식: "양식",
  아시안: "아시안",
  기타: "기타"
};
const distanceOptions = {
  "선택해 주세요": "",
  "5분 이내": 5,
  "10분 이내": 10,
  "15분 이내": 15,
  "20분 이내": 20,
  "30분 이내": 30
};
const FORM_FIELDS = Object.freeze({
  INPUTS: Object.freeze({
    fields: {
      name: {
        label: "이름",
        attribute: {
          required: true,
          id: "name",
          name: "name",
          type: "text",
          maxlength: 30,
          placeholder: "음식점 이름을 입력해주세요."
        }
      },
      link: {
        label: "참고 링크",
        attribute: {
          id: "link",
          name: "link",
          type: "text",
          maxlength: 100,
          placeholder: "https://www.woowacourse.io/"
        }
      }
    },
    create: (info) => $input(info)
  }),
  SELECTS: Object.freeze({
    fields: {
      category: {
        label: "카테고리",
        options: categoryOptions,
        attribute: {
          required: true,
          id: "category",
          name: "category"
        }
      },
      distance: {
        label: "거리(도보 이동 시간)",
        options: distanceOptions,
        attribute: {
          required: true,
          id: "distance",
          name: "distance"
        }
      }
    },
    create: (info) => {
      if ("options" in info) return $select(info);
      throw new Error("select에 옵션 값이 없습니다.");
    }
  }),
  TEXTAREAS: Object.freeze({
    fields: {
      description: {
        label: "설명",
        helperText: "메뉴 등 추가 정보를 입력해 주세요.",
        attribute: {
          id: "description",
          name: "description",
          cols: "30",
          rows: "5",
          maxlength: 200,
          placeholder: "너무 맛있는데 너무 매워서 배가 아파요,,,"
        }
      }
    },
    create: (info) => $textarea(info)
  })
});
const categoryFilterOptions = {
  전체: "",
  한식: "한식",
  중식: "중식",
  일식: "일식",
  양식: "양식",
  아시안: "아시안",
  기타: "기타"
};
const sortFilterOptions = {
  이름순: "name",
  거리순: "distance"
};
const FILTERS = Object.freeze({
  CATEGORY: {
    options: categoryFilterOptions,
    attribute: {
      name: "category",
      id: "category-filter",
      class: "restaurant-filter"
    }
  },
  SORT: {
    options: sortFilterOptions,
    attribute: {
      name: "sorting",
      id: "sorting-filter",
      class: "restaurant-filter"
    }
  },
  create: (info) => {
    if ("options" in info) return $filter(info);
    throw new Error("filter에 옵션 값이 없습니다.");
  }
});
const filterRestaurants = (restaurants, category) => {
  if (category === "") return restaurants;
  return restaurants.filter((r) => r.categoryTitle === category);
};
const sortRestaurants = (restaurants, sortBy) => {
  if (sortBy === "name") {
    return [...restaurants].sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortBy === "distance") {
    return [...restaurants].sort((a, b) => a.name.localeCompare(b.name)).sort((a, b) => a.distance - b.distance);
  }
  return restaurants;
};
const renderRestaurants = (restaurantList, restaurants) => {
  restaurantList.innerHTML = "";
  restaurants.forEach((data) => {
    restaurantList.appendChild($restaurantItem(data));
  });
};
addEventListener("load", () => {
  document.body.prepend($header(UI_CONFIG.HEADER));
  const main = document.querySelector("main");
  if (!main) return;
  const tabbar = $tabbar();
  main.prepend(tabbar);
  let selectedTab = document.querySelector(
    'input[name="tab"]:checked'
  );
  const updateRestaurantFilter = () => {
    const restaurantFilter = document.querySelector(
      ".restaurant-filter-container"
    );
    if (!restaurantFilter) return;
    if (selectedTab.value === "all") {
      restaurantFilter.classList.remove("hidden");
      restaurantFilter.innerHTML = "";
      const listFilters = [$filter(FILTERS.CATEGORY), $filter(FILTERS.SORT)];
      listFilters.forEach((data) => {
        restaurantFilter.appendChild(data);
      });
    } else if (selectedTab.value === "frequent") {
      restaurantFilter.classList.add("hidden");
    }
    const newCategoryFilter = document.querySelector("#category-filter");
    const newSortingFilter = document.querySelector("#sorting-filter");
    if (newCategoryFilter) {
      newCategoryFilter.addEventListener("change", (e) => {
        var _a;
        selectedCategory = ((_a = e.target) == null ? void 0 : _a.value) || "";
        updateList();
      });
    }
    if (newSortingFilter) {
      newSortingFilter.addEventListener("change", (e) => {
        var _a;
        selectedSorting = ((_a = e.target) == null ? void 0 : _a.value) || selectedSorting;
        updateList();
      });
    }
  };
  updateRestaurantFilter();
  const categoryFilter = document.querySelector("#category-filter");
  const sortingFilter = document.querySelector("#sorting-filter");
  const restaurantList = document.querySelector(
    ".restaurant-list"
  );
  if (!categoryFilter || !sortingFilter || !restaurantList) return;
  let selectedCategory = "";
  let selectedSorting = "name";
  tabbar.addEventListener("change", () => {
    selectedTab = document.querySelector(
      'input[name="tab"]:checked'
    );
    updateRestaurantFilter();
    selectedCategory = "";
    selectedSorting = "name";
    updateList();
  });
  const bindFavoriteEvents = () => {
    const favButtons = document.querySelectorAll(
      ".button-favorite"
    );
    favButtons.forEach((favButton) => {
      const restaurantId = favButton.getAttribute("data-restaurant-id");
      if (!restaurantId) return;
      const restaurant = currentRestaurantData.find(
        (r) => r.dataId.toString() === restaurantId
      );
      if (!restaurant) return;
      favButton.addEventListener("mouseover", () => {
        if (!restaurant.isFavorite) favButton.src = "images/star-filled.png";
      });
      favButton.addEventListener("mouseout", () => {
        if (!restaurant.isFavorite) favButton.src = "images/star-outline.png";
      });
      favButton.addEventListener("click", (e) => {
        e.stopPropagation();
        restaurant.isFavorite = !restaurant.isFavorite;
        favButton.src = restaurant.isFavorite ? "images/star-filled.png" : "images/star-outline.png";
        if (selectedTab.value === "frequent") updateList();
        saveRestaurantsToLocalStorage(currentRestaurantData);
      });
    });
  };
  const updateList = () => {
    let filteredRestaurants = [];
    if (selectedTab.value === "all") {
      filteredRestaurants = filterRestaurants(
        currentRestaurantData,
        selectedCategory
      );
    } else if (selectedTab.value === "frequent") {
      filteredRestaurants = currentRestaurantData.filter(
        (restaurant) => restaurant.isFavorite
      );
    }
    const sorted = sortRestaurants(filteredRestaurants, selectedSorting);
    renderRestaurants(restaurantList, sorted);
    saveRestaurantsToLocalStorage(currentRestaurantData);
    bindFavoriteEvents();
  };
  restaurantList.addEventListener("click", (e) => {
    const target = e.target.closest(".restaurant");
    if (!target) return;
    const restaurantId = target.getAttribute("data-id");
    if (!restaurantId) return;
    const restaurant = currentRestaurantData.find(
      (r) => r.dataId.toString() === restaurantId
    );
    if (!restaurant) return;
    const modal = $restaurantDetailModal(restaurant);
    main.appendChild(modal);
    handleRestaurantDetailModalOpen();
  });
  updateList();
  const submitCancelButtons = $buttonContainer({
    buttons: [
      $button(UI_CONFIG.BUTTONS.CANCEL),
      $button(UI_CONFIG.BUTTONS.ADD)
    ]
  });
  const restaurantAddForm = [
    $inputItem(FORM_FIELDS.SELECTS, "category"),
    $inputItem(FORM_FIELDS.INPUTS, "name"),
    $inputItem(FORM_FIELDS.SELECTS, "distance"),
    $inputItem(FORM_FIELDS.TEXTAREAS, "description"),
    $inputItem(FORM_FIELDS.INPUTS, "link"),
    submitCancelButtons
  ];
  main.appendChild($addRestaurantModal({ form: restaurantAddForm }));
  const cancelButton = document.querySelector("#cancel-restaurant-add-button");
  if (cancelButton) cancelButton.addEventListener("click", handleModalClose);
  const addButton = document.querySelector("#restaurant-add-button");
  if (addButton) addButton.addEventListener("click", handleAddRestaurant);
});
document.body.addEventListener("click", (e) => {
  const target = e.target;
  if (target.matches("#delete-restaurant-button")) {
    handleDeleteRestaurant(Number(target.getAttribute("data-restaurant-id")));
  }
  if (target.matches("#close-restaurant-detail-button")) {
    handleRestaurantDetailModalClose();
  }
});
