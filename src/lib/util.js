import casual from 'casual';

// when are we going to get comprehensions for Javascript???????
const quickArray = (size = 3, generator = () => 'whatever') => 
	((arr) => { 
		for (let i=0; i < arr.length; i+=1) {
			arr[i] = undefined;
		}
		return arr.map(generator);
	})(new Array(size));

const mapFromArray = (array, keyAttr) => {
	return array.reduce( (acc, elem) => {
		acc[elem[keyAttr]] = elem;
	},{});
};

const choose = (array, count = 1) => quickArray(count, () => array[casual.integer(0, array.length-1)]);
const chooseUpTo = (array, max = 1) => choose(array, casual.integer(1, max));

export default {
	quickArray,
	mapFromArray,
	choose,
	chooseUpTo
};