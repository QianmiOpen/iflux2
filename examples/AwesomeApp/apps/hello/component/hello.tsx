import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Relax } from "iflux2"
import { noop } from "uikit";


type Handler = () => void;

@Relax
export default class Hello extends React.Component<any, any> {
  props: {
    text?: string;
    count?: number;
    like?: Handler;
  };

  static defaultProps = {
    text: '',
    count: 1,
    like: noop,
  };

  render() {
    const { text, count, like } = this.props

    return (
      <View style={styles.container}>
        <Text
          style={styles.text}
          onPress={like}>
          {text}{`+${count}`}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  } as React.ViewStyle,
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue'
  } as React.ViewStyle
})