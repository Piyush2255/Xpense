import React, {useState,useEffect} from "react";
import { StyleSheet, View, Text, Button, Pressable, TouchableOpacity, FlatList, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DATA = [
    {
        id: "skjdfjekjfjasc",
        title: "Grocery Shopping",
        category: "Grocery",
        amount: "1000"
    },
    {
        id: "bvkreljfkwefvajdn",
        title: "Chhole Bhature",
        category: "Food",
        amount: "100"
    },
    {
        id: "kjvrjkjwenkjkjdvsdjz",
        title: "Jeans",
        category: "Clothing",
        amount: "1500"
    },
    {
        id: "jhdkfjafkjaejfnksdv",
        title: "Petrol",
        category: "Fuel",
        amount: "500"
    },
    {
        id: "jdkfjcdkjhcksjdckd",
        title: "Gold Ring",
        category: "Jewelry",
        amount: "18000"
    },
];

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

    useEffect(()=>{
        async function checkCategories(){
            try{
                const categories=await AsyncStorage.getItem('categories');
                if(categories===null){
                    const category=['Food','Travel','Clothing','Groceries','Others'];
                    const categoryValues=JSON.stringify(category);
                    await AsyncStorage.setItem('categories',categoryValues);
                }
                else{
                    console.log("categories are present")
                    console.log(JSON.parse(categories));
                }
            }
            catch(e){
                console.log(e);
            }
        }
        checkCategories();
    },[]);

    return (
        <View style={styles.home}>
            <ScrollView>
                <View style={styles.highlight}>
                    <View style={styles.expenditureView}>
                        <Text style={styles.expenditureText}>Month's Expenditure</Text>
                        <Text style={styles.expenditureNumber}>10,000</Text>
                    </View>
                    <View style={styles.highlights}>
                        <View style={styles.highlightInfo}>
                            <Text style={styles.highlightText}>Something</Text>
                            <Text style={styles.highlightNumber}>10,000</Text>
                        </View>
                        <View style={styles.highlightInfo}>
                            <Text style={styles.highlightText}>Something</Text>
                            <Text style={styles.highlightNumber}>10,000</Text>
                        </View>
                        <View style={styles.highlightInfo}>
                            <Text style={styles.highlightText}>Something</Text>
                            <Text style={styles.highlightNumber}>10,000</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.expenditureDetailView}>
                    <Text style={styles.expenditureDetailHead}>Recent Expenses</Text>
                    <View style={styles.expenseList}>
                        {DATA.map((item,index)=>{
                            return(<Item item={item} index={index} key={item.id}></Item>);
                        })}
                        {/* <FlatList data={DATA} renderItem={Item} keyExtractor={(item) => item.id} scrollEnabled={false} /> */}
                    </View>
                    <Pressable style={styles.viewExpenses} onPress={() => navigation.navigate('Expenses')} >
                        <Text style={styles.viewExpensesText}>View All</Text>
                    </Pressable>
                </View>
                <View style={styles.expenditureDetailView}>
                    <Text style={styles.expenditureDetailHead}>Recent Expenses</Text>
                    <View style={styles.expenseList}>
                        {DATA.map((item,index)=>{
                            return(<Item item={item} index={index} key={item.id}></Item>);
                        })}
                        {/* <FlatList data={DATA} renderItem={Item} keyExtractor={(item) => item.id} scrollEnabled={false} /> */}
                    </View>
                    <Pressable style={styles.viewExpenses} onPress={() => navigation.navigate('Expenses')} >
                        <Text style={styles.viewExpensesText}>View All</Text>
                    </Pressable>
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
        backgroundColor: '#e580ff',
        borderRadius: 25,
        margin: 10,
        elevation: 5,
    },
    expenditureView: {
        marginTop: 30,
        // flex: 1,
        alignItems: "center"
    },
    expenditureNumber: {
        color: "white",
        fontWeight: "800",
        fontSize: 30
    },
    expenditureText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
        letterSpacing: 0.8
    },
    highlights: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginVertical: 20
    },
    highlightInfo: {

    },
    highlightText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
        letterSpacing: 0.8
    },
    highlightNumber: {
        color: "white",
        fontWeight: "800",
        fontSize: 23
    },
    expenditureDetailView: {
        // backgroundColor: "#c8d0d0",
        backgroundColor: "white",
        borderRadius: 25,
        padding: 20,
        margin: 10,
        elevation: 5
    },
    expenditureDetailHead: {
        fontWeight: "bold",
        fontSize: 15,
        letterSpacing: 0.8
    },
    viewExpenses: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        backgroundColor: '#e580ff',
        borderRadius: 5,
        elevation: 3,
    },
    viewExpensesText: {
        color: "white"
    },
    expenseList: {
        marginVertical: 10
    },
    expenseItem: {
        backgroundColor: "white",
        // flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 5
    },
    expenseIndex: {
        marginRight: 10
    },
    expensedetail: {
        flex: 1,
    },
    expenseTitle: {
        // fontWeight: "bold",
        fontSize: 13,
        letterSpacing: 0.25
    },
    expenseCategory: {
        fontWeight: "bold",
        fontSize: 10,
        letterSpacing: 0.25
    },
    expenseAmount: {
        fontWeight: "bold",
        fontSize: 15,
    }
});