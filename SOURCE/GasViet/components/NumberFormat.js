import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl
} from "react-native";
import NumberFormat from "react-number-format";
import * as Theme from "../constants/Theme";
import Icon from './Icon'
export default class FormatMoney extends React.Component {
  render() {
    const { value, color, fonts, style, perfix } = this.props;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {this.props.image &&
          <Image source={require('../assets/images/ic_price_tag.png')}
            style={{ width: 14, height: 14 }}
          />
        }
        <NumberFormat
          value={value}
          displayType={"text"}
          thousandSeparator={true}
          renderText={value => (
            <Text
              numberOfLines={1}
              style={[
                fonts,
                {
                  color: color,
                },
                style
              ]}
            >
              {value}{perfix}
            </Text>
          )}
        />
      </View>
    );
  }
}
