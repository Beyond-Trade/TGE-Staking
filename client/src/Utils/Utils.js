const convertGetNumberFormat = (number) => {
    let result = 0;
    let a = '';
    if (number) {
      result = '';
  
      //number += '';
      number = number.toString().replaceAll(',', '');
      number = number * 1;
      number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      a = number.toString().replace('NaN', '');
      console.log('number : ' + number);
      result = a;
    }
    return a;
};

const Utils = {
    convertGetNumberFormat: convertGetNumberFormat
}

export default Utils