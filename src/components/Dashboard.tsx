import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import VUMeter from './VUMeter';

const Dashboard: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text>Dashboard</Text>
            <VUMeter />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});

export default Dashboard;
