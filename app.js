const editor = document.getElementById("editor");
const editButton = document.getElementById("editButton");
const status = document.getElementById("status");

let editing = false;
let saveTimer = null;
let lastSavedContent = "";

function setStatus(text) {
    status.textContent = text;
}

async function loadDocument() {
    try {
        setStatus("Chargement…");

        const response = await fetch("/api/document");

        if (!response.ok) {
            throw new Error("Impossible de charger le document");
        }

        const data = await response.json();

        editor.value = data.content || "";
        lastSavedContent = editor.value;

        setStatus("Enregistré");
    } catch (error) {
        console.error(error);
        setStatus("Erreur de connexion");
    }
}

async function saveDocument() {
    const content = editor.value;

    if (content === lastSavedContent) {
        setStatus("Enregistré");
        return;
    }

    editButton.classList.add("saving");
    setStatus("Sauvegarde…");

    try {
        const response = await fetch("/api/document", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content
            })
        });

        if (!response.ok) {
            throw new Error("Erreur de sauvegarde");
        }

        lastSavedContent = content;

        setStatus("Enregistré");
    } catch (error) {
        console.error(error);
        setStatus("Erreur de sauvegarde");
    } finally {
        editButton.classList.remove("saving");
    }
}

function scheduleSave() {
    setStatus("Modifications non enregistrées");

    clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {
        saveDocument();
    }, 1000);
}

editButton.addEventListener("click", () => {
    editing = !editing;

    editor.disabled = !editing;

    if (editing) {
        editButton.textContent = "💾 Terminer";
        editor.focus();
        setStatus("Modification en cours…");
    } else {
        editButton.textContent = "✏️ Modifier";
        saveDocument();
    }
});

editor.addEventListener("input", scheduleSave);

loadDocument();