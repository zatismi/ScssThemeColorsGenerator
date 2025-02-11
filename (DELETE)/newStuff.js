document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("scssInput").value = `$themes: (
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
$vintage-on: true;`;

    document.getElementById("convertButton").addEventListener("click", () => {
        let scssText = document.getElementById("scssInput").value;
        let jsonResult = parseScssToJSON(scssText);
        document.getElementById("jsonOutput").textContent = JSON.stringify(jsonResult, null, 2);
    });
});

function parseScssToJSON(scssText) {
    let themesMatch = scssText.match(/\$themes:\s*\(([\s\S]*?)\);/);
    if (!themesMatch) return {};

    let themes = {};
    let themesString = themesMatch[1].trim();
    let themeRegex = /([\w-]+):\s*\(([^)]+)\)/g;
    let match;

    while ((match = themeRegex.exec(themesString)) !== null) {
        let themeName = match[1];
        let values = match[2].trim();
        let colors = {};

        // Match each color property in the format "key: rgb(x, y, z)"
        let colorRegex = /(\w+):\s*(rgb\(\d+,\s*\d+,\s*\d+\))/g;
        let colorMatch;
        while ((colorMatch = colorRegex.exec(values)) !== null) {
            colors[colorMatch[1]] = colorMatch[2]; // Store full rgb(x, y, z)
        }

        themes[themeName] = colors;
    }

    let activeThemeMatch = scssText.match(/\$active-theme:\s*(\w+);/);
    let multiplayerMatch = scssText.match(/\$multiplayer:\s*(\d+);/);
    let vintageOnMatch = scssText.match(/\$vintage-on:\s*(true|false);/);

    return {
        themes,
        activeTheme: activeThemeMatch ? activeThemeMatch[1] : null,
        multiplayer: multiplayerMatch ? parseInt(multiplayerMatch[1], 10) : 1,
        vintageOn: vintageOnMatch ? vintageOnMatch[1] === "true" : false
    };
}

let cleanScss;
function viewCleanScss() {
    let scssText = document.getElementById("scssInput").value;
    let themesMatch = scssText.match(/\$themes:\s*\(([\s\S]*?)\);/);
    if (!themesMatch) return;

    let themes = {};
    let themesString = themesMatch[1].trim();
    let themeRegex = /([\w-]+):\s*\(([^)]+)\)/g;
    let match;

    // Extract the themes and their RGB values
    while ((match = themeRegex.exec(themesString)) !== null) {
        let themeName = match[1];
        let values = match[2].trim();
        let colors = {};

        values.split(',').forEach(color => {
            let parts = color.match(/(\w+):\s*(rgb\(\d+,\s*\d+,\s*\d+\))/);
            if (!parts) return;
            let key = parts[1];
            let value = parts[2];
            colors[key] = value;

        });

        themes[themeName] = colors;
    }

    // Check if the active theme exists in the parsed themes
    let activeThemeName = themes['peter'] ? 'peter' : Object.keys(themes)[0];  // Default to the first theme if 'peter' is not found
    let activeTheme = themes[activeThemeName] || {};  // Fallback to an empty object if activeTheme is undefined

    // Replace with actual calculated values based on the active theme
    let white = activeTheme.lightner || [255, 255, 255]; // Replace with 'lightner' of active theme
    let gray100 = activeTheme.darkner || [200, 200, 200];  // Replace with 'darkner'
    let gray300 = activeTheme.midtones || [150, 150, 150]; // Replace with 'midtones'

    cleanScss = {
        "$white": `rgb(${white.join(", ")})`,
        "$gray-100": `rgb(${gray100.join(", ")})`,
        "$gray-300": `rgb(${gray300.join(", ")})`,
        // Add other variables similarly
    };

    // Display the clean SCSS variables
    document.getElementById("cleanScssOutput").textContent = JSON.stringify(cleanScss, null, 2);
}



function saveScssFile() {
    let cleanScssText = '';
    for (let variable in cleanScss) {
        cleanScssText += `${variable}: ${cleanScss[variable]};\n`;
    }

    // Generate the filename based on the active theme
    let scssText = document.getElementById("scssInput").value;
    let activeThemeMatch = scssText.match(/\$active-theme:\s*(\w+);/);
    let themeName = activeThemeMatch ? activeThemeMatch[1] : "default";
    let filename = `_variables_${themeName}.scss`;

    // Create a Blob with the clean SCSS text
    let blob = new Blob([cleanScssText], { type: "text/css" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
