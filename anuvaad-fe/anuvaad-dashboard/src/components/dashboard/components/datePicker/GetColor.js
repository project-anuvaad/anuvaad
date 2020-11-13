export default function getColor(
  isSelected,
  isSelectedStartOrEnd,
  isWithinHoverRange,
  isDisabled
) {
  return ({
    selectedFirstOrLastColor,
    normalColor,
    selectedColor,
    rangeHoverColor,
    disabledColor
  }) => {
    if (isSelectedStartOrEnd) {
      return selectedFirstOrLastColor;
    } else if (isSelected) {
      return selectedColor;
    } else if (isWithinHoverRange) {
      return rangeHoverColor;
    } else if (isDisabled) {
      return disabledColor;
    } else {
      return normalColor;
    }
  };
}
