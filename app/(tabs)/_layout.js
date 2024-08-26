import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import colors from "../../constants/colors";

import { User, Home, Pencil } from "../../components/Icons";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.violeta,
                tabBarShowLabel: false,
                tabBarStyle: {height: 65}
            }}
        >
            <Tabs.Screen
                name="bloques"
                options={{
                    tabBarIcon: ({ color }) => <Pencil color={color}/>
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: "",
                    tabBarIcon: ({ color }) => <Home color={color}/>
                }}
            />
            <Tabs.Screen
                name="perfil"
                options={{
                    title: "",
                    tabBarIcon: ({ color }) => <User color={color}/>
                }}
            />
        </Tabs>
    );
}

