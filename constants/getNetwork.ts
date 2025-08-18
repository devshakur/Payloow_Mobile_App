import nineMobileIcon from "../assets/images/custom/svg/9mobile.svg";
import airtelIcon from "../assets/images/custom/svg/airtel.svg";
import gloIcon from "../assets/images/custom/svg/glo.svg";
import mtnIcon from "../assets/images/custom/svg/mtn.svg";



let mtn = {
    pattern: /0(703|706|803|806|810|813|814|816|903|906)\d{7}/,
    name: { title: "mtn", icon: mtnIcon },
};
let airtel = {
    pattern: /0(701|708|802|808|812|902|907)\d{7}/,
    name: { title: "airtel", icon: airtelIcon },
};
let _9mobile = {
    pattern: /0(809|817|818|908|909)\d{7}/,
    name: { title: "9mobile", icon: nineMobileIcon },
};
let glo = {
    pattern: /0(705|805|807|811|815|905)\d{7}/,
    name: { title: "glo", icon: gloIcon },
};
let networks = [mtn,airtel,_9mobile,glo];

export  const getNetworkProvider = (mobileNumber : string) => {
    for(let network of networks){
        if (network.pattern.test(mobileNumber)){
            return network.name;
        }
    }
    return null;
}

Math.random()  // retutn 0 to 10.

