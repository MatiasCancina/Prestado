import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import HomeScreen from '../screens/HomeScreen';
import ItemsListScreen from '../screens/ItemsListScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                // header: () => {
                //     return <Header title={route.name} />;
                // },
                tabBarShowLabel: false,
                // tabBarStyle: styles.tabBar,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View>
                                <FontAwesome5 name="home" size={24} color={focused ? 'blue' : 'black'} />
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="ItemsList"
                component={ItemsListScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View>
                                <FontAwesome5 name="list" size={24} color={focused ? 'blue' : 'black'} />
                            </View>
                        );
                    },
                }}
            />
            {/* <Tab.Screen
                name="Orders"
                component={OrdersStackNavigator}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View>
                                <FontAwesome5 name="receipt" size={24} color={focused ? 'blue' : 'white'} />
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Profile"
                component={MyProfileStackNavigator}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View>
                                <FontAwesome5 name="user-alt" size={24} color={focused ? 'blue' : 'white'} />
                            </View>
                        );
                    },
                }}
            /> */}

        </Tab.Navigator>
    )
}

export default BottomTabNavigator