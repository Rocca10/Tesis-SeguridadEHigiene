import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import React from "react";
import { Image, Text, View } from "react-native";
import AlertasScreen from "./alertas";
import ConfiguracionScreen from "./configuracion";
import DashboardScreen from "./dashboard";
import VencimientosScreen from "./vencimientos";

const nombreUsuario = "Nicolás Rocca";

const Drawer = createDrawerNavigator();

export default function AppLayout() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      // 👇 Personalizamos el contenido del Drawer
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          {/* Encabezado del Drawer */}
          <View style={{ alignItems: "center", marginVertical: 25 }}>
            
            <Image
              source={require("../../assets/images/utedyc_logo.png")}
              style={{ width: 80, height: 80, marginBottom: 10 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#1E88E5" }}>
              👋 Bienvenido
            </Text>
            <Text style={{ fontSize: 15, color: "#333" }}>{nombreUsuario}</Text>
          </View>

          {/* Menú de opciones */}
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      )}
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
        name="Configuracion"
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
