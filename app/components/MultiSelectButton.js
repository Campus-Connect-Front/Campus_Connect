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

export default class MultiSelectButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //select: this.props.initSelect.length > 0 ? this.props.initSelect : Array(this.props.count).fill(false),
            select: Array(this.props.count).fill(false),
            lastSelected: '',
            selectAll: false,
        }
    }
    render() {
        return (
            <View style={this.props.containerStyle}>
                {
                    this.props.selectAll ?
                        <View style={{ width: 500 }}>
                            <TouchableOpacity
                                style={[this.props.buttonStyle, this.state.selectAll && { backgroundColor: this.props.selectedButtonColor }]}
                                onPress={() => {
                                    if (this.state.selectAll) {
                                        this.setState({
                                            selectAll: false,
                                            select: Array(this.props.count).fill(false)
                                        });
                                    } else {
                                        this.setState({
                                            selectAll: true,
                                            select: Array(this.props.count).fill(true)
                                        });
                                    }
                                }}
                            >
                                <Text style={[this.props.textStyle, this.state.selectAll && { color: this.props.selectedTextColor }]}>{this.props.selectAllButtonText}</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }

                {
                    this.props.textArray.map((data, index) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    let s = this.state.select;
                                    s[index] = !s[index];
                                    this.setState({
                                        select: s,
                                    });
                                    if (s[index]) {
                                        this.state.lastSelected = data;
                                    }
                                    this.props.getSelected(s, this.state.lastSelected);
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