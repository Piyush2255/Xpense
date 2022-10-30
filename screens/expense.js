import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
  Pressable,
  SectionList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];

const Item = ({ item }) => {
  return (
    <View style={styles.expenseItem}>
      <View style={styles.expenseDate}>
        <Text style={styles.expenseDay}>{item.timestamp.getDate()}</Text>
        <Text style={styles.expenseMonth}>{monthNames[item.timestamp.getMonth()].slice(0,3)}</Text>
      </View>
      <View style={styles.expenseDetails}>
      <View style={styles.expensedetail}>
        <Text style={styles.expenseTitle}>{item.desc}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
      </View>
      <Text style={styles.expenseAmount}>RS {item.amnt}</Text>
      </View>
    </View>
  );
};

export default function Expense({ navigation, route }) {
  const [expenses, setExpenses] = useState();
  const [months, setMonths] = useState();
  const [monthsShown, setMonthsShown] = useState();
  const [numOfMonthsShown, setNumOfMonthsShown] = useState(0);
  const [shownAll, setShownAll] = useState(false);
  const [reload,setReload]=useState(false);

  async function fetchExpenses() {
    let expenses = [];
    try {
      let months = JSON.parse(await AsyncStorage.getItem("months"));
      if (months !== null) {
        // console.log("Months fetched");
        let monthsShown = [];
        for (month of months) {
          let expense = {};
          expense.data = [];
          expense.month = month;
          let timestamps = JSON.parse(await AsyncStorage.getItem(month));
          for (timestamp of timestamps) {
            let expenseDetail = JSON.parse(
              await AsyncStorage.getItem(timestamp)
            );
            expenseDetail.timestamp=new Date(timestamp);
            // console.log(expenseDetail);
            expense["data"].push(expenseDetail);
          }
          expenses.push(expense);
          monthsShown.push(month);
        }
        setMonths(months);
        setExpenses(expenses);
        console.log("Fetched expenses successfully")
        // console.log(expenses);
      }
    } catch (e) {
      console.log(e);
    }
  }
  
  useEffect(()=>{
    async function reloadExpenses(){
      if(expenses==null || expenses.length==0){
        fetchExpenses();
      }
      else{
        let today=new Date();
        let month=today.getMonth() + " " + today.getFullYear();
        let expense = {};
        expense.data = [];
        expense.month = month;
        let timestamps = JSON.parse(await AsyncStorage.getItem(month));
        for (timestamp of timestamps) {
          let expenseDetail = JSON.parse(
            await AsyncStorage.getItem(timestamp)
          );
          // console.log(expenseDetail);
          expense["data"].push(expenseDetail);
        }
        let newExpenses=JSON.parse(JSON.stringify(expenses));
        if(month==expenses[0].month){
          newExpenses[0]=expense;
        }
        else{
          newExpenses.unshift(expense);
          let newMonths=months;
          newMonths.unshift(month);
          setMonths(newMonths);
        }
        setExpenses(newExpenses);
        console.log("Expenses Updated");
        // console.log(newExpenses);
      }
    }
    if(reload==true){
      fetchExpenses();
      setReload(false);
    }
  },[reload]);

  useEffect(() => {  
    fetchExpenses();
  },[]);

  useEffect(() => {
    if (route.params?.reload) {
      setReload(true);
      console.log("Reloading set to true");
    }
  }, [route]);

  const onRefresh = useCallback(() => {
    setReload(true);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.expenseList}>
        {/* <FlatList data={DATA} renderItem={Item} keyExtractor={(item) => item.id} scrollEnabled={true} /> */}
        {expenses != null ? (
          <SectionList
            sections={expenses}
            keyExtractor={(item) => item.key}
            renderItem={Item}
            renderSectionHeader={({ section: { month } }) => (
              <Text style={styles.month}>{monthNames[parseInt(month.split(" ")[0])]} {month.split(" ")[1]}</Text>
            )}
            refreshing={reload}
            onRefresh={onRefresh}
          ></SectionList>
        ) : (
          <Text>No Data Available</Text>
        )}
      </View>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Add Expenses")}
      >
        <Ionicons name="add" size={32} color="white"></Ionicons>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  expenseList: {},
  month:{
    fontSize: 15,
    marginVertical: 10,
    marginHorizontal: 5
  },
  expenseItem: {
    backgroundColor: "white",
    // flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    padding: 5,
    paddingVertical: 8,
    elevation: 1
  },
  expenseDate:{
    flex:1,
    justifyContent: "center"
  },
  expenseDay: {
    marginLeft: 5,
    fontSize: 11,
  },
  expenseMonth:{
    marginLeft: 5,
    fontSize: 11,
  },
  expenseDetails:{
    flex: 9,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 5
  },
  expensedetail: {
    flex: 1,
  },
  expenseTitle: {
    fontWeight: "bold",
    fontSize: 14,
    // letterSpacing: 0.75,
  },
  expenseCategory: {
    color: "gray",
    fontWeight: "500",
    fontSize: 11,
    // letterSpacing: 0.25,
  },
  expenseAmount: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
  },
  button: {
    right: 15,
    bottom: 15,
    position: "absolute",
    borderRadius: 30,
    width: 60,
    height: 60,
    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center",
  },
});
