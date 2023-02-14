const stringHandlers = {
  API_KEY:
    "live_5MAMo4OtNVjOeHmOw35ZPoNXz6FqT3lUQetzb5bD3y3QdNO8hlLA6Bd3LAtBmGt7",
  insertAPI_KEY: (API_KEY) => `&api_key=${API_KEY}`,
  limit: (number) => number && `?limit=${number}`,
  plainUrl: "https://api.thecatapi.com/v1",
};

const URL_API = {
  random: `${stringHandlers.plainUrl}/images/search${stringHandlers.limit(
    3
  )}${stringHandlers.insertAPI_KEY(stringHandlers.API_KEY)}`,
  favourites: `${stringHandlers.plainUrl}/favourites${stringHandlers.limit(6)}`,
  upload: `${stringHandlers.plainUrl}/images/upload`,
  delete: (id) => `${stringHandlers.plainUrl}/favourites/${id}`,
};

const createReference = (id) => document.getElementById(id);
let spanError = createReference("error");

const fetchData = async (url, options) => {
  if (!options) {
    return await fetch(url);
  } else {
    return await fetch(url, options);
  }
};

const documentHTML = {
  swapButton: createReference("buttonSwap"),
  uploadForm: createReference("uploadingForm"),
};

const loadRandomCats = async (URL_API_RANDOM) => {
  const section = createReference("catsImageWrapper");
  section.innerHTML = "";
  const response = await fetchData(URL_API_RANDOM);
  const data = await response.json();

  if (response.status === 200) {
    data.map((element) => {
      const article = document.createElement("article");
      const image = document.createElement("img");
      const button = document.createElement("button");
      const btnText = document.createTextNode("Add to favourites");

      image.src = element.url;
      image.alt = "Picture from one of our favourite cats";
      button.onclick = () => saveFavouriteCat(element.id);
      button.appendChild(btnText);
      article.appendChild(image);
      article.appendChild(button);
      section.appendChild(article);

      section.appendChild(article);
    });
  } else {
    spanError.innerHTML = `There was an error loading your random cats, ${response?.status}: ${data?.message}`;
  }
};

const loadFavouriteCats = async (URL_API_FAVOURITES) => {
  const section = createReference("catsImageWrapper2");
  section.innerHTML = "";
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "x-api-key": stringHandlers.API_KEY,
    },
  };
  const response = await fetchData(URL_API_FAVOURITES, options);
  const data = await response.json();
  if (response.status === 200) {
    await data?.map((element) => {
      const article = document.createElement("article");
      const image = document.createElement("img");
      const button = document.createElement("button");
      const btnText = document.createTextNode("Delete from favourites");

      button.appendChild(btnText);
      button.onclick = () => deleteFavourite(element.id);
      image.src = element.image.url;
      image.alt = "Picture from one of our favourite cats";
      article.appendChild(image);
      article.appendChild(button);
      section.appendChild(article);
    });
  } else {
    spanError.innerHTML = `There was an error loading your favorite cats, ${response?.status}: ${data?.message}`;
  }
};

const saveFavouriteCat = async (id) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({
      image_id: id,
    }),
  };
  const response = await fetchData(URL_API_FAVOURITES, options);
  const data = await response.json();
  if (response.status === 200) {
    spanError.innerHTML = data.message;
  } else {
    spanError.innerHTML = `There was an error loading your favorite cats, ${response?.status}: ${data?.message}`;
  }
  console.log(data);
  console.log("saved");
  loadFavouriteCats(URL_API.favourites);
};

const deleteFavourite = async (favouriteId) => {
  const options = {
    method: "DELETE",
    headers: {
      "x-api-key": stringHandlers.API_KEY,
    },
  };

  const response = await fetchData(`${URL_API.delete(favouriteId)}`, options);
  const data = await response.json();
  loadFavouriteCats(URL_API.favourites);
};

const inputImg = createReference("file");
inputImg.addEventListener("change", (event) => {
  const img = createReference("preloadPhoto");
  const pathImage = URL.createObjectURL(event.target.files[0]);
  img.src = pathImage;
  output.onload = function () {
    URL.revokeObjectURL(output.src); // free memory
  };
});

const uploadCatForm = async () => {
  const formData = new FormData(documentHTML.uploadForm);
  const options = {
    method: "POST",
    headers: {
      "x-api-key": stringHandlers.API_KEY,
    },
    body: formData,
  };
  const response = await fetchData(URL_API.upload, options);
  return response;
};

documentHTML.swapButton.addEventListener("click", async () => {
  try {
    await loadRandomCats(URL_API.random);
  } catch (error) {
    alert(error);
  }
});

loadRandomCats(URL_API.random);
loadFavouriteCats(URL_API.favourites);
