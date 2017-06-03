#### API Definition

    REQUESTS
    {
       procedure: {
           scope: 'user',
           method: 'register'
       },
       meta: {
           token: '',
       },
       payload: {}
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
         
#### Generic stuff ( procedure property will always be present ):

    {
        status: 400,
        payload: `Method "methodName" doesn't exist in user context.`
    }
    {
        status: 500,
        payload: 'Something went wrong on server'
    },
    {
        status: 400,
        payload: 'Client request error',
    {
        status: 401, 
        payload: 'Unauthorized'
    }
    {
        status: 403,
        payload: 'Forbidden'
    }
 
#### Authentication scope
 
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
    
Login:   
    
    REQUEST
        {
            procedure: {
                scope: 'auth',
                method: 'signup',
            },
            meta: {},
            payload: {
                password: 'admin',
                email: 'a@a.pl',
            },
        };
        RESPONSES:
        {
            procedure: {method: 'signup', scope: 'auth'},
            status: 200,
            payload: 'validToken',
        }
        {
            procedure: {method: 'signup', scope: 'auth'},
            status: 401,
            payload: 'Unauthorized'
        }
        {
            procedure: {method: 'signup', scope: 'auth'},
            status: 400, 
            payload: 'You need to provide both email and password'
        }
 
#### User scope        
        
Get info about self

    REQUEST
    {
        procedure: {
            scope: 'user',
            method: 'me',
        },
        meta: {},
        payload: {},
    };
    RESPONSES:
    {
        procedure: {method: 'signup', scope: 'auth'},
        status: 200,
        payload: {
            username: "",
            email: "",
            id: "",
            avatarId: "",
        },
    }
    
Get all registered users

    REQUEST
        {
            procedure: {
                scope: 'user',
                method: 'list',
            },
            meta: {
                token: "validToken"   
            },
            payload: {},
        };
    RESPONSES:
    {
        procedure: {method: 'list', scope: 'user'},
        status: 200,
        payload: [
            {
                username: "",
                email: "",
                id: "",
                avatarId: "",
            },
            {
                username: "",
                email: "",
                id: "",
                avatarId: "",
            },
            ...
        ],
    }
    
Update info about user

    REQUEST
        {
            procedure: {
                scope: 'user',
                method: 'update',
            },
            meta: {
                token: "validToken"   
            },
            payload: {
                id: 13,
                data: {
                    username: "newUsername",
                    password: "newPass",
                    email: "newEmail",
                }
            },
        };
    RESPONSES:
    {
        procedure: {method: 'update', scope: 'user'},
        status: 200,
        payload: {
            id: -1,
            data: {
                username: "newUsername",
                password: "newPass",
                email: "newEmail",
            }
        }
    }
    {
        procedure: {method: 'update', scope: 'user'},
        status: 404,
        payload: 'User with id -1 doesn't exist'
    }
    {
        procedure: {method: 'update', scope: 'user'},
        status: 400,
        payload: 'Missing data object'
    }

#### Friendship scope
    
Get invites from others ( status 'pending' )

    REQUEST
    {
        procedure: {
            scope: 'friendship',
            method: 'getInvitesList',
        },
        meta: {
            token: "validToken"
        },
        payload: {},
    };
    RESPONSES:
    {
        procedure: {method: 'signup', scope: 'auth'},
        status: 200,
        payload: [
            {
                username: "",
                email: "",
                id: "",
                avatarId: "",
            },
            {
                username: "",
                email: "",
                id: "",
                avatarId: "",
            },
            ...
        ],
    }
   
Invite person to friends

    REQUEST
    {
        procedure: {
            scope: 'friendship',
            method: 'inviteFriend',
        },
        meta: {
            token: "validToken"
        },
        payload: {
            id: 1
        },
    };
    RESPONSES:
    {
        procedure: {method: 'signup', scope: 'auth'},
        status: 200,
        payload: '`User with id 1 invited`'
    }
    
Get friends list ( status either 'pending' or 'accepted' if I am 'initiator', only 'accepted' if I'm receiver of invite )

    REQUEST
    {
        procedure: {
            scope: 'friendship',
            method: 'getFriendsList',
        },
        meta: {
            token: "validToken"
        },
        payload: {},
    };
    RESPONSES:
    {
        procedure: {method: 'getFriendsList', scope: 'friendship'},
        status: 200,
        payload: [
         {
             username: "",
             email: "",
             id: "",
             avatarId: "",
         },
         {
             username: "",
             email: "",
             id: "",
             avatarId: "",
         },
         ...
     ],
    }

Remove person from friend's list

    REQUEST
    {
        procedure: {
            scope: 'friendship',
            method: 'removeFriend',
        },
        meta: {
            token: "validToken"
        },
        payload: {
            id: 1
        },
    };
    RESPONSES:
    {
        procedure: {method: 'removeFriend', scope: 'friendship'},
        status: 200,
        payload: {
            username: "removedUserUsername",
            email: "",
            id: "",
            avatarId: "",
        }
    }

Accept friendship invite

    REQUEST
    {
        procedure: {
            scope: 'friendship',
            method: 'acceptFriendshipInvite',
        },
        meta: {
            token: "validToken"
        },
        payload: {
            id: 1
        },
    };
    RESPONSES:
    {
        procedure: {method: 'acceptFriendshipInvite', scope: 'friendship'},
        status: 200,
        payload: {
            username: "newFriendUsername",
            email: "",
            id: "",
            avatarId: "",
        }
    }
    
Reject friendship invite

    REQUEST
    {
        procedure: {
            scope: 'friendship',
            method: 'rejectFriendshipInvite',
        },
        meta: {
            token: "validToken"
        },
        payload: {
            id: 1
        },
    };
    RESPONSES:
    {
        procedure: {method: 'rejectFriendshipInvite', scope: 'friendship'},
        status: 200,
        payload: `Rejected invite from user with id 1}`
    }