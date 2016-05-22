import Webiny from 'Webiny';

class CodeEditor extends Webiny.Ui.FormComponent {
    constructor(props) {
        super(props);

        this.codeMirror = null;
        this.options = {
            lineNumbers: true,
            htmlMode: true,
            mode: 'text/html', // needs to be loaded via bower.json
            theme: 'monokai' // needs to be loaded via bower.json
        };

        this.bindMethods('getTextareaElement,fullscreen');
    }

    componentDidMount() {
        super.componentDidMount();

        this.codeMirror = CodeMirror.fromTextArea(this.getTextareaElement(), this.options);

        // add resize option (not supported natively by CodeMirror)
        $(this.codeMirror.getWrapperElement()).resizable({
            resize: () => {
                this.codeMirror.setSize($(this.codeMirror.getWrapperElement()).width(), $(this.codeMirror.getWrapperElement()).height());
                this.codeMirror.refresh();
            }
        });

        this.codeMirror.on('change', () => {
            this.props.valueLink.requestChange(this.codeMirror.getValue());
        });
    }

    componentWillReceiveProps(props) {
        if (this.codeMirror.getValue() !== props.valueLink.value && !_.isNull(props.valueLink.value)) {
            // the "+ ''" sort a strange with splitLines method within CodeMirror
            this.codeMirror.setValue(props.valueLink.value + '');
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    getTextareaElement() {
        return $(ReactDOM.findDOMNode(this)).find('textarea')[0];
    }
}

CodeEditor.defaultProps = {
    renderer() {
        return (
            <div>
                <textarea></textarea>
            </div>
        );
    }
};

export default CodeEditor;