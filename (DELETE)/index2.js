const themes = {
    regular: {
      darkner: [4, 4, 4],
      midtones: [15, 76, 162],
      lightner: [218, 218, 218]
    },
    regular2: {
      darkner: [5, 59, 62],
      midtones: [65, 149, 175],
      lightner: [255, 232, 99]
    },
    free_spirit: {
      darkner: [0, 0, 0],
      midtones: [47, 160, 86],
      lightner: [236, 236, 236]
    },
    kartoffel: {
      darkner: [0, 0, 0],
      midtones: [179, 40, 40],
      lightner: [255, 186, 49]
    },
    sweater: {
      darkner: [25, 20, 20],
      midtones: [95, 120, 150],
      lightner: [230, 210, 170]
    },
    avocado: {
      darkner: [35, 25, 10],
      midtones: [120, 140, 80],
      lightner: [245, 230, 160]
    },
    berries: {
      darkner: [40, 30, 35],
      midtones: [150, 100, 120],
      lightner: [230, 220, 200]
    },
    cappuccino_choco: {
      darkner: [68, 48, 32],
      midtones: [135, 100, 85],
      lightner: [230, 215, 185]
    },
    brownies: {
      darkner: [45, 30, 20],
      midtones: [120, 85, 60],
      lightner: [215, 190, 150]
    },
    peter: {
        darkner: [1, 1, 1],
        midtones: [86, 86, 86],
        lightner: [255, 255, 0]
    }
  };
  
  const activeTheme = "brownies";
  const multiplayer = 1;
  const vintageOn = true;
  const balancer = 200;
  
  const conditionMinMax = multiplayer < 2 ? 1 : multiplayer > 100 ? 100 : 1 * multiplayer;
  const multiplyerMinus = multiplayer * 0.4;
  const multiplyerPlus = multiplayer * 1.2;
  
  let [rD, gD, bD] = themes[activeTheme].darkner;
  let [rM, gM, bM] = themes[activeTheme].midtones;
  let [rL, gL, bL] = themes[activeTheme].lightner;
  
  const darkner = [rD + conditionMinMax, gD + conditionMinMax, bD + conditionMinMax];
  const midtones = [rM - conditionMinMax, gM - conditionMinMax, bM - conditionMinMax];
  const lightner = [rL / conditionMinMax, gL / conditionMinMax, bL / conditionMinMax];
  
  const vintageRed = (vintageOn ? midtones[0] / 4 : 0) + 99;
  const vintageGreen = (vintageOn ? midtones[1] / 4 : 0) + 99;
  const vintageBlue = (vintageOn ? midtones[2] / 4 : 0) + 99;
  const vintageRGB = [vintageRed, vintageGreen, vintageBlue];
  
const white = darkner.map(value => (value > 255 ? 255 : parseInt(value)));
const gray100 = [
    midtones[0] + (vintageOn ? vintageRed / 3 : 0),
    midtones[1] + (vintageOn ? vintageGreen / 3 : 0),
    midtones[2] + (vintageOn ? vintageBlue / 3 : 0)
].map(value => (value > 255 ? 255 : parseInt(value)));
const gray300 = [
    lightner[0] + (vintageOn ? vintageRed : 0),
    lightner[1] + (vintageOn ? vintageGreen : 0),
    lightner[2] + (vintageOn ? vintageBlue : 0)
].map(value => (value > 255 ? 255 : parseInt(value)));
const gray400 = [
    lightner[0] + (vintageOn ? vintageRed / multiplyerMinus : 0),
    lightner[1] + (vintageOn ? vintageGreen / multiplyerMinus : 0),
    lightner[2] + (vintageOn ? vintageBlue / multiplyerMinus : 0)
].map(value => (value > 255 ? 255 : parseInt(value)));
const gray500 = [
    lightner[0] + (vintageOn ? vintageRed / multiplyerPlus : 0),
    lightner[1] + (vintageOn ? vintageGreen / multiplyerPlus : 0),
    lightner[2] + (vintageOn ? vintageBlue / multiplyerPlus : 0)
].map(value => (value > 255 ? 255 : parseInt(value)));
const gray800 = [
    vintageRGB[0] + 161 + lightner[0],
    vintageRGB[1] + 210 + lightner[1],
    vintageRGB[2] + 122 + lightner[2]
].map(value => (value > 255 ? 255 : parseInt(value)));
const gray900 = vintageRGB.map(value => (value > 255 ? 255 : parseInt(value)));
const black = [
    lightner[0] + vintageRed,
    lightner[1] + vintageGreen,
    lightner[2] + vintageBlue
].map(value => (value > 255 ? 255 : parseInt(value)));
const blue = black.map(value => (value > 255 ? 255 : parseInt(value)));
  
  console.log({ white, gray100, gray300, gray400, gray500, gray800, gray900, black, blue });