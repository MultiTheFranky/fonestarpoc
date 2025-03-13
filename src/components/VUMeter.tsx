import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import useRealTimeData from '../hooks/useRealTimeData';

const VUMeter = () => {
    const { data } = useRealTimeData();
    const needleAnimation = useRef(new Animated.Value(0)).current;
    const arcFillAnimation = useRef(new Animated.Value(0)).current;
    const lastValue = useRef(0);

    // Create tickmarks for the meter scale
    const renderTicks = () => {
        const ticks = [];
        const numTicks = 11; // 0, 10, 20, ... 100

        for (let i = 0; i < numTicks; i++) {
            const isMainTick = i % 2 === 0;
            // Color coding the ticks based on value range
            let tickColor = '#4CAF50'; // Green for lower values
            if (i > 6) {tickColor = '#FFC107';} // Yellow for mid values
            if (i > 8) {tickColor = '#F44336';} // Red for high values

            ticks.push(
                <View key={i} style={styles.tickContainer}>
                    <View style={[
                        styles.tick,
                        isMainTick ? styles.mainTick : styles.minorTick,
                        { backgroundColor: isMainTick ? tickColor : '#aaa' },
                    ]} />
                    {isMainTick && (
                        <Text style={[styles.tickLabel, { color: tickColor }]}>
                            {i * 10}
                        </Text>
                    )}
                </View>
            );
        }
        return ticks;
    };

    useEffect(() => {
        if (data && data.length > 0) {
            // Get the latest value and ensure it's within 0-100 range
            const newValue = Math.min(Math.max(Math.round(data[data.length - 1].value), 0), 100);

            // Animate both the needle and the arc fill
            Animated.parallel([
                Animated.spring(needleAnimation, {
                    toValue: newValue,
                    friction: 5.5,      // Controls the "bounciness"
                    tension: 25,        // Controls the speed
                    useNativeDriver: true,
                }),
                Animated.timing(arcFillAnimation, {
                    toValue: newValue,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: false, // We need to animate width which isn't supported by native driver
                }),
            ]).start();

            lastValue.current = newValue;
        }
    }, [data, needleAnimation, arcFillAnimation]);

    // Interpolate the fill color based on the current value
    const fillColor = arcFillAnimation.interpolate({
        inputRange: [0, 60, 80, 100],
        outputRange: ['rgba(76, 175, 80, 0.8)', 'rgba(255, 193, 7, 0.8)', 'rgba(255, 87, 34, 0.8)', 'rgba(244, 67, 54, 0.8)'],
    });

    return (
        <View style={styles.container}>
            <View style={styles.meterBody}>
                <Text style={styles.title}>VU LEVEL</Text>

                {/* Arc at the top with illumination */}
                <View style={styles.meterArc}>
                    <Animated.View
                        style={[
                            styles.arcFill,
                            {
                                width: arcFillAnimation.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%'],
                                }),
                                backgroundColor: fillColor,
                            },
                        ]}
                    />
                    <View style={styles.arcScale}>
                        <Text style={styles.arcScaleText}>0</Text>
                        <Text style={styles.arcScaleText}>50</Text>
                        <Text style={styles.arcScaleText}>100</Text>
                    </View>
                </View>

                {/* Meter scale with tickmarks */}
                <View style={styles.scaleContainer}>
                    {renderTicks()}
                </View>

                {/* Needle and pivot assembly */}
                <View style={styles.pivotArea}>
                    <Animated.View
                        style={{
                            transform: [
                                { rotate: needleAnimation.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['-140deg', '45deg'],
                                })},
                            ],
                        }}
                    >
                        <View style={styles.needleWrapper}>
                            <View style={styles.needle}>
                                <View style={styles.needleTip} />
                            </View>
                        </View>
                    </Animated.View>
                    <View style={styles.pivotPoint} />
                </View>

                {/* Current value digital display */}
                <View style={styles.levelDisplay}>
                    <Text style={styles.levelText}>{lastValue.current}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
    },
    meterBody: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
        backgroundColor: '#222',
        borderWidth: 3,
        borderColor: '#444',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'hidden',
    },
    meterArc: {
        position: 'absolute',
        left: 20,
        right: 20,
        height: 40,
        top: 40, // Position at the top
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#333',
        borderTopWidth: 0,
        backgroundColor: '#111',
        zIndex: 5,
    },
    arcFill: {
        position: 'absolute',
        height: '100%',
        left: 0,
        top: 0,
        borderBottomRightRadius: 20, // Match the arc radius
    },
    arcScale: {
        position: 'absolute',
        bottom: 2,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    arcScaleText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    greenZone: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '60%',
        height: 20,
        backgroundColor: 'rgba(76, 175, 80, 0.3)',
    },
    yellowZone: {
        position: 'absolute',
        left: '60%',
        bottom: 0,
        width: '20%',
        height: 20,
        backgroundColor: 'rgba(255, 193, 7, 0.3)',
    },
    redZone: {
        position: 'absolute',
        left: '80%',
        bottom: 0,
        width: '20%',
        height: 20,
        backgroundColor: 'rgba(244, 67, 54, 0.3)',
    },
    title: {
        color: '#eee',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    scaleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 55,
        left: 0,
        right: 0,
    },
    tickContainer: {
        alignItems: 'center',
    },
    tick: {
        width: 2,
        marginBottom: 5,
    },
    mainTick: {
        height: 15,
    },
    minorTick: {
        height: 8,
    },
    tickLabel: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    pivotArea: {
        position: 'absolute',
        left: '50%',
        bottom: 40,
        width: 0, // Important: zero width to center the rotation point
        height: 0, // Important: zero height to center the rotation point
        alignItems: 'center',
        justifyContent: 'center',
    },
    needleWrapper: {
        height: 140,
        width: 4,
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'visible',
    },
    needle: {
        width: 4,
        height: 140,
        backgroundColor: '#ff3333',
        borderRadius: 2,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        position: 'absolute',
        bottom: 0,
    },
    needleTip: {
        position: 'absolute',
        top: 0,
        left: -3,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ff3333',
    },
    pivotPoint: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#ffcc00',
        borderWidth: 2,
        borderColor: '#cc9900',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 5,
        zIndex: 20,
    },
    levelDisplay: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 5,
        padding: 5,
        alignSelf: 'center',
        minWidth: 60,
        alignItems: 'center',
        position: 'absolute',
        bottom: 15,
        left: '50%',
        transform: [{ translateX: -30 }],
        borderWidth: 1,
        borderColor: '#555',
    },
    levelText: {
        color: '#4fc3f7',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default VUMeter;
