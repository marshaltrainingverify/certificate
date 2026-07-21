const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTR8KKM9-eODPVkTWUsCbdSL68muApoFTps4foJFFoiTHI5mNdwDVwV1foA5J9QkZR7GKftqZQfYs5w/pub?output=csv";

function parseCSV(strData, delimiter = ",") {
    const pattern = new RegExp(
        "(\\"
        + delimiter
        + "|\\r?\\n|\\r|^)"
        + "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|"
        + "([^\"\\"
        + delimiter
        + "\\r\\n]*))",
        "gi"
    );

    const rows = [[]];
    let matches;

    while ((matches = pattern.exec(strData))) {
        const matchedDelimiter = matches[1];

        if (matchedDelimiter.length && matchedDelimiter !== delimiter) {
            rows.push([]);
        }

        let matchedValue;
        if (matches[2]) {
            matchedValue = matches[2].replace(/\"\"/g, "\"");
        } else {
            matchedValue = matches[3];
        }

        rows[rows.length - 1].push(matchedValue);
    }

    return rows;
}

async function loadSheet() {
    const response = await fetch(sheetURL);
    const data = await response.text();
    return parseCSV(data);
}

function normalizeHyphens(str) {
    if (!str) return "";
    return str.replace(/–|—/g, "-").trim();
}

function showModal(details) {
    document.getElementById("certno").innerText = details.certno;
    document.getElementById("participant").innerText = details.participant;
    document.getElementById("company").innerText = details.company;
    document.getElementById("course").innerText = details.course;
    document.getElementById("coursedate").innerText = details.coursedate;
    document.getElementById("expiry").innerText = details.expiry;

    document.getElementById("resultModal").style.display = "block";
}

function closeModal() {
    document.getElementById("resultModal").style.display = "none";
}

async function verifyCert() {
    const certNo = normalizeHyphens(document.getElementById("certInput").value.trim());
    if (!certNo) {
        alert("Please enter a certificate number.");
        return;
    }

    const rows = await loadSheet();
    const headers = rows[0];

    const certIndex = headers.indexOf("Certificate NO.");
    const participantIndex = headers.indexOf("Participant Name");
    const companyIndex = headers.indexOf("Company");
    const courseIndex = headers.indexOf("Course Title");
    const courseDateIndex = headers.indexOf("Course Date");
    const expiryIndex = headers.indexOf("Expiry Date");

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const sheetCert = normalizeHyphens(row[certIndex]);

        if (sheetCert === certNo) {
            showModal({
                certno: row[certIndex],
                participant: row[participantIndex],
                company: row[companyIndex],
                course: row[courseIndex],
                coursedate: row[courseDateIndex],
                expiry: row[expiryIndex]
            });
            return;
        }
    }

    alert("Certificate not found.");
}

// QR auto-lookup: ?cert=MT-2025-2952-14
window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const certParam = params.get("cert");

    if (certParam) {
        document.getElementById("certInput").value = certParam;
        verifyCert();
    }
});
