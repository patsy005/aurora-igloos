

const NAMESPACE = 'askell'

export const GetSetLocalStorage = (key, value, overwrite=false) => {

    const storage = window.localStorage.getItem(NAMESPACE)
    let storageObj = {}
    if (storage) {
        storageObj = JSON.parse(storage)
        if (storageObj[key] && !overwrite) {
            return storageObj[key]
        } else {
            console.log("writing to local storage")
            storageObj[key] = value
            window.localStorage.setItem(NAMESPACE, JSON.stringify(storageObj))
        }
    } else {
        storageObj[key] = value
        window.localStorage.setItem(NAMESPACE, JSON.stringify(storageObj))
    }
    return storageObj[key]
}

export const ClearSessionStorage = (key) => {
    delete localStorage[key]
}