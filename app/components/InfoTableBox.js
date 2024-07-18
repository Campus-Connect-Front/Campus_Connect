import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { infoBoxStyles } from '../assets/styles/globalStyles';

// create by hye33 on 2024/07/18
//
// params
// title: 맨 위 위치하는 제목
// tableInfos(Object Array): 표 안에 들어갈 정보
//     title: 왼쪽에 위치한 글자
//     info: 오른쪽에 들어갈 글자(혹은 컴포넌트)
//     titleStyle: title 텍스트 스타일
// showAdditionalButton: 아래에 뜨는 추가 버튼(ex. 변경하기)
// buttonText: 추가 버튼의 텍스트
// buttonOnPress: 추가 버튼 클릭 시 호출할 함수
// buttonContainerStyle: 추가 버튼 스타일
// buttonTextStyle: 추가 버튼의 텍스트 스타일

{/* 
    사용 예

    <InfoTableBox
        title='스터디 정보'
        tableInfos={[
            {
                title: '방제목',
                info: '영어 AtoZ'
            },
            {
                title: '인원',
                info: '5/6'
            },
            {
                title: '스터디 언어',
                titleStyle: { fontSize: 11 },
                info: () => (
                    <View>
                        // Component
                    </View>    
                )
            }
        ]}
    /> 
*/}

export default class InfoTableBox extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{...infoBoxStyles.boxContainer, ...this.props.style}}>
                <View style={infoBoxStyles.boxTitleContiner}>
                    <Text style={infoBoxStyles.boxTitleText}>{this.props.title}</Text>
                </View>
                <View style={infoBoxStyles.tableContainer}>
                    {
                        this.props.tableInfos.map((info, index) => (
                            <View style={
                                (index == 0) ? infoBoxStyles.tableRowContainer_top :
                                    infoBoxStyles.tableRowContainer_middle
                            } key={index}>
                                <View style={infoBoxStyles.tableTitleContainer}>
                                    <Text style={{ ...infoBoxStyles.tableTitleText, ...info.titleStyle }}>{info.title}</Text>
                                </View>
                                <View style={infoBoxStyles.tableContentContainer}>
                                    {
                                        (typeof (info.info) == 'string') ?
                                            <Text style={{ ...infoBoxStyles.tableContentText, ...info.infoStyle }}>{info.info}</Text>
                                            : info.info()
                                    }
                                </View>
                            </View>
                        ))
                    }
                </View>
                {
                    (this.props.showAdditionalButton) ?
                        <View style={{ alignSelf: 'center', marginBottom: 15, width: 120, paddingVertical: 7, backgroundColor: '#EFEFEF', borderRadius: 7, ...this.props.buttonContainerStyle }}>
                            <TouchableOpacity
                                style={{ alignItems: 'center' }}
                                onPress={this.props.buttonOnPress}
                            >
                                <Text style={{ fontFamily: 'Pretendard-Regular', fontSize: 14, ...this.props.buttonTextStyle }}>{this.props.buttonText}</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
            </View>
        )
    }
}