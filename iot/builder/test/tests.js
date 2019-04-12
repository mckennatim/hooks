import {evenNumbers} from 	'../src/utilities/ofuncs'
import Rx from 'rxjs'

evenNumbers.subscribe(
		function (x){console.log(x)},
		function (err){console.log('err: '+err)},
		function (){console.log('done')}
	)

let stream$ = new Rx.Observable(observer => {
  let count = 0;
  let interval = setInterval(() => {
    observer.next(count++);
  }, 1000);
 
  // Clear the interval when there are no more subscribers
  return () => {
    console.log('no more subscribers');
    clearInterval(interval);
  };
});
 
let disposable = stream$
  // The map operator squares each value
  .map(value => value * value)
  .subscribe(value => console.log(value));
 
// Unsubscribe after 5 seconds
setTimeout(() => {
  disposable.unsubscribe();
}, 5000);

@Injectable()
export class PostService {
    // Url to API
    private postUrl = 'https://jsonplaceholder.typicode.com/posts';

    // Injecting the http client into the service
    constructor(private http: Http) {}

    // Method retrieve all the posts
    getPosts (): Observable<Post[]> {
        return this.http.get(this.postUrl)
            .map(this.parseData)
            .catch(this.handleError);
    }

    // This method parses the data to JSON
    private parseData(res: Response)  {
        return res.json() || [];
    }

    // Displays the error message
    private handleError(error: Response | any) {
        let errorMessage: string;

        errorMessage = error.message ? error.message : error.toString();

        // In real world application, call to log error to remote server
        // logError(error);

        // This returns another Observable for the observer to subscribe to
        return Observable.throw(errorMessage);
    }
}