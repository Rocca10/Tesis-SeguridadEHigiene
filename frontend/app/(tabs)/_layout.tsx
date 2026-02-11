import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import React from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import AlertasScreen from "./alertas";
import ConfiguracionScreen from "./configuracion";
import DashboardScreen from "./dashboard";
import VencimientosScreen from "./vencimientos";

const nombreUsuario = "Nicolás Rocca";

const Drawer = createDrawerNavigator();

// Componente personalizado para el contenido del Drawer
function CustomDrawerContent(props: any) {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Querés cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("user");
            router.replace("/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        {/* Encabezado del Drawer */}
        <View style={styles.drawerHeader}>
          <Image
            source={require("../../assets/images/utedyc_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>👋 Bienvenido</Text>
          <Text style={styles.userName}>{nombreUsuario}</Text>
        </View>

        {/* Menú de opciones */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Botón de Logout al final */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#E53935" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AppLayout() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#1E88E5" },
        headerTintColor: "#fff",
        drawerActiveTintColor: "#1E88E5",
        drawerLabelStyle: { fontSize: 15 },
      }}
    >
      {/* 🛡️ Dashboard */}
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Panel Principal",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* 🔥 Vencimientos */}
      <Drawer.Screen
        name="Vencimientos"
        component={VencimientosScreen}
        options={{
          title: "Próximos Vencimientos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="flame-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ⚠️ Alertas */}
      <Drawer.Screen
        name="Alertas"
        component={AlertasScreen}
        options={{
          title: "Alertas Activas",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="warning-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ⚙️ Configuración */}
      <Drawer.Screen
        name="configuracion"
        component={ConfiguracionScreen}
        options={{
          title: "Configuración",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: "center",
    marginVertical: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E88E5",
  },
  userName: {
    fontSize: 15,
    color: "#333",
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FAFAFA",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E53935",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E53935",
    marginLeft: 12,
  },
});