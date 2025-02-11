document.getElementById("convertButton").addEventListener("click", function () {
    const scssInput = document.getElementById("scssInput").value;
    
    try {
        const parsedData = parseScss(scssInput);
        
        document.getElementById("jsonOutput").textContent = JSON.stringify(parsedData.themes, null, 2);
        document.getElementById("cleanScssOutput").textContent = generateCleanScss(parsedData);
    } catch (error) {
        alert("Error parsing SCSS: " + error.message);
    }
});

function parseScss(scss) {
    const themesRegex = /\$themes:\s*\(([^;]*)\);/s;
    const activeThemeRegex = /\$active-theme:\s*(\w+);/;
    
    const themesMatch = scss.match(themesRegex);
    const activeThemeMatch = scss.match(activeThemeRegex);
    
    if (!themesMatch || !activeThemeMatch) throw new Error("SCSS structure not found");
    
    const themes = parseThemes(themesMatch[1]);
    const activeTheme = activeThemeMatch[1];
    
    return { themes, activeTheme };
}

function parseThemes(themesStr) {
    const themeRegex = /(\w+):\s*\(([^)]*)\)/g;
    const colorRegex = /(\w+):\s*rgb\((\d+),\s*(\d+),\s*(\d+)\)/g;
    const themes = {};
    
    let match;
    while ((match = themeRegex.exec(themesStr)) !== null) {
        const themeName = match[1];
        const themeContent = match[2];
        
        const colors = {};
        let colorMatch;
        while ((colorMatch = colorRegex.exec(themeContent)) !== null) {
            colors[colorMatch[1]] = `rgb(${colorMatch[2]}, ${colorMatch[3]}, ${colorMatch[4]})`;
        }
        
        themes[themeName] = colors;
    }
    return themes;
}

function generateCleanScss(data) {
    const { themes, activeTheme } = data;
    const selectedTheme = themes[activeTheme];
    if (!selectedTheme) throw new Error("Active theme not found");
    
    return `
$white: ${selectedTheme.lightner};
$gray-100: ${selectedTheme.midtones};
$gray-300: ${selectedTheme.darkner};
$gray-400: ${selectedTheme.lightner};
$gray-500: rgba(${selectedTheme.lightner.replace("rgb", "")}, 0.78);
$gray-800: rgb(161, 210, 122);
$gray-900: rgb(${selectedTheme.midtones.replace("rgb(", "").replace(")", "")});
$black: ${selectedTheme.darkner};

$blue: ${selectedTheme.lightner};
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
    `.trim();
}
