import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Dashboard from './components/Dashboard';
import { FpsCounter } from './components/FPSCounter';

const App = () => {
  return (
      <SafeAreaView style={styles.container}>
        <FpsCounter visible={true} />
        <Dashboard />
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

export default App;
