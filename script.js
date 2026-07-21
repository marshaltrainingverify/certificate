const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTR8KKM9-eODPVkTWUsCbdSL68muApoFTps4foJFFoiTHI5mNdwDVwV1foA5J9QkZR7GKftqZQfYs5w/pub?output=csv";

// Robust CSV parser (handles quotes, commas, newlines)
function parseCSV(strData, strDelimiter = ",") {
    const objPattern = new RegExp(
        (
            // Delimiters
            "(\\"
            + strDelimiter
            + "|\\r?\\n|\\r|^)"
            +
            // Quoted fields
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|"
            +
            // Standard fields
            "([^\"\\"
            + strDelimiter
            + "\\r\\n]*))"
        ),
        "gi"
    );

    const arrData = [[]];
    let arrMatches = null;

    while ((arrMatches = objPattern.exec(strData))) {
        const strMatchedDelimiter = arrMatches[1];

        if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
            arrData.push([]);
        }

        let strMatchedValue;
        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(/\"\"/g, "\"");
        } else {
            strMatchedValue = arrMatches[3];
        }

        arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
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

function getQueryParam() {
    const params = new URLSearchParams(window.location.search);
    return params.get("cert");
}

function showModal(details) {
    document.getElementById("modalTitle").innerText = "Certificate Details";

    document.getElementById("certno").innerText = details.certno;
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
    const rows = await loadSheet();
    const headers = rows[0];

    const certIndex = headers.indexOf("Certificate NO.");
    const companyIndex = headers.indexOf("Company");
    const courseIndex = headers.indexOf("Course Title");
    const courseDateIndex = headers.indexOf("Course Date");
    const expiryIndex = headers.indexOf("Expiry Date");

    if (certIndex === -1 || companyIndex === -1 || courseIndex === -1 ||
        courseDateIndex === -1 || expiryIndex === -1) {
        alert("Column headers not found. Please check the CSV structure.");
        return;
    }

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const sheetCert = normalizeHyphens(row[certIndex]);

        if (sheetCert === certNo) {
            showModal({
                certno: row[certIndex],
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

window.onload = async () => {
    const certParam = getQueryParam();
    if (certParam) {
        document.getElementById("certInput").value = certParam;
        verifyCert();
    }
};
