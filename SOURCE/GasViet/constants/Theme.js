import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";
const dimension = ({ width, height } = Dimensions.get("window"));

const colors = {

	primary: "#40A4D1",
	primaryDark: "#125183",
	primaryDark1: "#2E384D",
	primaryButton:'#007CC2',

	bottombarBg: '#fafafa',
	headerColor: '#1b75bc',
	headerTextColor: '#FFFF',
	active: '#1b75bc',
	defaultBg: '#f3f4f6',
	inactive: 'gray',
	indicator: "#24277e",
	borderTopColor: "#dedede",
	white: "#FFFF",
	registerText:'#0692E1',
	border:'#707070',
	backgroundColor:'#F9F9F9',
	header:'#EC7214',
	inactiveText:'#979797',


	black: "#000000",
	green: "#02B019",
	orange: "#FE8427",
	yellow: "#FFE227",
	red: "#FF0000",
	gray: "#979797",
	lightBlue:'#E0F3FE'



};


const sizes = {
	font: 15,
	h1: 48,
	h2: 34,
	h3: 28,
	h4: 15,
	paragraph: 15,
	caption: 13,
	captionMedium: 12,

	// global sizes
	base: 16,
	font: 14,
	border: 15,
	padding: 25,
};

const fonts = {
	bold_italic12: {
		fontSize: 12,
		fontFamily: "Roboto-BoldItalic",
	},
	bold_italic16: {
		fontSize: 16,
		fontFamily: "Roboto-BoldItalic",
	},
	italic18: {
		fontSize: 18,
		fontFamily: "Roboto-Italic",
	},

	bold12: {
		fontFamily: "Roboto-Bold",
		fontSize: 12,
		lineHeight: 14
	},
	bold14: {
		fontFamily: "Roboto-Bold",
		fontSize: 14,
		lineHeight: 17
	},
	bold17: {
		fontFamily: "Roboto-Bold",
		fontSize: 17,
		lineHeight: 45
	},
	bold15: {
		fontFamily: "Roboto-Bold",
		fontSize: 15,
		lineHeight: 18
	},
	bold16: {
		fontFamily: "Roboto-Bold",
		fontSize: 16,
		lineHeight: 19
	},
	bold18: {
		fontFamily: "Roboto-Bold",
		fontSize: 18,
		lineHeight: 21
	},
	bold20: {
		fontFamily: "Roboto-Bold",
		fontSize: 20,
		lineHeight: 24
	},
	bold23: {
		fontFamily: "Roboto-Bold",
		fontSize: 23,
		lineHeight: 27
	},
	bold25: {
		fontFamily: "Roboto-Bold",
		fontSize: 25,
		lineHeight: 29
	},
	bold49: {
		fontFamily: "Roboto-Bold",
		fontSize: 49
	},
	regular10: {
		fontFamily: "Roboto-Regular",
		fontSize: 10,
		lineHeight: 12
	},
	regular12: {
		fontFamily: "Roboto-Regular",
		fontSize: 12,
		lineHeight: 15
	},
	regular13: {
		fontFamily: "Roboto-Regular",
		fontSize: 13,
		lineHeight: 16
	},
	regular14: {
		fontFamily: "Roboto-Regular",
		fontSize: 14,
		lineHeight: 17
	},
	regular15: {
		fontFamily: "Roboto-Regular",
		fontSize: 15,
		lineHeight: 18
	},
	regular16: {
		fontFamily: "Roboto-Regular",
		fontSize: 16,
		lineHeight: 19
	},
	regular17: {
		fontFamily: "Roboto-Regular",
		fontSize: 17,
		lineHeight: 20
	},
	regular18: {
		fontFamily: "Roboto-Regular",
		fontSize: 18,
		lineHeight: 21
	},
	regular24: {
		fontFamily: "Roboto-Regular",
		fontSize: 24,
		lineHeight: 27
	},
	regular47: {
		fontFamily: "Roboto-Regular",
		fontSize: 47,
		lineHeight: 50
	},

	light14: {
		fontFamily: "Roboto-Light",
		fontSize: 14,
		lineHeight: 17
	},
	light10: {
		fontFamily: "Roboto-Light",
		fontSize: 10
	},
	light18: {
		fontFamily: "Roboto-Light",
		fontSize: 18,
		lineHeight: 21
	},

	light20: {
		fontFamily: "Roboto-Light",
		fontSize: 20,
		lineHeight: 23
	},

	light14i: {
		fontFamily: "Roboto-LightItalic",
		fontSize: 14,
		lineHeight: 21
	},

	light15i: {
		fontFamily: "Roboto-LightItalic",
		fontSize: 15,
		lineHeight: 19
	},

	medium11: {
		fontFamily: "Roboto-Medium",
		fontSize: 11,
		lineHeight: 14
	},
	medium12: {
		fontFamily: "Roboto-Medium",
		fontSize: 12,
		lineHeight: 15
	},
	medium13: {
		fontFamily: "Roboto-Medium",
		fontSize: 13,
		lineHeight: 16
	},
	medium14: {
		fontFamily: "Roboto-Medium",
		fontSize: 14,
		lineHeight: 17
	},
	medium15: {
		fontFamily: "Roboto-Medium",
		fontSize: 15,
		lineHeight: 18
	},
	medium16: {
		fontFamily: "Roboto-Medium",
		fontSize: 16,
		lineHeight: 20
	},
	medium18: {
		fontFamily: "Roboto-Medium",
		fontSize: 18,
		lineHeight: 23
	},
	medium20: {
		fontFamily: "Roboto-Medium",
		fontSize: 20,
		lineHeight: 25
	},
	caption: {
		fontFamily: "Roboto-Regular",
		fontSize: sizes.caption,
		color: colors.dark,
		letterSpacing: 1.12,
		lineHeight: 15
	},

	bold20: {
		fontFamily: "roboto-bold",
		fontSize: 20,
		lineHeight: 45,
	},
};

const styles = StyleSheet.create({
	androidSafeView: {
		flex: 1,
		// paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
	},

	test: {
		flex: 1,
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
	},

	containter: {
		flex: 1,
		backgroundColor: colors.defaultBg,
		marginTop: Platform.OS == "ios" ? 0 : -StatusBar.currentHeight
	},

	menu: {
		flex: 1,
		height: width * 0.25,
	},

	scrollHoz: {
		width: width * 0.9,
		height: height * 0.3,
		backgroundColor: colors.white,
		borderRadius: 15,
	},

});

export { colors, sizes, fonts, styles, dimension };
