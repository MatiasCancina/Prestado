import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AddItemScreen from "./screens/AddItemScreen";
import ItemsListScreen from "./screens/ItemsListScreen";
import { AuthProvider } from "./context/AuthContext";
import { ItemProvider } from "./context/ItemContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <ItemProvider>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="AddItem" component={AddItemScreen} />
            <Stack.Screen name="ItemsList" component={ItemsListScreen} />
          </Stack.Navigator>
        </ItemProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
