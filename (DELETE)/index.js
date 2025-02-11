function fileCleaner(input) {
    // Extract the active theme
    const match = input.match(/\$active-theme:\s*(\w+);/);
    if (!match) return "Error: No active theme found";
    
    const activeTheme = match[1];
    
    // Extract themes
    const themesMatch = input.match(/\$themes:\s*\(([^;]+)\);/s);
    if (!themesMatch) return "Error: No themes found";
    
    const themes = {};
    themesMatch[1].split(/\),/).forEach(theme => {
        const [name, colors] = theme.split(/:\s*\(/);
        const values = colors.match(/rgb\((\d+,\s*\d+,\s*\d+)\)/g);
        if (values) {
            themes[name.trim()] = {
                darkner: values[0].match(/\d+/g).map(Number),
                midtones: values[1].match(/\d+/g).map(Number),
                lightner: values[2].match(/\d+/g).map(Number)
            };
        }
    });
    
    if (!themes[activeTheme]) return "Error: Active theme not found in themes list";
    
    let { darkner, midtones, lightner } = themes[activeTheme];
    
    // Apply calculations from SCSS
    darkner = darkner.map(c => c + 1);
    midtones = midtones.map(c => c - 1);
    lightner = lightner.map(c => Math.floor(c / 1));
    
    const vintageRGB = [99, 99, 99];
    
    const white = darkner.map((c, i) => c + 0);
    const gray100 = midtones.map((c, i) => c + 0);
    const gray300 = lightner.map((c, i) => c + 0);
    const gray400 = lightner.map((c, i) => c + 0);
    const gray500 = lightner.map((c, i) => c + 0);
    const gray800 = lightner.map((c, i) => c + vintageRGB[i] + [161, 210, 122][i]);
    const gray900 = vintageRGB;
    const black = lightner.map((c, i) => c + vintageRGB[i]);
    const blue = black;
    
    return `
$white: rgb(${white});
$gray-100: rgb(${gray100});
$gray-300: rgb(${gray300});
$gray-400: rgb(${gray400});
$gray-500: rgb(${gray500});
$gray-800: rgb(${gray800});
$gray-900: rgb(${gray900});
$black: rgb(${black});

$blue: rgb(${blue});
    `;
}

document.getElementById("convertButton").addEventListener("click", function() {
    const input = document.getElementById("scssInput").value;
    const output = fileCleaner(input);
    document.getElementById("cleanScssOutput").innerText = output;
});
