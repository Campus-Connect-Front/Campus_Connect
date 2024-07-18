import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text,
    View
} from 'react-native';
/*
 *create by zengkm on 2018/03/28
 *
 *
 *params
 *count:按钮个数
 *textArray:文字数组
 *containerStyle:按钮容器样式
 *buttonStyle:按钮样式
 *textStyle:文字样式
 *selectedButtonColor:选中按钮样式
 *selectedTextColor:选中文字样式
 */
export default class SingleSelectButton extends Component {
    constructor(props) {
        super(props);
        const set = Array(this.props.count).fill(false)
        if (this.props.initialSelect != null)
            set[this.props.initialSelect] = true
        this.state = {
            select: set,
        }
    }
    render() {
        if (this.props.fixedSelect) {
            return (
                <View style={this.props.containerStyle}>
                    {
                        this.props.textArray.map((data, index) => {
                            return (
                                <View
                                    key={index}
                                    {...this.props}
                                    style={[this.props.buttonStyle, this.state.select[index] && { backgroundColor: this.props.selectedButtonColor }]}
                                >
                                    <Text style={[this.props.textStyle, this.state.select[index] && { color: this.props.selectedTextColor }]}>{data}</Text>
                                </View>
                            );
                        })
                    }
                </View>
            )
        }
        return (
            <View style={this.props.containerStyle}>
                {
                    this.props.textArray.map((data, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                {...this.props}
                                onPress={() => {
                                    let s = Array(this.props.count).fill(false);
                                    s[index] = true;
                                    this.setState({
                                        select: s,
                                    });
                                    this.props.getSelected({ data: data, index: index })
                                }}
                                style={[this.props.buttonStyle, this.state.select[index] && { backgroundColor: this.props.selectedButtonColor }]}
                            >
                                <Text style={[this.props.textStyle, this.state.select[index] && { color: this.props.selectedTextColor }]}>{data}</Text>
                            </TouchableOpacity>
                        );
                    })
                }
            </View>
        )
    }
}