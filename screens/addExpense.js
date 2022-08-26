import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
  Pressable,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function storeExpense(input) {
  console.log(input);
  let categories=['Food','Travel','Clothing','Groceries','Others'];
    let categoryString=JSON.stringify(categories);
    console.log(categoryString);
    console.log(JSON.parse(categoryString));
}

export default function AddExpense() {
  const [input, setInput] = useState({ desc: "", amnt: "" });

  return (
    <View>
      <Text>Add Expense</Text>
      <TextInput
        value={input.desc}
        onChangeText={(val) => {
          setInput({ ...input, desc: val });
        }}
        placeholder="Enter Description"
      ></TextInput>
      <TextInput
        value={input.amnt}
        onChangeText={(val) => {
          setInput({ ...input, amnt: val });
        }}
        placeholder="Enter Amount"
        keyboardType="numeric"
      ></TextInput>
      <Button
        onPress={() => {
          storeExpense(input);
        }}
        title="Add"
      ></Button>
    </View>
  );
}
