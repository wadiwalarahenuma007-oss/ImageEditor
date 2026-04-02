let filters = {
    brightness: { min: 0, max: 200, value: 100, unit: "%" },
    contrast:   { min: 0, max: 200, value: 100, unit: "%" },
    exposure:   { min: 0, max: 200, value: 100, unit: "%" },
    saturation: { min: 0, max: 200, value: 100, unit: "%" },
    hueRotation:{ min: 0, max: 360, value: 0,   unit: "deg" },
    blur:       { min: 0, max: 10,  value: 0,   unit: "px" },
    grayscale:  { min: 0, max: 100, value: 0,   unit: "%" },
    sepia:      { min: 0, max: 100, value: 0,   unit: "%" },
    invert:     { min: 0, max: 100, value: 0,   unit: "%" },
    opacity:    { min: 0, max: 100, value: 100, unit: "%" }
}

const imageCanvas    = document.querySelector("#image-canvas");
const imageInput     = document.querySelector("#image-input");
const filtersContainer = document.querySelector(".filters");
const canvasContext  = imageCanvas.getContext("2d");
const resetBtn       = document.querySelector("#reset-btn");
const downloadBtn    = document.querySelector("#download-btn");
const presetsContainer = document.querySelector(".presets");
let file  = null;
let image = null;

function createFilterElement(filterName, min, max, value, unit = "%") {
    const div = document.createElement("div");
    div.classList.add("filter");

    // Header with label + live value
    const header = document.createElement("div");
    header.classList.add("filter-header");

    const p = document.createElement("p");
    p.innerText = filterName;

    const valueLabel = document.createElement("span");
    valueLabel.classList.add("filter-value");
    valueLabel.innerText = value + unit;

    header.appendChild(p);
    header.appendChild(valueLabel);

    const input = document.createElement("input");
    input.type  = "range";
    input.min   = min;
    input.max   = max;
    input.value = value;
    input.id    = filterName;

    div.appendChild(header);
    div.appendChild(input);

    input.addEventListener("input", (e) => {
        filters[filterName].value = input.value;
        valueLabel.innerText = input.value + unit;
        applyFilters();
    });

    return div;
}

function createFilters() {
    Object.keys(filters).forEach(key => {
        const filterElement = createFilterElement(
            key,
            filters[key].min,
            filters[key].max,
            filters[key].value,
            filters[key].unit
        );
        filtersContainer.appendChild(filterElement);
    });
}
createFilters();

imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const imagePlaceholder = document.querySelector(".placeholder");
    imageCanvas.style.display = "block";
    imagePlaceholder.style.display = "none";

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
        image = img;
        imageCanvas.width  = img.width;
        imageCanvas.height = img.height;
        canvasContext.drawImage(img, 0, 0);
    }
});

function applyFilters() {

    if (!image) return;
    
    canvasContext.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    canvasContext.filter = `
        brightness(${filters.brightness.value}${filters.brightness.unit})
        contrast(${filters.contrast.value}${filters.contrast.unit})
        saturate(${filters.saturation.value}${filters.saturation.unit})
        hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit})
        blur(${filters.blur.value}${filters.blur.unit})
        grayscale(${filters.grayscale.value}${filters.grayscale.unit})
        sepia(${filters.sepia.value}${filters.sepia.unit})
        invert(${filters.invert.value}${filters.invert.unit})
        opacity(${filters.opacity.value}${filters.opacity.unit})
    `.trim();

    canvasContext.drawImage(image, 0, 0);
}

resetBtn.addEventListener("click", (e) => {
    filters = {
        brightness: { min: 0, max: 200, value: 100, unit: "%" },
        contrast:   { min: 0, max: 200, value: 100, unit: "%" },
        exposure:   { min: 0, max: 200, value: 100, unit: "%" },
        saturation: { min: 0, max: 200, value: 100, unit: "%" },
        hueRotation:{ min: 0, max: 360, value: 0,   unit: "deg" },
        blur:       { min: 0, max: 10,  value: 0,   unit: "px" },
        grayscale:  { min: 0, max: 100, value: 0,   unit: "%" },
        sepia:      { min: 0, max: 100, value: 0,   unit: "%" },
        invert:     { min: 0, max: 100, value: 0,   unit: "%" },
        opacity:    { min: 0, max: 100, value: 100, unit: "%" }
    }

    applyFilters();

    filtersContainer.innerHTML = "";
    createFilters();

    document.querySelectorAll(".presets .btn").forEach(b => b.classList.remove("active"));
});

downloadBtn.addEventListener("click", (e) => {
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = imageCanvas.toDataURL();
    link.click();
});

