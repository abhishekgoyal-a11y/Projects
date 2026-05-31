const markdownInput =
document.getElementById("markdownInput");

const preview =
document.getElementById("preview");

const wordCount =
document.getElementById("wordCount");

const charCount =
document.getElementById("charCount");

const saveStatus =
document.getElementById("saveStatus");

const clearBtn =
document.getElementById("clearBtn");

const copyBtn =
document.getElementById("copyBtn");

const downloadBtn =
document.getElementById("downloadBtn");

const themeToggle =
document.getElementById("themeToggle");

function renderMarkdown() {

    const markdownText =
    markdownInput.value;

    preview.innerHTML =
    marked.parse(markdownText);

    updateCounts();
    saveDraft();
}

function updateCounts() {

    const text =
    markdownInput.value.trim();

    const words =
    text === ""
    ? 0
    : text.split(/\s+/).length;

    wordCount.textContent =
    words;

    charCount.textContent =
    markdownInput.value.length;
}
function saveDraft() {

    localStorage.setItem(
        "markdownDraft",
        markdownInput.value
    );

    saveStatus.textContent =
    "Saved";
}

function loadDraft() {

    const draft =
    localStorage.getItem(
        "markdownDraft"
    );

    if(draft){

        markdownInput.value =
        draft;

    }

    renderMarkdown();
}

markdownInput.addEventListener(
    "input",
    () => {

        saveStatus.textContent =
        "Saving...";

        renderMarkdown();
    }
);
clearBtn.addEventListener(
"click",
() => {

    const ok =
    confirm(
    "Clear all markdown content?"
    );

    if(!ok) return;

    markdownInput.value = "";

    renderMarkdown();
}
);

copyBtn.addEventListener(
"click",
async () => {

    try{

        await navigator.clipboard.writeText(
            markdownInput.value
        );

        copyBtn.textContent =
        "✅ Copied";

        setTimeout(() => {

            copyBtn.textContent =
            "📋 Copy Markdown";

        },1500);

    }catch{

        alert(
        "Copy failed."
        );

    }
}
);

downloadBtn.addEventListener(
"click",
() => {

    const htmlFile = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Markdown Export</title>
</head>
<body>

${preview.innerHTML}

</body>
</html>
`;

    const blob =
    new Blob(
        [htmlFile],
        {type:"text/html"}
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;
    a.download =
    "markdown-output.html";

    a.click();

    URL.revokeObjectURL(url);
}
);

themeToggle.addEventListener(
"click",
() => {

    document.body.classList.toggle(
    "light-mode"
    );

    const light =
    document.body.classList.contains(
    "light-mode"
    );

    if(light){

        themeToggle.textContent =
        "☀ Light Mode";

        localStorage.setItem(
        "theme",
        "light"
        );

    }else{

        themeToggle.textContent =
        "🌙 Dark Mode";

        localStorage.setItem(
        "theme",
        "dark"
        );
    }
}
);

function loadTheme() {

    const theme =
    localStorage.getItem(
    "theme"
    );

    if(theme === "light"){

        document.body.classList.add(
        "light-mode"
        );

        themeToggle.textContent =
        "☀ Light Mode";
    }
}

loadTheme();
loadDraft();
renderMarkdown();