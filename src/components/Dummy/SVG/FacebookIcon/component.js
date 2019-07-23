import React from "react";
import { Svg, G, Path } from "react-native-svg";

export default class FacebookIcon extends React.Component {
  render() {
    return (
      <Svg
        height={this.props.height}
        width={this.props.width}
        viewBox="0 0 36.35 70"
      >
        <G>
          <Path
            fill="#FFFFFF"
            d="M36.35.5V11.61h-6.6q-3.62,0-4.88,1.51a7,7,0,0,0-1.26,4.54v8H35.93L34.28,38.07H23.6V70H10.73V38.07H0V25.62H10.73V16.45q0-7.82,4.37-12.14T26.75,0A69.59,69.59,0,0,1,36.35.5Z"
          />
        </G>
      </Svg>
    );
  }
}
