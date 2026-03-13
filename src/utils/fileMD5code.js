import { getToken } from '@/utils/auth'
let flag = null;
if (getToken()) {
    let md5 = localStorage.getItem('md5code');
    if (md5 != undefined && md5 != null && md5 != '') flag = false;
    else flag = true;
} else flag = false;

export default flag;