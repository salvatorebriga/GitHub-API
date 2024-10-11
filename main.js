const GITHUB_TOKEN = "";

let currentPage = 1;
let totalPages = 1;
let totalResults = 0;

document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  currentPage = 1;
  fetchResults(
    document.getElementById("name").value,
    document.getElementById("type").value
  );
});

document.getElementById("menuToggle").addEventListener("click", function () {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("hidden");
});

document
  .getElementById("searchFormMobile")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    currentPage = 1;
    fetchResults(
      document.getElementById("nameMobile").value,
      document.getElementById("typeMobile").value
    );
  });

function fetchResults(name, type) {
  document.getElementById("loading").classList.remove("hidden");
  const resultsList = document.getElementById("results");
  resultsList.innerHTML = "";

  let apiUrl = `https://api.github.com/search/${type.toLowerCase()}?q=${
    name || ""
  }&page=${currentPage}`;

  fetch(apiUrl, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Errore nella richiesta");
      }
      return response.json();
    })
    .then((data) => {
      totalResults = data.total_count;
      totalPages = Math.ceil(totalResults / 30);
      displayResults(data, type);
      updatePagination();
    })
    .catch((error) => {
      console.error("Errore nella richiesta:", error);
    })
    .finally(() => {
      document.getElementById("loading").classList.add("hidden");
    });
}

function displayResults(data, type) {
  const resultsList = document.getElementById("results");
  resultsList.innerHTML = "";

  if (data.items && data.items.length > 0) {
    data.items.forEach((item) => {
      const card = document.createElement("div");
      card.className =
        "border rounded-lg shadow-lg p-5 bg-white flex flex-col items-center";

      if (type === "Repositories") {
        const avatar = document.createElement("img");
        avatar.src = item.owner.avatar_url;
        avatar.alt = `${item.owner.login} avatar`;
        avatar.className = "w-16 h-16 rounded-full mb-4";

        const title = document.createElement("h3");
        title.className = "text-lg font-bold mb-2 text-center";
        title.textContent = item.full_name;

        const description = document.createElement("p");
        description.className = "text-gray-600 mb-3 text-center";
        description.textContent = item.description
          ? item.description
          : "No description provided";

        const stars = document.createElement("p");
        stars.className = "text-sm text-yellow-500 font-bold text-center";
        stars.textContent = `⭐ ${item.stargazers_count} Stars`;

        const link = document.createElement("a");
        link.href = item.html_url;
        link.target = "_blank";
        link.className = "text-blue-500 underline mt-2 inline-block";
        link.textContent = "View Repository";

        card.appendChild(avatar);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(stars);
        card.appendChild(link);
      } else if (type === "Users") {
        const avatar = document.createElement("img");
        avatar.src = item.avatar_url;
        avatar.alt = `${item.login} avatar`;
        avatar.className = "w-16 h-16 rounded-full mb-4";

        const title = document.createElement("h3");
        title.className = "text-lg font-bold mb-2 text-center";
        title.textContent = item.login;

        const link = document.createElement("a");
        link.href = item.html_url;
        link.target = "_blank";
        link.className = "text-blue-500 underline mt-2 inline-block";
        link.textContent = "View Profile";

        card.appendChild(avatar);
        card.appendChild(title);
        card.appendChild(link);
      } else if (type === "Organizations") {
        const avatar = document.createElement("img");
        avatar.src = item.avatar_url;
        avatar.alt = `${item.login} avatar`;
        avatar.className = "w-16 h-16 rounded-full mb-4";

        const title = document.createElement("h3");
        title.className = "text-lg font-bold mb-2 text-center";
        title.textContent = item.login;

        const link = document.createElement("a");
        link.href = item.html_url;
        link.target = "_blank";
        link.className = "text-blue-500 underline mt-2 inline-block";
        link.textContent = "View Organization";

        card.appendChild(avatar);
        card.appendChild(title);
        card.appendChild(link);
      }

      resultsList.appendChild(card);
    });
  } else {
    resultsList.innerHTML = `<p class="text-gray-500">Nessun risultato trovato.</p>`;
  }
}

function updatePagination() {
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const pagination = document.getElementById("pagination");

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;

  pagination.classList.remove("hidden");
}

document.getElementById("prevButton").addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    fetchResults(
      document.getElementById("name").value,
      document.getElementById("type").value
    );
  }
});

document.getElementById("nextButton").addEventListener("click", function () {
  if (currentPage < totalPages) {
    currentPage++;
    fetchResults(
      document.getElementById("name").value,
      document.getElementById("type").value
    );
  }
});

fetchResults("react", "Repositories");
