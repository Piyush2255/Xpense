import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Pressable,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PieChart,BarChart } from "react-native-chart-kit";

const Item = ({ item, index }) => {
  return (
    <View style={styles.expenseItem}>
      <Text style={styles.expenseIndex}>{index + 1}</Text>
      <View style={styles.expensedetail}>
        <Text style={styles.expenseTitle}>{item.title}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
      </View>
      <Text style={styles.expenseAmount}>RS {item.amount}</Text>
    </View>
  );
};

export default function Home({ navigation }) {
  const [categoriesData, setCategoriesData] = useState();
  const [expenseData, setExpenseData] = useState();
  const [totalExpense, setTotalExpense] = useState(0);
  const [maxExpense, setMaxExpense] = useState();
  const [minExpense, setMinExpense] = useState();
  const [pastExpenseData, setPastExpenseData] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const screenWidth=Dimensions.get("window").width;

  function getRandomColor() {
    return Math.floor(Math.random() * 205) + 50;
  }

  const monthNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  async function fetchPastExpenses() {
    try {
      let months = JSON.parse(await AsyncStorage.getItem("months"));
      if (months != null) {
        let labels = [];
        let data = [];
        let num=0;
        for (let month of months) {
          if(num>=3){
            break;
          }
          let total = 0;
          labels.push(
            monthNames[month.split(" ")[0]] + " " + month.split(" ")[1]
          );
          let timestamps = JSON.parse(await AsyncStorage.getItem(month));
          for (let timestamp of timestamps) {
            let expenseDetail = JSON.parse(
              await AsyncStorage.getItem(timestamp)
            );
            // console.log(expenseDetail);
            if (expenseDetail != null) {
              total = total + parseInt(expenseDetail.amnt);
            }
          }
          data.push(total);
          num++;
        }
        setPastExpenseData({
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchExpenses() {
    try {
      let today = new Date();
      let month = today.getMonth() + " " + today.getFullYear();
      let expenses = [];
      for (let category of categoriesData) {
        console.log(category);
        expenses.push({
          name: category,
          amount: 0,
          color:
            "rgb(" +
            getRandomColor().toString() +
            "," +
            getRandomColor().toString() +
            "," +
            getRandomColor().toString() +
            ")",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        });
      }
      console.log(expenses);
      let timestamps = JSON.parse(await AsyncStorage.getItem(month));
      if (timestamps == null || timestamps.length == 0) {
        console.log("No expense available");
      } else {
        for (let timestamp of timestamps) {
          let expenseDetail = JSON.parse(await AsyncStorage.getItem(timestamp));
          // console.log(expenseDetail);
          if (expenseDetail != null) {
            for (let expense of expenses) {
              if (expense.name == expenseDetail.category) {
                expense.amount =
                  parseInt(expense.amount) + parseInt(expenseDetail.amnt);
                break;
              }
            }
          }
        }
        console.log(expenses);
        console.log("Expenses Fetched Successfully");
      }
      setExpenseData(expenses);
      setRefreshing(false);
      let total = 0;
      let maxValue = expenses[0].amount;
      let maxCategory = expenses[0].name;
      let minValue = expenses[0].amount;
      let minCategory = expenses[0].name;
      for (let expense of expenses) {
        total = total + expense.amount;
        if (maxValue < expense.amount) {
          maxValue = expense.amount;
          maxCategory = expense.name;
        } else if (minValue > expense.amount) {
          minValue = expense.amount;
          minCategory = expense.name;
        }
      }
      setTotalExpense(total);
      setMaxExpense({
        category: maxCategory,
        amount: maxValue,
      });
      setMinExpense({
        category: minCategory,
        amount: minValue,
      });
    } catch (e) {
      console.log(e);
    }
  }

  const checkCategories = async function () {
    try {
      const categories = JSON.parse(await AsyncStorage.getItem("categories"));
      if (categories === null) {
        const category = ["Food", "Travel", "Clothing", "Groceries", "Others"];
        const categoryValues = JSON.stringify(category);
        await AsyncStorage.setItem("categories", categoryValues);
        console.log("Categories Added");
        setCategoriesData(category);
      } else {
        console.log(categories);
        setCategoriesData(categories);
      }
    } catch (e) {
      console.log(e);
    }
  };

  async function deleteAllKeys() {
    let keys = [];
    try {
      keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      console.log("All keys deleted");
    } catch (e) {
      console.log(e);
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    checkCategories();
    fetchPastExpenses();
  }, []);

  useEffect(() => {
    if (categoriesData) {
      fetchExpenses();
    }
  }, [categoriesData]);

  useEffect(() => {
    checkCategories();
    fetchPastExpenses();
    // fetchExpenses();
    // deleteAllKeys();
  }, []);

  const chartConfig = {
    backgroundColor: "#1cc910",
    backgroundGradientFrom: "#eff3ff",
    backgroundGradientTo: "#efefef",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={styles.home}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.highlight}>
          <View style={styles.expenditureView}>
            <Text style={styles.expenditureText}>Month's Expenditure</Text>
            {totalExpense!=null ? (
              <Text style={styles.expenditureNumber}>Rs {totalExpense}</Text>
            ) : (
              <Text style={styles.expenditureNumber}>Fetching...</Text>
            )}
          </View>
          <View style={styles.highlights}>
            {maxExpense ? (
              <View style={styles.highlightInfo}>
                <Text style={styles.highlightText}>
                  Spent most on {maxExpense.category}
                </Text>
                <Text style={styles.highlightNumber}>
                  Rs {maxExpense.amount}
                </Text>
              </View>
            ) : (
              <View style={styles.highlightInfo}>
                <Text style={styles.highlightText}>Fetching category...</Text>
                <Text style={styles.highlightNumber}>Fetching...</Text>
              </View>
            )}
            {minExpense ? (
              <View style={styles.highlightInfo}>
                <Text style={styles.highlightText}>
                  Spent least on {minExpense.category}
                </Text>
                <Text style={styles.highlightNumber}>
                  Rs {minExpense.amount}
                </Text>
              </View>
            ) : (
              <View style={styles.highlightInfo}>
                <Text style={styles.highlightText}>Fetching category...</Text>
                <Text style={styles.highlightNumber}>Fetching...</Text>
              </View>
            )}
            {/* <View style={styles.highlightInfo}>
              <Text style={styles.highlightText}>Something</Text>
              <Text style={styles.highlightNumber}>10,000</Text>
            </View> */}
          </View>
        </View>
        <View style={styles.expenditureDetailView}>
          <Text style={styles.expenditureDetailHead}>This Month's Expenses</Text>
          {expenseData!=null && totalExpense!=0 ? (
            <PieChart
              data={expenseData}
              width={screenWidth-20}
              height={220}
              chartConfig={chartConfig}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              accessor={"amount"}
              backgroundColor="transparent"
              paddingLeft="0"
              absolute //For the absolute number else percentage
            />
          ) : (
            <Text>No Data Available</Text>
          )}
        </View>
        <View style={styles.expenditureDetailView}>
          <Text style={styles.expenditureDetailHead}>Past Expenses</Text>
          {pastExpenseData ? (
            <BarChart
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
              data={pastExpenseData}
              width={screenWidth-50}
              height={220}
              // yAxisLabel="Rs"
              chartConfig={chartConfig}
              showValuesOnTopOfBars={true}
              // withHorizontalLabels={false} 
              // verticalLabelRotation={30}
            />
          ) : (
            <Text>No Data Available</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
  },
  highlight: {
    // height: "35%",
    backgroundColor: "#e580ff",
    borderRadius: 25,
    margin: 10,
    elevation: 5,
  },
  expenditureView: {
    marginTop: 30,
    // flex: 1,
    alignItems: "center",
  },
  expenditureNumber: {
    color: "white",
    fontWeight: "800",
    fontSize: 30,
  },
  expenditureText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 0.8,
  },
  highlights: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  highlightInfo: {
    alignItems: "center",
  },
  highlightText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 0.8,
  },
  highlightNumber: {
    color: "white",
    fontWeight: "800",
    fontSize: 23,
  },
  expenditureDetailView: {
    // backgroundColor: "#c8d0d0",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    margin: 10,
    elevation: 5,
  },
  expenditureDetailHead: {
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.8,
  },
  viewExpenses: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: "#e580ff",
    borderRadius: 5,
    elevation: 3,
  },
  viewExpensesText: {
    color: "white",
  },
  expenseList: {
    marginVertical: 10,
  },
  expenseItem: {
    backgroundColor: "white",
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 5,
  },
  expenseIndex: {
    marginRight: 10,
  },
  expensedetail: {
    flex: 1,
  },
  expenseTitle: {
    // fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 0.25,
  },
  expenseCategory: {
    fontWeight: "bold",
    fontSize: 10,
    letterSpacing: 0.25,
  },
  expenseAmount: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
