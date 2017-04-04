export function $get (url) {
  let xhr = new XMLHttpRequest()
  xhr.responseType = 'json'
  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      } else {
        reject(xhr)
      }
    }
    xhr.onerror = () => reject(xhr)
    xhr.open('GET', url, true)
    xhr.send()
  })
}
