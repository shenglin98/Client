import Cookies from 'js-cookie'

const TokenKey = 'X-Token'
const LicenseKey = 'LICENSE-KEY'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}


export function getLicenseKey() {
    return Cookies.get(LicenseKey)
}

export function setLicenseKey(licenseKey) {
    return Cookies.set(LicenseKey, licenseKey)
}

export function removeLicenseKey() {
    return Cookies.remove(LicenseKey)
}