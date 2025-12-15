import React, { Suspense } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// const MiniAppComponent = React.lazy(() => import('megaStoreCart/example'));

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Host Application</Text>

      <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
        {/* <MiniAppComponent /> */}
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});