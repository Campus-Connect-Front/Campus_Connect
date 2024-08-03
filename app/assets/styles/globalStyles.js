import { Platform, StyleSheet, Text, View } from "react-native";

export const horizontalLineStyle = {
    height: 0.7,
    backgroundColor: '#5678F0',
    marginVertical: 10,
    marginHorizontal: 25
};

export const shadowStyle = {
    ...Platform.select({
        ios: {
            shadowColor: "#000000",
            shadowOpacity: 0.45,
            shadowRadius: 5, 
            shadowOffset: { width: 0, height: 2 }
        },
        android: { elevation: 5 }
    })
};

export const alertButtonStyle = StyleSheet.create({
    destructive: {
        backgroundColor: '#FF8989',
    },
    default: {
        backgroundColor: '#7F9AF5',
    }
});

export const miniLanguageBox = StyleSheet.create({
    box: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        ...shadowStyle
    },
    text: {
        color: '#5678F0',
        fontFamily: 'Pretendard-Bold',
        fontSize: 11
    }
})

export const toastConfig = {
    default: ({ text1 }) => (
        <View style={{
            paddingHorizontal: 40,
            paddingVertical: 10,
            opacity: 0.9,
            backgroundColor: '#757575',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            ...Platform.select({
                ios: {
                    shadowColor: "#000000",
                    shadowOpacity: 0.45,
                },
                android: { elevation: 5 }
            })
        }}>
            <Text style={{
                color: '#ffffff'
            }}>{text1}</Text>
        </View>
    )
};

export const selectButtonStyle = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowColor: "#000000",
                shadowOpacity: 0.45,
            },
            android: { elevation: 5 }
        })
    },
    text: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 14
    }
});

export const infoBoxStyles = StyleSheet.create({
    boxContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginHorizontal: 40
    },
    boxTitleContiner: {
        backgroundColor: '#5678F0',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    boxTitleText: {
        color: '#ffffff',
        fontFamily: 'Pretendard-Bold',
        fontSize: 19,
        paddingVertical: 12 
    },
    tableContainer: {
        marginHorizontal: 20,
        marginVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#5678F0'
    },
    tableTitleContainer: {
        backgroundColor: '#F2F2F7',
        alignItems: 'flex-end',
        justifyContent: 'center',
        flex: 3,
        paddingRight: 10,
        paddingVertical: 10
    },
    tableContentContainer: {
        backgroundColor: '#ffffff',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 7,
        paddingLeft: 15,
        paddingVertical: 10
    },
    tableTitleText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 14
    },
    tableContentText: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 13
    },
    tableRowContainer_top: {
        flexDirection: 'row'
    },
    tableRowContainer_middle: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderColor: '#E0E0E0'
    },
    tableRowContainer_bottom: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderColor: '#E0E0E0'
    }
});