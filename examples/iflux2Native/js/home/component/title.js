//@flow
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Relax } from 'iflux2'

@Relax
export default class Title extends Component {
  static defaultProps = {
    text: ''
  };

  render() {
    const { loading, text } = this.props

    return (
      <View style={styles.container}>
        <Text style={styles.text}>{ text }</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold'
  }
})
