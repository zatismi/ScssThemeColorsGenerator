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
$vintage-on: true; 
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
const themes = convertedJSON.themes;


  const multiplayer = 1;
  const vintageOn = false;
  const activeTheme = themes.avocado;
  
  const conditionMinMax = multiplayer < 2 ? 1 : multiplayer > 100 ? 100 : 1 * multiplayer;
  const multiplyerMinus = multiplayer * 0.4;
  const multiplyerPlus = multiplayer * 1.2;
  const balancer = Math.abs(100 - multiplayer);
  
  const clampRgb = (value) => Math.max(0, Math.min(255, value));
  
  const darkner = activeTheme.darkner.map(c => clampRgb(c + conditionMinMax));
  const midtones = activeTheme.midtones.map(c => clampRgb(c - conditionMinMax));
  const lightner = activeTheme.lightner.map(c => clampRgb(Math.floor(c / conditionMinMax)));
  
  const vintageRed = vintageOn ? clampRgb(Math.floor(midtones[0] / 4)) : 0;
  const vintageGreen = vintageOn ? clampRgb(Math.floor(midtones[1] / 4)) : 0;
  const vintageBlue = vintageOn ? clampRgb(Math.floor(midtones[2] / 4)) : 0;
  
  const vintageRgb = [vintageRed, vintageGreen, vintageBlue];
  
  const calculateColor = (base, adjustments) => base.map((c, i) => clampRgb(c + adjustments[i]));
  
  const white = calculateColor(darkner, vintageRgb);
  const gray100 = calculateColor(midtones, vintageRgb).map((c, i) => clampRgb(multiplayer > 66 ? c + balancer : c));
  const gray300 = calculateColor(lightner, vintageRgb);
  const gray400 = calculateColor(lightner, vintageRgb.map(c => clampRgb(Math.floor(c / multiplyerMinus))));
  const gray500 = calculateColor(lightner, vintageRgb.map(c => clampRgb(Math.floor(c / multiplyerPlus))));
  const gray800 = calculateColor(vintageRgb, [161, 210, 122]).map((c, i) => clampRgb(c + lightner[i]));
  const gray900 = calculateColor(vintageRgb, [147, 196, 114]).map((c, i) => clampRgb(c + Math.floor(lightner[i] / multiplyerMinus)));
  const black = calculateColor(vintageRgb, [165, 205, 126]).map((c, i) => clampRgb(i < 2 ? c + Math.floor(lightner[i] / multiplyerPlus) : c + Math.floor(darkner[i] / multiplyerPlus)));
  const blue = calculateColor(lightner, [vintageRed, vintageGreen, vintageBlue]);
  
  console.log({ white, gray100, gray300, gray400, gray500, gray800, gray900, black, blue });
  