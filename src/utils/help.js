import md5 from 'js-md5';

export function setPassMd5 (arr,obj) {
  let newObj = Object.assign({}, obj);
  if(arr.length) {
    arr.forEach((item) =>{
       let newitem = md5(obj[item])
       newObj[item] = newitem
    })
  }
  return newObj
}