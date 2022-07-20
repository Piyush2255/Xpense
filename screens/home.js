import React from "react";
import {StyleSheet,View,Text,Button} from "react-native";

export default function Home({navigation}){
    return(
        <View>
            <Text>Home Screen</Text>
            <Button title="Go to Details" onPress={()=>navigation.navigate('Detail')}/>
        </View>
    );
}