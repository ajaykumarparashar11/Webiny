import React from 'react';
import Webiny from 'webiny';
import ExportTranslationsModal from './TranslationsList/ExportTranslationsModal';
import ImportTranslationsModal from './TranslationsList/ImportTranslationsModal';
import TranslationListRow from './TranslationsList/TranslationListRow';

/**
 * @i18n.namespace Webiny.Backend.I18N.TranslationsList
 */
class TranslationsList extends Webiny.Ui.View {
    constructor() {
        super();
        this.ref = null;
    }
}

TranslationsList.defaultProps = {
    renderer () {
        return (
            <Webiny.Ui.LazyLoad
                modules={['ViewSwitcher', 'View', 'Button', 'ButtonGroup', 'Icon', 'Textarea', 'List', 'Link', 'Input', 'Link', 'Form', 'Grid', 'Select']}>
                {Ui => (
                    <Ui.ViewSwitcher>
                        <Ui.ViewSwitcher.View view="translationsList" defaultView>
                            {showView => (
                                <Ui.View.List>
                                    <Ui.View.Header
                                        title={this.i18n(`Translations`)}
                                        description={this.i18n('Manage translations for texts in all installed apps.')}>
                                        <Ui.ButtonGroup>
                                            <Ui.Button
                                                type="secondary"
                                                onClick={showView('importTranslationsModal')}
                                                icon="fa-download"
                                                label={this.i18n(`Import`)}/>
                                            <Ui.Button
                                                type="secondary"
                                                onClick={showView('exportTranslationsModal')}
                                                icon="fa-upload"
                                                label={this.i18n(`Export`)}/>
                                        </Ui.ButtonGroup>
                                    </Ui.View.Header>
                                    <Ui.View.Body>
                                        <Ui.List
                                            connectToRouter
                                            title={this.i18n(`Translations`)}
                                            api="/entities/webiny/i18n-texts"
                                            searchFields="key,base,app,group.name"
                                            fields="key,base,app,translations"
                                            sort="-createdOn">
                                            <Ui.List.FormFilters>
                                                {(apply) => (
                                                    <Ui.Grid.Row>
                                                        <Ui.Grid.Col all={3}>
                                                            <Ui.Input
                                                                name="_searchQuery"
                                                                placeholder="Search by key or text"
                                                                onEnter={apply()}/>
                                                        </Ui.Grid.Col>
                                                        <Ui.Grid.Col all={3}>
                                                            <Ui.Select
                                                                api="/entities/webiny/i18n-locales"
                                                                name="locale"
                                                                fields="id,label"
                                                                textAttr="label"
                                                                placeholder="Filter by locale"
                                                                allowClear
                                                                onChange={apply()}/>
                                                        </Ui.Grid.Col>
                                                        <Ui.Grid.Col all={3}>
                                                            <Ui.Select
                                                                name="app"
                                                                api="/services/webiny/apps"
                                                                url="/installed"
                                                                textAttr="name"
                                                                valueAttr="name"
                                                                placeholder="Filter by app"
                                                                allowClear
                                                                onChange={apply()}/>
                                                        </Ui.Grid.Col>
                                                        <Ui.Grid.Col all={3}>
                                                            <Ui.Select
                                                                api="/entities/webiny/i18n-text-groups"
                                                                name="group"
                                                                placeholder="Filter by text group"
                                                                allowClear
                                                                onChange={apply()}/>
                                                        </Ui.Grid.Col>
                                                    </Ui.Grid.Row>
                                                )}
                                            </Ui.List.FormFilters>
                                            <Ui.List.Table>
                                                <Ui.List.Table.Row>
                                                    <Ui.List.Table.Field label={this.i18n('Text')} align="left">
                                                        {row => <TranslationListRow data={row}/>}
                                                    </Ui.List.Table.Field>
                                                </Ui.List.Table.Row>
                                                <Ui.List.Table.Footer/>
                                            </Ui.List.Table>
                                            <Ui.List.Pagination/>
                                        </Ui.List>
                                    </Ui.View.Body>
                                </Ui.View.List>
                            )}
                        </Ui.ViewSwitcher.View>
                        <Ui.ViewSwitcher.View view="exportTranslationsModal" modal>
                            {(showView, data) => (
                                <ExportTranslationsModal {...{showView, data}}/>
                            )}
                        </Ui.ViewSwitcher.View>
                        <Ui.ViewSwitcher.View view="importTranslationsModal" modal>
                            {(showView, data) => (
                                <ImportTranslationsModal {...{showView, data}}/>
                            )}
                        </Ui.ViewSwitcher.View>
                    </Ui.ViewSwitcher>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default TranslationsList;