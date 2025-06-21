// 🟢 Input, Button, Image Container & Load More Button ko select kar rahe hain
let input = document.querySelector(".search-box input");      // Search input field
let btn = document.querySelector(".btn button");              // Search button
let images = document.querySelector(".images");               // Container to show image results
let load = document.querySelector("#load");                   // "Load More" button

// 🔑 Unsplash API access key (replace with yours if needed)
const accessKey = "NB8agTeh9EpZDUy2drjhXo59_x4tmYu8IbhZ4JbRUD8";

// 🔢 Current page number for pagination
let page = 1;

// 🔎 Keyword for the current search
let keyword = "";

// 🧠 Main function to fetch and display images from Unsplash
async function getResponse() {
  // Get search input and remove extra spaces
  keyword = input.value.trim();

  // ❌ If search is empty, clear everything and hide "Load More"
  if (!keyword) {
    images.innerHTML = "";
    load.style.display = "none";
    return;
  }

  // 📡 API URL with page number and search keyword
  let url = `https://api.unsplash.com/search/photos?page=${page}&per_page=12&query=${keyword}&client_id=${accessKey}`;

  // 📥 Fetch data from Unsplash
  let response = await fetch(url);
  let data = await response.json();
  let results = data.results;

  console.log(results); // ✅ Console for debugging

  // 🚫 If no results found, show message and hide "Load More" button
  if (results.length === 0) {
    load.style.display = "none";
    images.innerHTML = "<p style='color:white;font-size:20px;'>No results found!</p>";
    return;
  } else {
    // ✅ If results found, show the "Load More" button
    load.style.display = "block";
  }

  // 📤 Clear previous images if it's the first page of search
  if (page === 1) {
    images.innerHTML = "";
  }

  // 🔁 Loop through each result and create HTML
  results.forEach((result) => {
    let li = document.createElement("li");
    li.classList.add("image");

    // 🧱 Template for image card with download functionality
    let html = `
      <img src="${result.urls.small}" alt="img" class="photo">
      <div class="details">
        <div class="user">
          <img src="camera.svg" alt="camera">
          <span>${result.user.name}</span>  <!-- Photographer's name -->
        </div>
        <div class="download">
          <!-- ⬇️ Image download on click -->
          <img src="download.svg" alt="download" onclick="downloadImage('${result.urls.full}', 'unsplash-${result.id}.jpg')">
        </div>
      </div>`;

    li.innerHTML = html;
    images.appendChild(li); // 📦 Add image card to gallery
  });
}

// 🔍 Search Button Click → Reset page & Fetch new results
btn.addEventListener("click", () => {
  page = 1;
  getResponse();
});

// 📥 Load More Button Click → Go to next page & fetch more images
load.addEventListener("click", () => {
  page++;
  getResponse();
});

// 💾 Function to download image using fetch + blob
async function downloadImage(url, filename) {
  try {
    const res = await fetch(url);              // Download image from URL
    const blob = await res.blob();             // Convert response to blob

    const link = document.createElement("a");  // Create a hidden anchor
    link.href = URL.createObjectURL(blob);     // Create blob link
    link.download = filename;                  // Set filename

    document.body.appendChild(link);           // Add to DOM
    link.click();                              // Auto click to download

    document.body.removeChild(link);           // Remove from DOM
    URL.revokeObjectURL(link.href);            // Clean up memory
  } catch (error) {
    console.error("Download failed:", error);  // Log if download fails
    alert("Failed to download image");         // Alert user
  }
}

// ⌨️ Enter key press on input triggers the same search
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    page = 1;          // Reset to page 1
    getResponse();     // Fetch images
  }
});

