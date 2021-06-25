import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // flexDirection: 'row',
        // marginBottom: 10,
        // justifyContent: 'space-between',
    },
    text: {
        fontSize: 18,
        color: 'blue',
    },
    picker: {
        // width: 150,
        height: Platform.OS === 'ios' ? 200 : 50,
        // marginLeft: 10,
    },
});

const ConfigPicker = ({ callback, value, text, options }) => {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
            <Picker style={styles.picker}
                selectedValue={value}
                onValueChange={(itemValue, itemIndex) => callback(itemValue)}
            >
                {options.map((option, index) => (
                    <Picker.Item key={index} label={option.name} value={option.value} />
                ))}
                </Picker>
        </View>
    );
}


export default ConfigPicker;
