<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Validation\Validation;
use Webiny\Component\Validation\ValidationException;

/**
 * Class ApiMethod
 *
 * This class is used when we want to expose class or service method to the API
 *
 * @package Apps\Core\Php\Dispatchers
 */
class ApiMethod
{
    use ParamsInjectorTrait, StdLibTrait, DevToolsTrait;

    private $httpMethod;
    private $pattern;
    /**
     * @var null|EntityAbstract|AbstractService
     */
    private $context;
    private $callbacks = [];
    private $bodyValidators;
    private $authorizationCallback;

    function __construct($httpMethod, $methodName, $context, $callable = null)
    {
        $this->httpMethod = $httpMethod;
        $this->pattern = $methodName;
        $this->context = $context;
        if ($callable) {
            $this->callbacks = [$callable];
        }
    }

    public function getPattern()
    {
        return $this->pattern;
    }

    public function getUrl($params = [])
    {
        // Determine if this method belongs to entity or service
        $parts = $this->str(get_class($this->context))->explode('\\')->val();
        $app = $this->str($parts[1])->kebabCase()->val();
        if ($this->context instanceof EntityAbstract) {
            $contextUrl = 'entities/' . $app . '/' . $this->str($parts[4])->pluralize()->kebabCase()->val();
        } else {
            $contextUrl = 'services/' . $app . '/' . $this->str($parts[4])->kebabCase()->val();
        }

        $url = $this->str($this->pattern)->trimLeft('/');
        foreach ($params as $k => $v) {
            $url->replace('{' . $k . '}', $v);
        }

        if ($url->startsWith('{id}')) {
            $url->replace('{id}', $this->context->id);
        }

        $url = $this->str($this->wConfig()->get('Application.ApiPath') . '/' . $contextUrl . '/' . $url)->trimRight('/');

        return $url->val();
    }

    public function __invoke($params, $bindTo = null)
    {
        if (!$params) {
            $params = [];
        }

        // Call authorization callback if any
        if (is_callable($this->authorizationCallback)) {
            call_user_func_array($this->authorizationCallback, []);
        }

        if (($this->httpMethod === 'post' || $this->httpMethod === 'patch') && count($this->bodyValidators)) {
            $this->validateBody($this->wRequest()->getRequestData());
        }

        $callback = $this->callbacks[0];
        if ($bindTo) {
            $callback = $callback->bindTo($bindTo);
        }
        $callbackCount = count($this->callbacks);
        $params = $this->injectParams($callback, $params);
        if ($callbackCount > 1) {
            $params[] = $this->createParent(1);
        }

        return $callback(...$params);
    }

    public function addCallback($callable)
    {
        array_unshift($this->callbacks, $callable);

        return $this;
    }

    /**
     * Set body validators
     *
     * @param array $validators
     *
     * @return $this
     */
    public function setBodyValidators(array $validators = [])
    {
        $this->bodyValidators = $validators;

        return $this;
    }

    /**
     * Set a custom authorization callback
     *
     * @param $callable
     *
     * @return $this
     */
    public function setAuthorization($callable)
    {
        $this->authorizationCallback = $callable;

        return $this;
    }

    /**
     * Add validators to existing set of validators.
     * Use this if you are overriding parent API method and calling $parent()
     *
     * @param array $validators
     *
     * @return $this
     */
    public function addBodyValidators(array $validators = [])
    {
        $this->bodyValidators = array_merge($this->bodyValidators, $validators);

        return $this;
    }

    private function createParent($index)
    {
        return function () use ($index) {
            $params = func_get_args();
            $callback = $this->callbacks[$index];
            if (count($this->callbacks) > $index + 1) {
                $params[] = $this->createParent($index + 1);
            }

            return $callback(...$params);
        };
    }

    private function validateBody($params)
    {
        $errors = [];

        $params = $this->arr($params);
        foreach ($this->bodyValidators as $key => $validators) {
            $keyValue = $params->keyNested($key);
            if ($this->isString($validators)) {
                $validators = explode(',', $validators);
            }

            // Do not validate if value is not required and empty value is given
            // 'empty' function is not suitable for this check here
            if (!in_array('required', $validators) && (is_null($keyValue) || $keyValue === '')) {
                continue;
            }

            try {
                Validation::getInstance()->validate($keyValue, $validators);
            } catch (ValidationException $e) {
                $errors[$key] = $e->getMessage();
            }
        }

        if (count($errors)) {
            $message = 'Invalid arguments provided to method `' . $this->pattern . '.' . $this->httpMethod . '`';
            throw new ApiMethodException($message, 'WBY-ENTITY-API-METHOD-VALIDATION', 404, $errors);
        }
    }
}
