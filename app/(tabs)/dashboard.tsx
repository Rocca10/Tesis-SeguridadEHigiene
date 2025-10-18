import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getAlertas, getVencimientos } from "../../services/api";



export default function DashboardScreen() {

  const router = useRouter();


  type Vencimiento = {
  id: number;
  nombre: string;
  fecha: string;
  diasRestantes: number;
};

type Alerta = {
  id: number;
  tipo: string;
  mensaje: string;
};

const [dataVencimientos, setDataVencimientos] = useState<Vencimiento[]>([]);
const [dataAlertas, setDataAlertas] = useState<Alerta[]>([]);



  // 🔹 Cargar datos desde el backend al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const vencimientos = await getVencimientos();
        const alertas = await getAlertas();
        setDataVencimientos(vencimientos);
        setDataAlertas(alertas);
      } catch (error) {
        console.log("❌ Error al cargar datos:", error);
      }
    };

    cargarDatos();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={require("../../assets/images/utedyc_logo.png")}
        style={{
          width: 250,
          height: 250,
          alignSelf: "center",
          marginBottom: -20,
          marginTop: -20,
        }}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>Centro de Formación Profesional UTEDYC</Text>
      <Text style={styles.subtitulo}>
        Seguridad e Higiene - Panel Principal
      </Text>



      {/* Próximos Vencimientos */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calendar-outline" size={22} color="#1E88E5" />
          <Text style={styles.cardTitle}>Próximos Vencimientos</Text>
        </View>

        {[...dataVencimientos]
          .sort((a, b) => a.diasRestantes - b.diasRestantes)
          .map((item) => (
            <View key={item.id} style={styles.vencimientoItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.vencimientoNombre}>{item.nombre}</Text>
                <Text style={styles.vencimientoFecha}>
                  Vence: {item.fecha}
                </Text>
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

              {/* Accesos directos */}
<View style={styles.accesosContainer}>
  <TouchableOpacity
    style={styles.accesoItem}
    onPress={() => router.push("/matafuegos")}
  >
    <Ionicons name="flame-outline" size={36} color="#E53935" />
    <Text style={styles.accesoTexto}>Matafuegos</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.accesoItem}>
    <Ionicons name="medical-outline" size={36} color="#43A047" />
    <Text style={styles.accesoTexto}>Botiquines</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.accesoItem}>
    <Ionicons name="exit-outline" size={36} color="#FB8C00" />
    <Text style={styles.accesoTexto}>Señalización</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.accesoItem}>
    <Ionicons name="settings-outline" size={36} color="#1E88E5" />
    <Text style={styles.accesoTexto}>Configuración</Text>
  </TouchableOpacity>
</View>



      <View style={{ marginTop: 0, marginBottom: 50 }}>
        <Text style={styles.footer}>
          © 2025 CFP UTEDYC - Sistema de Seguridad e Higiene
        </Text>
      </View>
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
  accesosContainer: {
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  marginBottom: 25,
  marginTop: 10,
},
accesoItem: {
  alignItems: "center",
  justifyContent: "center",
},
accesoTexto: {
  fontSize: 12,
  color: "#333",
  marginTop: 4,
  fontWeight: "500",
},

});
