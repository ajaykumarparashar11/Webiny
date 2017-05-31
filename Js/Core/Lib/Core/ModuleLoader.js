class ModuleLoader {
    constructor() {
        // This object contains module providers registered by other apps (this allows lazy loading of chunks from other apps)
        this.registeredModules = {};

        // This object will contain optional this.configurations for components
        this.configurations = {};
    }

    load(requiredModules) {
        const toLoad = requiredModules;
        let modules = {};
        if (_.isArray(toLoad)) {
            toLoad.map((name, key) => {
                // String value is most probably a Webiny/Core component name
                if (_.isString(name)) {
                    modules[name] = name;
                    return;
                }

                // Function value is most probably a vendor that does not export anything (attaches to jQuery or window directly)
                if (_.isFunction(name)) {
                    modules[key] = name;
                    return;
                }

                // Object value is a custom map of modules (Webiny/Core components or import statements) to a desired prop name
                if (_.isPlainObject(name)) {
                    _.each(name, (value, key) => {
                        modules[key] = value;
                    })
                }
            });
        } else {
            modules = toLoad;
        }

        const keys = Object.keys(modules);

        const imports = keys.map(key => {
            let module = modules[key];
            if (_.isString(module)) {
                module = this.registeredModules[module];
            }
            // If a function is given - execute it and return either the default export (if exists) or the entire export
            if (!_.isFunction(module)) {
                console.warn('[MODULE LOADER] not a function: ' + key);
            }
            return Promise.resolve(module()).then(m => m && m.hasOwnProperty('default') ? m.default : m);
        });

        return Promise.all(imports).then(values => {
            // Map loaded modules to requested modules object
            const loadedModules = {};
            keys.map((key, i) => {
                // Only assign modules that export something (often vendor libraries like owlCarousel, select2, etc. do not export anything)
                if (!_.isNil(values[i])) {
                    // Assign loaded module and the original source path which will be used for optional configuration of component
                    // Source path is the name that was used to register a module via `Webiny.registerModule()` call
                    loadedModules[key] = {module: values[i], source: modules[key]};
                }
            });
            return loadedModules;
        }).then(loadedModules => {
            // Configure modules
            const configure = [];
            _.each(loadedModules, (obj, name) => {
                // Only configure modules that are requested as string
                if (_.isString(name) && _.has(this.configurations, obj.source) && !this.configurations[obj.source].configured) {
                    // build promise chain to configure each component
                    let chain = Promise.resolve();
                    _.get(this.configurations[obj.source], 'configs', []).map(config => {
                        // We support async configuration functions to allow 3rd party apps to lazy load their configuration code
                        // when the component is actually used
                        chain = chain.then(() => config(obj.module));
                    });
                    configure.push(chain.then(() => this.configurations[obj.source].configured = true));
                }
            });

            return Promise.all(configure).then(() => {
                const returnModules = {};
                _.each(loadedModules, (obj, name) => {
                    returnModules[name] = obj.module;
                });
                return returnModules;
            });
        });
    }

    setModule(name, provider) {
        this.registeredModules[name] = provider;
    }

    setConfiguration(name, config) {
        const current = _.get(this.configurations, name, {configured: false, configs: []});
        current.configs.push(config);
        this.configurations[name] = current;
    }
}

export default ModuleLoader;