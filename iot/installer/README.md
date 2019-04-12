# admind
sbs cascada
    greenhouse
    outtemp
    admin
    watering
    shrooms
    blank
    timer
    tstat
hrs user
    admin

todo: race condition in devapps, fix in reducer. Whenever an action is called, state changes.

https://github.com/Reactive-Extensions/RxJS-DOM/blob/master/doc/operators/ajax.md

http://www.gistia.com/talk-backend-services-angular-2s-http-client/ brilliant on showing how a csrf attack would work. It also ids pretty clear on using angular's http +headers

https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)

        createPost(post: Post) {
            if (!post.title) return;
            this.postService.addPost(post)
                .subscribe(
                    newPost => this.posts = [newPost, ...this.posts],
                    error => this.errorMessage = error
                )
        }

    addPost (post: Post): Observable {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers});
        return this.http.post(this.postUrl, { post }, options)
            .map(this.parseData)
            .catch(this.handleError);
    }


    // Updated parse data method handles arrays and objects
    private parseData(res: Response)  {
        let body = res.json();
        if (body instanceof Array) {
            return body || [];
        }
        else return body.post || {};
    }



inherits from
# bl-navigo-react-rxjs-responsive
TODO ajax error handling is non-existent

Move from a working navigo react rxjs version to a version that allows for programmable responsive webpages. In the process correct the fault that has store storing the current page as a react function. In this version the switchPage action takes and object like `{name: 'Products', params: params}` or with an empty {} if there are no params. 

* handle multiple reducers using `rxred/combineReducers`
* call old reducer `test`, add `responsive` reducer
* listen to window size


        Observable.fromEvent(window, 'resize')
          .debounceTime(300)
          .subscribe((e)=>setDeviceType(window.innerWidth));


* modify `store/initialState` 
* * to startup based upon current browser size
* * break state into `test` and `break`
* change state based on debounced display size. The action `setDeviceType`  is reduced by `SET_DEVICE` which calculated the correct device for the size
* assign background size and color to each page
* add an optional `multi` object to the components/index page to program what will show up based on device size.
* replace the function that renders a route with `funcs/responsivePage` that allows for multiple panes
* add the css to display multiple pages
 