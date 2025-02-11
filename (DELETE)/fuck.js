let input = `
$themes: (
  test:             (darkner: rgb(1, 2, 3),     midtones: rgb(4, 5, 6),        lightner: rgb(7, 8, 9)),
  regular:          (darkner: rgb(4, 4, 4),     midtones: rgb(15, 76, 162),    lightner: rgb(218, 218, 218)),
  regular2:         (darkner: rgb(5, 59, 62),   midtones: rgb(65, 149, 175),   lightner: rgb(255, 232, 99)),
  free-spirit:      (darkner: rgb(0, 0, 0),     midtones: rgb(47, 160, 86),    lightner: rgb(236, 236, 236)),
  kartoffel:        (darkner: rgb(0, 0, 0),     midtones: rgb(179, 40, 40),    lightner: rgb(255, 186, 49)),
  sweater:          (darkner: rgb(25, 20, 20),  midtones: rgb(95, 120, 150),   lightner: rgb(230, 210, 170)),
  avocado:          (darkner: rgb(35, 25, 10),  midtones: rgb(120, 140, 80),   lightner: rgb(245, 230, 160)),
  berries:          (darkner: rgb(40, 30, 35),  midtones: rgb(150, 100, 120),  lightner: rgb(230, 220, 200)),
  cappuccino-choco: (darkner: rgb(68, 48, 32),  midtones: rgb(135, 100, 85),   lightner: rgb(230, 215, 185)),
  brownies:         (darkner: rgb(45, 30, 20),  midtones: rgb(120, 85, 60),    lightner: rgb(215, 190, 150)),
  peter:            (darkner: rgb(0, 0, 0),     midtones: rgb(87, 87, 87),     lightner: rgb(255, 255, 0))
);


$active-theme: peter;
$multiplayer: 1;
$vintage-on: false; 
`;
let colorsData = {};

function convertToJson(input) {
  // Parse themes
  const themesMatch = input.match(/\$themes:\s*\(([\s\S]+?)\);/);
  if (themesMatch) {
    const themesContent = themesMatch[1].trim();
    const themes = {};

    themesContent.split(/\n/).forEach(line => {
      const match = line.match(
        /([-a-zA-Z0-9]+):\s*\(darkner:\s*rgb\(([^)]+)\),\s*midtones:\s*rgb\(([^)]+)\),\s*lightner:\s*rgb\(([^)]+)\)\)/
      );
      if (match) {
        themes[match[1]] = {
          "darkner": match[2].split(/\s*,\s*/).map(Number),
          "midtones": match[3].split(/\s*,\s*/).map(Number),
          "lightner": match[4].split(/\s*,\s*/).map(Number),
        };
      }
    });
    colorsData.themes = themes;
  }

  const variables = ['multiplayer', 'active-theme', 'vintage-on'];
  variables.forEach(variable => {
    const regex = new RegExp(`\\$${variable}:\\s*([^;]+);`);
    const match = input.match(regex);
    if (match) {
      let value = match[1].trim();

      if (!isNaN(value)) {
        value = Number(value);
      } else if (value.toLowerCase() === 'false') {
        value = false;
      } else if (value.toLowerCase() === 'true') {
        value = true;
      }

      colorsData[
        variable.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      ] = value;
    }
  });

  return colorsData;
}
// Main data JSON
let convertedJSON = convertToJson(input);

// Main Variables
let { multiplayer, vintageOn } = colorsData;
let activeThemeName = convertedJSON.activeTheme;
let activeThemeValues = convertedJSON.themes[activeThemeName];
let {darkner, midtones, lightner } = activeThemeValues;


console.log("lightner:", lightner);







function conditionMinMax() {
    if (multiplayer < 2) multiplayer = 1
    else if (multiplayer > 100) multiplayer = 100
    return multiplayer
}
// Helper Variables
let multiplyerMinus = multiplayer * 0.4;
let multiplyerPlus = multiplayer * 1.2;
let balancer = multiplayer > 66 ? 200 : 0;

// Helper functions
function scanAndUpdate(color, operator) {
    for (index in color) {
        switch (operator) {
            case '+':
                color[index] += 1;
                break;
            case '-':
                color[index] -=  1;
                break;
            case '/':
                color[index] = color[index] / conditionMinMax();
                break;
        }
    }
    return color
}


darkner = scanAndUpdate(darkner, "+");
midtones = scanAndUpdate(midtones, "-");
lightner = scanAndUpdate(lightner, "/");
console.log(midtones)

function vintageEffectColorSetter() {
    let effectColor = midtones;
    if (vintageOn){
      for (index in effectColor) {
        effectColor[index] = parseInt((effectColor[index] / 4)) + 99;
        console.log("rgb", index, effectColor[index])
      }
    }
    vintageColor = effectColor;
}

let vintageColor = [0,0,0]
vintageEffectColorSetter(vintageColor);
console.log(vintageColor)
function vintageEffectForGray800(baseColor, specialValues = [161,210,122]) { // to be checked later why always with vinrage effect
    let effectColor = baseColor;
    if (vintageOn){

    let counter = 0;
      for (index in effectColor) {
        effectColor[index] = [index] + vintageColor[index] + specialValues[counter];
        counter++;
      }
    }
    return effectColor;
}
function vintageEffectFunction(baseColor, divider = 1) {
    let adjustedColor = baseColor;
    if (vintageOn){
      for (index in adjustedColor) {
        let result = adjustedColor[index] + (parseInt((vintageColor[index]) / divider));
        adjustedColor[index] = result > 255 ? 255 : result
      }
    }
    return adjustedColor;
}

let white =  vintageEffectFunction(darkner, 2);

let gray100 = vintageEffectFunction(midtones, 3);

let gray300 = vintageEffectFunction(lightner, 3);

let gray400 = vintageEffectFunction(lightner, multiplyerMinus);

let gray500 = vintageEffectFunction(lightner, multiplyerPlus);

let gray800 = vintageEffectForGray800(lightner, [161, 210,122]);

let gray900 = vintageColor;

let black = vintageEffectFunction(lightner);

let blue = vintageEffectFunction(lightner);

let cleanedVariables =
`
//
// Colors
//
$white: rgb(${white});
$gray-100: rgb(${gray100});
$gray-300: rgb(${gray300}); // fix should result rgb(255, 255, 83);
$gray-400: rgb(${gray400}); // fix
$gray-500: rgb(${gray500}); // fix
$gray-800: rgb(${gray800}); // fix
$gray-900: rgb(${gray900});
$black: rgb(${black}); // fix

$blue: rgb(${blue}); // fix
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
`
console.log("⭐️cleanedVariables", cleanedVariables)