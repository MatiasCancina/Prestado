import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./navigation/Navigator";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Navigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
