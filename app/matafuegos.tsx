import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function MatafuegosScreen() {
  const [data, setData] = useState([
    { piso: "Subsuelo", cantidad: 3, fechaVencimiento: "2025-11-10" },
  ]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Matafuegos",
          headerStyle: { backgroundColor: "#1E88E5" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />

      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>Listado de Matafuegos</Text>

        {data.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="flame-outline" size={24} color="#E53935" />
              <Text style={styles.cardTitle}>{item.piso}</Text>
            </View>
            <Text style={styles.cardText}>Cantidad: {item.cantidad}</Text>
            <Text style={styles.cardFecha}>Vence: {item.fechaVencimiento}</Text>
          </View>
        ))}

        <Text style={styles.total}>
          Total Matafuegos: {data.reduce((acc, x) => acc + x.cantidad, 0)}
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F4F6F8" },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E88E5",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  cardText: { fontSize: 14, color: "#555", marginTop: 4 },
  cardFecha: { fontSize: 13, color: "#777" },
  total: {
    marginTop: 15,
    textAlign: "center",
    color: "#1E88E5",
    fontWeight: "bold",
    fontSize: 16,
  },
});
