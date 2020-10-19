'use strict';

var placeBelow = (function (_ref) {
    var gap = _ref.gap,
        frameHeight = _ref.frameHeight,
        frameWidth = _ref.frameWidth,
        frameLeft = _ref.frameLeft,
        frameTop = _ref.frameTop,
        boxHeight = _ref.boxHeight,
        selectionTop = _ref.selectionTop,
        selectionLeft = _ref.selectionLeft,
        selectionHeight = _ref.selectionHeight;

    var style = { position: "fixed" };
    style.left = selectionLeft;
    if (selectionLeft + 450 > window.innerWidth - 50) {
        style.left = window.innerWidth - 500;
    }
    style.top = selectionTop + selectionHeight + gap;
    // if the popover is placed too far to the right, align with right edge
    if (style.right > frameWidth) {
        delete style.left;
        style.right = frameLeft + frameWidth;
    }

    // if the popover is placed below the frame, position above
    // selection instead if there's room
    if (style.top + boxHeight > frameHeight && selectionTop - (gap + boxHeight) > frameTop) {
        style.top = selectionTop - (gap + boxHeight);
    }

    return style;
});

module.exports = placeBelow;
