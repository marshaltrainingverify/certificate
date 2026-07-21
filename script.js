const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTR8KKM9-eODPVkTWUsCbdSL68muApoFTps4foJFFoiTHI5mNdwDVwV1foA5J9QkZR7GKftqZQfYs5w/pub?output=csv";

async function loadSheet() {
    const response = await fetch(sheetURL);
    const data = await response.text();
    const rows = data.split("\n").map(r => r.split(","));
    return rows;
}

function getQueryParam() {
    const params = new URLSearchParams(window.location.search);
    return params.get("cert");
}

function showModal(details) {
    document.getElementById("modalTitle").innerText = "Certificate Verified";
    document.getElementById("name").innerText = details.name;
    document.getElementById("course").innerText = details.course;
    document.getElementById("start").innerText = details.start;
    document.getElementById("end").innerText = details.end;
    document.getElementById("issue").innerText = details.issue;
    document.getElementById("validity").innerText = details.validity;

    document.getElementById("resultModal").style.display = "block";
}

function closeModal() {
    document.getElementById("resultModal").style.display = "none";
}

async function verifyCert() {
    const certNo = document.getElementById("certInput").value.trim();
    const rows = await loadSheet();

    const headers = rows[0];
    const certIndex = headers.indexOf("Certificate Number");
    const nameIndex = headers.indexOf("Name");
    const courseIndex = headers.indexOf("Course");
    const startIndex = headers.indexOf("Start Date");
    const endIndex = headers.indexOf("Expiry Date");
    const issueIndex = headers.indexOf("Issue Date");

    for (let i = 1; i < rows.length; i++) {
        if (rows[i][certIndex] === certNo) {
            const expiry = new Date(rows[i][endIndex]);
            const today = new Date();
            const validity = today <= expiry ? "Valid" : "Expired";

            showModal({
                name: rows[i][nameIndex],
                course: rows[i][courseIndex],
                start: rows[i][startIndex],
                end: rows[i][endIndex],
                issue: rows[i][issueIndex],
                validity: validity
            });
            return;
        }
    }

    alert("Certificate not found.");
}

window.onload = async () => {
    const certParam = getQueryParam();
    if (certParam) {
        document.getElementById("certInput").value = certParam;
        verifyCert();
    }
};
