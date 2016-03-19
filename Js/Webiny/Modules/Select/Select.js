import Webiny from 'Webiny';

class Select extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        this.select2 = null;
        this.options = null;
        this.bindMethods('prepareOptions,getConfig,getValue,triggerChange,getSelect2Element');
    }

    componentDidMount() {
        super.componentDidMount();
        this.select2 = this.getSelect2Element().select2(this.getConfig(this.props));
        this.select2.on('select2:select', e => {
            this.triggerChange(e.target.value);
        });
        this.select2.on('select2:unselect', () => {
            this.triggerChange('');
        });
        this.select2.val(this.getValue()).trigger('change');
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (!this.options || !_.isEqual(props.options, this.options)) {
            this.select2.html('');
            this.getSelect2Element().select2(this.getConfig(props));
        }
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        const possibleValues = _.map(this.options, 'id');
        const value = this.getValue();
        const inPossibleValues = possibleValues.indexOf(value) > -1;

        if (value !== null && !inPossibleValues && possibleValues.length > 0) {
            this.triggerChange(null);
            return;
        }

        if (value !== null && inPossibleValues) {
            this.select2.val(value).trigger('change');
            return;
        }

        this.select2.val('').trigger('change');
    }

    getSelect2Element(){
        return $(ReactDOM.findDOMNode(this)).find('select');
    }

    getValue() {
        const value = this.props.valueLink ? this.props.valueLink.value : this.props.selectedValue;
        if (!value) {
            return value;
        }

        return _.isObject(value) ? value.id : '' + value;
    }

    triggerChange(value) {
        if (this.props.valueLink) {
            this.props.valueLink.requestChange(value);
        }
        this.props.changed(value);
    }

    getConfig(props) {
        const renderer = function (item) {
            if (item.text.indexOf('<') === 0) {
                return $(item.text);
            }
            return item.text;
        };

        const config = {
            disabled: props.disabled,
            minimumResultsForSearch: props.minimumResultsForSearch,
            placeholder: this.props.placeholder,
            allowClear: props.allowClear,
            templateResult: renderer,
            templateSelection: renderer
        };

        if (!this.options || !_.isEqual(props.options, this.options)) {
            this.options = props.options;
            config['data'] = props.options;
        }

        return config;
    }

    prepareOptions(props) {
        this.options = [];
        if (props.children) {
            React.Children.map(props.children, child => {
                let option = child.props.children;
                if (!_.isString(option)) {
                    option = ReactDOMServer.renderToStaticMarkup(option);
                }

                this.options.push({
                    id: child.props.value,
                    text: option
                });
            });
        }

        if (props.options) {
            _.each(props.options, (value, key) => {
                this.options.push({
                    id: key,
                    text: value
                });
            });
        }
    }
}

Select.defaultProps = {
    allowClear: false,
    placeholder: null,
    changed: _.noop,
    selectedValue: '',
    minimumResultsForSearch: 15,
    renderer: function renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        let label = null;
        if (this.props.label) {
            label = <label key="label" className="control-label">{this.props.label}</label>;
        }

        let validationMessage = null;

        if (this.state.isValid === false) {
            validationMessage = <span className="info-txt">({this.state.validationMessage})</span>;
        }

        return (
            <div className={this.classSet(cssConfig)}>
                {label}
                <select style={{'width':'100%'}}/>
                {validationMessage}
            </div>
        );
    }
};

export default Select;