function computeColors(data) {
    const { themes, variables } = data;

    // Get the active theme's colors
    const activeTheme = variables["active-theme"];
    const themeColors = themes[activeTheme];

    // Helper function to resolve variables
    function resolveValue(value) {
        if (typeof value === "boolean" || typeof value === "number") return value;
        if (Array.isArray(value)) return value.map(v => resolveValue(v));
        
        if (typeof value === "string") {
            return value.replace(/\$(\w[\w-]*)/g, (_, varName) => {
                if (variables[varName] !== undefined) return resolveValue(variables[varName]);
                return _;
            }).replace(/rgb\(([^)]+)\)/g, (_, expr) => {
                return `[${expr.split(",").map(e => evalExpr(e.trim())).join(", ")}]`;
            });
        }

        return value;
    }

    // Evaluate math expressions
    function evalExpr(expr) {
        try {
            return new Function("return " + expr.replace(/(\d+)\s*([\+\-\*\/])\s*(\d+)/g, "$1 $2 $3"))();
        } catch {
            return expr;
        }
    }

    // Define active theme colors
    const darkner_rgb = themeColors.darkner;
    const midtones_rgb = themeColors.midtones;
    const lightner_rgb = themeColors.lightner;

    // Define computed values
    const condition_min_max = 1;
    const vintage_on = resolveValue(variables["vintage-on"]);
    const vintage_rgb = [99, 99, 99];

    const darkner = darkner_rgb.map(c => c + condition_min_max);
    const midtones = midtones_rgb.map(c => c - condition_min_max);
    const lightner = lightner_rgb.map(c => Math.floor(c / condition_min_max));

    const white = darkner.map((c, i) => c + (vintage_on ? Math.floor(vintage_rgb[i] / 2) : 0));
    const gray_100 = midtones.map((c, i) => c + (vintage_on ? Math.floor(vintage_rgb[i] / 3) : 0) + (1 > 66 ? 200 : 0));
    const gray_300 = lightner.map((c, i) => c + (vintage_on ? vintage_rgb[i] : 0));
    const gray_400 = lightner.map((c, i) => c + (vintage_on ? Math.floor(vintage_rgb[i] / 0.4) : 0));
    const gray_500 = [...gray_400, 0.78];
    const gray_800 = lightner.map((c, i) => vintage_rgb[i] + [161, 210, 122][i] + c);
    const gray_900 = lightner.map((c, i) => vintage_rgb[i] + (false ? darkner[i] + 100 : Math.floor(c / 0.4)));

    const black = lightner.map((c, i) => c + vintage_rgb[i]);
    const blue = [...black];

    const red = [lightner[0] + 81, lightner[1] - 151, lightner[2] - 96];
    const yellow = [lightner[0] + 165, lightner[1] - 97, lightner[2]];
    const green = [...midtones];
    const cyan = [lightner[0] + 171, lightner[1] - 97, lightner[2] - 171];
    const orange = [lightner[0] + 169, lightner[1] - 55, lightner[2] - 235];
    const pink = [lightner[0] + 61, lightner[1] - 71, lightner[2] - 102];

    // Semantic colors
    const primary = gray_500;
    const secondary = gray_400;
    const tertiary = gray_400;
    const success = green;
    const info = cyan;
    const warning = yellow;
    const danger = red;
    const light = gray_100;
    const dark = gray_900;
    const infoTextEmphasis = black;

    // Final computed result
    const computedColors = {
        "$white": white,
        "$gray-100": gray_100,
        "$gray-300": gray_300,
        "$gray-400": gray_400,
        "$gray-500": gray_500,
        "$gray-800": gray_800,
        "$gray-900": gray_900,
        "$black": black,
        "$blue": blue,
        "$red": red,
        "$yellow": yellow,
        "$green": green,
        "$cyan": cyan,
        "$orange": orange,
        "$pink": pink,
        "$primary": primary,
        "$secondary": secondary,
        "$tertiary": tertiary,
        "$success": success,
        "$info": info,
        "$warning": warning,
        "$danger": danger,
        "$light": light,
        "$dark": dark,
        "$infoTextEmphasis": infoTextEmphasis,
    };

    return computedColors;
}

// Example Usage:
const resultJson = `PASTE YOUR JSON STRING HERE`;
const parsedData = JSON.parse(resultJson);
const computedColors = computeColors(parsedData);

console.log(computedColors);