const presets = {
    drama:    { brightness: 90,  contrast: 150, exposure: 110, saturation: 120, hueRotation: 0,   blur: 0, grayscale: 10,  sepia: 20,  invert: 0, opacity: 100 },
    vintage:  { brightness: 110, contrast: 90,  exposure: 95,  saturation: 70,  hueRotation: 10,  blur: 0, grayscale: 20,  sepia: 60,  invert: 0, opacity: 100 },
    oldSchool:{ brightness: 105, contrast: 85,  exposure: 100, saturation: 60,  hueRotation: -10, blur: 0, grayscale: 30,  sepia: 50,  invert: 0, opacity: 100 },
    vibrant:  { brightness: 115, contrast: 120, exposure: 110, saturation: 160, hueRotation: 0,   blur: 0, grayscale: 0,   sepia: 0,   invert: 0, opacity: 100 },
    softGlow: { brightness: 120, contrast: 80,  exposure: 115, saturation: 90,  hueRotation: 0,   blur: 2, grayscale: 0,   sepia: 10,  invert: 0, opacity: 100 },
    coolBlue: { brightness: 100, contrast: 110, exposure: 105, saturation: 90,  hueRotation: 180, blur: 0, grayscale: 0,   sepia: 0,   invert: 0, opacity: 100 },
    sunset:   { brightness: 110, contrast: 105, exposure: 110, saturation: 130, hueRotation: 20,  blur: 0, grayscale: 0,   sepia: 30,  invert: 0, opacity: 100 },
    bw:       { brightness: 100, contrast: 140, exposure: 100, saturation: 0,   hueRotation: 0,   blur: 0, grayscale: 100, sepia: 0,   invert: 0, opacity: 100 },
    cyberpunk:{ brightness: 110, contrast: 160, exposure: 115, saturation: 180, hueRotation: 270, blur: 0, grayscale: 0,   sepia: 0,   invert: 0, opacity: 100 },
    noir:     { brightness: 80,  contrast: 170, exposure: 90,  saturation: 0,   hueRotation: 0,   blur: 0, grayscale: 100, sepia: 30,  invert: 0, opacity: 100 },
    polaroid: { brightness: 120, contrast: 80,  exposure: 105, saturation: 80,  hueRotation: 5,   blur: 0, grayscale: 10,  sepia: 40,  invert: 0, opacity: 95 },
    dream:    { brightness: 130, contrast: 70,  exposure: 120, saturation: 110, hueRotation: 0,   blur: 3, grayscale: 0,   sepia: 15,  invert: 0, opacity: 95 },
    matte:    { brightness: 108, contrast: 90,  exposure: 100, saturation: 85,  hueRotation: 0,   blur: 0, grayscale: 5,   sepia: 15,  invert: 0, opacity: 100 },
    haze:     { brightness: 125, contrast: 75,  exposure: 115, saturation: 75,  hueRotation: 0,   blur: 1, grayscale: 15,  sepia: 25,  invert: 0, opacity: 90 },
    forest:   { brightness: 100, contrast: 115, exposure: 105, saturation: 140, hueRotation: 100, blur: 0, grayscale: 0,   sepia: 10,  invert: 0, opacity: 100 },
    dusk:     { brightness: 95,  contrast: 120, exposure: 100, saturation: 110, hueRotation: 330, blur: 0, grayscale: 0,   sepia: 35,  invert: 0, opacity: 100 },
    ice:      { brightness: 110, contrast: 105, exposure: 108, saturation: 80,  hueRotation: 195, blur: 0, grayscale: 10,  sepia: 0,   invert: 0, opacity: 100 },
    ghost:    { brightness: 140, contrast: 60,  exposure: 120, saturation: 20,  hueRotation: 0,   blur: 2, grayscale: 50,  sepia: 10,  invert: 0, opacity: 85 },
    infrared: { brightness: 105, contrast: 130, exposure: 110, saturation: 80,  hueRotation: 145, blur: 0, grayscale: 0,   sepia: 0,   invert: 20, opacity: 100 },
    chrome:   { brightness: 115, contrast: 130, exposure: 110, saturation: 70,  hueRotation: 0,   blur: 0, grayscale: 30,  sepia: 10,  invert: 0, opacity: 100 },
};

Object.keys(presets).forEach(presetName => {
    const presetButton = document.createElement("button");
    presetButton.classList.add("btn");
    presetButton.innerText = presetName;

    presetsContainer.appendChild(presetButton);

    presetButton.addEventListener("click", () => {
        const presetFilters = presets[presetName];

        Object.keys(presetFilters).forEach(filterName => {
            filters[filterName].value = presetFilters[filterName];
        });

        applyFilters();

        filtersContainer.innerHTML = "";
        createFilters();

        document.querySelectorAll(".presets .btn").forEach(b => b.classList.remove("active"));
        presetButton.classList.add("active");
    });
});