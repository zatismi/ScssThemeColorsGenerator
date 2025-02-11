// converter.js

let result = "";
function convertToJson() {
    const scssInput = document.getElementById('scssInput').value;

    // Step 1: Parse the SCSS to JSON-like structure
    const themes = {};
    const variables = {};

    // Step 2: Regular expressions to extract theme data
    const themeRegex = /(\w[\w-]*):\s*\(\s*darkner:\s*rgb\(([^,]+),\s*([^,]+),\s*([^,]+)\),\s*midtones:\s*rgb\(([^,]+),\s*([^,]+),\s*([^,]+)\),\s*lightner:\s*rgb\(([^,]+),\s*([^,]+),\s*([^,]+)\)\)/g;
    const varRegex = /\$(\w[-\w]*):\s*(.*?);/g; // Matches SCSS variables

    // Step 3: Loop through theme matches and build JSON object
    let match;
    while ((match = themeRegex.exec(scssInput)) !== null) {
        const themeName = match[1];
        const darkner = [parseInt(match[2]), parseInt(match[3]), parseInt(match[4])];
        const midtones = [parseInt(match[5]), parseInt(match[6]), parseInt(match[7])];
        const lightner = [parseInt(match[8]), parseInt(match[9]), parseInt(match[10])];

        themes[themeName] = { darkner, midtones, lightner };
    }

    // Step 4: Loop through variables and extract them
    while ((match = varRegex.exec(scssInput)) !== null) {
        const varName = match[1];
        const value = match[2].trim();
        if (value === 'true' || value === 'false') {
            variables[varName] = value === 'true';  // Convert 'true'/'false' to boolean
        } else if (!isNaN(value)) {
            variables[varName] = parseFloat(value);  // Handle numeric values
        } else {
            variables[varName] = value;  // Keep string values as is
        }
    }

    // Step 5: Combine both themes and variables into one object
    result = { themes, variables };

    // Step 6: Display JSON output
    document.getElementById('jsonOutput').textContent = JSON.stringify(result, null, 2);
}

// ==================== Convert Back to SCSS ====================

function currentThemeFinder() {
    let currentThemeName = result.variables["active-theme"]; // Get active theme from JSON
    let currentTheme = result.themes[currentThemeName];
    return currentTheme;  // Directly return the theme object (darkner, midtones, lightner)
}
// function callerForAll(){
//     currentThemeFinder();
//     stringToRGBParser(colorArray);
//     conditionMinMax();
//     scanAndUpdate(colorArray, operator);
//     vintageEffectColor();

// }
function stringToRGBParser(colorArray) {
    return colorArray.map(value => parseInt(value)); // Directly parse the values
}

function conditionMinMax() {
    let multiplayer = result.variables["multiplayer"];
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

function vintageEffectColor() {
    let effectColor = stringToRGBParser(currentThemeFinder().midtones);
    if (result.variables["vintage-on"]) {
        effectColor = effectColor.map(value => (value / 4) + 99);
    }
    return effectColor;
}

function vintageLightner(baseColor, specialValue = [0, 0, 0]) {
    let effectColor = baseColor;
    if (result.variables["vintage-on"]) {
        effectColor = effectColor.map((value, index) => value + vintageEffectColor()[index] + specialValue[index]);
    }
    return effectColor;
}





let currentThemeArray = currentThemeFinder();


let darkner = stringToRGBParser(currentThemeArray["darkner"]);
let midtones = stringToRGBParser(currentThemeArray["midtones"]);
let lightner = stringToRGBParser(currentThemeArray["lightner"]);
let multiplayer = parseInt($multiplayer);

let vitageOn = "$vintage-on" === true;


multiplyerMinus: multiplayer * 0.4;
multiplyerPlus: multiplayer * 1.2;
balancer = 200;



darkner = scanAndUpdate(darkner, "+");
midtones = scanAndUpdate(midtones, "-");
lightner = scanAndUpdate(lightner, "/");



let vintageColor = vintageEffectColor();





let white = vintageLightner(darkner, [2, 2, 2]);
let gray100 = vintageLightnerMultiplayer(midtones, multiplayer, 3, balancer);
let gray300 = vintageLightner(lightner);
let gray400 = vintageLightnerMultiplayer(lightner, multiplyerMinus);
let gray500 = vintageLightnerMultiplayer(lightner, multiplyerPlus);
let gray800 = vintageLightner(lightner, [161, 210,122]);
let gray900 = vintageColor;
let black = vintageLightner(lightner);

let blue = intageLightner(lightner);

let red = [235, 64, 52];
let yellow = [232, 235, 52];
let green = [64, 235, 52];
let cyan = [152, 214, 213];
let orange = [235, 147, 52];
let pink = [211, 152, 214];

let primary = gray500;
let secondary = gray400;
let tertiary = gray400;
let success = success;
let info = cyan;
let warning = yellow;
let danger = red;
let light = gray100;
let dark = gray900;

let infoTextEmphasis = black;

function writeSCSSfile(){
  return
`
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
$infoTextEmphasis; ${infoTextEmphasis};
`;
}





// function writeSCSSfile() {
//     return `
// $white: ${result.variables.white};
// $gray-100: ${result.variables.gray100};
// $gray-300: ${result.variables.gray300};
// $gray-400: ${result.variables.gray400};
// $gray-500: ${result.variables.gray500};
// $gray-800: ${result.variables.gray800};
// $gray-900: ${result.variables.gray900};
// $black: ${result.variables.black};

// $blue: ${result.variables.blue};
// $red: ${result.variables.red};
// $yellow: ${result.variables.yellow};
// $green: ${result.variables.green};
// $cyan: ${result.variables.cyan};
// $orange: ${result.variables.orange};
// $pink: ${result.variables.pink};

// $primary: ${result.variables.primary};
// $secondary: ${result.variables.secondary};
// $tertiary: ${result.variables.tertiary};
// $success: ${result.variables.success};
// $info: ${result.variables.info};
// $warning: ${result.variables.warning};
// $danger: ${result.variables.danger};
// $light: ${result.variables.light};
// $dark: ${result.variables.dark};
// $info-text-emphasis: ${result.variables.infoTextEmphasis};
//     `;
// }

function viewCleanScss() {
    convertToJson();
    let cleanScss = writeSCSSfile();
    document.getElementById('cleanScssOutput').textContent = cleanScss;  // Display SCSS code in the <pre> element
}

// Make the function accessible in HTML
// window.viewCleanScss = viewCleanScss;
// window.convertToJson = convertToJson;
