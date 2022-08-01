import Home from '../screens/home';
import Expense from '../screens/detail';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function Route() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            }
            else if (route.name === 'Expenses') {
              iconName = focused ? 'cash' : 'cash-outline';
            }
            return <Ionicons name={iconName} size={size} color={color}></Ionicons>
          },
          tabBarActiveTintColor: '#e580ff',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name='Home' component={Home} />
        <Tab.Screen name='Expenses' component={Expense} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}