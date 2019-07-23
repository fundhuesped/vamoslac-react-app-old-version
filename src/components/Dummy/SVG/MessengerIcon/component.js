import React from "react";
import { Svg, G, Path } from "react-native-svg";

export default class MessengerIcon extends React.Component {
  render() {
    return (
      <Svg
        height={this.props.height}
        width={this.props.width}
        viewBox="0 0 77.24 79.25"
      >
        <G>
          <Path
            fill="#FFFFFF"
            d="M38.62,0C17.41,0,0,16.53,0,37A36.09,36.09,0,0,0,12.87,64.37V79.25l14.28-7.14A39.54,39.54,0,0,0,38.62,74c21.21,0,38.62-16.53,38.62-37S59.83,0,38.62,0Zm0,6.44C56.51,6.44,70.8,20.16,70.8,37S56.51,67.58,38.62,67.58a33.69,33.69,0,0,1-11-1.91l-1.31-.4-7,3.52V61.55l-1.21-1A29.91,29.91,0,0,1,6.44,37C6.44,20.16,20.73,6.44,38.62,6.44ZM35,26.85,15.59,47.37,33,37.71l9.25,10L61.45,26.85l-17,9.55Z"
          />
        </G>
      </Svg>
    );
  }
}
