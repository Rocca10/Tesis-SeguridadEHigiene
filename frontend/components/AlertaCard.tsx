import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface AlertaCardProps {
  tipo: string;
  mensaje: string;
  icono?: string;
  color?: string;
}

export default function AlertaCard({ tipo, mensaje, icono, color }: AlertaCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name={(icono as any) || "alert-circle-outline"} size={26} color={color || "#E53935"} />
        <Text style={[styles.tipo, { color: color || "#E53935" }]}>{tipo}</Text>
      </View>
      <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  tipo: { fontWeight: "bold", fontSize: 16, marginLeft: 8 },
  mensaje: { fontSize: 14, color: "#333" },
});
