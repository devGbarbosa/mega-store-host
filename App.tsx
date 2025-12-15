import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Cart = React.lazy(() => import('megaStoreCart/cart'));
const Stack = createStackNavigator();

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const FAKE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'High-quality wireless headphones with noise cancellation',
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    description: 'Feature-rich smartwatch with health tracking',
  },
  {
    id: '3',
    name: 'USB-C Cable',
    price: 12.99,
    description: 'Durable fast-charging USB-C cable',
  },
  {
    id: '4',
    name: 'Phone Case',
    price: 29.99,
    description: 'Protective and stylish phone case',
  },
  {
    id: '5',
    name: 'Screen Protector',
    price: 9.99,
    description: 'Tempered glass screen protector',
  },
  {
    id: '6',
    name: 'Portable Charger',
    price: 49.99,
    description: '20000mAh portable power bank',
  },
];

const ProductCard = ({
  product,
  onAddToCart,
  isInCart,
  quantity,
}: {
  product: Product;
  onAddToCart: () => void;
  isInCart: boolean;
  quantity?: number;
}) => (
  <TouchableOpacity
    style={[styles.productCard, isInCart && styles.productCardInCart]}
  >
    <View style={styles.cardHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>
      {isInCart && (
        <View style={styles.inCartBadge}>
          <Text style={styles.inCartBadgeText}>✓ {quantity}</Text>
        </View>
      )}
    </View>
    <View style={styles.priceContainer}>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      <TouchableOpacity
        style={[styles.addButton, isInCart && styles.addButtonInCart]}
        onPress={onAddToCart}
      >
        <Text style={styles.addButtonText}>
          {isInCart ? '+ Add More' : 'Add to Cart'}
        </Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

function HomeScreen({ navigation, onAddToCart, cartItems }: any) {
  const isProductInCart = (productId: string) => {
    return cartItems.some((item: CartItem) => item.id === productId);
  };

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find((item: CartItem) => item.id === productId);
    return item?.quantity || 0;
  };

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f5f5f5"
        translucent={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[
          styles.container,
          {
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          },
        ]}
      >
        <Text style={styles.title}>MegaStore</Text>
        <Text style={styles.subtitle}>Featured Products</Text>

        <FlatList
          data={FAKE_PRODUCTS}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onAddToCart={() => {
                handleAddToCart(item);
              }}
              isInCart={isProductInCart(item.id)}
              quantity={getCartQuantity(item.id)}
            />
          )}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function CartScreen({
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  navigation,
}: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f5f5f5"
        translucent={false}
      />
      <View style={styles.cartContainer}>
        <Cart
          items={cartItems}
          onRemoveItem={onRemoveItem}
          onUpdateQuantity={onUpdateQuantity}
          onCheckout={onCheckout}
          onContinueShopping={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const handleCheckout = () => {
    // Add checkout logic here
    console.log('Checkout:', cartItems);
  };

  const handleContinueShopping = () => {
    // Logic for continue shopping
    console.log('Continue shopping');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="Home"
              options={{
                headerTitle: 'MegaStore',
                headerTitleStyle: { fontSize: 24, fontWeight: '700' },
                headerBackTitle: '',
              }}
            >
              {props => (
                <HomeScreen
                  {...props}
                  onAddToCart={handleAddToCart}
                  cartItems={cartItems}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Cart"
              options={{
                headerTitle: 'Shopping Cart',
                headerTitleStyle: { fontSize: 24, fontWeight: '700' },
                headerBackTitle: '',
              }}
            >
              {props => (
                <CartScreen
                  {...props}
                  cartItems={cartItems}
                  onRemoveItem={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  onCheckout={handleCheckout}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cartContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 16,
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginLeft: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  productCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productCardInCart: {
    borderWidth: 2,
    borderColor: '#2ecc71',
    backgroundColor: '#f0fff4',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  inCartBadge: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  inCartBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 0,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonInCart: {
    backgroundColor: '#2ecc71',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  miniAppContainer: {
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 32,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  miniAppTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
});
