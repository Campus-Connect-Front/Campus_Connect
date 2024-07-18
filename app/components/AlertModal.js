import React, { Component } from 'react';
import { TouchableOpacity, Text, View, Modal, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { shadowStyle } from '../assets/styles/globalStyles';

// create by hye33 on 2024/07/18
//
// params
// title: alert title
// message: alert message
// showCloseButton: 우측 상단 X 버튼 표시 여부 (default: false)
// alertButtons(Object Array): 하단 버튼들(props: text, style, onPress)

{/* 

사용 예시

const [modalVisible, setModalVisible] = useState(false);
return(
    <AlertModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title='게시글 삭제'
        message={'정말 게시글을 삭제하시겠습니까?'}
        showCloseButton={false}
        alertButtons={[
            {
                text: '취소',
                style: alertButtonStyle.default,
                onPress: () => { setModalVisible(false) }
            },
            {
                text: '삭제',
                style: alertButtonStyle.destructive,
                onPress: () => { deletePost({ navigation }) }
            }
        ]}
    /> 
)
*/}

export default class AlertModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.modalVisible}
                onRequestClose={() => {
                    this.props.setModalVisible(false);
                }}
            >
                <View style={{ flex: 1, backgroundColor: "rgba(217, 217, 217, 0.4)", justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                        backgroundColor: '#ffffff',
                        width: '70%',
                        alignItems: 'center',
                        borderRadius: 11,
                        minHeight: '25%',
                        ...Platform.select({
                            ios: {
                                shadowColor: "#000000",
                                shadowOpacity: 0.45,
                            },
                            android: { elevation: 5 }
                        })
                    }}>
                        {
                            (this.props.showCloseButton) ?
                                <TouchableOpacity
                                    style={{ position: 'absolute', top: 5, right: 5 }}
                                    onPress={() => this.props.setModalVisible(false)}>
                                    <MaterialIcons name="cancel" size={20} color="#FF8989" />
                                </TouchableOpacity>
                                : null
                        }
                        <Text style={{
                            fontSize: 15,
                            marginTop: 25,
                            marginBottom: 10
                        }}>{this.props.title}</Text>
                        <View style={{
                            width: '90%',
                            height: 0.7,
                            backgroundColor: '#DADADA',
                        }} />
                        <Text style={{
                            fontSize: 12,
                            marginTop: 30,
                            marginBottom: 10,
                            minHeight: '10%'
                        }}>{this.props.message}</Text>
                        <View style={{
                            marginBottom: 30,
                            marginTop: 10,
                            width: '100%',
                            alignSelf: 'flex-end',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly'
                        }}>
                            {
                                (this.props.alertButtons == null) ? null
                                    : this.props.alertButtons.map((buttons, index) => {
                                        return (
                                            <TouchableOpacity style={{
                                                borderRadius: 6,
                                                paddingVertical: 3,
                                                width: 70,
                                                height: 25,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                ...shadowStyle,
                                                ...buttons.style
                                            }} onPress={buttons.onPress}>
                                                <Text>{buttons.text}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}