export const pattern =
  "( |<([^>]+)>*|&[a-zA-Z0-9]*;|[_,;\\:\\-\\n\\+\\?\\^\\$\\*{}()|[\\]\\\\]||<(\\/[a-z])*>)*";

const validStrRegex = "^[^a-zA-Z0-9 ]{0,5}[a-zA-Z0-9 ]{1}.*";
export const highlightSource = (
  source,
  color,
  id,
  highlightSentence,
  paper
) => {
if (source.match(validStrRegex) && source.replace(/[|,|\.|\-]+/g, "") !== "") {
    let regExpSource = source
      .replace(/[|,|\.|\-]+/g, "")
      .split(" ")
      .join(pattern);
    if (regExpSource[regExpSource.length - 1] === ".") {
      regExpSource = regExpSource.substr(0, regExpSource.length - 1);
    } else if (regExpSource[0] === ".") {
      regExpSource = regExpSource.substr(0);
    }
    regExpSource = new RegExp(regExpSource, "gm");
    let m;
    let regArr = [];
    while ((m = regExpSource.exec(paper.replace(/\n/g, " "))) !== null) {
      regArr.push(m);
    }
    let matchArr = regArr[0];
    let startIndex = matchArr && matchArr.index;
    let totalLen = 0;
    if (matchArr) totalLen += matchArr[0].length;
    if (startIndex >= 0) {
      highlightSentence(paper, startIndex, totalLen, color, id);
    } else {
      let regExpArr = source.replace(/[|,|\.|\-]+/g, "").split(" ");
      let regExpSource = getInitialText(regExpArr, pattern);
      // console.log(regExpSource);
      regExpSource = new RegExp(regExpSource, "gm");
      let m;
      let regArr = [];
      while ((m = regExpSource.exec(paper.replace(/\n/g, " "))) !== null) {
        regArr.push(m);
      }
      let matchArr = regArr[0];
      let startIndex = matchArr && matchArr.index;
      let totalLen = 0;
      if (matchArr) totalLen += matchArr[0].length;
      if (startIndex >= 0) {
        highlightSentence(paper, startIndex, totalLen, "#e1f5b3", id);
      }
    }
  }
};

export const getInitialText = (arr, pattern) => {
  let str = "";
  let i = 0;
  while (i <= 2) {
    str = str + arr[i] + pattern;
    i++;
  }
  return str;
};
