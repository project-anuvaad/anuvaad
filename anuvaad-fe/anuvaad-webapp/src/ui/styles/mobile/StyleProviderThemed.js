import React from "react";
import { StyleProvider } from "native-base";
import getTheme from "../../../../native-base-theme/components";
import dark from "../../../../native-base-theme/variables/dark";

// eslint-disable-next-line react/prop-types
export const StyleProviderThemed = ({ children }) => <StyleProvider style={getTheme(dark)}>{children}</StyleProvider>;

export default StyleProviderThemed;
