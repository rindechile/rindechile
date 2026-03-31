export function decimalToRoman(num: number): string {
    if (num < 1 || num > 3999) return "Número fuera de rango";
    
    // Mapa de valores arábigos a romanos de mayor a menor
    const map: { [key: string]: number } = {
        M: 1000, CM: 900, D: 500, CD: 400,
        C: 100, XC: 90, L: 50, XL: 40,
        X: 10, IX: 9, V: 5, IV: 4, I: 1
    };
    
    let resultado = "";
    for (const key in map) {
        while (num >= map[key]) {
            resultado += key;
            num -= map[key];
        }
    }
    return resultado;
}
