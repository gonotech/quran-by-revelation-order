const seerahKeyedSelect = document.getElementById('seerahDropdown');
const quranIndexRevisedKeyedSelect = document.getElementById('quranDropdown');
// const chapterSelect = document.getElementById('chapter-select');
const textBoxContent = document.getElementById('textBoxContent');
const collapseExample = new bootstrap.Collapse(document.getElementById('collapseExample'));

const originalVersesContainer = document.getElementById('original-verse-container');
const originalVersesIndividualDivs = document.getElementsByClassName("verse-original");

const prevChapterButtonUp = document.getElementById('prev-chapter-up');
const nextChapterButtonUp = document.getElementById('next-chapter-up');

const seerahContentCloseButton = document.getElementById('seerahContentCloseButton');
const toggleArabicCheckBox = document.getElementById('toggleArabicCheckBox');

let currentChapterIndex = 0

// default initial selection
let quranIndexRevisedKeyedCurrent = quranIndexRevisedKeyed["A"];



// Function to load JSON synchronously
function loadQuranContent(quranLangVersion) {
    // URL of the JSON file
    const jsonUrl = `https://github.com/gonotech/quran-through-seerah/blob/5a7206fe8e836d71bcccfc192afbf97fa962bd6c/data/quranContent/${quranLangVersion}.json`;

    // Function to perform synchronous request
    function loadJSONSync(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, false); // false makes the request synchronous
        xhr.send();

        if (xhr.status === 200) {
            return JSON.parse(xhr.responseText);
        } else {
            throw new Error(`HTTP error! Status: ${xhr.status}`);
        }
    }

    try {
        // Synchronously load JSON data
        const jsonData = loadJSONSync(jsonUrl);
        return jsonData
    } catch (error) {
        // Handle errors
        console.error('Error fetching data:', error);
    }
}

// Call the function to load JSON synchronously
let quranContentEn = loadQuranContent("quran_en");

// Array of JSON file options with labels
var quranLangOptions = [
    { value: "quran_en", label: "Quran (English)" },
    { value: "quran_es", label: "Quran (Spanish)" },
    { value: "quran_ru", label: "Quran (Russian)" },
    { value: "quran_bn", label: "Quran (Bengali)" },
    { value: "quran_fr", label: "Quran (French)" },
    { value: "quran_sv", label: "Quran (Swedish)" },
    { value: "quran_ur", label: "Quran (Urdu)" },
    { value: "quran_id", label: "Quran (Indonesian)" },
    { value: "quran_tr", label: "Quran (Turkish)" },
    { value: "quran_zh", label: "Quran (Chinese)" }
];

// Get the dropdown element
var quranLangDropdown = document.getElementById('quranLangDropdown');

// Populate the dropdown with options from the array
quranLangOptions.forEach(function(option) {
    var optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.text = option.label;
    quranLangDropdown.add(optionElement);
});

// Add event listener to the dropdown
quranLangDropdown.addEventListener('change', function() {
    // Get the selected value
    var selectedValue = quranLangDropdown.options[quranLangDropdown.selectedIndex].value;

    // Display the selected value
    quranContentEn = loadQuranContent(selectedValue);
    clearQuranContentBox()
});


function populateDropdown(jsonData, dropdownElement) {
    for (const key in jsonData) {
        const optionElement = document.createElement("option");
        optionElement.value = key;
        optionElement.text = `${jsonData[key]['Title']} - (${jsonData[key]['year_ce']})`;
        // seerah content is down here
        dropdownElement.appendChild(optionElement);
    }
}

window.onload = function() {
    populateDropdown(seerahShortKeyed, seerahKeyedSelect);
    collapseExample.hide(); 
};

// Function to load and display translation verses from js file
function loadChapterTranslationJson(chapterId, startVerseIdx, endVerseIdx) {
    chapterId = parseFloat(chapterId)
    // Select the element with id = 1 
    const chapterContent = quranContentEn.find(item => item.id === chapterId);
    selectedVerses = chapterContent.verses.slice(startVerseIdx, endVerseIdx)
    const originalVerses = selectedVerses.map((verse) => `${verse.text}`);
    const translationVerses = selectedVerses.map((verse) => `${verse.id}. ${verse.translation}`);
    const combinedVerses = [];

    for (let i = 0; i < originalVerses.length; i++) {
        combinedVerses.push(`<div class="verse-original" style="display:${getArabicVisibility()}">${originalVerses[i]}</div>`);
        combinedVerses.push(`<div class="verse-translation">${translationVerses[i]}</div>`);
    }

    originalVersesContainer.innerHTML = combinedVerses.join('');
}

// Function to load and display translation verses from js file
function clearQuranContentBox() {
    originalVersesContainer.innerHTML = "";
}

function getArabicVisibility() {
    if (toggleArabicCheckBox.checked) {
        return "block";
    } else {
        return "none";
    }
}


toggleArabicCheckBox.addEventListener('change', function () {
    for (var i = 0; i < originalVersesIndividualDivs.length; i++) {
        originalVersesIndividualDivs[i].style.display = getArabicVisibility();
    }
});


// Event listener for Seerah dropdown change
seerahKeyedSelect.addEventListener('change', () => {

    // get seerah content:
    updateTextBox(seerahKeyedSelect.value)
    clearQuranContentBox()

    // get surah list 
    // Get the selected key from the first dropdown
    quranIndexRevisedKeyedCurrent = quranIndexRevisedKeyed;
    let selectedKey = seerahKeyedSelect.value;
    // Get the corresponding options from quranIndexRevisedKeyed

    // clear existing selections
    while (quranIndexRevisedKeyedSelect.options.length > 1) {
        quranIndexRevisedKeyedSelect.remove(1);
    }

    try {
        quranIndexRevisedKeyedCurrent = quranIndexRevisedKeyed[selectedKey];
    
        quranIndexRevisedKeyedSelect.innerHTML = '<option value="" disabled selected>Select a Surah from this stage</option>';
        quranIndexRevisedKeyedCurrent.forEach(option => {
            let newOption = document.createElement("option");
            newOption.value = JSON.stringify(option);
            newOption.text = `${option.transliteration} (${option.id})`;
            quranIndexRevisedKeyedSelect.add(newOption);
        });
    } catch {
        console.log("Key does not exist in Quran Index: ", selectedKey)
    }
});


// Function to update the text box content and show the collapsible box
function updateTextBox(seerahStage) {
    // Update the content of the text box based on the selected option
    textBoxContent.textContent = seerahShortKeyed[seerahStage]['Stage_summary'];
    // Show the collapsible box
    collapseExample.show();
}


seerahContentCloseButton.addEventListener('click', () => {
    collapseExample.hide();
});


// Event listener for Quran dropdown change
quranIndexRevisedKeyedSelect.addEventListener('change', () => {
    const selectedQuranIdxObject = JSON.parse(quranIndexRevisedKeyedSelect.value)
    const selectedChapterId = selectedQuranIdxObject.id | 0;
    versesArray = JSON.parse(selectedQuranIdxObject.Verses)
    console.log("selectedQuranIdxObject", selectedQuranIdxObject)
    let startIdx, endIdx = 0
    startIdx = versesArray[0] - 1
    if (versesArray[1] == -1) {
        // we use slice which already excludes the last index, so don't need to use -1 here
        endIdx = selectedQuranIdxObject.total_verses
    } else {
        // we use slice which already excludes the last index, so don't need to use -1 here
        endIdx = versesArray[1]
    }
    
    // // Get the index of the selected option
    if (selectedChapterId) {
        loadChapterTranslationJson(selectedChapterId, startIdx, endIdx);
    }
});



