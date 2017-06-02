class Common {
    static getOwnFields(callbacks) {
        let methods = [];
        for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(callbacks))) {
            let method = callbacks[name];
            // Supposedly you'd like to skip constructor
            if (!(method instanceof Function) || method === "constructor") continue;
            methods.push(name);
        }
        return methods;
    }
}

module.exports = Common;