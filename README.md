
    REQUESTS
    {
       procedure: {
           scope: 'user',
           method: 'register'
       },
       meta: {
           token: '',
       },
       payload: {
    
       }
    }
    RESPONSES
    {
       prodecure: {
          scope: 'user',
          method: 'register',
       }
       status: 200,
       payload: "whatever",
    }
         
Generic stuff ( procedure property will always be present ):

    {
        status: 401, 
        payload: 'Unauthorized'
    }
    {
        status: 403,
        payload: 'Forbidden'
    }
 
 
Register new user:
    
    REQUEST
    {
        procedure: {
            scope: 'auth',
            method: 'register',
        },
        meta: {},
        payload: {
            username: 'admin',
            password: 'admin',
            email: 'a@a.pl',
        },
    };
    RESPONSES:
    {
        procedure: {method: 'register', scope: 'auth'},
        status: 200,
        payload: 'validToken',
    }
    {
        procedure: {method: 'register', scope: 'auth'},
        status: 409,
        payload: 'User with provided credentials already exists.',
    }
    {
        procedure: {method: 'register', scope: 'auth'},
        status: 400, 
        payload: 'You need to provide both email and password'
    }
    