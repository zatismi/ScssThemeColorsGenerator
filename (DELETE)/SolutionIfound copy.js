function p(arg){
  console.log(arg)
}
let input = `
$themes: (
  test:             (darkner: rgb(1, 1, 1),     midtones: rgb(2, 2, 2),        lightner: rgb(3, 3, 3)),
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


$active-theme: test ;
$multiplayer: 1;
$vintage-on: false; 
`;
const colorsData = {};

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
        console.log("Raw lightner:", match[4]); // Debugging line

        themes[match[1]] = {
          darkner: match[2].split(/\s*,\s*/).map(Number),
          midtones: match[3].split(/\s*,\s*/).map(Number),
          lightner: match[4].split(/\s*,\s*/).map(Number),
        };
      }

    });

    colorsData.themes = themes;
    // console.log(colorsData.themes)

  }

  // Parse variables
  const variables = ['multiplayer', 'active-theme', 'vintage-on'];
  variables.forEach(variable => {
    const regex = new RegExp(`\\$${variable}:\\s*([^;]+);`);
    const match = input.match(regex);
    if (match) {
      let value = match[1].trim();

      // Convert numbers, booleans, and keep strings as is
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
// console.log(colorsData)
let testArr = [1,2,3]
// console.log(testArr)

// Main data JSON
let convertedJSON = convertToJson(input);
// console.log(convertedJSON);

// Main Variables
let { multiplayer, vintageOn } = colorsData;
let activeThemeName = convertedJSON.activeTheme;
let activeThemeValues = convertedJSON.themes[activeThemeName];
let {darkner, midtones, lightner } = activeThemeValues;
// console.log(activeThemeValues)
// let darkner = activeThemeValues.darkner
// let lightner = activeThemeValues.lightner
// let midtones = activeThemeValues.midtones
// console.log("⭐️Midtones:", midtones.length, midtones);
// console.log("⭐️Lightner:", lightner.length, lightner);

multiplayer = 1 // it actually should start from 0 and 0 will not change the origianl color
p(lightner)
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
                color[index] += conditionMinMax();
                break;
            case '-':
                color[index] -=  conditionMinMax();
                break;
            case '/':
                color[index] = parseInt(color[index] / conditionMinMax());
                break;
        }
    }
    return color
}
// console.log(darkner)
darkner = scanAndUpdate(darkner, "+");
// console.log(darkner)
// console.log(midtones)
midtones = scanAndUpdate(midtones, "-");
// console.log(midtones)
// console.log(lightner)
lightner = scanAndUpdate(lightner, "/");
// console.log(lightner)

vintageOn = false
function vintageEffectColor() {
    let effectColor = midtones;
    if (vintageOn){
      for (index in effectColor) {
        effectColor[index] = parseInt((effectColor[index] / 4)) + 99;
      }
    }
    return effectColor;
}

let vintageColor = vintageEffectColor();

function vintageEffectForGray800(baseColor, specialValues = [161,210,122]) { // ro be checked later why always with vinrage effect
    let effectColor = baseColor;
    // if (vintageOn){

    let counter = 0;
      for (index in effectColor) {
        effectColor[index] = [index] + vintageColor[index] + specialValues[counter];
        counter++;
      }
    // }
    return effectColor;
}


// function vintageEffectWithMultiPlusMinus(baseColor, divider = 1) {
//     let adjustedColor = baseColor;
//     if (vintageOn){
//       for (index in adjustedColor) {
//         adjustedColor[index] = adjustedColor[index] + parseInt((vintageColor[index] / divider));
//       }
//     }
//     return adjustedColor;
// }

function vintageEffectFunction(baseColor, divider = 1) {
    let adjustedColor = baseColor;
    if (vintageOn){
      for (index in adjustedColor) {
        adjustedColor[index] = adjustedColor[index] + parseInt((vintageColor[index]) / 3);
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

// console.log("🟡WHITE", white)
// console.log("🟡GRAY100", gray100)
// console.log("🟡GRAY300", gray300)
// console.log("🟡GRAY400", gray400)
// console.log("🟡GRAY500", gray500)
// console.log("🟡GRAY800", gray800)
// console.log("🟡GRAY900", gray900)
// console.log("🟡BLACK", black)
// console.log("🟡BLUE", white)


let cleanedVariables =
`
//
// Colors
//
$white: rgb(${white});
$gray-100: rgb(${gray100});
$gray-300: rgb(${gray300}); // fix
$gray-400: rgb(${gray400}); // fix
$gray-500: rgb(${gray500}); // fix
$gray-800: rgb(${gray800}); // fix
$gray-900: rgb(${gray900});
$black: rgb(${black}); // fix

$blue: rgb(${blue}); // fix
$red: rgb[235, 64, 52];
$yellow: rgb[232, 235, 52];
$green: rgb[64, 235, 52];
$cyan: rgb[152, 214, 213];
$orange: rgb[235, 147, 52];
$pink: rgb[211, 152, 214];

$primary: $gray500;
$secondary: $gray400;
$tertiary: $gray400;
$success: green;
$info: cyan;
$warning: yellow;
$danger: red;
$light: $gray100;
$dark: $gray900;

$infoTextEmphasis: $black;
`
// console.log("⭐️", cleanedVariables)





// Add options
// add pre defined code manually
// add pre defined code automatically (saved)

// Preview option before download



/**
const cleanResult = `
// This is the clean version created by Alaa Tahhan
$darkner: rgb(${});

`
console.log()
 */
// please carry in desctructiring data and then use the functions you already written in SublimeText editor


// NOTE: coding js without live debugging with console.log is like a blind man walking the wild

// create a chrome extention that reads the variables used in a website and exports them as scss as long as they use bootstrap
// first it checks if the website is using bootstrap
// then it get searching for the variables used
// then add them is a text file and then convert them to json or export them instantly