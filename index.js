let themes = {};

function convertToJson() {
  let input = document.getElementById("inputField").value.trim();

  // Check if the input has surrounding curly braces, if not, add them
  if (!input.startsWith("{")) {
    input = `{ ${input} }`;
  }

  try {
    const inputData = eval("(" + input + ")"); // Evaluate the string as a JavaScript object
    themes = JSON.parse(JSON.stringify(inputData)); // Save the converted data into 'themes'
    const jsonOutput = JSON.stringify(inputData, null, 2); // Convert to formatted JSON
    document.getElementById("outputField").value = jsonOutput; // Display output
  } catch (error) {
    // document.getElementById('outputField').value = 'Invalid input. Please check the format.';
  }
  console.log("Basic Theme without any effects:\n", themes);
}

let activeTheme, multiplier, vintageOn, balancer;
let completion = false;
let completionText = `

// =================================
// Fonts
// https://getbootstrap.com/docs/5.3/utilities/text/#sass-variables
// =================================

// Font family
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap");
$font-family-sans-serif: Oswald, system-ui, -apple-system, "Segoe UI", Roboto,
  "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif,
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

// Font sizes
$font-size-base: 1rem; // Assumes the browser default, typically \`16px\`

$h0-font-size: $font-size-base * 3;
$h1-font-size: $font-size-base * 2.5;
$h2-font-size: $font-size-base * 2;
$h3-font-size: $font-size-base * 1.75;
$h4-font-size: $font-size-base * 1.5;
$h5-font-size: $font-size-base * 1.25;
$h6-font-size: $font-size-base;
$h7-font-size: $font-size-base * 0.75;
$h8-font-size: $font-size-base * 0.5;
$h9-font-size: $font-size-base * 0.25;

// Font weights
$font-weight-lighter:         lighter;
$font-weight-light:           300;
$font-weight-normal:          400;
$font-weight-medium:          500;
$font-weight-semibold:        600;
$font-weight-bold:            700;
$font-weight-bolder:          bolder;

$font-weight-base:            $font-weight-normal;

// Buttons
$input-btn-font-family:       null;
$input-btn-font-size:         $font-size-base;
$btn-font-weight:             $font-weight-normal;

// Badges
$badge-font-size:             .75em;
$badge-font-weight:           $font-weight-bold;

// Code
$code-font-size:              $font-size-base * 0.875;



// =================================
// Spacing
// For margins, paddings etc.
// https://getbootstrap.com/docs/5.3/utilities/spacing/#sass-maps
// =================================

$spacer: 1rem;
$spacers: (
    0: 0,
    1: $spacer * .25,
    2: $spacer * .5,
    3: $spacer,
    4: $spacer * 1.5,
    5: $spacer * 3,
    6: $spacer * 4.5,
    7: $spacer * 7
);



// =================================
// Positioning
// For elements which are relatively positioned to their container
// https://getbootstrap.com/docs/5.3/utilities/position/#sass-maps
// =================================

$position-values: (
  0: 0,
  50: 50%,
  100: 100%,
  33: 33%,
  66: 66%,
  25: 25%,
  75: 25%,
  20: 20%,
  40: 40%,
  60: 60%,
  80: 80%,
  10: 10%,
  30: 30%,
  70: 70%,
  90: 90%,
  'auto': auto
);



// =================================
// Options
// https://getbootstrap.com/docs/5.3/customize/options/
// =================================

$enable-shadows: true;
$enable-negative-margins: true;
$enable-gradients: true;
`;
let white, gray100, gray300, gray400, gray500, gray800, gray900, black, blue;
let darknerBasic, midtonesBasic, lightnerBasic;
function toggleCompletion() {
  completion = document.getElementById("complement").checked;
  // console.log("Completion:", completion); // For debugging
}

function populateThemeDropdown() {
  const themeDropdown = document.getElementById("activeTheme");
  themeDropdown.innerHTML = "no theme";

  const themeKeys = Object.keys(themes);
  if (themeKeys.length === 0) return;

  themeKeys.forEach((theme, index) => {
      const option = document.createElement("option");
      option.value = theme;
      option.textContent = theme;
      if (index === 0) option.selected = true;
      themeDropdown.appendChild(option);
  });
}


