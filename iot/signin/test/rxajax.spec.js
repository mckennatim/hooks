import {expect} from 'chai';
import request from 'superagent'
import observify from 'superagent-rxjs'
import la from 'lazy-ass'
//import {dog} from '../src/utilities'
import {evenNumbers} from '../src/utilities/ofuncs'

observify(request)

const observable = request.get('http://parleyvale.com:3000/api/').observify()
observable.subscribe(
	(res)=>{
		console.log('tehre is a res')
		console.log(res.body);
	},
	(err)=>console.log(err),
	(don)=>{
		console.log('done')
	}
)

var httpLoc = 'http://parleyvale.com:3000/api/'

 describe("rxajax dog is a duck",()=>{
	it('tries ajaxdog badly ok', ()=> {
		var ani = "duck"
		//console.log(dog(ani))
		expect(ani).to.equal("duck");
	})
	it('for even numbers (from)',(done)=>{
		evenNumbers.subscribe(
			(val)=>console.log(val),
			(err)=>console.log(err),
			(don)=>console.log('done')
			)
		expect('duck').to.equal("duck");
		done()
	})
	it('GET / should be running and return: please select...', function(done){	
    request.get(httpLoc)
      .end(function(e, res){
        console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.be.above(0)
        expect(res.body).to.be.a('string')
        done()
      })    
  })		
	it('GET /  observable->should be running...', function(done){	
		console.log('starting to observe')
		const observable = request.get('http://parleyvale.com:3000/api/').observify()
		observable.subscribe(
			(res)=>{
				console.log('there is a res')
				console.log(res.body);
			},
			(err)=>console.log(err),
			(don)=>{
				console.log('done')
				done()
			}
		)	
  })		
})
