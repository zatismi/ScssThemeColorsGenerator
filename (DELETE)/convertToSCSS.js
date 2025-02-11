// convertToSCSS.js
import { result } from './convertFromSCSS.js';  // Import the result variable from the other file

// You can now access the result variable or call the function
console.log(result);  // Access the imported result

// Assuming themesData is defined globally or imported from the HTML
function currentThemeFinder() {
    let currentThemeName = themesData.variables["active-theme"]; // Get active theme from JSON
    let currentTheme = themesData.themes[currentThemeName];
    return currentTheme;  // Directly return the theme object (darkner, midtones, lightner)
}

let currentTheme = currentThemeFinder();

function stringToRGBParser(colorArray) {
    return colorArray.map(value => parseInt(value)); // Directly parse the values
}

let darkner = stringToRGBParser(currentTheme.darkner);
let midtones = stringToRGBParser(currentTheme.midtones);
let lightner = stringToRGBParser(currentTheme.lightner);
let multiplayer = parseInt(themesData.variables["multiplayer"]);

let vintageOn = themesData.variables["vintage-on"] === true;

function conditionMinMax() {
    let multiplayer = themesData.variables["multiplayer"];
    if (multiplayer < 2) multiplayer = 1;
    else if (multiplayer > 100) multiplayer = 100;
    return multiplayer;
}

function scanAndUpdate(colorArray, operator) {
    return colorArray.map(value => {
        let updatedValue = value;
        updatedValue = eval(`${updatedValue} ${operator} ${conditionMinMax()}`);
        return updatedValue;
    });
}

darkner = scanAndUpdate(darkner, "+");
midtones = scanAndUpdate(midtones, "-");
lightner = scanAndUpdate(lightner, "/");

function vintageEffectColor() {
    let effectColor = midtones;
    if (vintageOn) {
        effectColor = effectColor.map(value => (value / 4) + 99);
    }
    return effectColor;
}

function vintageLightner(baseColor, specialValue = [0, 0, 0]) {
    let effectColor = baseColor;
    if (vintageOn) {
        effectColor = effectColor.map((value, index) => value + vintageEffectColor()[index] + specialValue[index]);
    }
    return effectColor;
}

function writeSCSSfile() {
    return `
$white: ${white};
$gray-100: ${gray100};
$gray-300: ${gray300};
$gray-400: ${gray400};
$gray-500: ${gray500};
$gray-800: ${gray800};
$gray-900: ${gray900};
$black: ${black};

$blue: ${blue};
$red: ${red};
$yellow: ${yellow};
$green: ${green};
$cyan: ${cyan};
$orange: ${orange};
$pink: ${pink};

$primary: ${primary};
$secondary: ${secondary};
$tertiary: ${tertiary};
$success: ${success};
$info: ${info};
$warning: ${warning};
$danger: ${danger};
$light: ${light};
$dark: ${dark};
$info-text-emphasis: ${infoTextEmphasis};
    `;
}

let fileContent = writeSCSSfile();

function viewCleanScss() {
    let cleanScss = writeSCSSfile();
    document.getElementById('cleanScssOutput').textContent = cleanScss;  // Display SCSS code in the <pre> element
}

window.viewCleanScss = viewCleanScss;