function calculateColors() {
  if (document.getElementById("activeTheme").options.length <= 1) {
    populateThemeDropdown();
  }
  activeTheme = document.getElementById("activeTheme").value;
  convertToJson();
  activeTheme = document.getElementById("activeTheme").value;
  multiplier = document.getElementById("multiplier").value;
  vintageOn = document.getElementById("vintageOn").checked;
  balancer = multiplier > 66 ? document.getElementById("balancer").value : 0;

  const conditionMinMax =
    multiplier < 2 ? 1 : multiplier > 100 ? 100 : 1 * multiplier;
  const multiplierMinus = multiplier * 0.4;
  const multiplierPlus = multiplier * 1.2;

  let [rD, gD, bD] = themes[activeTheme].darkner;
  let [rM, gM, bM] = themes[activeTheme].midtones;
  let [rL, gL, bL] = themes[activeTheme].lightner;

  const darkner = [
    rD + conditionMinMax,
    gD + conditionMinMax,
    bD + conditionMinMax,
  ];
  const midtones = [
    rM - conditionMinMax,
    gM - conditionMinMax,
    bM - conditionMinMax,
  ];
  const lightner = [
    rL / conditionMinMax,
    gL / conditionMinMax,
    bL / conditionMinMax,
  ];
  darknerBasic = `RGB(${parseInt(rD)}, ${parseInt(gD)}, ${parseInt(bD)})`;
  midtonesBasic = `RGB(${parseInt(rM)}, ${parseInt(gM)}, ${parseInt(bM)})`;
  lightnerBasic = `RGB(${parseInt(rL)}, ${parseInt(gL)}, ${parseInt(bL)})`;
  const vintageRed = (vintageOn ? midtones[0] / 4 : 0) + 99;
  const vintageGreen = (vintageOn ? midtones[1] / 4 : 0) + 99;
  const vintageBlue = (vintageOn ? midtones[2] / 4 : 0) + 99;
  const vintageRGB = [vintageRed, vintageGreen, vintageBlue];

  white = [
    darkner[0] + (vintageOn ? vintageRed / 2 : 0),
    darkner[1] + (vintageOn ? vintageGreen / 2 : 0),
    darkner[2] + (vintageOn ? vintageBlue / 2 : 0),
  ].map((value) => (value > 255 ? 255 : value < 0 ? 0 : parseInt(value)));
  gray100 = [
    midtones[0] + (vintageOn ? vintageRed / 3 : 0) + balancer,
    midtones[1] + (vintageOn ? vintageGreen / 3 : 0) + balancer,
    midtones[2] + (vintageOn ? vintageBlue / 3 : 0) + balancer,
  ].map((value) => (value > 255 ? 255 : value < 0 ? 0 : parseInt(value)));
  gray300 = [
    lightner[0] + (vintageOn ? vintageRed : 0),
    lightner[1] + (vintageOn ? vintageGreen : 0),
    lightner[2] + (vintageOn ? vintageBlue : 0),
  ].map((value) => (value > 255 ? 255 : value < 0 ? 0 : parseInt(value)));
  gray400 = [
    lightner[0] + (vintageOn ? vintageRed / multiplierMinus : 0),
    lightner[1] + (vintageOn ? vintageGreen / multiplierMinus : 0),
    lightner[2] + (vintageOn ? vintageBlue / multiplierMinus : 0),
  ].map((value) => (value > 255 ? 255 : value < 0 ? 0 : parseInt(value)));
  gray500 = [
    lightner[0] + (vintageOn ? vintageRed / multiplierPlus : 0),
    lightner[1] + (vintageOn ? vintageGreen / multiplierPlus : 0),
    lightner[2] + (vintageOn ? vintageBlue / multiplierPlus : 0),
  ].map((value) => (value > 255 ? 255 : value < 0 ? 0 : parseInt(value)));
  gray800 = [
    vintageRed + 165 + lightner[0],
    vintageGreen + 210 + lightner[1],
    vintageBlue + 122 + lightner[2],
  ].map((value) => (value > 255 ? 255 : value < 0 ? 0 : parseInt(value)));
  // gray-900 is the Texts  color
  gray900 = [
    vintageRed + 100 + (lightner[0] / multiplierPlus),
    vintageGreen + 100 + (lightner[1] / multiplierPlus),
    vintageBlue + 100 + (lightner[2] / multiplierPlus),
  ].map((value) => (value > 255 ? 255 : value < 0 ? 0 : parseInt(value)));
  black = [
    vintageRed + 165 + lightner[0] / multiplierPlus,
    vintageGreen + 205 + lightner[1] / multiplierPlus,
    vintageBlue + 126 + lightner[2] / multiplierPlus,
  ].map((value) => (value > 255 ? 255 : value < 0 ? 0 : parseInt(value)));
  blue = [
    lightner[0] + vintageRed,
    lightner[1] + vintageGreen, 
    lightner[2] + vintageBlue
  ].map((value) => (value > 255 ? 255 : value < 0 ? 0 : parseInt(value)));
}

