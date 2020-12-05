import React, { Component } from "react";
import {
  FlatList,
  Keyboard,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback
} from "react-native";
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from "react-native-geolocation-service";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { connect } from "react-redux";
import { showMessages } from "../../../components/Alert";
import GVHeader from "../../../components/GVHeader";
import Icon from "../../../components/Icon";
import {
  getDetailPlace,
  nearBySearch,
  searchPlaceAutoComplete
} from "../../../constants/Api";
import I18n from "../../../i18n/i18n";
import NavigationUtil from "../../../navigation/NavigationUtil";
import { sendLocationSelect } from "../../../redux/actions";

var timeOut;
const SELECT_ON_MAP = {
  description: "Chọn vị trí trên bản đồ"
};
const SELECT_MY_LOCATION = {
  description: "Chọn vị trí của bạn"
};
class MapLocationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resSearchPlace: [],
      searchKey: "",
      locationSelect: {},
      marker: {
        latitude: 21.002383,
        longitude: 105.795718
      },
      markerName: "",
      isSelectLocationByMarker: false,
      showMap: true,
      marginBottom: 1,
      isLoadingNearBy: false
    };
  }

  onChangeText = text => {
    if (timeOut) clearTimeout(timeOut);
    timeOut = setTimeout(() => this.search(), 600);
    this.setState({
      searchKey: text
    });
  };

  onDragEnd = async event => {
    this.setState({
      marker: event.nativeEvent.coordinate
    });
    this.getNearBy(event.nativeEvent.coordinate);
  };

  async getNearBy(loc) {
    this.setState({
      isLoadingNearBy: true
    });
    var res = await nearBySearch(loc);
    var { vicinity, name } = res.data.results[0];
    this.setState({
      markerName: vicinity.length > name.length ? vicinity : name,
      isLoadingNearBy: false
    });
  }

  requestPerAndroid = async () => {
    const isGrand = await PermissionsAndroid.requestPermission(
      "android.permission.ACCESS_FINE_LOCATION"
    );
    if (!isGrand) this.requestPerAndroid();
  };

  componentWillMount() {
    Keyboard.dismiss;
    if (Platform.OS == "android") this.requestPerAndroid();
  }

  componentDidMount() {
    Keyboard.dismiss;
  }

  onPressLocationSearch = async (item, coords) => {
    this.mapShow();
    this.setState({
      isSelectLocationByMarker: !this.state.isSelectLocationByMarker,
      searchKey: "",
      resSearchPlace: []
    });

    if (item == SELECT_MY_LOCATION) {
      this.setState({
        marker: {
          latitude: coords.latitude,
          longitude: coords.longitude
        }
      });
    }

    if (item != SELECT_ON_MAP && item != SELECT_MY_LOCATION) {
      Keyboard.dismiss();
      var resLocation = await getDetailPlace(item.place_id);
      var { location } = resLocation.data.result.geometry;
      this.setState(
        {
          resSearchPlace: [],
          marker: {
            latitude: location.lat,
            longitude: location.lng
          }
        },
        () => {
          // this.map.animateCamera({
          //   center: {
          //     latitude: this.state.marker.lat,
          //     longitude: this.state.marker.lng
          //   }
          // });
          this.map.animateCamera({
            latitude: this.state.marker.lat,
            longitude: this.state.marker.lng
          });
        }
      );
    }
    this.getNearBy(this.state.marker);
  };

  search = async () => {
    if (this.state.searchKey.trim() != "") {
      var res = await searchPlaceAutoComplete(this.state.searchKey.trim());
      this.setState({
        resSearchPlace: res.data.predictions
      });
    } else this.setState({ resSearchPlace: [] });
  };

  mapShow = () => {
    this.setState({
      showMap: true
    });
  };
  mapHidden = () => {
    this.setState({
      showMap: false
    });
  };

  _onMapReady = () => this.setState({ marginBottom: 0 });

  gotToMyLocation() {
    // console.log("gotToMyLocation is called");
    // navigator.geolocation.getCurrentPosition(
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        this.onPressLocationSearch(SELECT_MY_LOCATION, coords);
        this.map.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        });
      },
      error =>
        showMessages(
          I18n.t("notification"),
          "Vui lòng bật Vị trí trên thiết bị của bạn"
        ),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  render() {
    const {
      isSelectLocationByMarker,
      marker,
      searchKey,
      resSearchPlace,
      showMap
    } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.root}>
          <GVHeader back title="Địa chỉ" />
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
              {showMap && (
                <MapView
                  ref={ref => {
                    this.map = ref;
                  }}
                  onMapReady={this._onMapReady}
                  onTouchStart={() => Keyboard.dismiss()}
                  showsMyLocationButton={true}
                  showsUserLocation={true}
                  provider={PROVIDER_DEFAULT} // remove if not using Google Maps
                  style={[
                    styles.map,
                    { flex: 1, marginBottom: this.state.marginBottom }
                  ]}
                  region={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                  }}
                >
                  {isSelectLocationByMarker && (
                    <Marker
                      onDragEnd={this.onDragEnd}
                      draggable
                      coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude
                      }}
                    />
                  )}
                </MapView>
              )}
              <TextInput
                editable={!isSelectLocationByMarker}
                onFocus={this.mapHidden}
                style={[styles.textInput]}
                value={searchKey}
                numberOfLines={1}
                placeholder={
                  isSelectLocationByMarker
                    ? this.state.markerName
                    : "Tìm kiếm vị trí"
                }
                onChangeText={this.onChangeText}
              />
              {!isSelectLocationByMarker && showMap && (
                <TouchableOpacity
                  onPress={this.gotToMyLocation.bind(this)}
                  style={{
                    width: 60,
                    height: 60,
                    position: "absolute",
                    justifyContent: "center",
                    alignContent: "center",
                    bottom: 20,
                    right: 20,
                    borderRadius: 30,
                    backgroundColor: "#d2d2d2"
                  }}
                >
                  <Icon.MaterialIcons
                    name="my-location"
                    size={50}
                    color="#FD8427"
                    style={{
                      alignSelf: "center"
                    }}
                  />
                </TouchableOpacity>
              )}
              {!showMap && (
                <TouchableOpacity
                  style={styles.rootSelectOnMap}
                  onPress={() => this.onPressLocationSearch(SELECT_ON_MAP)}
                >
                  <Icon.MaterialIcons
                    name="my-location"
                    size={16}
                    color="#FD8427"
                    style={{
                      alignSelf: "center"
                    }}
                  />
                  <Text style={styles.textSelectOnMap}>
                    {SELECT_ON_MAP.description}
                  </Text>
                </TouchableOpacity>
              )}
              {resSearchPlace.length > 0 && !isSelectLocationByMarker && (
                <FlatList
                  keyboardShouldPersistTaps={true}
                  style={[
                    styles.textItemResSearch,
                    {
                      top: 100,
                      width: width - 20
                    }
                  ]}
                  data={resSearchPlace}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{ marginVertical: 8 }}
                      onPress={() => this.onPressLocationSearch(item)}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          color: item == SELECT_ON_MAP ? "#FD8427" : "#8C8C8C"
                        }}
                      >
                        {item.description}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              {isSelectLocationByMarker && (
                <>
                  <View style={styles.root_select_button_bg}>
                    <TouchableOpacity
                      style={[
                        styles.select_button_bg,
                        {
                          backgroundColor: "white",
                          borderWidth: 1,
                          borderColor: "#ED7117"
                        }
                      ]}
                      onPress={() => this.onPressLocationSearch(SELECT_ON_MAP)}
                    >
                      <Text
                        style={[styles.select_button, { color: "#ED7117" }]}
                      >
                        Huỷ
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.select_button_bg]}
                      disabled={this.state.isLoadingNearBy}
                      onPress={() => {
                        this.props.sendLocationSelect(
                          this.state.marker,
                          this.state.markerName
                        );
                        NavigationUtil.goBack();
                      }}
                    >
                      <Text style={styles.select_button}>Chọn vị trí</Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={styles.text_hole_marker}
                  >
                    Giữ icon đỏ để chọn vị trí
                  </Text>
                </>
              )}
            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = {
  sendLocationSelect
};
export default connect(mapStateToProps, mapDispatchToProps)(MapLocationScreen);
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  textSelectOnMap: {
    textAlignVertical: "center",
    fontFamily: "Roboto-regular",
    fontSize: 14,
    color: "#FD8427",
    textAlign: "center",
    marginStart: 10
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  textInput: {
    position: "absolute",
    borderRadius: 30,
    top: 10,
    width: width - 10,
    backgroundColor: "white",
    textAlignVertical: "center",
    fontFamily: "Roboto-regular",
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS == "android" ? 8 : 13,
    shadowRadius: 10,
    elevation: 3,
    shadowOpacity: 0.3
  },
  rootSelectOnMap: {
    position: "absolute",
    top: 60,
    flexDirection: "row",
    padding: 10,
    width: width - 20
  },
  textItemResSearch: {
    position: "absolute",
    top: 10,
    backgroundColor: "white",
    textAlignVertical: "center",
    fontFamily: "Roboto-regular",
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS == "android" ? 6 : 8
  },
  select_button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: "white",
    fontFamily: "Roboto-regular",
    fontSize: 15,
    textAlign: "center"
  },
  root_select_button_bg: {
    bottom: 30,
    position: "absolute",
    flexDirection: "row",
    overflow: "hidden",
    marginHorizontal: 35
  },
  select_button_bg: {
    backgroundColor: "#ED7117",
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 10
  },
  root: {
    flex: 1,
    marginTop: Platform.OS == "ios" ? 0 : -StatusBar.currentHeight
  },
  text_hole_marker:{
    position: "absolute",
    bottom: 80,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius:5,padding:5
  }
});
