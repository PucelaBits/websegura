// Search functionality
document.addEventListener('DOMContentLoaded', () => {
  const searchWrapper = document.querySelector(".search-input");
  const inputBox = searchWrapper.querySelector("input");
  const suggestionBox = searchWrapper.querySelector(".autocom-box");
  const linkTag = searchWrapper.querySelector("a");

  // Handle input changes
  inputBox.addEventListener('keyup', (e) => {
    const userData = e.target.value;
    if (userData) {
      const list = suggestions
        .filter((data) => data.name.toLowerCase().includes(userData.toLowerCase()))
        .map((data) => {
          const li = document.createElement('li');
          li.textContent = data.name;
          li.classList.add('whitespace-nowrap');
          return li.outerHTML;
        });
      
      searchWrapper.classList.add("active");
      showSuggestions(list);
    } else {
      searchWrapper.classList.remove("active");
    }
  });

  // Handle suggestion selection
  suggestionBox.addEventListener('click', (e) => {
    const element = e.target;
    if (element.tagName === 'LI') {
      const selectData = element.textContent;
      inputBox.value = selectData;
      const site = suggestions.find((data) => data.name === selectData);
      if (site) {
        searchWrapper.classList.remove("active");
        linkTag.setAttribute("href", site.href);
        linkTag.click();
      }
    }
  });

  function showSuggestions(list) {
    let listData;
    if (!list.length) {
      const userValue = inputBox.value;
      listData = '<li class="notfound">No encuentro ningún resultado</li>';
    } else {
      listData = list.join('');
    }
    suggestionBox.innerHTML = listData;
  }
});