calculateColors();

const colors = {
  white,
  gray100,
  gray300,
  gray400,
  gray500,
  gray800,
  gray900,
  black,
  blue,
};

function copyToClipboard() {}

function displayCleanScss() {
  calculateColors();
  let cleanScssString = `
////// Theme Info //////
// Name: ${activeTheme}
// Type: Dark Mode
// Basic Colors:
//     Darkner   rgb(${darknerBasic})
//     Midtones: rgb(${midtonesBasic})
//     Lightner: rgb(${lightnerBasic})
// Options:
//     Vintage Effect:    ${vintageOn ? "✅ Activated": "🚫 Deactivated"}
//     Multiplier Effect: ${multiplier == 1 ? "Real Colors" : `${multiplier} times`}
//     Balancer:          ${balancer}

//
// Colors Pallet
//

$white: rgb(${white});

$gray-100: rgb(${gray100});
$gray-300: rgb(${gray300});
$gray-400: rgb(${gray400});
$gray-500: rgb(${gray500});
$gray-800: rgb(${gray800});
$gray-900: rgb(${gray900});

$black: rgb(${black});

$blue: rgb(${blue});
$red: rgb(235, 64, 52);
$yellow: rgb(232, 235, 52);
$green: rgb(64, 235, 52);
$cyan: rgb(152, 214, 213);
$orange: rgb(235, 147, 52);
$pink: rgb(211, 152, 214);

$primary: $gray-500;
$secondary: $gray-400;
$tertiary: $gray-400;
$success: green;
$info: cyan;
$warning: yellow;
$danger: red;
$light: $gray-100;
$dark: $gray-900;

$infoTextEmphasis: $black;
`;
  cleanScssString += completion ? completionText : "// End file";

  return cleanScssString;
}

function viewCleanScss() {
  document.getElementById("cleanScssOutput").textContent = displayCleanScss();
}

function exportCleanScssFile() {
  const fileContent = displayCleanScss(); // Replace with your variable content
  const fileName = `_variables_${activeTheme}`; // Replace with your variable name
  const fileExtension = ".scss"; // Replace with your desired extension

  const blob = new Blob([fileContent], { type: "text/plain" });

  const link = document.createElement("a");

  link.download = fileName + fileExtension;

  link.href = URL.createObjectURL(blob);

  link.click();

  alert("Downloaded");
}

function copyToClipboard() {
  const cleanScssString = displayCleanScss();
  navigator.clipboard
    .writeText(cleanScssString)
    .then(() => {
      alert("SCSS copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
    });
}

function resetInputField() {
    document.getElementById("inputField").value = "";
    document.getElementById("cleanScssOutput").value = "";
}

function reactivateCleanBtn() {
  let button = document.getElementById("convertButton");
  button.disabled = false;
}

function deactivateCleanBtn() {
  let button = document.getElementById("convertButton");
  button.disabled = true;
}
