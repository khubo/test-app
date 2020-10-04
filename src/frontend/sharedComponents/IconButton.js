// @flow
import * as React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import { TouchableNativeFeedback } from "../sharedComponents/Touchables";

import { VERY_LIGHT_BLUE } from "../lib/styles";
import type { ViewStyleProp } from "../types";

// Fix warning pending https://github.com/kmagiera/react-native-gesture-handler/pull/561/files
TouchableNativeFeedback.propTypes = {
  ...TouchableNativeFeedback.propTypes,
  background: PropTypes.object,
};

type Props = {
  onPress: (SyntheticEvent<>) => any,
  style?: ViewStyleProp,
  children: React.Node,
  testID?: string,
};

const IconButton = ({ onPress, style, children, testID }: Props) => (
  <TouchableNativeFeedback
    testID={testID}
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, true)}
  >
    <View style={[styles.container, style]}>{children}</View>
  </TouchableNativeFeedback>
);

export default React.memo<Props>(IconButton);

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
