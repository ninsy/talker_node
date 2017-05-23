import userService from '../services/userService';
import imageService from '../services/imageService';

/**
 * Just a facade between connection and service - singleton fits here.
 */

let instance = null;
class userController {
    constructor() {
        if(!instance) {
            instance = this;
        }
        return instance;
    }

}

export default userController;