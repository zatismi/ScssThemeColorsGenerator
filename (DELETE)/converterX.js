let result = "";

function convertToJson() {
    const scssInput = document.getElementById('scssInput').value;

    const themes = {};
    const variables = {};

    const themeRegex = /(\w[\w-]*):\s*\(\s*darkner:\s*rgb\(([^,]+),\s*([^,]+),\s*([^,]+)\),\s*midtones:\s*rgb\(([^,]+),\s*([^,]+),\s*([^,]+)\),\s*lightner:\s*rgb\(([^,]+),\s*([^,]+),\s*([^,]+)\)\)/g;
    const varRegex = /\$(\w[-\w]*):\s*(.*?);/g; 

    let match;
    while ((match = themeRegex.exec(scssInput)) !== null) {
        const themeName = match[1];
        const darkner = [parseInt(match[2]), parseInt(match[3]), parseInt(match[4])];
        const midtones = [parseInt(match[5]), parseInt(match[6]), parseInt(match[7])];
        const lightner = [parseInt(match[8]), parseInt(match[9]), parseInt(match[10])];

        themes[themeName] = { darkner, midtones, lightner };
    }

    while ((match = varRegex.exec(scssInput)) !== null) {
        const varName = match[1];
        const value = match[2].trim();
        if (value === 'true' || value === 'false') {
            variables[varName] = value === 'true'; 
        } else if (!isNaN(parseFloat(value))) {
            variables[varName] = parseFloat(value);  
        } else {
            variables[varName] = value; 
        }
    }

    // Compute values using parsed variables
    result = { themes, variables };
    const computedValues = computeResolvedValues(result);
    
    document.getElementById('jsonOutput').textContent = JSON.stringify(computedValues, null, 2);
}

function computeResolvedValues(data) {
    const activeTheme = data.variables["active-theme"];
    if (!activeTheme || !data.themes[activeTheme]) {
        console.error("Active theme not found.");
        return data;
    }

    const themeColors = data.themes[activeTheme];
    const darkner = themeColors.darkner;
    const midtones = themeColors.midtones;
    const lightner = themeColors.lightner;

    const computed = {
        darkner,
        midtones,
        lightner,
        "gray-100": midtones.map((c) => c + 99),
        "gray-400": lightner.map((c) => c + 50),
        "gray-500": [...lightner, 0.78], // Add alpha channel
        red: [lightner[0] + 81, lightner[1] - 151, lightner[2] - 96],
        yellow: [lightner[0] + 165, lightner[1] - 97, lightner[2]],
        green: [...midtones],
        cyan: [lightner[0] + 171, lightner[1] - 97, lightner[2] - 171],
        primary: "gray-500",
        secondary: "gray-400",
        success: "green",
        warning: "yellow",
        danger: "red",
    };

    return { themes: data.themes, variables: computed };
}

function viewCleanScss() {
    let cleanScss = "";
    for (const [key, value] of Object.entries(result.variables)) {
        cleanScss += `$${key}: ${Array.isArray(value) ? `rgb(${value.join(", ")})` : value};\n`;
    }
    document.getElementById('cleanScssOutput').textContent = cleanScss;
}

function saveScssFile() {
    const scssContent = document.getElementById('cleanScssOutput').textContent;
    const blob = new Blob([scssContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cleaned.scss";
    link.click();
}
