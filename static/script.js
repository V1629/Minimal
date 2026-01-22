// DOM Elements
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const imageInput = document.getElementById("image-input");
const chatWindow = document.getElementById("chat-window");
const previewArea = document.getElementById("preview-area");
const imagePreview = document.getElementById("image-preview");
const uploadLabel = document.getElementById("upload-label");

let currentMode = "";

// MODE SWITCHING
function openText() {
    currentMode = "text";
    initChat("📝 Text Query", false);
}

function openVision() {
    currentMode = "vision";
    initChat("🖼️ Vision Query", true);
}

function initChat(title, allowImage) {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("chat").classList.remove("hidden");
    document.getElementById("mode-title").innerText = title;
    uploadLabel.classList.toggle("hidden", !allowImage);
    chatWindow.innerHTML = "";
}

function goHome() {
    document.getElementById("chat").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");
    userInput.value = "";
    imageInput.value = "";
    previewArea.style.display = "none";
}

// IMAGE PREVIEW
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        imagePreview.src = e.target.result;
        previewArea.style.display = "block";
    };
    reader.readAsDataURL(file);
});

document.getElementById("remove-img").onclick = () => {
    imageInput.value = "";
    previewArea.style.display = "none";
};

// FORM SUBMIT (🔥 PREVENTS PAGE RELOAD)
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = userInput.value.trim();
    const image = imageInput.files[0];

    if (!text && !image) return;

    addMessage(text || "Image sent", "user");

    const formData = new FormData();
    formData.append("text", text);
    if (currentMode === "vision" && image) {
        formData.append("image", image);
    }

    const endpoint = currentMode === "text"
        ? "/text-query"
        : "/vision-query";

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        addMessage(data.response || data.error, "bot");
    } catch {
        addMessage("Server error", "bot");
    }

    userInput.value = "";
    imageInput.value = "";
    previewArea.style.display = "none";
});

// ADD MESSAGE TO CHAT
function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    div.innerText = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
