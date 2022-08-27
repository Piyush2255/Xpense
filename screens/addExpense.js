import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
  Pressable,
  TextInput,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";

async function storeExpense(input) {
  console.log(input);
  let today = new Date();
  let key = today.getMonth() + " " + today.getFullYear();
  try {
    let expenses = await AsyncStorage.getItem(key);
    if (expenses === null) {
      await AsyncStorage.setItem(key, JSON.stringify([today.toDateString()]));
    } else {
      expenses = JSON.parse(expenses);
      expenses.unshift(today.toDateString());
      await AsyncStorage.setItem(key, JSON.stringify(expenses));
    }
  } catch (e) {
    console.log(e);
  }
}

export default function AddExpense({ navigation }) {
  const [input, setInput] = useState({ desc: "", amnt: "", category: "" });
  const [categories, setCategories] = useState();
  const [validInput, setValidInput] = useState(false);

  function checkInput(input) {
    if (
      input.desc.length > 0 &&
      input.amnt.length > 0 &&
      input.category.length > 0 &&
      isNaN(input.amnt) == false
    ) {
      setValidInput(true);
    }
    else{
      setValidInput(false);
    }
  }

  useEffect(() => {
    async function loadCategories() {
      try {
        let category = JSON.parse(await AsyncStorage.getItem("categories"));
        let formattedCategories = category.map((val) => {
          return { label: val, value: val };
        });
        setCategories(formattedCategories);
      } catch (e) {
        console.log(e);
      }
    }
    loadCategories();
  }, []);

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        {categories != null ? (
          <RNPickerSelect
            style={styles.selector}
            onValueChange={(value) => {
              setInput({ ...input, category: value });
              checkInput({ ...input, category: value });
            }}
            items={categories}
            placeholder={{ label: "Select a category", value: null }}
          ></RNPickerSelect>
        ) : null}
        <TextInput
          style={styles.input}
          value={input.desc}
          onChangeText={(val) => {
            setInput({ ...input, desc: val });
            checkInput({ ...input, desc: val });
          }}
          placeholder="Enter Description"
        ></TextInput>
        <TextInput
          style={styles.input}
          value={input.amnt}
          onChangeText={(val) => {
            setInput({ ...input, amnt: val });
            checkInput({ ...input, amnt: val });
          }}
          placeholder="Enter Amount"
          keyboardType="numeric"
        ></TextInput>
        {validInput?<Button
          color="#e580ff"
          onPress={() => {
            storeExpense(input);
            Keyboard.dismiss();
            navigation.goBack();
          }}
          title="Add"
        ></Button>:<Button
        color="#e580ff"
        disabled={true}
        title="Add"
      ></Button>}
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: 10,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    elevation: 5,
  },
  input: {
    padding: 10,
  },
});
