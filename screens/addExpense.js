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
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AddExpense({ navigation }) {
  const [input, setInput] = useState({ desc: "", amnt: "", category: "" });
  const [categories, setCategories] = useState();
  const [validInput, setValidInput] = useState(false);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");
  const [validCategory, setValidCategory] = useState(false);

  async function storeExpense(input) {
    console.log(input);
    let today = new Date();
    let key = today.getMonth() + " " + today.getFullYear();
    console.log(today);
    console.log(key);
    try {
      let expenses = JSON.parse(await AsyncStorage.getItem(key));
      let months = JSON.parse(await AsyncStorage.getItem("months"));
      console.log(expenses);
      console.log(months)
      if (expenses === null) {
        await AsyncStorage.setItem(key, JSON.stringify([today.toISOString()]));
        if (months === null) {
          await AsyncStorage.setItem("months", JSON.stringify([key]));
        } else {
          months.unshift(key);
          await AsyncStorage.setItem("months", JSON.stringify(months));
        }
      } else {
        expenses.unshift(today.toISOString());
        await AsyncStorage.setItem(key, JSON.stringify(expenses));
      }
      input.key = today.toISOString();
      let output = await AsyncStorage.setItem(
        today.toISOString(),
        JSON.stringify(input)
      );
      console.log(output);
      navigation.navigate("Expenses", {
        screen: "Expense",
        params: { reload: true },
        merge: true,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function addCategory(value){
    try{
      let category=JSON.parse(await AsyncStorage.getItem("categories"));
      console.log(category);
      category.unshift(value);
      await AsyncStorage.setItem("categories",JSON.stringify(category));
      let formattedCategories = category.map((val) => {
        return { label: val, value: val };
      });
      setCategories(formattedCategories);
    }
    catch(e){
      console.log(e);
    }
  }

  function checkInput(input) {
    if (
      input.desc.length > 0 &&
      input.amnt.length > 0 &&
      input.category.length > 0 &&
      isNaN(input.amnt) == false
    ) {
      setValidInput(true);
    } else {
      setValidInput(false);
    }
  }

  function checkCategory(value) {
    if (value.length != 0 && !(value in categories)) {
      setValidCategory(true);
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
          <View style={styles.categories}>
            <View style={styles.selector}>
              <RNPickerSelect
                onValueChange={(value) => {
                  setInput({ ...input, category: value });
                  checkInput({ ...input, category: value });
                }}
                items={categories}
                placeholder={{ label: "Select a category", value: null }}
              ></RNPickerSelect>
            </View>
            <View style={styles.button}>
              <Pressable onPress={() => setShowCategoryInput(true)}>
                <Ionicons
                  name="add-circle"
                  size={32}
                  color="#e580ff"
                ></Ionicons>
              </Pressable>
            </View>
          </View>
        ) : null}
        {showCategoryInput ? (
          <View>
            <TextInput
              style={styles.input}
              value={categoryInput}
              placeholder="Enter new category..."
              onChangeText={(val) => {
                setCategoryInput(val);
                checkCategory(val);
              }}
            ></TextInput>
            {validCategory ? (
              <Button
                color="#e580ff"
                onPress={() => {
                  addCategory(categoryInput);
                  setCategoryInput("");
                  setShowCategoryInput(false);
                  setValidCategory(false);
                  Keyboard.dismiss();
                }}
                title="Save"
              ></Button>
            ) : (
              <Button color="#e580ff" disabled={true} title="Save" ></Button>
            )}
          </View>
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
        {validInput ? (
          <Button
            color="#e580ff"
            onPress={() => {
              storeExpense(input);
              Keyboard.dismiss();
            }}
            title="Add"
          ></Button>
        ) : (
          <Button color="#e580ff" disabled={true} title="Add"></Button>
        )}
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
  categories: {
    flexDirection: "row",
  },
  selector: {
    flex: 5,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    padding: 10,
  },
});
