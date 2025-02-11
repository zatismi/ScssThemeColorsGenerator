let themes // array of key value pairs
let multiplayer // int
let activeTheme // string
let vintageOn // boolean

{
    themes: {
        regular: {
            darkner: (
                [4,4,4],
                [15,76,162],
                [218,218,218]
            );
            //...
            peter: [
                [0,0,0],
                [87,87,87],
                [256,256,0]
            ]
        }
    };
    multiplayer: 1;
    activeTheme: "avocado";
    vintageOn: false;
}
// Note: in $themes, please make sure all colors in rgb format


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("convertButton").addEventListener("click", function () {
        const input = document.getElementById("scssInput").value;
        const colorsData = convertToJson(input);
        document.getElementById("jsonOutput").textContent = JSON.stringify(colorsData, null, 2);
    });
});

const colorsData = {};

function convertToJson(input) {
    
    // Parse themes
    const themesMatch = input.match(/\$themes:\s*\(([\s\S]+?)\);/);
    if (themesMatch) {
        const themesContent = themesMatch[1].trim();
        const themes = {};

        themesContent.split(/\n/).forEach(line => {
            const match = line.match(/([-a-zA-Z0-9]+):\s*\(darkner:\s*rgb\(([^)]+)\),\s*midtones:\s*rgb\(([^)]+)\),\s*lightner:\s*rgb\(([^)]+)\)\)/);
            if (match) {
                themes[match[1]] = {
                    darkner: match[2].split(/\s*,\s*/).map(Number),
                    midtones: match[3].split(/\s*,\s*/).map(Number),
                    lightner: match[4].split(/\s*,\s*/).map(Number)
                };
            }
        });

        colorsData.themes = themes;
    }

    // Parse variables
    const variables = ["multiplayer", "active-theme", "vintage-on"];
    variables.forEach(variable => {
        const regex = new RegExp(`\\$${variable}:\\s*([^;]+);`);
        const match = input.match(regex);
        if (match) {
            let value = match[1].trim();
            
            // Convert numbers, booleans, and keep strings as is
            if (!isNaN(value)) {
                value = Number(value);
            } else if (value.toLowerCase() === "false") {
                value = false;
            } else if (value.toLowerCase() === "true") {
                value = true;
            }

            colorsData[variable.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
        }
    });

    return colorsData;
}

