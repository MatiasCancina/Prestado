import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./navigation/Navigator";
import { AuthProvider } from "./context/AuthContext";
import { UserStatsProvider } from "./context/UserStatsContext";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <UserStatsProvider>
          <Navigator />
        </UserStatsProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
