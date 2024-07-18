import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

// create by hye33 on 2024/07/17
//
// params
// text: 버튼 텍스트
// onPress: onPress
// disablePress: Press 불가 여부
// containerStyle: 버튼 스타일
// textStyle: 텍스트 스타일

export default class DoneButton extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.disablePress) {
            return (
                <View style={{ 
                    backgroundColor: '#dbdbdb',
                    borderRadius: 16,
                    justifyContent:'center',
                    alignItems: 'center',
                    marginHorizontal: 25,
                    ...this.props.containerStyle}}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Pretendard-Bold',
                        color: '#848484',
                        paddingVertical: 15,
                        ...this.props.textStyle
                    }}>{this.props.text}</Text>
                </View>
            )
        }
        return (
            <View style={{ 
                backgroundColor: '#5678F0',
                borderRadius: 16,
                marginHorizontal: 25,
                ...this.props.containerStyle}}>
                <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                    onPress={this.props.onPress}
                >
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Pretendard-Bold',
                        color: '#ffffff',
                        paddingVertical: 15,
                        ...this.props.textStyle
                    }}>{this.props.text}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}