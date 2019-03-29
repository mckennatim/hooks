import {expect} from 'chai';
//var console = require('tracer').console();
//import {dog} from '../src/utilities';
//import {dog, get} from '../src/utilities';
import {deepObjModify, dog} from '../src/utilities/ofuncs'
// const dog = (cat)=>{
// 	console.log(cat)
// 	return 'girl'
// }


describe("a dog is a duck",()=>{
	it('tries dog badly ok', ()=> {
		var ani = "duck"
		console.log(dog(ani))
		expect(ani).to.equal("duck");
	})
	it('deepObjMod an object then access it', ()=>{
		var g ={dog: 'bull', devid: 'CYURE', server:{url:'10.0.1.1', mgtt: 1345}, animal:{pet: {dog: 'uli', cat: 'mabibi', cnt:234.56, arr:[1,2,3]}, wild: 'lion'}}
		console.log(g)
		console.log('-----------------------------------')
		var valstr = ' [3,4,5,6,7]'
		var j = (deepObjModify('animal.pet.cnt', valstr, g))
		console.log(j)
		expect(j.animal.pet.cnt[3]).to.equal(JSON.parse(valstr)[3])
	})
	// it('sees if ... is workin',()=>{
	// 	var state = {name: 'James', rtpg: 'jand'}
	// 	state = {...state, rtpg: 'dog'}
	// 	console.log(state);
	// 	expect(state.rtpg).to.equal('dog');
	// })
	// it('sees if deep search get() is workin +',()=>{
	// 	var props ={trpg: {id: "333", inv: "inv"}}
	// 	var gotten = get('props.trpg.id',props)
	// 	console.log(gotten);
	// 	expect(gotten).to.equal('333');
	// })	
	// it('sees if deep search get() is workin -',()=>{
	// 	var props =  {test: {rtpg: 'Home', name: 'frog'}}
	// 	var gotten = get('props.trpg.id',props)
	// 	console.log(gotten);
	// 	expect(gotten).to.equal(null);
	// })	
})