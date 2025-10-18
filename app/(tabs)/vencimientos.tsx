import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function VencimientosScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Próximos Vencimientos</Text>
      <View style={styles.card}>
        <Text>🔧 En desarrollo — acá vas a listar los vencimientos reales.</Text>
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
