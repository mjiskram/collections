export const sentenceCase = (str) =>
  str
    ? str
        .split(" ")
        .map((word) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    : "";

  
export const  allCaps = (str) => {
  if (typeof str !== 'string' || !str.length) return '';
  return str.toUpperCase();
}

export const firstWord = ( str ) => {
  var val = str.split(" ")[0]
  return val;
}

export const lastWord =( str ) => {
    var n = str.split(" ");
    return n[n.length - 1];

}