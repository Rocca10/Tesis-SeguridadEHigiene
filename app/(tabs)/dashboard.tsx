import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

// Datos simulados (después los vas a traer del backend)
const vencimientos = [
  { id: 1, nombre: "Extintor ABC - Taller Mecánica", fecha: "2025-11-10", diasRestantes: 25 },
  { id: 2, nombre: "Botiquín de Primeros Auxilios - Aula 3", fecha: "2025-10-20", diasRestantes: 5 },
  { id: 3, nombre: "Señalización de Evacuación - Pasillo Principal", fecha: "2025-12-01", diasRestantes: 45 },
];

const alertas = [
  { id: 1, tipo: "Peligro", mensaje: "Falta señal de advertencia en laboratorio de química." },
  { id: 2, tipo: "Mantenimiento", mensaje: "Control anual de matafuegos pendiente." },
];

export default function DashboardScreen() {
  const [dataVencimientos] = useState(vencimientos);
  const [dataAlertas] = useState(alertas);

  return (
    <ScrollView style={styles.container}>
                  <Image
                    source={require("../../assets/images/utedyc_logo.png")}
                     style={{ width: 250, height: 250, alignSelf: "center", marginBottom: -20 }}
                    resizeMode="contain"
                  />
      <Text style={styles.titulo}>Centro de Formación Profesional UTEDYC</Text>
      <Text style={styles.subtitulo}>Seguridad e Higiene - Panel Principal</Text>
      
      {/* Próximos Vencimientos */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calendar-outline" size={22} color="#1E88E5" />
          <Text style={styles.cardTitle}>Próximos Vencimientos</Text>
        </View>

        {dataVencimientos.map((item) => (
          <View key={item.id} style={styles.vencimientoItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.vencimientoNombre}>{item.nombre}</Text>
              <Text style={styles.vencimientoFecha}>Vence: {item.fecha}</Text>
            </View>
            <Text
              style={[
                styles.vencimientoDias,
                item.diasRestantes <= 7
                  ? styles.vencimientoUrgente
                  : item.diasRestantes <= 30
                  ? styles.vencimientoProximo
                  : styles.vencimientoOk,
              ]}
            >
              {item.diasRestantes} días
            </Text>
          </View>
        ))}
      </View>

      {/* Alertas Activas */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="alert-circle-outline" size={22} color="#E53935" />
          <Text style={styles.cardTitle}>Alertas Activas</Text>
        </View>

        {dataAlertas.map((alerta) => (
          <View key={alerta.id} style={styles.alertaItem}>
            <Ionicons
              name={
                alerta.tipo === "Peligro"
                  ? "warning-outline"
                  : "construct-outline"
              }
              size={20}
              color={alerta.tipo === "Peligro" ? "#E53935" : "#FB8C00"}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.alertaTexto}>{alerta.mensaje}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        © 2025 CFP UTEDYC - Sistema de Seguridad e Higiene
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F6F8",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E88E5",
    marginTop: 20,
  },
  subtitulo: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  vencimientoItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  vencimientoNombre: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  vencimientoFecha: {
    fontSize: 12,
    color: "#888",
  },
  vencimientoDias: {
    fontWeight: "bold",
    fontSize: 14,
    paddingHorizontal: 10,
  },
  vencimientoUrgente: {
    color: "#E53935",
  },
  vencimientoProximo: {
    color: "#FB8C00",
  },
  vencimientoOk: {
    color: "#43A047",
  },
  alertaItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  alertaTexto: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#777",
    marginTop: 20,
    marginBottom: 10,
  },
});
