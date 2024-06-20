import { StyleSheet } from "react-native";

const loginStyle = StyleSheet.create({
  loginHolder: {
    flex: 1,
    position: "relative",
  },
  imagebg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  feildHolder: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 30,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: "white",
    marginTop: "auto",
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 10,
    width: "70%",
    borderRadius: 7,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  started: {
    fontSize: 30,
    fontWeight: "600"
  },
  buttons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  loginBtn: {
    backgroundColor: "#030933",
    borderRadius: 50,
    height: 50,
    width: "50%",
    justifyContent: "center"
  },
  loginBtnText: {
    textAlign: "center",
    color: "white"
  },
  loginBtn2: {
    backgroundColor: "white",
    borderRadius: 50,
    height: 50,
    width: "50%",
    borderColor: "#131314",
    borderWidth: 1,
    justifyContent: "center"
  },
  loginBtnText2: {
    textAlign: "center",
    color: "black"
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal:30
  },
  orText: {
    paddingHorizontal: 10,
    fontSize: 12,
    color: "#999",
  },
  line: {
    flex: 1,
    width:"10%",
    height: 1,
    backgroundColor: "#9999",
  },
  googleBtn2: {
    borderRadius: 50,
    marginTop: 10,
    width: 200,
    height: 50,
    justifyContent: "center"
  },
  googleBtnText: {
    textAlign: "center",
    color: "white"
  },
  googleBtn: {
    backgroundColor: "#030933",
    borderRadius: 50,
    height: 40,
    justifyContent: "center"
  },
  footer: {
    marginTop: 10,
    color: "#131314",
    alignItems: "center"
  },
  footer_text: {
    fontSize: 10,
    color: "gray",
    marginTop: 5
  },
  footer_text2: {
    fontSize: 10,
    color: "gray",
  },
  footer_text3: {
    fontSize: 12,
  },
  avatar2: {
    marginLeft: 20,
    marginTop: 55,
    width: 50,
    height: 50
  },
  overText: {
    color: "white",
    marginTop: "20%",
    marginLeft: 15,
    fontSize: 50,
    fontWeight: "400"
  },
  overText2: {
    color: "white",
    marginTop: -15,
    marginLeft: 15,
    fontSize: 25,
    fontWeight: "300"
  },
  overText3: {
    color: "white",
    marginLeft: 15,
    marginTop: -5,
    fontSize: 15,
    fontWeight: "300"
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a dark overlay for readability
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
});

export { loginStyle };
