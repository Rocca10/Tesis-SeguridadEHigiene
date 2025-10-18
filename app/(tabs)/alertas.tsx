import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AlertasScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Alertas Activas</Text>
      <View style={styles.card}>
        <Text>⚠️ En esta pantalla vas a mostrar las alertas activas.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1E88E5", marginBottom: 15 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
});
