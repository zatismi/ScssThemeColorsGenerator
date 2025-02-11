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

// ==================== Convert Back to SCSS but Cleaned! ====================
let currentTheme = result.themes['$active-theme'];


function viewCleanScss() {
    console.log(currentTheme);

    convertToJson();
    let cleanScss = writeSCSSfile();
    document.getElementById('cleanScssOutput').textContent = cleanScss;  // Display SCSS code in the <pre> element
}
