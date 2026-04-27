import React, { useEffect, useState } from 'react';

import { View, Text, StyleSheet } from 'react-native';
import {
    getBrightness,
    setBrightness,
    requestPermission,
} from '../services/BrightnessService';
import Slider from '@react-native-community/slider';

export default function BrightnessScreen() {
    const [value, setValue] = useState(0);

    useEffect(() => {
        requestPermission().then((granted) => {
            if (granted) {
                getBrightness().then(setValue);
            }
        });
    }, []);

    const onChange = (val) => {
        setValue(val);
        setBrightness(val);
    };

    return (
        <View style={styles.container}>
            {/* Circle */}
            <View style={styles.circleContainer}>
                <Text style={styles.percent}>{Math.round(value * 100)}%</Text>
            </View>

            {/* Slider */}
            <View style={styles.sliderContainer}>
                <Text style={styles.label}>Brightness</Text>
                <Slider
                    style={{ width: '100%' }}
                    minimumValue={0}
                    maximumValue={1}
                    value={value}
                    onValueChange={onChange}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDE7F6',
        padding: 20,
        justifyContent: 'center',
    },
    circleContainer: {
        height: 200,
        borderRadius: 20,
        backgroundColor: '#DADADA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    percent: {
        fontSize: 28,
        color: '#555',
    },
    sliderContainer: {
        backgroundColor: '#DADADA',
        padding: 15,
        borderRadius: 15,
    },
    label: {
        marginBottom: 10,
        fontSize: 16,
    },
});