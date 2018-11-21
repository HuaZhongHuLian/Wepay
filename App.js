if (!__DEV__) {
    global.console = {
        info: () => {},
        log: () => {},
        warn: () => {},
        debug: () => {},
        error: () => {}
    };
}
import React from 'react';
import { Provider } from 'mobx-react';
import codePush from "react-native-code-push";
import AppStore from './js/AppStore';
import AppNavigator from './js/navigators/AppNavigator'

import { promiseInitBuild, Login, Navigator } from './js/utils/_component';

// import {View, Text, Image} from "react-native"
// import {Theme} from 'teaset';


// import StackNavigator from "./js/utils/StackNavigator"


// import {_Dialog} from "./js/utils/Dialog"
// import {_Net} from "./js/utils/Net"
// import {_Util} from "./js/utils/Util"

// import icons from "./res/images/_icons";
// import images from "./res/pictures/_images"
// import bankcards from "./res/bank_card_icon/_bankcard"


// Theme.set({
//     fitIPhoneX: true,
//     primaryColor: '#48B1A3',
//     secondaryColor : "#48B1A3",
//     defaultColor : "white",
//     defaultTextColor : "black",
// }); 

const stores ={AppStore};
class App extends React.Component {
    constructor(props){
        super(props);
        console.log("App初始化Build");
        promiseInitBuild().then(Login.onBuild.bind(Login))
    }

    componentWillMount(){
        console.log("App准备Mount");
    }

    componentDidMount(){
        console.log("App已经Mount");
    }

    render() {
        // return <View style = {{
        //     flex:1, 
        //     backgroundColor:"black", 
        //     justifyContent:"center", 
        //     alignItems:"center"
        // }}>
        //     <Text style = {{fontSize:32, color:"white"}}>Nav</Text>
        //     {/* <Image source = {Bankcards.guangda}/> */}
        // </View>;
        // return <StackNavigator />;
        return <Provider {...stores}>
            <AppNavigator onNavigationStateChange={Navigator.onNavigate.bind(Navigator)}/>
        </Provider>;
    }
}

// 关闭指定警告
console.ignoredYellowBox = [ 'Warning: isMounted(...)','Warning: Failed prop type' ];
// 关闭全部的警告
//console.disableYellowBox = true;


//必须配置以下代码否则重启app回到上一个版本
let codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};
let codePushApp = codePush(codePushOptions)(App);
export default codePushApp;
