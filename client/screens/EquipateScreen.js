import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

const products = [
  {
    id: "1",
    name: "Zapatillas Running",
    price: "$75.00",
    stock: 10,
    image: "https://via.placeholder.com/100",
  },
  {
    id: "2",
    name: "Camiseta Deportiva",
    price: "$25.00",
    stock: 0,
    image: "https://via.placeholder.com/100",
  },
  {
    id: "3",
    name: "Mochila Deportiva",
    price: "$45.00",
    stock: 5,
    image: "https://via.placeholder.com/100",
  },
];

const EquipateScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text
          style={[
            styles.productStock,
            item.stock > 0 ? styles.inStock : styles.outOfStock,
          ]}
        >
          {item.stock > 0 ? `Stock: ${item.stock}` : "Sin stock"}
        </Text>
        {item.stock > 0 && (
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Comprar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Equipate</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Fondo oscuro principal
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#fff",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E", // Tarjeta con fondo oscuro
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  productPrice: {
    fontSize: 16,
    color: "#ccc",
    marginVertical: 5,
  },
  productStock: {
    fontSize: 14,
    fontWeight: "500",
  },
  inStock: {
    color: "#4CAF50",
  },
  outOfStock: {
    color: "#FF5252",
  },
  buyButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EquipateScreen;
