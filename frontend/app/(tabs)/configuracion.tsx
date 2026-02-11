import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function ConfiguracionScreen() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<any>(null);
  const [alertasActivas, setAlertasActivas] = useState(true);
  const [diasAviso, setDiasAviso] = useState(15);

  useEffect(() => {
    const cargarUsuario = async () => {
      const user = await SecureStore.getItemAsync("user");
      if (user) setUsuario(JSON.parse(user));
    };

    cargarUsuario();
  }, []);

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    router.replace("/login");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Configuración",
          headerStyle: { backgroundColor: "#1E88E5" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Configuración</Text>

        {/* 👤 Usuario */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>👤 Usuario</Text>
          <Text>Usuario: {usuario?.usuario || "-"}</Text>
          <Text>Rol: {usuario?.rol || "-"}</Text>
          <Text>Estado: Activo</Text>
        </View>

        {/* 🔔 Alertas */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🔔 Alertas</Text>

          <View style={styles.row}>
            <Text>Alertas activas</Text>
            <Switch
              value={alertasActivas}
              onValueChange={setAlertasActivas}
            />
          </View>

          <Text style={{ marginTop: 10 }}>Avisar con:</Text>

          <View style={styles.row}>
            {[7, 15, 30].map((dias) => (
              <TouchableOpacity
                key={dias}
                style={[
                  styles.optionButton,
                  diasAviso === dias && styles.optionSelected,
                ]}
                onPress={() => setDiasAviso(dias)}
              >
                <Text
                  style={{
                    color: diasAviso === dias ? "#fff" : "#1E88E5",
                  }}
                >
                  {dias} días
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ℹ️ Información del sistema */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ℹ️ Información del sistema</Text>
          <Text>Versión app: 1.0.0</Text>
          <Text>Backend: http://10.0.2.2:5000</Text>
          <Text>
            Última sincronización: {new Date().toLocaleDateString()}
          </Text>
        </View>

        {/* 🚪 Logout */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E88E5",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#1E88E5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  optionSelected: {
    backgroundColor: "#1E88E5",
  },
  logoutButton: {
    backgroundColor: "#E53935",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});