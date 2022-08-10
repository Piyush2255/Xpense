import React from "react";
import { StyleSheet, View, Text, FlatList, Button,Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

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

export default function Expense({navigation}) {
    return (
        <View style={styles.container}>
            <View style={styles.expenseList}>
                <FlatList data={DATA} renderItem={Item} keyExtractor={(item) => item.id} scrollEnabled={true} />
            </View>
            <Pressable style={styles.button} onPress={()=>navigation.navigate("Add Expenses")}>
                <Ionicons name="add" size={32} color="white"></Ionicons>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    expenseList: {

    },
    expenseItem: {
        backgroundColor: "white",
        // flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 5
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
    },
    button:{
        right: 15,
        bottom: 15,
        position: "absolute",
        borderRadius: 30,
        width: 60,
        height: 60,
        backgroundColor: "purple",
        alignItems: "center",
        justifyContent: "center"
    }
});