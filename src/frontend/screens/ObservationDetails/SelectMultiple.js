// @flow
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import { VERY_LIGHT_BLUE } from "../../lib/styles";
import QuestionLabel from "./QuestionLabel";
import { convertSelectOptionsToLabeled } from "../../lib/utils";

import type { ViewStyleProp } from "../../types";
import type { QuestionProps } from "./Question";
import type { SelectMultipleField } from "../../context/ConfigContext";

type Props = {
  ...$Exact<QuestionProps>,
  field: SelectMultipleField,
};

type CheckItemProps = {
  checked: boolean,
  onPress: () => any,
  label: string,
  style: ViewStyleProp,
};

const CheckItem = ({ checked, onPress, label, style }: CheckItemProps) => (
  <TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}
  >
    <View style={style}>
      <MaterialIcon
        name={checked ? "check-box" : "check-box-outline-blank"}
        size={30}
      />
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
  </TouchableNativeFeedback>
);

const SelectMultiple = ({ value, field, onChange }: Props) => {
  const valueAsArray = toArray(value);

  const handleChange = itemValue => {
    const updatedValue = valueAsArray.includes(itemValue)
      ? valueAsArray.filter(d => d !== itemValue)
      : [...valueAsArray, itemValue];
    onChange(updatedValue);
  };

  return (
    <>
      <QuestionLabel field={field} />
      {convertSelectOptionsToLabeled(field.options).map((item, index) => (
        <CheckItem
          key={item.label}
          onPress={() => handleChange(item.value)}
          checked={valueAsArray.includes(item.value)}
          label={item.label}
          style={[styles.radioContainer, index === 0 ? styles.noBorder : {}]}
        />
      ))}
    </>
  );
};

function toArray(value) {
  // null or undefined
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export default React.memo<Props>(SelectMultiple);

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#F3F3F3",
  },
  noBorder: {
    borderTopWidth: 0,
  },
  itemLabel: {
    fontSize: 18,
    lineHeight: 24,
    marginLeft: 20,
    flex: 1,
    color: "black",
    fontWeight: "700",
  },
});
