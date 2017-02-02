<?php
namespace Apps\Core\Php\View;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\Services\Apps;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\StorageException;
use Webiny\Component\TemplateEngine\Drivers\Smarty\AbstractSmartyExtension;
use Webiny\Component\TemplateEngine\Drivers\Smarty\SmartySimplePlugin;

setlocale(LC_MONETARY, 'en_GB.UTF-8');

class SmartyExtension extends AbstractSmartyExtension
{
    use WebinyTrait, StdLibTrait;

    function getFunctions()
    {
        return [
            new SmartySimplePlugin('webiny', 'function', [$this, 'webinyInclude'])
        ];
    }

    /**
     * Returns the name of the plugin.
     *
     * @return string
     */
    function getName()
    {
        return 'webiny_extension';
    }

    public function webinyInclude($params, $smarty)
    {
        $env = $this->wConfig()->get('Application.Environment', 'production');
        $webPath = $this->wConfig()->getConfig()->get('Application.WebPath');
        $apiPath = $this->wConfig()->getConfig()->get('Application.ApiPath');
        $assetsCssPath = $this->wConfig()->getConfig()->get('Application.CssPath');
        $assetsJsPath = $this->wConfig()->getConfig()->get('Application.JsPath');
        $jsConfig = $this->wConfig()->getConfig()->get('Js', new ConfigObject())->toArray();

        $appsHelper = new Apps();

        try {
            $meta = $appsHelper->getAppsMeta('Core.Webiny');
        } catch (StorageException $e) {
            ob_end_clean();
            echo '<h2>Meta files are not available!</h2>';
            echo '<p>
                    This can be caused by one of the following things:
                    <ul>
                        <li>Build was never started</li>
                        <li>Build is currently in progress</li>
                    </ul>
                    Start a new build or wait until build process is finished, then refresh the page!
                </p>';
            die();
        }

        $metaConfig = ['Core.Webiny' => $meta];

        $apps = array_filter(explode(',', $params['apps'] ?? ''));
        foreach ($apps as $app) {
            $metaConfig[$app] = $appsHelper->getAppsMeta($app);
        }

        $flags = JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE;
        $config = json_encode($jsConfig, $flags);
        $appsMeta = json_encode($metaConfig, $flags);

        $browserSync = '<script src="http://localhost:3000/browser-sync/browser-sync-client.js?v=2.18.6"></script>';
        if ($this->wIsProduction()) {
            $browserSync = '';
        }

        return <<<EOT
    <script type="text/javascript">
        var webinyEnvironment = '{$env}';
        var webinyWebPath = '{$webPath}';
        var webinyApiPath = '{$apiPath}';
        var webinyCssPath = '{$assetsCssPath}';
        var webinyJsPath = '{$assetsJsPath}';
        var webinyConfig = {$config};
        var webinyMeta = {$appsMeta};

        var loadScript = function(url) {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = url;
            s.async = true;
            document.body.appendChild(s);
            return s;
        };

        loadScript('{$meta['vendor']}').onload = function() {
            loadScript('{$meta['bootstrap']}');
        };
    </script>
    {$browserSync}
EOT;
    }
}