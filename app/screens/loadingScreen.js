import { StyleSheet, View, ActivityIndicator } from "react-native";

export function Splash() {
    return (
        <View style={[styles.container, {
            transform: [{ scale: 1.5 }],
            backgroundColor: '#EBEDF6' }]}>
            <ActivityIndicator size="large" color="#5678F0" />
        </View>
    )
}

export function SplashIcon() {
    return (
        <View style={[styles.container, { transform: [{ scale: 1.5 }] }]}>
            <ActivityIndicator size="large" color="#5678F0" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});