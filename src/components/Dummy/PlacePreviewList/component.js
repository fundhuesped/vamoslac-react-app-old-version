import React from "react";
import { FlatList, View } from "react-native";
import PlacePreviewItem from "../PlacePreviewItem/component.js";

export default class PlacePreviewList extends React.Component {
  state = { selected: (new Map(): Map<string, boolean>) };

  _keyExtractor = (item, index) => item.placeData.placeId && item.placeData.placeId.toString();

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState(state => {
      // copy the map rather than modi  fying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return { selected };
    });
  };

  _renderItem = ({ item }) => (
    <PlacePreviewItem
      id={item.placeData.placeId}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.placeData.placeId)}
      data={item}
      navigation={this.props.navigation}
    />
  );

  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 10
        }}
      />
    );
  };

  _renderFooter = () => {
    return (
      <View
        style={{
          height: 10
        }}
      />
    );
  };

  componentWillReceiveProps = nexProps => {
    this.refs.listRef.scrollToOffset({ x: 0, y: 0, animated: true });
  };

  render() {
    let store = { ...this.props.store };
    return (
      <FlatList
        ref="listRef"
        data={this.props.store}
        extraData={store}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._renderSeparator}
        ListFooterComponent={this._renderFooter}
      />
    );
  }
}
