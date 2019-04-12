import {expect} from 'chai';
import {deepObjModify, dog} from '../src/utilities/wfuncs'

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
		var valstr = [3,4,5,6,7]
		var j = (deepObjModify('g.animal.pet.cnt', valstr, g))
		console.log(j)
		expect(j.animal.pet.cnt[3]).to.equal(valstr[3])
	})
})